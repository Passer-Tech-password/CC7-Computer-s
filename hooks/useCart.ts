"use client";

import { useMemo } from "react";

export type CartSummary = {
  itemCount: number;
};

export function useCart(): CartSummary {
  return useMemo(
    () => ({
      itemCount: 0
    }),
    []
  );
}

