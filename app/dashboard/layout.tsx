"use client";

import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardAccessGate } from "@/components/DashboardAccessGate";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardAccessGate>
      <div className="min-h-[calc(100vh-4rem)]">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr]">
          <div className="hidden lg:block lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)]">
            <DashboardSidebar />
          </div>
          <div className="container-page py-8">
            <div className="mb-6 lg:hidden">
              <div className="rounded-2xl overflow-hidden">
                <DashboardSidebar />
              </div>
            </div>
            {children}
          </div>
        </div>
      </div>
    </DashboardAccessGate>
  );
}

