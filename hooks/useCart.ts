"use client";

import { useMemo } from "react";
import { useCartContext } from "@/contexts/CartContext";

export type CartSummary = {
  itemCount: number;
};

export function useCart(): CartSummary {
  const { itemCount } = useCartContext();
  return useMemo(() => ({ itemCount }), [itemCount]);
}
