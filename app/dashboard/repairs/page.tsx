"use client";

import { useEffect, useMemo, useState } from "react";
import { DataTable, DataTableColumn } from "@/components/DataTable";
import { getFirebaseClientAsync } from "@/lib/firebase";
import type { RepairJob, RepairJobStatus } from "@/types/repairJob";
import { toast } from "sonner";
import { isApiEnabled } from "@/lib/api-client";
import { adminGetRepairJobs, updateRepairStatus as apiUpdateRepairStatus } from "@/lib/api";
import type { BackendRepairJobStatus } from "@/types/backend";

type RepairRow = RepairJob & { docId: string };

const STATUS_OPTIONS: RepairJobStatus[] = ["pending", "diagnosis", "repairing", "ready", "completed"];

function parseString(v: unknown): string | null {
  return typeof v === "string" ? v : null;
}

function parseNumber(v: unknown): number | null {
  return typeof v === "number" && Number.isFinite(v) ? v : null;
}

function parseRepair(docId: string, data: unknown): RepairRow | null {
  if (!data || typeof data !== "object") return null;
  const obj = data as Record<string, unknown>;
  const jobNumber = parseString(obj.jobNumber);
  const customerName = parseString(obj.customerName) ?? "Customer";
  const deviceType = parseString(obj.deviceType) ?? "Device";
  const brand = parseString(obj.brand) ?? "Brand";
  const model = parseString(obj.model) ?? "Model";
  const status = (parseString(obj.status) as RepairJobStatus | null) ?? "pending";
  const technicianName = parseString(obj.technicianName) ?? undefined;
  const createdAtMs = parseNumber(obj.createdAtMs) ?? Date.now();
  if (!jobNumber) return null;

  return {
    docId,
    id: docId,
    jobNumber,
    userUid: parseString(obj.userUid) ?? null,
    customerName,
    customerPhone: parseString(obj.customerPhone) ?? undefined,
    deviceType,
    brand,
    model,
    status,
    technicianName,
    beforeNotes: parseString(obj.beforeNotes) ?? undefined,
    afterNotes: parseString(obj.afterNotes) ?? undefined,
    createdAtMs
  };
}

