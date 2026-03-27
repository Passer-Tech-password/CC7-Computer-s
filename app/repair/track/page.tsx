"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { RepairStepper } from "@/components/RepairStepper";
import { getRepairJob, getRepairStageIndex, REPAIR_STAGES } from "@/lib/repairs";

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("en-NG", { year: "numeric", month: "short", day: "2-digit" }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function normalizePhone(value: string) {
  return value.replace(/[^\d]/g, "");
}

function StatusBadge({ stage }: { stage: string }) {
  const map: Record<string, { label: string; className: string }> = {
    diagnosis: { label: "In Diagnosis", className: "bg-primary-yellow/25 text-yellow-800 dark:text-primary-yellow" },
    repairing: { label: "Repairing", className: "bg-primary-blue/15 text-primary-blue" },
    testing: { label: "Testing", className: "bg-primary-blue/15 text-primary-blue" },
    ready: { label: "Ready", className: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" }
  };
  const data = map[stage] ?? { label: "Processing", className: "bg-dark/10 text-dark/70 dark:bg-light/10 dark:text-light/70" };
  return <span className={["inline-flex rounded-full px-3 py-1 text-xs font-extrabold", data.className].join(" ")}>{data.label}</span>;
}

export default function RepairTrackPage() {
  const searchParams = useSearchParams();
  const [jobNumber, setJobNumber] = useState("");
  const [submitted, setSubmitted] = useState<string | null>(null);

  useEffect(() => {
    const job = searchParams.get("job");
    if (job) {
      setJobNumber(job);
      setSubmitted(job);
    }
  }, [searchParams]);

  const job = useMemo(() => (submitted ? getRepairJob(submitted) : null), [submitted]);

  const stepperSteps = useMemo(
    () => REPAIR_STAGES.map((s) => ({ key: s.key, label: s.label })),
    []
  );

  const activeIndex = job ? getRepairStageIndex(job.stage) : 0;

  const whatsappLink = useMemo(() => {
    const number = normalizePhone(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "");
    const text = job
      ? `Hi CC7, I want an update on my repair job ${job.jobNumber} (${job.brand} ${job.model}).`
      : "Hi CC7, I need help tracking my repair job.";
    if (!number) return null;
    return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
  }, [job]);

  return (
    <div className="container-page py-10">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center rounded-full bg-primary-yellow/25 px-3 py-1 text-sm font-extrabold text-yellow-800 dark:text-primary-yellow">
              Repair Tracking
            </div>
            <h1 className="mt-3 text-3xl font-black text-dark dark:text-light">Track your repair</h1>
            <p className="mt-2 text-sm font-semibold text-dark/70 dark:text-light/70">
              Enter your job number to see the current status.
            </p>
          </div>
          <Link href="/repair/book" className="text-sm font-bold text-primary-blue hover:underline">
            Book a new repair →
          </Link>
        </div>

        <div className="card">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex-1">
              <label className="sr-only" htmlFor="job-number">
                Job number
              </label>
              <input
                id="job-number"
                value={jobNumber}
                onChange={(e) => setJobNumber(e.target.value)}
                placeholder="CC7-2026-021-0047"
                className="w-full rounded-xl border border-dark/15 bg-white px-4 py-3 text-sm font-semibold text-dark outline-none focus:ring-2 focus:ring-primary-blue dark:border-light/15 dark:bg-[#0b1220] dark:text-light"
              />
            </div>
            <button
              type="button"
              onClick={() => setSubmitted(jobNumber)}
              className="btn inline-flex rounded-xl bg-primary-red px-6 py-3 font-extrabold text-white hover:brightness-110"
            >
              Track
            </button>
          </div>

          <div className="mt-4 text-xs font-semibold text-dark/60 dark:text-light/60">
            Try sample job numbers: CC7-2026-021-0047 • CC7-2026-019-0021 • CC7-2026-015-0008
          </div>
        </div>

        {submitted ? (
          job ? (
            <div className="card">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="text-xs font-extrabold text-primary-blue">Job Number</div>
                  <div className="mt-1 text-2xl font-black text-dark dark:text-light">{job.jobNumber}</div>
                  <div className="mt-2 text-sm font-semibold text-dark/70 dark:text-light/70">
                    {job.deviceType} • <span className="font-extrabold text-primary-blue">{job.brand}</span> • {job.model}
                  </div>
                  <div className="mt-1 text-xs font-semibold text-dark/60 dark:text-light/60">
                    {job.serialNumber ? `Serial: ${job.serialNumber} • ` : ""}
                    Technician: {job.technicianName}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge stage={job.stage} />
                  <div className="rounded-full bg-primary-red/15 px-3 py-1 text-xs font-extrabold text-primary-red">
                    ETA: {formatDate(job.estimatedCompletionISO)}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <RepairStepper steps={stepperSteps} activeIndex={activeIndex} variant="tracking" />
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-dark/10 bg-white p-4 dark:border-light/10 dark:bg-[#0b1220]">
                  <div className="text-xs font-extrabold text-primary-blue">Current update</div>
                  <div className="mt-2 text-sm font-semibold text-dark/75 dark:text-light/75">{job.issueSummary}</div>
                </div>
                <div className="rounded-xl border border-dark/10 bg-white p-4 dark:border-light/10 dark:bg-[#0b1220]">
                  <div className="text-xs font-extrabold text-primary-blue">Next step</div>
                  <div className="mt-2 text-sm font-semibold text-dark/75 dark:text-light/75">
                    {activeIndex < stepperSteps.length - 1 ? stepperSteps[activeIndex + 1]?.label : "Pickup / Delivery"}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                {whatsappLink ? (
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noreferrer"
                    className="btn inline-flex rounded-2xl bg-primary-blue px-6 py-4 text-base font-black text-white hover:brightness-110"
                  >
                    Contact Technician
                  </a>
                ) : (
                  <Link
                    href="/contact"
                    className="btn inline-flex rounded-2xl bg-primary-blue px-6 py-4 text-base font-black text-white hover:brightness-110"
                  >
                    Contact Technician
                  </Link>
                )}
                <Link
                  href="/services"
                  className="btn inline-flex rounded-2xl bg-primary-yellow px-6 py-4 text-base font-black text-dark hover:brightness-95"
                >
                  Services
                </Link>
              </div>
            </div>
          ) : (
            <div className="card">
              <h2 className="text-xl font-extrabold text-dark dark:text-light">Job not found</h2>
              <p className="mt-2 text-sm font-semibold text-dark/70 dark:text-light/70">
                Check the job number and try again. If you’re stuck, message CC7 for help.
              </p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setSubmitted(null)}
                  className="btn inline-flex rounded-2xl bg-primary-yellow px-6 py-4 text-base font-black text-dark hover:brightness-95"
                >
                  Try again
                </button>
                {whatsappLink ? (
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noreferrer"
                    className="btn inline-flex rounded-2xl bg-primary-blue px-6 py-4 text-base font-black text-white hover:brightness-110"
                  >
                    Contact CC7
                  </a>
                ) : (
                  <Link
                    href="/contact"
                    className="btn inline-flex rounded-2xl bg-primary-blue px-6 py-4 text-base font-black text-white hover:brightness-110"
                  >
                    Contact CC7
                  </Link>
                )}
              </div>
            </div>
          )
        ) : null}
      </div>
    </div>
  );
}
