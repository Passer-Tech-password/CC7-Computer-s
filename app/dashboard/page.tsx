"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { SpinnerIcon } from "@/components/icons";

export default function DashboardPage() {
  const { user, userData, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

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
          <p className="text-sm text-dark/60 dark:text-light/60">
            You have no recent orders.
          </p>
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
