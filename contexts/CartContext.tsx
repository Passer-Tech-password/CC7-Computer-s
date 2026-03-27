"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Product } from "@/types/product";

export type CartItem = {
  productId: string;
  name: string;
  brand: string;
  model: string;
  priceNgn: number;
  imageUrl: string;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotalNgn: number;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
};

// Local-first cart persistence (later can be upgraded to Firestore per user).
const STORAGE_KEY = "cc7_cart_v1";

const CartContext = createContext<CartContextValue | null>(null);

// Defensive parsing so corrupted localStorage never breaks the UI.
function safeParseCart(value: string | null): CartItem[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item) => {
        if (!item || typeof item !== "object") return null;
        const obj = item as Record<string, unknown>;
        const productId = typeof obj.productId === "string" ? obj.productId : "";
        const name = typeof obj.name === "string" ? obj.name : "";
        const brand = typeof obj.brand === "string" ? obj.brand : "";
        const model = typeof obj.model === "string" ? obj.model : "";
        const imageUrl = typeof obj.imageUrl === "string" ? obj.imageUrl : "";
        const priceNgn = typeof obj.priceNgn === "number" ? obj.priceNgn : 0;
        const quantity = typeof obj.quantity === "number" ? obj.quantity : 0;
        if (!productId || !name || !imageUrl || priceNgn <= 0 || quantity <= 0) return null;
        return { productId, name, brand, model, imageUrl, priceNgn, quantity } satisfies CartItem;
      })
      .filter((v): v is CartItem => Boolean(v));
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Hydrate from localStorage on first mount.
  useEffect(() => {
    setItems(safeParseCart(window.localStorage.getItem(STORAGE_KEY)));
  }, []);

  // Persist on every change.
  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((product: Product, quantity = 1) => {
    const safeQty = Number.isFinite(quantity) ? Math.max(1, Math.floor(quantity)) : 1;
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      if (!existing) {
        return [
          ...prev,
          {
            productId: product.id,
            name: product.name,
            brand: product.brand,
            model: product.model,
            priceNgn: product.priceNgn,
            imageUrl: product.imageUrl,
            quantity: safeQty
          }
        ];
      }
      return prev.map((i) =>
        i.productId === product.id ? { ...i, quantity: Math.min(i.quantity + safeQty, 99) } : i
      );
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const setQuantity = useCallback((productId: string, quantity: number) => {
    const safeQty = Number.isFinite(quantity) ? Math.floor(quantity) : 1;
    setItems((prev) =>
      prev
        .map((i) => (i.productId === productId ? { ...i, quantity: safeQty } : i))
        .filter((i) => i.quantity > 0)
        .map((i) => ({ ...i, quantity: Math.min(i.quantity, 99) }))
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const itemCount = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);

  const subtotalNgn = useMemo(() => items.reduce((sum, i) => sum + i.priceNgn * i.quantity, 0), [items]);

  const value = useMemo<CartContextValue>(
    () => ({ items, itemCount, subtotalNgn, addItem, removeItem, setQuantity, clearCart }),
    [items, itemCount, subtotalNgn, addItem, removeItem, setQuantity, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCartContext(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCartContext must be used inside <CartProvider />");
  }
  return ctx;
}
