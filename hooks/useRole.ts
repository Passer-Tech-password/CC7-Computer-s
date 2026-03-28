"use client";

import { useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import type { UserRole } from "@/types/user";

export type StaffRole = Extract<UserRole, "staff" | "admin" | "technician">;

export function useRole() {
  const { userData } = useAuth();
  const role = userData?.role ?? "customer";

  return useMemo(() => {
    const isStaff = role === "staff" || role === "admin" || role === "technician";
    const isAdmin = role === "admin";
    const isTechnician = role === "technician";
    return { role, isStaff, isAdmin, isTechnician };
  }, [role]);
}

