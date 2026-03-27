export type OrderStatus = "pending" | "paid" | "processing" | "completed" | "cancelled";

export type OrderItem = {
  productId: string;
  name: string;
  brand: string;
  model: string;
  imageUrl: string;
  priceNgn: number;
  quantity: number;
};

export type Order = {
  id: string;
  orderNumber: string;
  userUid: string | null;
  items: OrderItem[];
  subtotalNgn: number;
  deliveryFeeNgn: number;
  totalNgn: number;
  pickup: boolean;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  createdAtMs: number;
  status: OrderStatus;
};

