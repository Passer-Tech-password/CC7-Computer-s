"use client";

import { useEffect, useMemo, useState } from "react";
import { DataTable, DataTableColumn } from "@/components/DataTable";
import { formatNgn } from "@/lib/products";
import { getFirebaseClientAsync } from "@/lib/firebase";
import type { Order, OrderStatus } from "@/types/order";
import { toast } from "sonner";

type OrderRow = Order & { docId: string };

function parseString(v: unknown): string | null {
  return typeof v === "string" ? v : null;
}

function parseNumber(v: unknown): number | null {
  return typeof v === "number" && Number.isFinite(v) ? v : null;
}

function parseOrder(docId: string, data: unknown): OrderRow | null {
  if (!data || typeof data !== "object") return null;
  const obj = data as Record<string, unknown>;
  const orderNumber = parseString(obj.orderNumber);
  const status = parseString(obj.status) as OrderStatus | null;
  const totalNgn = parseNumber(obj.totalNgn);
  const customerName = parseString(obj.customerName) ?? "Customer";
  const customerEmail = parseString(obj.customerEmail) ?? "";
  const createdAtMs = parseNumber(obj.createdAtMs) ?? Date.now();
  if (!orderNumber || !status || totalNgn === null) return null;
  return {
    docId,
    id: docId,
    orderNumber,
    userUid: parseString(obj.userUid) ?? null,
    items: [],
    subtotalNgn: parseNumber(obj.subtotalNgn) ?? 0,
    deliveryFeeNgn: parseNumber(obj.deliveryFeeNgn) ?? 0,
    totalNgn,
    pickup: Boolean(obj.pickup),
    customerName,
    customerEmail,
    customerPhone: parseString(obj.customerPhone) ?? undefined,
    createdAtMs,
    status
  };
}

const STATUS_OPTIONS: OrderStatus[] = ["pending", "paid", "processing", "completed", "cancelled"];

export default function DashboardOrdersPage() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<OrderRow[]>([]);
  const [filter, setFilter] = useState<OrderStatus | "all">("all");

  async function refresh() {
    setLoading(true);
    try {
      const { db } = await getFirebaseClientAsync();
      const { collection, getDocs, limit, orderBy, query, where } = await import("firebase/firestore");
      const base = query(collection(db, "orders"), orderBy("createdAtMs", "desc"), limit(300));
      const q = filter === "all" ? base : query(collection(db, "orders"), where("status", "==", filter), orderBy("createdAtMs", "desc"), limit(300));
      const snap = await getDocs(q);
      const parsed = snap.docs.map((d) => parseOrder(d.id, d.data())).filter((v): v is OrderRow => Boolean(v));
      setRows(parsed);
    } catch (e) {
      console.error(e);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, [filter]);

  async function updateStatus(order: OrderRow, status: OrderStatus) {
    try {
      const { db } = await getFirebaseClientAsync();
      const { doc, serverTimestamp, updateDoc } = await import("firebase/firestore");
      await updateDoc(doc(db, "orders", order.docId), { status, updatedAt: serverTimestamp() });
      setRows((prev) => prev.map((o) => (o.docId === order.docId ? { ...o, status } : o)));
      toast.success("Order updated", { description: `Status set to ${status}` });
    } catch (e) {
      console.error(e);
      toast.error("Update failed", { description: "Failed to update order status." });
    }
  }

  const columns = useMemo<Array<DataTableColumn<OrderRow>>>(
    () => [
      { key: "orderNumber", header: "Order No", cell: (o) => <span className="font-extrabold text-primary-blue">{o.orderNumber}</span> },
      { key: "customer", header: "Customer", cell: (o) => <span className="text-sm font-semibold text-dark/80 dark:text-light/80">{o.customerName}</span> },
      { key: "total", header: "Total", cell: (o) => <span className="font-black text-primary-red">{formatNgn(o.totalNgn)}</span> },
      {
        key: "status",
        header: "Status",
        cell: (o) => (
          <select
            value={o.status}
            onChange={(e) => updateStatus(o, e.target.value as OrderStatus)}
            className="rounded-xl border border-dark/15 bg-white px-3 py-2 text-xs font-extrabold text-dark outline-none focus:ring-2 focus:ring-primary-blue dark:border-light/15 dark:bg-[#0b1220] dark:text-light"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        )
      },
      { key: "pickup", header: "Pickup", cell: (o) => <span className="text-xs font-bold">{o.pickup ? "Yes" : "No"}</span> }
    ],
    []
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="inline-flex items-center rounded-full bg-primary-blue/15 px-3 py-1 text-sm font-extrabold text-primary-blue">
            Orders
          </div>
          <h1 className="mt-3 text-3xl font-black text-dark dark:text-light">Orders Management</h1>
          <p className="mt-2 text-sm font-semibold text-dark/70 dark:text-light/70">Filter orders and update status.</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as OrderStatus | "all")}
            className="rounded-xl border border-dark/15 bg-white px-3 py-3 text-sm font-extrabold text-dark outline-none focus:ring-2 focus:ring-primary-blue dark:border-light/15 dark:bg-[#0b1220] dark:text-light"
          >
            <option value="all">All</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={refresh}
            className="btn inline-flex rounded-xl bg-primary-yellow px-4 py-3 font-extrabold text-dark hover:brightness-95"
          >
            Refresh
          </button>
        </div>
      </div>

      <DataTable rows={rows} columns={columns} emptyLabel={loading ? "Loading…" : "No orders yet."} loading={loading} />
    </div>
  );
}
