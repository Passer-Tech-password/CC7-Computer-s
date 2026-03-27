import { Suspense } from "react";
import { RepairTrackClient } from "@/components/RepairTrackClient";

export default function RepairTrackPage() {
  return (
    <Suspense
      fallback={
        <div className="container-page py-10">
          <div className="card">
            <div className="text-sm font-semibold text-dark/70 dark:text-light/70">Loading tracking…</div>
          </div>
        </div>
      }
    >
      <RepairTrackClient />
    </Suspense>
  );
}
