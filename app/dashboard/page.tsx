"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { SpinnerIcon } from "@/components/icons";
import { formatNgn } from "@/lib/products";
import { getFirebaseClientAsync } from "@/lib/firebase";

export default function DashboardPage() {
  const { user, userData, loading, logout } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Array<{ id: string; orderNumber: string; totalNgn: number; createdAtMs?: number }>>([]);

  function parseOrderSummary(data: unknown): { orderNumber: string; totalNgn: number; createdAtMs?: number } | null {
    if (!data || typeof data !== "object") return null;
    const obj = data as Record<string, unknown>;
    const orderNumber = typeof obj.orderNumber === "string" ? obj.orderNumber : null;
    const totalNgn = typeof obj.totalNgn === "number" ? obj.totalNgn : null;
    if (!orderNumber || totalNgn === null) return null;

    const createdAtMs =
      typeof obj.createdAtMs === "number"
        ? obj.createdAtMs
        : typeof (obj.createdAt as { toMillis?: unknown } | undefined)?.toMillis === "function"
          ? (obj.createdAt as { toMillis: () => number }).toMillis()
          : undefined;

    return { orderNumber, totalNgn, createdAtMs };
  }

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    (async () => {
      if (!user) return;
      try {
        const { db } = await getFirebaseClientAsync();
        const { collection, query, where, orderBy, limit, getDocs } = await import("firebase/firestore");
        const q = query(
          collection(db, "orders"),
          where("userUid", "==", user.uid),
          orderBy("createdAt", "desc"),
          limit(5)
        );
        const snap = await getDocs(q);
        const rows = snap.docs.map((d) => {
          const parsed = parseOrderSummary(d.data());
          if (!parsed) return null;
          return { id: d.id, ...parsed };
        }).filter((v): v is { id: string; orderNumber: string; totalNgn: number; createdAtMs?: number } => Boolean(v));
        setOrders(rows);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [user]);
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <SpinnerIcon className="w-8 h-8 animate-spin text-primary-blue" />
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div className="card border-l-4 border-l-primary-red">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-dark dark:text-light">
              Welcome, {userData?.displayName || user.email || "User"}!
            </h1>
            <p className="mt-1 text-sm font-medium text-dark/75 dark:text-light/75">
              Role: <span className="uppercase text-primary-blue font-bold">{userData?.role || "Customer"}</span>
            </p>
          </div>
          
          <button 
            onClick={async () => {
              await logout();
              router.push("/");
            }}
            className="btn-ghost text-primary-red hover:bg-primary-red/10"
          >
            Log Out
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-bold text-dark dark:text-light border-b border-dark/10 dark:border-light/10 pb-2 mb-4">
            Recent Orders
          </h2>
          {orders.length === 0 ? (
            <p className="text-sm text-dark/60 dark:text-light/60">You have no recent orders.</p>
          ) : (
            <div className="divide-y divide-dark/10 dark:divide-light/10">
              {orders.map((o) => (
                <div key={o.id} className="flex items-center justify-between py-3">
                  <div className="text-sm font-extrabold text-primary-blue">{o.orderNumber}</div>
                  <div className="text-sm font-black text-primary-red">{formatNgn(o.totalNgn)}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <h2 className="text-xl font-bold text-dark dark:text-light border-b border-dark/10 dark:border-light/10 pb-2 mb-4">
            Active Repairs
          </h2>
          <p className="text-sm text-dark/60 dark:text-light/60">
            No active repairs to track.
          </p>
        </div>
      </div>
    </div>
  );
}
