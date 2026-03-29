/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartContext } from "@/contexts/CartContext";
import { formatNgn, getStockStatus } from "@/lib/products";
import { Product } from "@/types/product";
import { ProductCard } from "@/components/ProductCard";
import { isApiEnabled } from "@/lib/api-client";
import { getProductById as apiGetProductById, getProducts as apiGetProducts } from "@/lib/api";
import { fetchProductByIdFromFirestore } from "@/lib/firebase-data";
import { toast } from "sonner";

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
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

function ConditionBadge({ condition }: { condition: Product["condition"] }) {
  const label = condition === "new" ? "New" : condition === "fairly_used" ? "Fairly Used" : "Refurbished";
  return (
    <span className="inline-flex items-center rounded-full bg-primary-yellow/25 px-3 py-1 text-sm font-extrabold text-yellow-800 dark:text-primary-yellow">
      {label}
    </span>
  );
}

export function ProductDetailClient({ product, related }: { product: Product; related: Product[] }) {
  const router = useRouter();
  const { addItem } = useCartContext();
  const [currentProduct, setCurrentProduct] = useState<Product>(product);
  const [currentRelated, setCurrentRelated] = useState<Product[]>(related);
  const [wishlisted, setWishlisted] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(product.images?.[0] ?? product.imageUrl);

  useEffect(() => {
    setCurrentProduct(product);
    setCurrentRelated(related);
    setActiveImage(product.images?.[0] ?? product.imageUrl);
  }, [product, related]);

  useEffect(() => {
    (async () => {
      try {
        if (isApiEnabled()) {
          const latest = await apiGetProductById(currentProduct.id);
          setCurrentProduct(latest as unknown as Product);
          const rel = await apiGetProducts({ category: latest.category });
          setCurrentRelated(
            rel
              .filter((p) => p.id !== latest.id)
              .slice(0, 4) as unknown as Product[]
          );
          return;
        }
      } catch (e) {
        console.error(e);
        toast.error("API unavailable", { description: "Showing Firebase/demo product details for now." });
      }

      try {
        const fb = await fetchProductByIdFromFirestore(currentProduct.id);
        if (fb) setCurrentProduct(fb);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [currentProduct.id]);

  const status = getStockStatus(currentProduct.stockCount);
  const canBuy = status !== "out_of_stock";

  const price = useMemo(() => {
    return {
      current: formatNgn(currentProduct.priceNgn),
      old: currentProduct.oldPriceNgn ? formatNgn(currentProduct.oldPriceNgn) : null
    };
  }, [currentProduct.priceNgn, currentProduct.oldPriceNgn]);

  const specsEntries = useMemo(() => Object.entries(currentProduct.specs ?? {}), [currentProduct.specs]);

  function clampQty(value: number) {
    if (!Number.isFinite(value)) return 1;
    return Math.max(1, Math.min(99, Math.floor(value)));
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-sm font-bold text-dark/70 dark:text-light/70">
          <Link href="/shop" className="text-primary-blue hover:underline">
            Shop
          </Link>
          <span>/</span>
          <span className="truncate">{currentProduct.brand}</span>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <div className="group overflow-hidden rounded-2xl border border-dark/10 bg-white shadow-sm dark:border-light/10 dark:bg-dark">
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-dark/5 dark:bg-light/5">
              <img
                src={activeImage}
                alt={currentProduct.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute left-4 top-4 flex items-center gap-2">
                <span className="rounded-full bg-primary-blue/15 px-3 py-1 text-xs font-extrabold text-primary-blue">
                  {currentProduct.brand}
                </span>
                <ConditionBadge condition={currentProduct.condition} />
              </div>
              <button
                type="button"
                onClick={() => setWishlisted((v) => !v)}
                className="absolute right-4 top-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/85 text-primary-yellow shadow-sm backdrop-blur transition hover:bg-white dark:bg-dark/70"
                aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                <HeartIcon filled={wishlisted} />
              </button>
            </div>
          </div>

          {currentProduct.images && currentProduct.images.length > 1 ? (
            <div className="grid grid-cols-4 gap-3">
              {currentProduct.images.slice(0, 4).map((src) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setActiveImage(src)}
                  className={[
                    "overflow-hidden rounded-xl border transition",
                    src === activeImage
                      ? "border-primary-blue shadow-sm"
                      : "border-dark/10 hover:border-primary-blue/60 dark:border-light/10"
                  ].join(" ")}
                  aria-label="Select image"
                >
                  <img src={src} alt="" className="aspect-[4/3] w-full object-cover" />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-6">
          <div className="card">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h1 className="text-3xl font-black text-dark dark:text-light">{currentProduct.name}</h1>
                <p className="mt-2 text-sm font-semibold text-dark/70 dark:text-light/70">
                  <span className="font-extrabold text-primary-blue">{currentProduct.brand}</span> • {currentProduct.model}
                </p>
              </div>

              <div className="hidden sm:flex flex-col items-end gap-2">
                <span className="rounded-full bg-primary-yellow/25 px-3 py-1 text-xs font-extrabold text-yellow-800 dark:text-primary-yellow">
                  {status === "in_stock" ? "In Stock" : status === "low_stock" ? "Low Stock" : "Out of Stock"}
                </span>
              </div>
            </div>

            <div className="mt-5 flex items-end gap-3">
              <div className="text-4xl font-black text-primary-red">{price.current}</div>
              {price.old ? (
                <div className="pb-1 text-base font-bold text-dark/45 line-through dark:text-light/45">
                  {price.old}
                </div>
              ) : null}
            </div>

            <div className="mt-6 flex flex-col gap-4">
              <div className="flex items-center justify-between rounded-xl border border-dark/10 bg-white p-3 dark:border-light/10 dark:bg-[#0b1220]">
                <div className="text-sm font-extrabold text-dark dark:text-light">Quantity</div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setQuantity((v) => clampQty(v - 1))}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-dark/5 text-dark transition hover:bg-dark/10 dark:bg-light/5 dark:text-light dark:hover:bg-light/10"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={quantity}
                    onChange={(e) => setQuantity(clampQty(Number(e.target.value)))}
                    className="h-10 w-16 rounded-xl border border-dark/15 bg-white text-center text-sm font-extrabold text-dark outline-none focus:ring-2 focus:ring-primary-blue dark:border-light/15 dark:bg-[#0b1220] dark:text-light"
                    min={1}
                    max={99}
                  />
                  <button
                    type="button"
                    onClick={() => setQuantity((v) => clampQty(v + 1))}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-dark/5 text-dark transition hover:bg-dark/10 dark:bg-light/5 dark:text-light dark:hover:bg-light/10"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  disabled={!canBuy}
                  onClick={() => addItem(currentProduct, quantity)}
                  className={[
                    "btn inline-flex w-full rounded-2xl py-4 text-base font-black",
                    canBuy
                      ? "bg-primary-red text-white hover:brightness-110"
                      : "cursor-not-allowed bg-dark/10 text-dark/40 dark:bg-light/10 dark:text-light/40"
                  ].join(" ")}
                >
                  Add to Cart
                </button>

                <button
                  type="button"
                  disabled={!canBuy}
                  onClick={() => {
                    addItem(currentProduct, quantity);
                    router.push("/cart");
                  }}
                  className={[
                    "btn inline-flex w-full rounded-2xl py-4 text-base font-black",
                    canBuy
                      ? "bg-primary-blue text-white hover:brightness-110"
                      : "cursor-not-allowed bg-dark/10 text-dark/40 dark:bg-light/10 dark:text-light/40"
                  ].join(" ")}
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-extrabold text-dark dark:text-light">Description</h2>
            <p className="mt-3 text-sm font-semibold leading-relaxed text-dark/75 dark:text-light/75">
              {currentProduct.description ??
                "Premium quality product from CC7 Computers. We test and verify all devices for performance and reliability."}
            </p>
          </div>

          <div className="card">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-extrabold text-dark dark:text-light">Specifications</h2>
              <span className="text-xs font-bold text-dark/50 dark:text-light/50">Demo data</span>
            </div>

            {specsEntries.length > 0 ? (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {specsEntries.map(([key, value]) => (
                  <div
                    key={key}
                    className="rounded-xl border border-dark/10 bg-white p-3 dark:border-light/10 dark:bg-[#0b1220]"
                  >
                    <div className="text-xs font-extrabold text-primary-blue">{key}</div>
                    <div className="mt-1 text-sm font-bold text-dark dark:text-light">{value}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm font-semibold text-dark/70 dark:text-light/70">
                Specifications will be available soon.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-end justify-between gap-3">
          <h2 className="text-2xl font-black text-dark dark:text-light">You may also like</h2>
          <Link href="/shop" className="text-sm font-bold text-primary-blue hover:underline">
            Browse all →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
          {currentRelated.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
