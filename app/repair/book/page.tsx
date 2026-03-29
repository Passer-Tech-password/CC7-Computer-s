"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RepairStepper } from "@/components/RepairStepper";
import { useAuth } from "@/contexts/AuthContext";
import { getFirebaseClientAsync } from "@/lib/firebase";
import { toast } from "sonner";
import { isApiEnabled } from "@/lib/api-client";
import { createRepairJob as apiCreateRepairJob } from "@/lib/api";

type DeviceType = "Laptop" | "Desktop" | "Phone" | "Tablet" | "Other";
type DeviceCondition = "New" | "Fairly Used" | "Refurbished";

type RepairRequestDraft = {
  deviceType: DeviceType;
  brand: string;
  model: string;
  serialNumber: string;
  condition: DeviceCondition;
  issues: string[];
  issueDescription: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  pickupDate: string;
};

const COMMON_ISSUES = [
  "No Power",
  "Screen Damage",
  "Battery Issues",
  "Keyboard/Touchpad",
  "Overheating",
  "Slow Performance",
  "Charging Port",
  "Water Damage",
  "Software/OS",
  "Data Recovery"
];

const STEPS = [
  { key: "device", label: "Device" },
  { key: "issue", label: "Issue" },
  { key: "customer", label: "Customer" },
  { key: "review", label: "Review" }
];

function clampStep(step: number) {
  return Math.max(0, Math.min(STEPS.length - 1, step));
}

function generateJobNumber() {
  const now = new Date();
  const year = now.getFullYear();
  const dayOfYear = Math.floor(
    (Date.UTC(year, now.getMonth(), now.getDate()) - Date.UTC(year, 0, 0)) / 86400000
  );
  const serial = String(Math.floor(Math.random() * 10000)).padStart(4, "0");
  return `CC7-${year}-${String(dayOfYear).padStart(3, "0")}-${serial}`;
}