export default function DashboardRepairsPage() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<RepairRow[]>([]);
  const [filter, setFilter] = useState<RepairJobStatus | "all">("all");
  const [detail, setDetail] = useState<RepairRow | null>(null);
  const [saving, setSaving] = useState(false);

  async function refresh() {
    setLoading(true);
    try {
      if (isApiEnabled()) {
        try {
          const apiRepairs = await adminGetRepairJobs(filter === "all" ? undefined : (filter as BackendRepairJobStatus));
          setRows(apiRepairs.map((r) => ({ ...(r as unknown as RepairJob), docId: r.id })));
          return;
        } catch (e) {
          console.error(e);
          toast.error("API unavailable", { description: "Showing Firebase repair jobs for now." });
        }
      }

      const { db } = await getFirebaseClientAsync();
      const { collection, getDocs, limit, orderBy, query, where } = await import("firebase/firestore");
      const base = query(collection(db, "repair_jobs"), orderBy("createdAtMs", "desc"), limit(300));
      const q =
        filter === "all"
          ? base
          : query(collection(db, "repair_jobs"), where("status", "==", filter), orderBy("createdAtMs", "desc"), limit(300));
      const snap = await getDocs(q);
      const parsed = snap.docs.map((d) => parseRepair(d.id, d.data())).filter((v): v is RepairRow => Boolean(v));
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

  async function updateRow(row: RepairRow, patch: Partial<Pick<RepairRow, "status" | "technicianName" | "beforeNotes" | "afterNotes">>) {
    setSaving(true);
    try {
      if (isApiEnabled() && patch.status) {
        try {
          await apiUpdateRepairStatus(row.id, patch.status as BackendRepairJobStatus);
          setRows((prev) => prev.map((r) => (r.docId === row.docId ? { ...r, ...patch } : r)));
          setDetail((prev) => (prev && prev.docId === row.docId ? { ...prev, ...patch } : prev));
          toast.success("Repair job updated", { description: `Status set to ${patch.status}` });
          return;
        } catch (e) {
          console.error(e);
          toast.error("API update failed", { description: "Updating via Firebase for now." });
        }
      }

      const { db } = await getFirebaseClientAsync();
      const { doc, serverTimestamp, updateDoc } = await import("firebase/firestore");
      await updateDoc(doc(db, "repair_jobs", row.docId), { ...patch, updatedAt: serverTimestamp() });
      setRows((prev) => prev.map((r) => (r.docId === row.docId ? { ...r, ...patch } : r)));
      setDetail((prev) => (prev && prev.docId === row.docId ? { ...prev, ...patch } : prev));
      if (patch.status) toast.success("Repair job updated", { description: `Status set to ${patch.status}` });
    } catch (e) {
      console.error(e);
      toast.error("Update failed", { description: "Failed to update repair job." });
    } finally {
      setSaving(false);
    }
  }

  const columns = useMemo<Array<DataTableColumn<RepairRow>>>(
    () => [
      { key: "job", header: "Job Number", cell: (r) => <span className="font-extrabold text-primary-blue">{r.jobNumber}</span> },
      { key: "customer", header: "Customer", cell: (r) => <span className="text-sm font-semibold text-dark/80 dark:text-light/80">{r.customerName}</span> },
      {
        key: "device",
        header: "Device",
        cell: (r) => (
          <span className="text-xs font-bold text-dark/70 dark:text-light/70">
            {r.deviceType} • {r.brand} {r.model}
          </span>
        )
      },
      {
        key: "status",
        header: "Status",
        cell: (r) => (
          <select
            value={r.status}
            onChange={(e) => updateRow(r, { status: e.target.value as RepairJobStatus })}
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
      {
        key: "tech",
        header: "Technician",
        cell: (r) => (
          <span className="text-xs font-bold text-dark/70 dark:text-light/70">{r.technicianName ?? "Unassigned"}</span>
        )
      },
      {
        key: "actions",
        header: "Actions",
        cell: (r) => (
          <button
            type="button"
            onClick={() => setDetail(r)}
            className="rounded-xl bg-primary-blue px-3 py-2 text-xs font-extrabold text-white hover:brightness-110"
          >
            View
          </button>
        )
      }
    ],
    []
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="inline-flex items-center rounded-full bg-primary-blue/15 px-3 py-1 text-sm font-extrabold text-primary-blue">
            Repairs
          </div>
          <h1 className="mt-3 text-3xl font-black text-dark dark:text-light">Repair Jobs Management</h1>
          <p className="mt-2 text-sm font-semibold text-dark/70 dark:text-light/70">Track job progress and assign technicians.</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as RepairJobStatus | "all")}
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

      <DataTable
        rows={rows}
        columns={columns}
        emptyLabel={loading ? "Loading…" : "No repair jobs yet."}
        loading={loading}
      />

      {detail ? (
        <div className="fixed inset-0 z-50 bg-black/60 p-4" role="dialog" aria-modal="true">
          <div className="mx-auto w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-[#0b1220]">
            <div className="flex items-center justify-between border-b border-dark/10 p-4 dark:border-light/10">
              <div className="min-w-0">
                <div className="text-xs font-extrabold text-primary-blue">Repair Job</div>
                <div className="truncate text-lg font-black text-dark dark:text-light">{detail.jobNumber}</div>
              </div>
              <button
                type="button"
                onClick={() => setDetail(null)}
                className="btn-ghost h-10 w-10 rounded-full p-0"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="grid gap-4 p-5 md:grid-cols-2">
              <div className="rounded-xl border border-dark/10 bg-white p-4 dark:border-light/10 dark:bg-[#0b1220]">
                <div className="text-xs font-extrabold text-primary-blue">Customer</div>
                <div className="mt-1 text-sm font-bold text-dark dark:text-light">{detail.customerName}</div>
                <div className="mt-1 text-xs font-semibold text-dark/60 dark:text-light/60">
                  {detail.customerPhone ?? "No phone"} • {detail.userUid ?? "Guest"}
                </div>
              </div>
              <div className="rounded-xl border border-dark/10 bg-white p-4 dark:border-light/10 dark:bg-[#0b1220]">
                <div className="text-xs font-extrabold text-primary-blue">Device</div>
                <div className="mt-1 text-sm font-bold text-dark dark:text-light">
                  {detail.deviceType} • {detail.brand} {detail.model}
                </div>
              </div>

              <div className="md:col-span-2 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-extrabold text-dark dark:text-light mb-1">Status</label>
                  <select
                    value={detail.status}
                    onChange={(e) => updateRow(detail, { status: e.target.value as RepairJobStatus })}
                    className="w-full rounded-xl border border-dark/15 bg-white px-3 py-3 text-sm font-semibold text-dark outline-none focus:ring-2 focus:ring-primary-blue dark:border-light/15 dark:bg-[#0b1220] dark:text-light"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-extrabold text-dark dark:text-light mb-1">Assign technician</label>
                  <input
                    value={detail.technicianName ?? ""}
                    onChange={(e) => updateRow(detail, { technicianName: e.target.value })}
                    placeholder="Tech. Mary"
                    className="w-full rounded-xl border border-dark/15 bg-white px-4 py-3 text-sm font-semibold text-dark outline-none focus:ring-2 focus:ring-primary-blue dark:border-light/15 dark:bg-[#0b1220] dark:text-light"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-extrabold text-dark dark:text-light mb-1">Before notes</label>
                <textarea
                  rows={4}
                  value={detail.beforeNotes ?? ""}
                  onChange={(e) => updateRow(detail, { beforeNotes: e.target.value })}
                  className="w-full rounded-xl border border-dark/15 bg-white px-4 py-3 text-sm font-semibold text-dark outline-none focus:ring-2 focus:ring-primary-blue dark:border-light/15 dark:bg-[#0b1220] dark:text-light"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-extrabold text-dark dark:text-light mb-1">After notes</label>
                <textarea
                  rows={4}
                  value={detail.afterNotes ?? ""}
                  onChange={(e) => updateRow(detail, { afterNotes: e.target.value })}
                  className="w-full rounded-xl border border-dark/15 bg-white px-4 py-3 text-sm font-semibold text-dark outline-none focus:ring-2 focus:ring-primary-blue dark:border-light/15 dark:bg-[#0b1220] dark:text-light"
                />
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-dark/10 p-4 dark:border-light/10">
              <div className="text-xs font-semibold text-dark/60 dark:text-light/60">{saving ? "Saving…" : ""}</div>
              <button
                type="button"
                onClick={() => setDetail(null)}
                className="btn inline-flex rounded-xl bg-primary-yellow px-5 py-3 font-extrabold text-dark hover:brightness-95"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
