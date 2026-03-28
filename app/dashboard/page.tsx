"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { StatCard } from "@/components/StatCard";
import { DataTable, DataTableColumn } from "@/components/DataTable";
import { formatNgn } from "@/lib/products";
import { getFirebaseClientAsync } from "@/lib/firebase";
import type { Order } from "@/types/order";
import type { RepairJob } from "@/types/repairJob";

type OrderRow = Pick<Order, "orderNumber" | "totalNgn" | "status" | "createdAtMs"> & { id: string };
type RepairRow = Pick<RepairJob, "jobNumber" | "customerName" | "deviceType" | "brand" | "model" | "status" | "createdAtMs"> & {
  id: string;
};

function parseNumber(v: unknown): number | null {
  return typeof v === "number" && Number.isFinite(v) ? v : null;
}

function parseString(v: unknown): string | null {
  return typeof v === "string" ? v : null;
}

function parseOrderRow(id: string, data: unknown): OrderRow | null {
  if (!data || typeof data !== "object") return null;
  const obj = data as Record<string, unknown>;
  const orderNumber = parseString(obj.orderNumber);
  const status = parseString(obj.status);
  const totalNgn = parseNumber(obj.totalNgn);
  const createdAtMs = parseNumber(obj.createdAtMs) ?? Date.now();
  if (!orderNumber || !status || totalNgn === null) return null;
  return { id, orderNumber, status: status as Order["status"], totalNgn, createdAtMs };
}

function parseRepairRow(id: string, data: unknown): RepairRow | null {
  if (!data || typeof data !== "object") return null;
  const obj = data as Record<string, unknown>;
  const jobNumber = parseString(obj.jobNumber);
  const customerName = parseString(obj.customerName) ?? "Customer";
  const deviceType = parseString(obj.deviceType) ?? "Device";
  const brand = parseString(obj.brand) ?? "Brand";
  const model = parseString(obj.model) ?? "Model";
  const status = parseString(obj.status) ?? "pending";
  const createdAtMs = parseNumber(obj.createdAtMs) ?? Date.now();
  if (!jobNumber) return null;
  return { id, jobNumber, customerName, deviceType, brand, model, status: status as RepairJob["status"], createdAtMs };
}

