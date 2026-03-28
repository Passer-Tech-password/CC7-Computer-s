"use client";

import { useEffect, useMemo, useState } from "react";
import { DataTable, DataTableColumn } from "@/components/DataTable";
import { getFirebaseClientAsync } from "@/lib/firebase";
import type { UserRole } from "@/types/user";

type UserRow = {
  id: string;
  uid: string;
  displayName: string;
  email: string;
  role: UserRole;
};

function parseString(v: unknown): string | null {
  return typeof v === "string" ? v : null;
}

export default function DashboardCustomersPage() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<UserRow[]>([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { db } = await getFirebaseClientAsync();
        const { collection, getDocs, limit, query } = await import("firebase/firestore");
        const snap = await getDocs(query(collection(db, "users"), limit(300)));
        const parsed = snap.docs
          .map((d) => {
            const data = d.data() as Record<string, unknown>;
            const uid = parseString(data.uid) ?? d.id;
            const email = parseString(data.email) ?? "";
            const displayName = parseString(data.displayName) ?? "User";
            const role = (parseString(data.role) as UserRole | null) ?? "customer";
            return { id: d.id, uid, email, displayName, role };
          })
          .filter((u) => Boolean(u.email));
        setRows(parsed);
      } catch (e) {
        console.error(e);
        setRows([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const columns = useMemo<Array<DataTableColumn<UserRow>>>(
    () => [
      { key: "name", header: "Name", cell: (u) => <span className="font-extrabold text-dark dark:text-light">{u.displayName}</span> },
      { key: "email", header: "Email", cell: (u) => <span className="text-sm font-semibold text-dark/70 dark:text-light/70">{u.email}</span> },
      { key: "role", header: "Role", cell: (u) => <span className="rounded-full bg-primary-yellow/25 px-3 py-1 text-xs font-extrabold text-yellow-800 dark:text-primary-yellow">{u.role}</span> }
    ],
    []
  );

  return (
    <div className="flex flex-col gap-5">
      <div>
        <div className="inline-flex items-center rounded-full bg-primary-blue/15 px-3 py-1 text-sm font-extrabold text-primary-blue">
          Customers
        </div>
        <h1 className="mt-3 text-3xl font-black text-dark dark:text-light">Customers</h1>
        <p className="mt-2 text-sm font-semibold text-dark/70 dark:text-light/70">
          This page reads from the Firestore users collection.
        </p>
      </div>

      <DataTable rows={rows} columns={columns} emptyLabel={loading ? "Loading…" : "No users found."} loading={loading} />
    </div>
  );
}
