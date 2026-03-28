"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { SpinnerIcon } from "@/components/icons";
import { getFirebaseClientAsync } from "@/lib/firebase";
import { formatNgn } from "@/lib/products";
import { toast } from "sonner";

type OrderSummary = {
  id: string;
  orderNumber: string;
  totalNgn: number;
  status: string;
  createdAtMs?: number;
};

type RepairJobSummary = {
  id: string;
  jobNumber: string;
  deviceType: string;
  brand: string;
  model: string;
  status: string;
  createdAtMs?: number;
};

function parseOrderSummary(id: string, data: unknown): OrderSummary | null {
  if (!data || typeof data !== "object") return null;
  const obj = data as Record<string, unknown>;
  const orderNumber = typeof obj.orderNumber === "string" ? obj.orderNumber : null;
  const totalNgn = typeof obj.totalNgn === "number" ? obj.totalNgn : null;
  const status = typeof obj.status === "string" ? obj.status : "pending";
  const createdAtMs = typeof obj.createdAtMs === "number" ? obj.createdAtMs : undefined;
  if (!orderNumber || totalNgn === null) return null;
  return { id, orderNumber, totalNgn, status, createdAtMs };
}

function parseRepairSummary(id: string, data: unknown): RepairJobSummary | null {
  if (!data || typeof data !== "object") return null;
  const obj = data as Record<string, unknown>;
  const jobNumber = typeof obj.jobNumber === "string" ? obj.jobNumber : null;
  const deviceType = typeof obj.deviceType === "string" ? obj.deviceType : "Device";
  const brand = typeof obj.brand === "string" ? obj.brand : "Brand";
  const model = typeof obj.model === "string" ? obj.model : "Model";
  const status = typeof obj.status === "string" ? obj.status : "pending";
  const createdAtMs = typeof obj.createdAtMs === "number" ? obj.createdAtMs : undefined;
  if (!jobNumber) return null;
  return { id, jobNumber, deviceType, brand, model, status, createdAtMs };
}