export default function DashboardOverviewPage() {
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState<OrderRow[]>([]);
  const [recentRepairs, setRecentRepairs] = useState<RepairRow[]>([]);
  const [stats, setStats] = useState({
    totalSalesNgn: 0,
    activeOrders: 0,
    pendingRepairs: 0,
    lowStockItems: 0
  });

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { db } = await getFirebaseClientAsync();
        const { collection, getDocs, limit, orderBy, query, where } = await import("firebase/firestore");

        const ordersSnap = await getDocs(query(collection(db, "orders"), orderBy("createdAtMs", "desc"), limit(10)));
        const orderRows = ordersSnap.docs
          .map((d) => parseOrderRow(d.id, d.data()))
          .filter((v): v is OrderRow => Boolean(v));
        setRecentOrders(orderRows);

        const repairsSnap = await getDocs(query(collection(db, "repair_jobs"), orderBy("createdAtMs", "desc"), limit(10)));
        const repairRows = repairsSnap.docs
          .map((d) => parseRepairRow(d.id, d.data()))
          .filter((v): v is RepairRow => Boolean(v));
        setRecentRepairs(repairRows);

        const salesSnap = await getDocs(
          query(collection(db, "orders"), where("status", "in", ["paid", "processing", "completed"]), limit(200))
        );
        const totalSalesNgn = salesSnap.docs.reduce((sum, d) => {
          const data = d.data() as Record<string, unknown>;
          const total = parseNumber(data.totalNgn) ?? 0;
          return sum + total;
        }, 0);

        const activeOrdersSnap = await getDocs(
          query(collection(db, "orders"), where("status", "in", ["paid", "processing"]), limit(200))
        );

        const pendingRepairsSnap = await getDocs(
          query(collection(db, "repair_jobs"), where("status", "in", ["pending", "diagnosis", "repairing", "ready"]), limit(200))
        );

        const productsSnap = await getDocs(query(collection(db, "products"), limit(500)));
        const lowStockItems = productsSnap.docs.reduce((count, d) => {
          const data = d.data() as Record<string, unknown>;
          const stockCount = parseNumber(data.stockCount) ?? 0;
          return stockCount > 0 && stockCount <= 5 ? count + 1 : count;
        }, 0);

        setStats({
          totalSalesNgn,
          activeOrders: activeOrdersSnap.size,
          pendingRepairs: pendingRepairsSnap.size,
          lowStockItems
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const orderColumns = useMemo<Array<DataTableColumn<OrderRow>>>(
    () => [
      {
        key: "orderNumber",
        header: "Order No",
        cell: (r) => <div className="font-extrabold text-primary-blue">{r.orderNumber}</div>
      },
      { key: "status", header: "Status", cell: (r) => <span className="text-xs font-bold">{r.status}</span> },
      { key: "total", header: "Total", cell: (r) => <div className="font-black text-primary-red">{formatNgn(r.totalNgn)}</div> }
    ],
    []
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="inline-flex items-center rounded-full bg-primary-blue/15 px-3 py-1 text-sm font-extrabold text-primary-blue">
            Dashboard Overview
          </div>
          <h1 className="mt-3 text-3xl font-black text-dark dark:text-light">CC7 Staff Dashboard</h1>
          <p className="mt-2 text-sm font-semibold text-dark/70 dark:text-light/70">
            Live data from Firestore: products, orders, repair jobs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/dashboard/products" className="btn inline-flex rounded-xl bg-primary-blue px-4 py-2.5 font-extrabold text-white hover:brightness-110">
            Manage Products
          </Link>
          <Link href="/dashboard/repairs" className="btn inline-flex rounded-xl bg-primary-yellow px-4 py-2.5 font-extrabold text-dark hover:brightness-95">
            Repair Jobs
          </Link>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Sales" value={formatNgn(stats.totalSalesNgn)} subtitle="Paid / Processing / Completed" variant="red" />
        <StatCard title="Pending Repairs" value={`${stats.pendingRepairs}`} subtitle="Pending → Ready" variant="yellow" />
        <StatCard title="Active Orders" value={`${stats.activeOrders}`} subtitle="Paid / Processing" variant="blue" />
        <StatCard title="Low Stock Items" value={`${stats.lowStockItems}`} subtitle="Stock ≤ 5" variant="neutral" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-dark dark:text-light">Recent Orders</h2>
            <Link href="/dashboard/orders" className="text-sm font-bold text-primary-blue hover:underline">
              View all →
            </Link>
          </div>
          <DataTable rows={recentOrders} columns={orderColumns} emptyLabel={loading ? "Loading…" : "No orders yet."} />
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-dark dark:text-light">Recent Repair Jobs</h2>
            <Link href="/dashboard/repairs" className="text-sm font-bold text-primary-blue hover:underline">
              View all →
            </Link>
          </div>

          <div className="overflow-hidden rounded-2xl border border-dark/10 bg-white shadow-sm dark:border-light/10 dark:bg-dark">
            <div className="divide-y divide-dark/10 dark:divide-light/10">
              {recentRepairs.length === 0 ? (
                <div className="p-6 text-center text-sm font-semibold text-dark/60 dark:text-light/60">
                  {loading ? "Loading…" : "No repair jobs yet."}
                </div>
              ) : (
                recentRepairs.slice(0, 8).map((r) => (
                  <div key={r.id} className="flex items-center justify-between gap-4 p-4 hover:bg-dark/5 dark:hover:bg-light/5 transition-colors">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-extrabold text-primary-blue">{r.jobNumber}</div>
                      <div className="mt-1 text-xs font-semibold text-dark/60 dark:text-light/60">
                        {r.customerName} • {r.deviceType} • {r.brand} {r.model}
                      </div>
                    </div>
                    <span className="rounded-full bg-primary-yellow/25 px-3 py-1 text-xs font-extrabold text-yellow-800 dark:text-primary-yellow">
                      {r.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
