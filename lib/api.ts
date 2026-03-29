"use client";

import { apiRequest } from "@/lib/api-client";
import type {
  BackendOrder,
  BackendOrderStatus,
  BackendProduct,
  BackendRepairJob,
  BackendRepairJobStatus
} from "@/types/backend";

export type ProductFilters = {
  q?: string;
  category?: string;
  brand?: string;
  condition?: string;
  maxPriceNgn?: number;
};

export async function getProducts(filters?: ProductFilters): Promise<BackendProduct[]> {
  const params = new URLSearchParams();
  if (filters?.q) params.set("q", filters.q);
  if (filters?.category) params.set("category", filters.category);
  if (filters?.brand) params.set("brand", filters.brand);
  if (filters?.condition) params.set("condition", filters.condition);
  if (typeof filters?.maxPriceNgn === "number") params.set("maxPriceNgn", String(filters.maxPriceNgn));
  const query = params.toString();
  return apiRequest<BackendProduct[]>(`/products${query ? `?${query}` : ""}`, { method: "GET", auth: false });
}

export async function getProductById(id: string): Promise<BackendProduct> {
  return apiRequest<BackendProduct>(`/products/${encodeURIComponent(id)}`, { method: "GET", auth: false });
}

export type CreateRepairJobInput = {
  deviceType: string;
  brand: string;
  model: string;
  serialNumber?: string;
  condition?: string;
  issues?: string[];
  issueDescription?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  pickupDate?: string;
};

export async function createRepairJob(data: CreateRepairJobInput): Promise<{ id: string; jobNumber: string }> {
  return apiRequest<{ id: string; jobNumber: string }>(`/repair-jobs`, { method: "POST", body: data, auth: true });
}

export async function getRepairJobByNumber(jobNumber: string): Promise<BackendRepairJob> {
  return apiRequest<BackendRepairJob>(`/repair-jobs/by-number/${encodeURIComponent(jobNumber)}`, { method: "GET", auth: false });
}

export type CreateOrderInput = Omit<
  BackendOrder,
  "id" | "orderNumber" | "status" | "createdAtMs" | "updatedAtMs"
> & {
  note?: string;
};

export async function createOrder(data: CreateOrderInput): Promise<{ id: string; orderNumber: string }> {
  return apiRequest<{ id: string; orderNumber: string }>(`/orders`, { method: "POST", body: data, auth: true });
}

export async function getMyOrders(): Promise<BackendOrder[]> {
  return apiRequest<BackendOrder[]>(`/orders/me`, { method: "GET", auth: true });
}

export async function updateRepairStatus(jobId: string, status: BackendRepairJobStatus): Promise<BackendRepairJob> {
  return apiRequest<BackendRepairJob>(`/repair-jobs/${encodeURIComponent(jobId)}/status`, {
    method: "PATCH",
    body: { status },
    auth: true
  });
}

export async function updateOrderStatus(orderId: string, status: BackendOrderStatus): Promise<BackendOrder> {
  return apiRequest<BackendOrder>(`/orders/${encodeURIComponent(orderId)}/status`, { method: "PATCH", body: { status }, auth: true });
}

export async function adminGetOrders(status?: BackendOrderStatus): Promise<BackendOrder[]> {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";
  return apiRequest<BackendOrder[]>(`/admin/orders${query}`, { method: "GET", auth: true });
}

export async function adminGetRepairJobs(status?: BackendRepairJobStatus): Promise<BackendRepairJob[]> {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";
  return apiRequest<BackendRepairJob[]>(`/admin/repair-jobs${query}`, { method: "GET", auth: true });
}

export async function adminGetProducts(): Promise<BackendProduct[]> {
  return apiRequest<BackendProduct[]>(`/admin/products`, { method: "GET", auth: true });
}

export async function adminUpsertProduct(product: BackendProduct): Promise<BackendProduct> {
  return apiRequest<BackendProduct>(`/admin/products/${encodeURIComponent(product.id)}`, { method: "PUT", body: product, auth: true });
}

export async function adminDeleteProduct(id: string): Promise<{ ok: true }> {
  return apiRequest<{ ok: true }>(`/admin/products/${encodeURIComponent(id)}`, { method: "DELETE", auth: true });
}

