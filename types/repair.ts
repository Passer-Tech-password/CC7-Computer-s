export type RepairStatus = "new" | "in_progress" | "awaiting_parts" | "ready" | "delivered" | "cancelled";

export type RepairRequest = {
  id: string;
  customerName: string;
  customerPhone: string;
  deviceType: "laptop" | "desktop" | "phone" | "other";
  issueSummary: string;
  status: RepairStatus;
  createdAtMs: number;
};

