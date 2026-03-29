export type BackendUserRole = "customer" | "staff" | "admin" | "technician";

export type BackendProductCondition = "new" | "fairly_used" | "refurbished";
export type BackendProductCategory = "laptops" | "desktops" | "accessories" | "phones" | "printers";

export type BackendOrderStatus = "pending" | "paid" | "processing" | "completed" | "cancelled";
export type BackendRepairJobStatus = "pending" | "diagnosis" | "repairing" | "ready" | "completed";

export type BackendInventory = {
  productId: string;
  stockCount: number;
  lowStockThreshold?: number;
  updatedAtMs: number;
};

export type BackendProduct = {
  id: string;
  name: string;
  brand: string;
  model: string;
  category: BackendProductCategory;
  condition: BackendProductCondition;
  priceNgn: number;
  oldPriceNgn?: number;
  imageUrl: string;
  images?: string[];
  stockCount: number;
  inStock: boolean;
  description?: string;
  specs?: Record<string, string>;
  createdAtMs: number;
  updatedAtMs?: number;
};

export type BackendOrderItem = {
  productId: string;
  name: string;
  brand: string;
  model: string;
  imageUrl: string;
  priceNgn: number;
  quantity: number;
};

export type BackendOrder = {
  id: string;
  orderNumber: string;
  userUid: string | null;
  items: BackendOrderItem[];
  subtotalNgn: number;
  deliveryFeeNgn: number;
  totalNgn: number;
  pickup: boolean;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  status: BackendOrderStatus;
  createdAtMs: number;
  updatedAtMs?: number;
};

export type BackendRepairJob = {
  id: string;
  jobNumber: string;
  userUid: string | null;
  customerName: string;
  customerPhone?: string;
  deviceType: string;
  brand: string;
  model: string;
  serialNumber?: string;
  status: BackendRepairJobStatus;
  technicianName?: string;
  beforeNotes?: string;
  afterNotes?: string;
  estimatedCompletionISO?: string;
  createdAtMs: number;
  updatedAtMs?: number;
};

export type BackendCustomer = {
  uid: string;
  email: string;
  displayName: string;
  phone?: string;
  role: BackendUserRole;
  createdAtMs: number;
  updatedAtMs?: number;
};

