import { Suspense } from "react";
import { SuccessClient } from "@/components/SuccessClient";

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="container-page py-16">
          <div className="card">
            <div className="text-sm font-semibold text-dark/70 dark:text-light/70">Loading…</div>
          </div>
        </div>
      }
    >
      <SuccessClient />
    </Suspense>
  );
}
