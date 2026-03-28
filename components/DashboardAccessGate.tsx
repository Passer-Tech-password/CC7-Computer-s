"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useRole } from "@/hooks/useRole";
import { SpinnerIcon } from "@/components/icons";

export function DashboardAccessGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { isStaff } = useRole();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="grid min-h-[40vh] place-items-center">
        <SpinnerIcon className="h-8 w-8 animate-spin text-primary-blue" />
      </div>
    );
  }

  if (!user) return null;

  if (!isStaff) {
    return (
      <div className="container-page py-12">
        <div className="card">
          <div className="inline-flex items-center rounded-full bg-primary-yellow/25 px-3 py-1 text-sm font-extrabold text-yellow-800 dark:text-primary-yellow">
            Access denied
          </div>
          <h1 className="mt-4 text-3xl font-black text-dark dark:text-light">You don’t have permission</h1>
          <p className="mt-2 text-sm font-semibold text-dark/70 dark:text-light/70">
            This dashboard is for CC7 staff only (Staff / Admin / Technician).
          </p>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="mt-6 btn inline-flex rounded-2xl bg-primary-blue px-6 py-4 text-base font-black text-white hover:brightness-110"
          >
            Back Home
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