export default function AccountPage() {
  const router = useRouter();
  const { user, userData, loading, logout } = useAuth();
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [repairs, setRepairs] = useState<RepairJobSummary[]>([]);
  const [repairsLoading, setRepairsLoading] = useState(true);

  const [profileName, setProfileName] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [loading, user, router]);

  useEffect(() => {
    setProfileName(userData?.displayName ?? user?.displayName ?? "");
    setProfilePhone(userData?.phone ?? "");
  }, [userData?.displayName, userData?.phone, user?.displayName]);

  useEffect(() => {
    (async () => {
      if (!user) return;
      setOrdersLoading(true);
      try {
        const { db } = await getFirebaseClientAsync();
        const { collection, getDocs, limit, orderBy, query, where } = await import("firebase/firestore");
        const q = query(collection(db, "orders"), where("userUid", "==", user.uid), orderBy("createdAtMs", "desc"), limit(20));
        const snap = await getDocs(q);
        const rows = snap.docs
          .map((d) => parseOrderSummary(d.id, d.data()))
          .filter((v): v is OrderSummary => Boolean(v));
        setOrders(rows);
      } catch (e) {
        console.error(e);
        setOrders([]);
      } finally {
        setOrdersLoading(false);
      }
    })();
  }, [user]);

  useEffect(() => {
    (async () => {
      if (!user) return;
      setRepairsLoading(true);
      try {
        const { db } = await getFirebaseClientAsync();
        const { collection, getDocs, limit, orderBy, query, where } = await import("firebase/firestore");
        const q = query(collection(db, "repair_jobs"), where("userUid", "==", user.uid), orderBy("createdAtMs", "desc"), limit(20));
        const snap = await getDocs(q);
        const rows = snap.docs
          .map((d) => parseRepairSummary(d.id, d.data()))
          .filter((v): v is RepairJobSummary => Boolean(v));
        setRepairs(rows);
      } catch (e) {
        console.error(e);
        setRepairs([]);
      } finally {
        setRepairsLoading(false);
      }
    })();
  }, [user]);

  const canSaveProfile = useMemo(() => Boolean(profileName.trim() || profilePhone.trim()), [profileName, profilePhone]);

  async function saveProfile() {
    if (!user) return;
    setProfileSaving(true);
    try {
      const { db } = await getFirebaseClientAsync();
      const { doc, serverTimestamp, setDoc } = await import("firebase/firestore");
      await setDoc(
        doc(db, "users", user.uid),
        {
          uid: user.uid,
          email: user.email ?? "",
          displayName: profileName.trim() || user.displayName || "Customer",
          phone: profilePhone.trim() || "",
          role: userData?.role ?? "customer",
          createdAtMs: userData?.createdAtMs ?? Date.now(),
          updatedAt: serverTimestamp()
        },
        { merge: true }
      );
      toast.success("Profile updated", { description: "Your profile information has been saved." });
    } catch (e) {
      console.error(e);
      toast.error("Profile update failed", { description: "Check your Firestore rules and try again." });
    } finally {
      setProfileSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="grid min-h-[40vh] place-items-center">
        <SpinnerIcon className="h-8 w-8 animate-spin text-primary-blue" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="container-page py-10">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center rounded-full bg-primary-yellow/25 px-3 py-1 text-sm font-extrabold text-yellow-800 dark:text-primary-yellow">
              My Account
            </div>
            <h1 className="mt-3 text-3xl font-black text-dark dark:text-light">{userData?.displayName ?? "Customer"}</h1>
            <p className="mt-2 text-sm font-semibold text-dark/70 dark:text-light/70">{user.email}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-semibold text-dark/60 dark:text-light/60">
              <span className="font-extrabold text-dark/70 dark:text-light/70">UID:</span>
              <span className="rounded-lg bg-dark/5 px-2 py-1 font-mono text-[11px] dark:bg-light/10">{user.uid}</span>
              <button
                type="button"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(user.uid);
                    setCopied(true);
                    window.setTimeout(() => setCopied(false), 1200);
                  } catch {
                    window.prompt("Copy UID", user.uid);
                  }
                }}
                className="rounded-lg bg-primary-blue px-3 py-1.5 text-xs font-extrabold text-white hover:brightness-110"
              >
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/shop" className="btn inline-flex rounded-xl bg-primary-blue px-4 py-2.5 font-extrabold text-white hover:brightness-110">
              Shop
            </Link>
            <button
              type="button"
              onClick={async () => {
                await logout();
                toast.success("Logged out");
              }}
              className="btn inline-flex rounded-xl bg-primary-red px-4 py-2.5 font-extrabold text-white hover:brightness-110"
            >
              Log out
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="flex flex-col gap-6">
            <div className="card">
              <h2 className="text-xl font-extrabold text-dark dark:text-light">My Orders</h2>
              <div className="mt-4 overflow-hidden rounded-2xl border border-dark/10 dark:border-light/10">
                <div className="divide-y divide-dark/10 dark:divide-light/10">
                  {orders.length === 0 ? (
                    <div className="p-6 text-center text-sm font-semibold text-dark/60 dark:text-light/60">
                      {ordersLoading ? "Loading…" : "No orders yet."}
                    </div>
                  ) : (
                    orders.map((o) => (
                      <div key={o.id} className="flex items-center justify-between gap-3 p-4 hover:bg-dark/5 dark:hover:bg-light/5 transition-colors">
                        <div className="min-w-0">
                          <div className="truncate text-sm font-extrabold text-primary-blue">{o.orderNumber}</div>
                          <div className="mt-1 text-xs font-semibold text-dark/60 dark:text-light/60">{o.status}</div>
                        </div>
                        <div className="text-sm font-black text-primary-red">{formatNgn(o.totalNgn)}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-end justify-between gap-3">
                <h2 className="text-xl font-extrabold text-dark dark:text-light">My Repair Jobs</h2>
                <Link href="/repair/book" className="text-sm font-bold text-primary-blue hover:underline">
                  Book new →
                </Link>
              </div>
              <div className="mt-4 overflow-hidden rounded-2xl border border-dark/10 dark:border-light/10">
                <div className="divide-y divide-dark/10 dark:divide-light/10">
                  {repairs.length === 0 ? (
                    <div className="p-6 text-center text-sm font-semibold text-dark/60 dark:text-light/60">
                      {repairsLoading ? "Loading…" : "No repair jobs yet."}
                    </div>
                  ) : (
                    repairs.map((r) => (
                      <Link
                        key={r.id}
                        href={`/repair/track?job=${encodeURIComponent(r.jobNumber)}`}
                        className="block p-4 hover:bg-dark/5 dark:hover:bg-light/5 transition-colors"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <div className="truncate text-sm font-extrabold text-primary-blue">{r.jobNumber}</div>
                            <div className="mt-1 text-xs font-semibold text-dark/60 dark:text-light/60">
                              {r.deviceType} • {r.brand} {r.model}
                            </div>
                          </div>
                          <span className="rounded-full bg-primary-yellow/25 px-3 py-1 text-xs font-extrabold text-yellow-800 dark:text-primary-yellow">
                            {r.status}
                          </span>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="card">
              <h2 className="text-xl font-extrabold text-dark dark:text-light">Profile</h2>
              <div className="mt-4 grid gap-4">
                <div>
                  <label className="block text-sm font-extrabold text-dark dark:text-light mb-1">Full name</label>
                  <input
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full rounded-xl border border-dark/15 bg-white px-4 py-3 text-sm font-semibold text-dark outline-none focus:ring-2 focus:ring-primary-blue dark:border-light/15 dark:bg-[#0b1220] dark:text-light"
                  />
                </div>
                <div>
                  <label className="block text-sm font-extrabold text-dark dark:text-light mb-1">Phone</label>
                  <input
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    placeholder="+234…"
                    className="w-full rounded-xl border border-dark/15 bg-white px-4 py-3 text-sm font-semibold text-dark outline-none focus:ring-2 focus:ring-primary-blue dark:border-light/15 dark:bg-[#0b1220] dark:text-light"
                  />
                </div>
                <button
                  type="button"
                  disabled={!canSaveProfile || profileSaving}
                  onClick={saveProfile}
                  className={[
                    "btn inline-flex w-full rounded-2xl py-4 text-base font-black",
                    !canSaveProfile || profileSaving
                      ? "cursor-not-allowed bg-dark/10 text-dark/40 dark:bg-light/10 dark:text-light/40"
                      : "bg-primary-red text-white hover:brightness-110"
                  ].join(" ")}
                >
                  {profileSaving ? "Saving…" : "Save Profile"}
                </button>
              </div>
            </div>

            <div className="card">
              <h2 className="text-xl font-extrabold text-dark dark:text-light">Quick Links</h2>
              <div className="mt-4 flex flex-col gap-3">
                <Link href="/cart" className="btn inline-flex rounded-xl bg-primary-yellow px-4 py-3 font-extrabold text-dark hover:brightness-95">
                  View Cart
                </Link>
                <Link href="/repair/book" className="btn inline-flex rounded-xl bg-primary-blue px-4 py-3 font-extrabold text-white hover:brightness-110">
                  Book a Repair
                </Link>
                <Link href="/repair/track" className="btn inline-flex rounded-xl bg-primary-red px-4 py-3 font-extrabold text-white hover:brightness-110">
                  Track Repair
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
