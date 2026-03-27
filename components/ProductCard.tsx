/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useCartContext } from "@/contexts/CartContext";
import { formatNgn, getStockStatus } from "@/lib/products";
import { Product } from "@/types/product";

function StockPill({ stockCount }: { stockCount: number }) {
  const status = getStockStatus(stockCount);
  if (status === "in_stock") {
    return (
      <span className="inline-flex items-center rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-extrabold text-emerald-700 dark:text-emerald-300">
        In Stock
      </span>
    );
  }
  if (status === "low_stock") {
    return (
      <span className="inline-flex items-center rounded-full bg-primary-yellow/30 px-2.5 py-1 text-xs font-extrabold text-yellow-800 dark:text-primary-yellow">
        Low Stock
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-primary-red/15 px-2.5 py-1 text-xs font-extrabold text-primary-red">
      Out of Stock
    </span>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        d="M12 20s-7-4.4-9.2-8.6C1.3 8.7 2.8 6 6 6c1.9 0 3.1 1 4 2.1C10.9 7 12.1 6 14 6c3.2 0 4.7 2.7 3.2 5.4C19 15.6 12 20 12 20Z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ProductCard({
  product,
  showQuickView = true
}: {
  product: Product;
  showQuickView?: boolean;
}) {
  const { addItem } = useCartContext();
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  const status = getStockStatus(product.stockCount);
  const canBuy = status !== "out_of_stock";

  const pricing = useMemo(() => {
    const current = formatNgn(product.priceNgn);
    const old = product.oldPriceNgn ? formatNgn(product.oldPriceNgn) : null;
    return { current, old };
  }, [product.priceNgn, product.oldPriceNgn]);

  return (
    <>
      <div className="group relative overflow-hidden rounded-2xl border border-dark/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-light/10 dark:bg-dark">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-dark/5 dark:bg-light/5">
          <Link href={`/shop/${product.id}`} className="block h-full w-full">
            <img
              src={product.imageUrl}
              alt={`${product.brand} ${product.name}`}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </Link>

          <div className="absolute left-3 top-3 flex items-center gap-2">
            <span className="rounded-full bg-primary-blue/15 px-3 py-1 text-xs font-extrabold text-primary-blue">
              {product.brand}
            </span>
            <span className="rounded-full bg-primary-yellow/25 px-3 py-1 text-xs font-extrabold text-yellow-800 dark:text-primary-yellow">
              {product.condition === "new"
                ? "New"
                : product.condition === "fairly_used"
                  ? "Fairly Used"
                  : "Refurbished"}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setWishlisted((v) => !v)}
            className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-primary-yellow shadow-sm backdrop-blur transition hover:bg-white dark:bg-dark/70"
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <HeartIcon filled={wishlisted} />
          </button>
        </div>

        <div className="flex flex-col gap-3 p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <Link href={`/shop/${product.id}`} className="block">
                <h3 className="line-clamp-2 text-lg font-extrabold text-dark transition group-hover:text-primary-blue dark:text-light">
                  {product.name}
                </h3>
              </Link>
              <p className="mt-1 line-clamp-1 text-sm font-semibold text-dark/70 dark:text-light/70">
                {product.model}
              </p>
            </div>
            <StockPill stockCount={product.stockCount} />
          </div>

          <div className="flex items-end gap-2">
            <div className="text-2xl font-black text-primary-red">{pricing.current}</div>
            {pricing.old ? (
              <div className="pb-0.5 text-sm font-bold text-dark/45 line-through dark:text-light/45">
                {pricing.old}
              </div>
            ) : null}
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              disabled={!canBuy}
              onClick={() => addItem(product, 1)}
              className={[
                "btn inline-flex w-full rounded-xl py-2.5 font-extrabold",
                canBuy
                  ? "bg-primary-red text-white hover:brightness-110"
                  : "cursor-not-allowed bg-dark/10 text-dark/40 dark:bg-light/10 dark:text-light/40"
              ].join(" ")}
            >
              Add to Cart
            </button>

            <button
              type="button"
              onClick={() => setQuickViewOpen(true)}
              className={[
                "btn inline-flex w-full rounded-xl py-2.5 font-extrabold",
                "bg-primary-blue text-white hover:brightness-110"
              ].join(" ")}
              disabled={!showQuickView}
            >
              Quick View
            </button>
          </div>
        </div>
      </div>

      {quickViewOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-[#0b1220]">
            <div className="flex items-center justify-between border-b border-dark/10 p-4 dark:border-light/10">
              <div className="min-w-0">
                <div className="text-sm font-bold text-primary-blue">{product.brand}</div>
                <div className="truncate text-lg font-extrabold text-dark dark:text-light">{product.name}</div>
              </div>
              <button
                type="button"
                onClick={() => setQuickViewOpen(false)}
                className="btn-ghost h-10 w-10 rounded-full p-0"
                aria-label="Close quick view"
              >
                ×
              </button>
            </div>

            <div className="grid gap-6 p-5 md:grid-cols-2">
              <div className="overflow-hidden rounded-xl bg-dark/5 dark:bg-light/5">
                <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
              </div>
              <div className="flex flex-col gap-3">
                <StockPill stockCount={product.stockCount} />
                <div className="text-3xl font-black text-primary-red">{pricing.current}</div>
                <p className="text-sm font-semibold text-dark/70 dark:text-light/70">
                  {product.description ?? "Quality product from CC7 Computers. Details available on the product page."}
                </p>
                <div className="mt-auto grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    disabled={!canBuy}
                    onClick={() => {
                      addItem(product, 1);
                      setQuickViewOpen(false);
                    }}
                    className={[
                      "btn inline-flex w-full rounded-xl py-2.5 font-extrabold",
                      canBuy
                        ? "bg-primary-red text-white hover:brightness-110"
                        : "cursor-not-allowed bg-dark/10 text-dark/40 dark:bg-light/10 dark:text-light/40"
                    ].join(" ")}
                  >
                    Add to Cart
                  </button>
                  <Link
                    href={`/shop/${product.id}`}
                    className="btn inline-flex w-full rounded-xl bg-primary-blue py-2.5 font-extrabold text-white hover:brightness-110"
                    onClick={() => setQuickViewOpen(false)}
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
