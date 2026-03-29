"use client";

import type { Product } from "@/types/product";
import { getFirebaseClientAsync } from "@/lib/firebase";

function parseString(v: unknown): string | null {
  return typeof v === "string" ? v : null;
}

function parseNumber(v: unknown): number | null {
  return typeof v === "number" && Number.isFinite(v) ? v : null;
}

function parseBoolean(v: unknown): boolean | null {
  return typeof v === "boolean" ? v : null;
}

export function parseProductFromFirestore(docId: string, data: unknown): Product | null {
  if (!data || typeof data !== "object") return null;
  const obj = data as Record<string, unknown>;
  const id = parseString(obj.id) ?? docId;
  const name = parseString(obj.name);
  const brand = parseString(obj.brand);
  const model = parseString(obj.model);
  const category = parseString(obj.category) as Product["category"] | null;
  const condition = parseString(obj.condition) as Product["condition"] | null;
  const priceNgn = parseNumber(obj.priceNgn);
  const oldPriceNgn = parseNumber(obj.oldPriceNgn) ?? undefined;
  const imageUrl = parseString(obj.imageUrl);
  const stockCount = parseNumber(obj.stockCount);
  const inStock = parseBoolean(obj.inStock);
  const createdAtMs = parseNumber(obj.createdAtMs) ?? Date.now();

  if (!name || !brand || !model || !category || !condition || priceNgn === null || !imageUrl || stockCount === null || inStock === null) {
    return null;
  }

  return {
    id,
    name,
    brand,
    model,
    category,
    condition,
    priceNgn,
    oldPriceNgn,
    imageUrl,
    images: Array.isArray(obj.images) ? (obj.images.filter((x) => typeof x === "string") as string[]) : [],
    stockCount,
    inStock,
    description: parseString(obj.description) ?? undefined,
    specs: typeof obj.specs === "object" && obj.specs ? (obj.specs as Record<string, string>) : undefined,
    createdAtMs
  };
}

export async function fetchProductsFromFirestore(): Promise<Product[]> {
  const { db } = await getFirebaseClientAsync();
  const { collection, getDocs, limit, orderBy, query } = await import("firebase/firestore");
  const snap = await getDocs(query(collection(db, "products"), orderBy("createdAtMs", "desc"), limit(500)));
  return snap.docs.map((d) => parseProductFromFirestore(d.id, d.data())).filter((v): v is Product => Boolean(v));
}

export async function fetchProductByIdFromFirestore(id: string): Promise<Product | null> {
  const { db } = await getFirebaseClientAsync();
  const { doc, getDoc, collection, getDocs, limit, query, where } = await import("firebase/firestore");

  const byDocId = await getDoc(doc(db, "products", id));
  if (byDocId.exists()) return parseProductFromFirestore(byDocId.id, byDocId.data());

  const snap = await getDocs(query(collection(db, "products"), where("id", "==", id), limit(1)));
  const d = snap.docs[0];
  if (!d) return null;
  return parseProductFromFirestore(d.id, d.data());
}

