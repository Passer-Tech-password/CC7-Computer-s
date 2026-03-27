export type RepairStage = "diagnosis" | "repairing" | "testing" | "ready";

export type RepairJob = {
  jobNumber: string;
  deviceType: string;
  brand: string;
  model: string;
  serialNumber?: string;
  issueSummary: string;
  stage: RepairStage;
  estimatedCompletionISO: string;
  technicianName: string;
};

export const REPAIR_STAGES: Array<{ key: RepairStage; label: string }> = [
  { key: "diagnosis", label: "Diagnosis" },
  { key: "repairing", label: "Repairing" },
  { key: "testing", label: "Testing" },
  { key: "ready", label: "Ready" }
];

export const MOCK_REPAIR_JOBS: RepairJob[] = [
  {
    jobNumber: "CC7-2026-021-0047",
    deviceType: "Laptop",
    brand: "HP",
    model: "EliteBook 840 G8",
    serialNumber: "SN-84G8-CC7-0047",
    issueSummary: "Keyboard keys not responding + random shutdown",
    stage: "repairing",
    estimatedCompletionISO: "2026-04-03",
    technicianName: "Engr. Daniel"
  },
  {
    jobNumber: "CC7-2026-019-0021",
    deviceType: "Phone",
    brand: "Apple",
    model: "iPhone 13 Pro",
    serialNumber: "IP13P-CC7-0021",
    issueSummary: "Battery drain + charging port cleaning",
    stage: "testing",
    estimatedCompletionISO: "2026-03-30",
    technicianName: "Tech. Mary"
  },
  {
    jobNumber: "CC7-2026-015-0008",
    deviceType: "Desktop",
    brand: "Dell",
    model: "OptiPlex 7080",
    serialNumber: "OP7080-CC7-0008",
    issueSummary: "No display + RAM upgrade",
    stage: "ready",
    estimatedCompletionISO: "2026-03-28",
    technicianName: "Tech. Chuks"
  }
];

export function getRepairJob(jobNumber: string): RepairJob | null {
  const normalized = jobNumber.trim().toUpperCase();
  return MOCK_REPAIR_JOBS.find((j) => j.jobNumber.toUpperCase() === normalized) ?? null;
}

export function getRepairStageIndex(stage: RepairStage): number {
  return Math.max(
    0,
    REPAIR_STAGES.findIndex((s) => s.key === stage)
  );
}

