export type RepairJobStatus = "pending" | "diagnosis" | "repairing" | "ready" | "completed";

export type RepairJob = {
  id: string;
  jobNumber: string;
  userUid: string | null;
  customerName: string;
  customerPhone?: string;
  deviceType: string;
  brand: string;
  model: string;
  status: RepairJobStatus;
  technicianName?: string;
  beforeNotes?: string;
  afterNotes?: string;
  createdAtMs: number;
};

