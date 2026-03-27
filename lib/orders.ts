import { Order, OrderItem } from "@/types/order";
import { getFirebaseClientAsync } from "@/lib/firebase";

export function generateOrderNumber() {
  const now = new Date();
  const year = now.getFullYear();
  const dayOfYear = Math.floor(
    (Date.UTC(year, now.getMonth(), now.getDate()) - Date.UTC(year, 0, 0)) / 86400000
  );
  const serial = String(Math.floor(Math.random() * 10000)).padStart(4, "0");
  return `CC7-ORD-${year}-${String(dayOfYear).padStart(3, "0")}-${serial}`;
}

export function calcSubtotal(items: OrderItem[]): number {
  return items.reduce((sum, i) => sum + i.priceNgn * i.quantity, 0);
}

export function calcDeliveryFee(subtotalNgn: number, pickup: boolean): number {
  if (pickup) return 0;
  return subtotalNgn >= 500000 ? 0 : 3500;
}

export async function saveOrder(order: Omit<Order, "id">): Promise<string> {
  const { db } = await getFirebaseClientAsync();
  const { addDoc, collection, serverTimestamp } = await import("firebase/firestore");
  const ref = await addDoc(collection(db, "orders"), {
    ...order,
    createdAt: serverTimestamp()
  });
  return ref.id;
}