export default function RepairBookingPage() {
  const router = useRouter();
  const { user, userData } = useAuth();
  const [step, setStep] = useState(0);
  const [submittedJobNumber, setSubmittedJobNumber] = useState<string | null>(null);

  const [draft, setDraft] = useState<RepairRequestDraft>({
    deviceType: "Laptop",
    brand: "",
    model: "",
    serialNumber: "",
    condition: "Fairly Used",
    issues: [],
    issueDescription: "",
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    pickupDate: ""
  });

  useEffect(() => {
    const email = user?.email ?? "";
    const displayName = userData?.displayName ?? user?.displayName ?? "";
    setDraft((prev) => ({
      ...prev,
      customerEmail: prev.customerEmail || email,
      customerName: prev.customerName || displayName
    }));
  }, [user?.email, user?.displayName, userData?.displayName]);

  const canContinue = useMemo(() => {
    if (step === 0) return Boolean(draft.brand.trim() && draft.model.trim());
    if (step === 1) return Boolean(draft.issueDescription.trim() || draft.issues.length > 0);
    if (step === 2) return Boolean(draft.customerName.trim() && draft.customerEmail.trim() && draft.pickupDate);
    return true;
  }, [step, draft]);

  function toggleIssue(issue: string) {
    setDraft((prev) => {
      const exists = prev.issues.includes(issue);
      return { ...prev, issues: exists ? prev.issues.filter((i) => i !== issue) : [...prev.issues, issue] };
    });
  }

  function goNext() {
    if (!canContinue) return;
    setStep((s) => clampStep(s + 1));
  }

  function goBack() {
    setStep((s) => clampStep(s - 1));
  }

  async function submit() {
    if (!user) {
      toast.error("Please log in", { description: "Log in to submit a repair request and track it later." });
      router.push("/login");
      return;
    }

    const fallbackJobNumber = generateJobNumber();

    try {
      if (isApiEnabled()) {
        const created = await apiCreateRepairJob({
          deviceType: draft.deviceType,
          brand: draft.brand,
          model: draft.model,
          serialNumber: draft.serialNumber || undefined,
          condition: draft.condition,
          issues: draft.issues,
          issueDescription: draft.issueDescription,
          customerName: draft.customerName || user.displayName || "Customer",
          customerEmail: draft.customerEmail || user.email || "",
          customerPhone: draft.customerPhone || undefined,
          pickupDate: draft.pickupDate || undefined
        });
        toast.success("Repair request submitted", { description: `Job number: ${created.jobNumber}` });
        setSubmittedJobNumber(created.jobNumber);
        return;
      }
    } catch (e) {
      console.error(e);
      toast.error("API unavailable", { description: "Submitting via Firebase for now." });
    }

    try {
      const { db } = await getFirebaseClientAsync();
      const { addDoc, collection, serverTimestamp } = await import("firebase/firestore");
      await addDoc(collection(db, "repair_jobs"), {
        jobNumber: fallbackJobNumber,
        userUid: user.uid,
        customerName: draft.customerName || user.displayName || "Customer",
        customerPhone: draft.customerPhone || "",
        deviceType: draft.deviceType,
        brand: draft.brand,
        model: draft.model,
        status: "pending",
        technicianName: "",
        beforeNotes: `Condition: ${draft.condition}\nSerial: ${draft.serialNumber || "N/A"}\n\nIssues: ${
          draft.issues.length ? draft.issues.join(", ") : "N/A"
        }\n\nDescription:\n${draft.issueDescription || "N/A"}`,
        afterNotes: "",
        createdAtMs: Date.now(),
        createdAt: serverTimestamp()
      });
      toast.success("Repair request submitted", { description: `Job number: ${fallbackJobNumber}` });
      setSubmittedJobNumber(fallbackJobNumber);
    } catch (e) {
      console.error(e);
      toast.error("Submission failed", { description: "Please try again. Check network/Firestore rules." });
    }
  }

  if (submittedJobNumber) {
    return (
      <div className="container-page py-10">
        <div className="card">
          <div className="inline-flex items-center rounded-full bg-primary-yellow/25 px-3 py-1 text-sm font-extrabold text-yellow-800 dark:text-primary-yellow">
            Request submitted
          </div>
          <h1 className="mt-3 text-3xl font-black text-dark dark:text-light">Repair request received</h1>
          <p className="mt-2 text-sm font-semibold text-dark/70 dark:text-light/70">
            Your job number is <span className="font-black text-primary-red">{submittedJobNumber}</span>. Save it to
            track your repair progress.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => router.push(`/repair/track?job=${encodeURIComponent(submittedJobNumber)}`)}
              className="btn inline-flex rounded-2xl bg-primary-blue px-6 py-4 text-base font-black text-white hover:brightness-110"
            >
              Track this repair
            </button>
            <Link
              href="/services"
              className="btn inline-flex rounded-2xl bg-primary-yellow px-6 py-4 text-base font-black text-dark hover:brightness-95"
            >
              Back to Services
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page py-10">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center rounded-full bg-primary-blue/15 px-3 py-1 text-sm font-extrabold text-primary-blue">
              Repair Booking
            </div>
            <h1 className="mt-3 text-3xl font-black text-dark dark:text-light">Book a repair</h1>
            <p className="mt-2 text-sm font-semibold text-dark/70 dark:text-light/70">
              Complete the steps below. We’ll confirm diagnosis and pricing before any major work.
            </p>
          </div>
          <Link href="/repair/track" className="text-sm font-bold text-primary-blue hover:underline">
            Already have a job number? Track →
          </Link>
        </div>

        <div className="card">
          <RepairStepper steps={STEPS} activeIndex={step} variant="booking" />
        </div>

        <div className="card">
          {step === 0 ? (
            <div className="flex flex-col gap-5">
              <h2 className="text-xl font-extrabold text-dark dark:text-light">Step 1: Device Information</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-extrabold text-dark dark:text-light mb-1">Device type</label>
                  <select
                    value={draft.deviceType}
                    onChange={(e) => setDraft((p) => ({ ...p, deviceType: e.target.value as DeviceType }))}
                    className="w-full rounded-xl border border-dark/15 bg-white px-3 py-3 text-sm font-semibold text-dark outline-none focus:ring-2 focus:ring-primary-blue dark:border-light/15 dark:bg-[#0b1220] dark:text-light"
                  >
                    {(["Laptop", "Desktop", "Phone", "Tablet", "Other"] as const).map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-extrabold text-dark dark:text-light mb-1">Condition</label>
                  <select
                    value={draft.condition}
                    onChange={(e) => setDraft((p) => ({ ...p, condition: e.target.value as DeviceCondition }))}
                    className="w-full rounded-xl border border-dark/15 bg-white px-3 py-3 text-sm font-semibold text-dark outline-none focus:ring-2 focus:ring-primary-blue dark:border-light/15 dark:bg-[#0b1220] dark:text-light"
                  >
                    {(["New", "Fairly Used", "Refurbished"] as const).map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-extrabold text-dark dark:text-light mb-1">Brand</label>
                  <input
                    value={draft.brand}
                    onChange={(e) => setDraft((p) => ({ ...p, brand: e.target.value }))}
                    placeholder="HP, Dell, Lenovo, Apple…"
                    className="w-full rounded-xl border border-dark/15 bg-white px-4 py-3 text-sm font-semibold text-dark outline-none focus:ring-2 focus:ring-primary-blue dark:border-light/15 dark:bg-[#0b1220] dark:text-light"
                  />
                </div>
                <div>
                  <label className="block text-sm font-extrabold text-dark dark:text-light mb-1">Model</label>
                  <input
                    value={draft.model}
                    onChange={(e) => setDraft((p) => ({ ...p, model: e.target.value }))}
                    placeholder="EliteBook 840 G8, iPhone 13 Pro…"
                    className="w-full rounded-xl border border-dark/15 bg-white px-4 py-3 text-sm font-semibold text-dark outline-none focus:ring-2 focus:ring-primary-blue dark:border-light/15 dark:bg-[#0b1220] dark:text-light"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-extrabold text-dark dark:text-light mb-1">Serial number</label>
                  <input
                    value={draft.serialNumber}
                    onChange={(e) => setDraft((p) => ({ ...p, serialNumber: e.target.value }))}
                    placeholder="Optional"
                    className="w-full rounded-xl border border-dark/15 bg-white px-4 py-3 text-sm font-semibold text-dark outline-none focus:ring-2 focus:ring-primary-blue dark:border-light/15 dark:bg-[#0b1220] dark:text-light"
                  />
                </div>
              </div>
            </div>
          ) : null}

          {step === 1 ? (
            <div className="flex flex-col gap-5">
              <h2 className="text-xl font-extrabold text-dark dark:text-light">Step 2: Issue Description</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {COMMON_ISSUES.map((issue) => {
                  const checked = draft.issues.includes(issue);
                  return (
                    <button
                      type="button"
                      key={issue}
                      onClick={() => toggleIssue(issue)}
                      className={[
                        "flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm font-extrabold transition",
                        checked
                          ? "border-primary-blue bg-primary-blue/10 text-primary-blue"
                          : "border-dark/10 bg-white text-dark hover:border-primary-blue/40 dark:border-light/10 dark:bg-[#0b1220] dark:text-light"
                      ].join(" ")}
                    >
                      <span>{issue}</span>
                      <span className="text-xs">{checked ? "Selected" : ""}</span>
                    </button>
                  );
                })}
              </div>
              <div>
                <label className="block text-sm font-extrabold text-dark dark:text-light mb-1">Tell us more</label>
                <textarea
                  value={draft.issueDescription}
                  onChange={(e) => setDraft((p) => ({ ...p, issueDescription: e.target.value }))}
                  rows={5}
                  placeholder="Describe the issue, when it started, and any important symptoms…"
                  className="w-full rounded-xl border border-dark/15 bg-white px-4 py-3 text-sm font-semibold text-dark outline-none focus:ring-2 focus:ring-primary-blue dark:border-light/15 dark:bg-[#0b1220] dark:text-light"
                />
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="flex flex-col gap-5">
              <h2 className="text-xl font-extrabold text-dark dark:text-light">Step 3: Customer Information</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-extrabold text-dark dark:text-light mb-1">Full name</label>
                  <input
                    value={draft.customerName}
                    onChange={(e) => setDraft((p) => ({ ...p, customerName: e.target.value }))}
                    className="w-full rounded-xl border border-dark/15 bg-white px-4 py-3 text-sm font-semibold text-dark outline-none focus:ring-2 focus:ring-primary-blue dark:border-light/15 dark:bg-[#0b1220] dark:text-light"
                  />
                </div>
                <div>
                  <label className="block text-sm font-extrabold text-dark dark:text-light mb-1">Email</label>
                  <input
                    type="email"
                    value={draft.customerEmail}
                    onChange={(e) => setDraft((p) => ({ ...p, customerEmail: e.target.value }))}
                    className="w-full rounded-xl border border-dark/15 bg-white px-4 py-3 text-sm font-semibold text-dark outline-none focus:ring-2 focus:ring-primary-blue dark:border-light/15 dark:bg-[#0b1220] dark:text-light"
                  />
                </div>
                <div>
                  <label className="block text-sm font-extrabold text-dark dark:text-light mb-1">Phone</label>
                  <input
                    value={draft.customerPhone}
                    onChange={(e) => setDraft((p) => ({ ...p, customerPhone: e.target.value }))}
                    placeholder="+234…"
                    className="w-full rounded-xl border border-dark/15 bg-white px-4 py-3 text-sm font-semibold text-dark outline-none focus:ring-2 focus:ring-primary-blue dark:border-light/15 dark:bg-[#0b1220] dark:text-light"
                  />
                </div>
                <div>
                  <label className="block text-sm font-extrabold text-dark dark:text-light mb-1">
                    Preferred pickup date
                  </label>
                  <input
                    type="date"
                    value={draft.pickupDate}
                    onChange={(e) => setDraft((p) => ({ ...p, pickupDate: e.target.value }))}
                    className="w-full rounded-xl border border-dark/15 bg-white px-4 py-3 text-sm font-semibold text-dark outline-none focus:ring-2 focus:ring-primary-blue dark:border-light/15 dark:bg-[#0b1220] dark:text-light"
                  />
                </div>
              </div>
              <div className="rounded-xl border border-primary-yellow/35 bg-primary-yellow/15 p-4 text-sm font-semibold text-dark">
                If you’re logged in, your info is pre-filled. We’ll contact you before any major repairs.
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="flex flex-col gap-5">
              <h2 className="text-xl font-extrabold text-dark dark:text-light">Step 4: Review & Submit</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-dark/10 bg-white p-4 dark:border-light/10 dark:bg-[#0b1220]">
                  <div className="text-xs font-extrabold text-primary-blue">Device</div>
                  <div className="mt-1 text-sm font-bold text-dark dark:text-light">
                    {draft.deviceType} • {draft.brand} • {draft.model}
                  </div>
                  <div className="mt-2 text-xs font-semibold text-dark/60 dark:text-light/60">
                    Condition: {draft.condition}
                    {draft.serialNumber ? ` • Serial: ${draft.serialNumber}` : ""}
                  </div>
                </div>
                <div className="rounded-xl border border-dark/10 bg-white p-4 dark:border-light/10 dark:bg-[#0b1220]">
                  <div className="text-xs font-extrabold text-primary-blue">Customer</div>
                  <div className="mt-1 text-sm font-bold text-dark dark:text-light">{draft.customerName}</div>
                  <div className="mt-2 text-xs font-semibold text-dark/60 dark:text-light/60">
                    {draft.customerEmail}
                    {draft.customerPhone ? ` • ${draft.customerPhone}` : ""}
                  </div>
                  <div className="mt-2 text-xs font-semibold text-dark/60 dark:text-light/60">
                    Pickup: {draft.pickupDate || "Not set"}
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-dark/10 bg-white p-4 dark:border-light/10 dark:bg-[#0b1220]">
                <div className="text-xs font-extrabold text-primary-blue">Issue</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {draft.issues.length > 0 ? (
                    draft.issues.map((issue) => (
                      <span
                        key={issue}
                        className="rounded-full bg-primary-blue/10 px-3 py-1 text-xs font-extrabold text-primary-blue"
                      >
                        {issue}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs font-semibold text-dark/60 dark:text-light/60">No common issues selected</span>
                  )}
                </div>
                <p className="mt-3 text-sm font-semibold text-dark/75 dark:text-light/75">
                  {draft.issueDescription || "No extra description provided."}
                </p>
              </div>
            </div>
          ) : null}

          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={goBack}
              disabled={step === 0}
              className={[
                "btn inline-flex rounded-2xl px-6 py-3 text-base font-black",
                step === 0
                  ? "cursor-not-allowed bg-dark/10 text-dark/40 dark:bg-light/10 dark:text-light/40"
                  : "bg-primary-yellow text-dark hover:brightness-95"
              ].join(" ")}
            >
              Back
            </button>

            {step < 3 ? (
              <button
                type="button"
                onClick={goNext}
                disabled={!canContinue}
                className={[
                  "btn inline-flex rounded-2xl px-7 py-3 text-base font-black",
                  canContinue
                    ? "bg-primary-blue text-white hover:brightness-110"
                    : "cursor-not-allowed bg-dark/10 text-dark/40 dark:bg-light/10 dark:text-light/40"
                ].join(" ")}
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                onClick={submit}
                className="btn inline-flex rounded-2xl bg-primary-red px-7 py-3 text-base font-black text-white hover:brightness-110"
              >
                Submit Repair Request
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
