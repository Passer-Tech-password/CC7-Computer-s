"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { Skeleton } from "@/components/Skeleton";
import { PRODUCT_CATEGORIES, PRODUCT_CONDITIONS, PRODUCTS, formatNgn } from "@/lib/products";
import type { Product, ProductCategory, ProductCondition } from "@/types/product";
import { toast } from "sonner";
import { isApiEnabled } from "@/lib/api-client";
import { getProducts as apiGetProducts } from "@/lib/api";
import { fetchProductsFromFirestore } from "@/lib/firebase-data";

type Filters = {
  search: string;
  category: ProductCategory | "all";
  brand: string | "all";
  condition: ProductCondition | "all";
  maxPriceNgn: number | null;
};

function normalizeText(value: string) {
  return value.trim().toLowerCase();
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [productsLoading, setProductsLoading] = useState(true);
  const priceCeiling = useMemo(() => Math.max(...products.map((p) => p.priceNgn), 0), [products]);
  const [visibleCount, setVisibleCount] = useState(8);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    search: "",
    category: "all",
    brand: "all",
    condition: "all",
    maxPriceNgn: null
  });

  useEffect(() => {
    const timer = window.setTimeout(() => setShowSkeleton(false), 350);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    (async () => {
      setProductsLoading(true);
      try {
        if (isApiEnabled()) {
          const apiProducts = await apiGetProducts();
          if (Array.isArray(apiProducts) && apiProducts.length > 0) {
            setProducts(apiProducts as unknown as Product[]);
            setProductsLoading(false);
            return;
          }
        }
      } catch (e) {
        console.error(e);
        toast.error("API unavailable", { description: "Showing Firebase/demo products for now." });
      }

      try {
        const fbProducts = await fetchProductsFromFirestore();
        if (fbProducts.length > 0) setProducts(fbProducts);
      } catch (e) {
        console.error(e);
      } finally {
        setProductsLoading(false);
      }
    })();
  }, []);

  const filteredProducts = useMemo(() => {
    const query = normalizeText(filters.search);
    return products
      .filter((p) => {
      if (filters.category !== "all" && p.category !== filters.category) return false;
      if (filters.brand !== "all" && p.brand !== filters.brand) return false;
      if (filters.condition !== "all" && p.condition !== filters.condition) return false;
      if (typeof filters.maxPriceNgn === "number" && p.priceNgn > filters.maxPriceNgn) return false;
      if (!query) return true;
      const haystack = `${p.name} ${p.brand} ${p.model}`.toLowerCase();
      return haystack.includes(query);
      })
      .sort((a, b) => b.createdAtMs - a.createdAtMs);
  }, [filters, products]);

  const visibleProducts = useMemo(
    () => filteredProducts.slice(0, visibleCount),
    [filteredProducts, visibleCount]
  );

  const resultsLabel = useMemo(() => {
    const count = filteredProducts.length;
    return count === 1 ? "1 product" : `${count} products`;
  }, [filteredProducts.length]);

  function updateFilters(patch: Partial<Filters>) {
    setVisibleCount(8);
    setFilters((prev) => ({ ...prev, ...patch }));
  }

  function resetFilters() {
    setVisibleCount(8);
    setFilters({ search: "", category: "all", brand: "all", condition: "all", maxPriceNgn: null });
  }

  const FilterPanel = ({ variant }: { variant: "sidebar" | "sheet" }) => (
    <div className={variant === "sidebar" ? "card sticky top-20" : "card"}>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-extrabold text-dark dark:text-light">Filters</h2>
        <button
          type="button"
          onClick={resetFilters}
          className="text-sm font-bold text-primary-blue hover:underline"
        >
          Reset
        </button>
      </div>

      <div className="mt-4 flex flex-col gap-4">
        <div>
          <label className="block text-sm font-extrabold text-dark dark:text-light mb-1">Category</label>
          <select
            value={filters.category}
            onChange={(e) => updateFilters({ category: e.target.value as Filters["category"] })}
            className="w-full rounded-xl border border-dark/15 bg-white px-3 py-2 text-sm font-semibold text-dark outline-none focus:ring-2 focus:ring-primary-blue dark:border-light/15 dark:bg-[#0b1220] dark:text-light"
          >
            <option value="all">All</option>
            {PRODUCT_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-extrabold text-dark dark:text-light mb-1">Brand</label>
          <select
            value={filters.brand}
            onChange={(e) => updateFilters({ brand: e.target.value })}
            className="w-full rounded-xl border border-dark/15 bg-white px-3 py-2 text-sm font-semibold text-dark outline-none focus:ring-2 focus:ring-primary-blue dark:border-light/15 dark:bg-[#0b1220] dark:text-light"
          >
            <option value="all">All</option>
            {Array.from(new Set(products.map((p) => p.brand)))
              .sort((a, b) => a.localeCompare(b))
              .map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-extrabold text-dark dark:text-light mb-1">Condition</label>
          <select
            value={filters.condition}
            onChange={(e) => updateFilters({ condition: e.target.value as Filters["condition"] })}
            className="w-full rounded-xl border border-dark/15 bg-white px-3 py-2 text-sm font-semibold text-dark outline-none focus:ring-2 focus:ring-primary-blue dark:border-light/15 dark:bg-[#0b1220] dark:text-light"
          >
            <option value="all">All</option>
            {PRODUCT_CONDITIONS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="flex items-center justify-between gap-3">
            <label className="block text-sm font-extrabold text-dark dark:text-light">Max Price</label>
            <div className="text-sm font-black text-primary-red">
              {formatNgn(filters.maxPriceNgn ?? priceCeiling)}
            </div>
          </div>
          <input
            type="range"
            min={0}
            max={priceCeiling}
            value={filters.maxPriceNgn ?? priceCeiling}
            onChange={(e) => updateFilters({ maxPriceNgn: Number(e.target.value) })}
            className="mt-2 w-full accent-primary-red"
          />
          <div className="mt-1 flex items-center justify-between text-xs font-bold text-dark/60 dark:text-light/60">
            <span>{formatNgn(0)}</span>
            <span>{formatNgn(priceCeiling)}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container-page py-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-primary-yellow/25 px-3 py-1 text-sm font-extrabold text-yellow-800 dark:text-primary-yellow">
                CC7 Shop
              </div>
              <h1 className="mt-2 text-3xl font-black text-dark dark:text-light">Find your next upgrade</h1>
              <p className="mt-1 text-sm font-semibold text-dark/70 dark:text-light/70">
                {resultsLabel} • Fast delivery in Awka & Onitsha
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link href="/cart" className="btn inline-flex rounded-xl bg-primary-red px-4 py-2.5 font-extrabold text-white hover:brightness-110">
                View Cart
              </Link>
              <Link href="/contact" className="btn inline-flex rounded-xl bg-primary-blue px-4 py-2.5 font-extrabold text-white hover:brightness-110">
                Ask for a product
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-2xl border border-dark/10 bg-white p-4 shadow-sm dark:border-light/10 dark:bg-dark sm:flex-row sm:items-center">
            <div className="flex-1">
              <label className="sr-only" htmlFor="shop-search">
                Search products
              </label>
              <input
                id="shop-search"
                value={filters.search}
                onChange={(e) => updateFilters({ search: e.target.value })}
                placeholder="Search laptops, phones, brands, models…"
                className="w-full rounded-xl border border-dark/15 bg-white px-4 py-3 text-sm font-semibold text-dark outline-none focus:ring-2 focus:ring-primary-blue dark:border-light/15 dark:bg-[#0b1220] dark:text-light"
              />
            </div>

            <div className="flex items-center gap-2 lg:hidden">
              <button
                type="button"
                onClick={() => setFiltersOpen(true)}
                className="btn inline-flex w-full rounded-xl bg-primary-blue px-4 py-3 font-extrabold text-white hover:brightness-110"
              >
                Filters
              </button>
              <button
                type="button"
                onClick={resetFilters}
                className="btn inline-flex w-full rounded-xl bg-primary-yellow px-4 py-3 font-extrabold text-dark hover:brightness-95"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="hidden lg:block">
            <FilterPanel variant="sidebar" />
          </aside>

          <section className="flex flex-col gap-6">
            {showSkeleton || productsLoading ? (
              <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, idx) => (
                  <div
                    key={`sk-${idx}`}
                    className="overflow-hidden rounded-2xl border border-dark/10 bg-white shadow-sm dark:border-light/10 dark:bg-dark"
                  >
                    <Skeleton className="aspect-[4/3] w-full rounded-none" />
                    <div className="p-5">
                      <Skeleton className="h-4 w-3/4" />
                      <div className="mt-2">
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                      <div className="mt-4 flex items-end justify-between gap-3">
                        <Skeleton className="h-6 w-24" />
                        <Skeleton className="h-10 w-24" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : visibleProducts.length > 0 ? (
              <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
                {visibleProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="card">
                <h2 className="text-xl font-extrabold text-dark dark:text-light">No products found</h2>
                <p className="mt-2 text-sm font-semibold text-dark/70 dark:text-light/70">
                  Try changing your filters or searching for a different keyword.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-4 btn inline-flex rounded-xl bg-primary-red px-5 py-3 font-extrabold text-white hover:brightness-110"
                >
                  Reset filters
                </button>
              </div>
            )}

            {visibleCount < filteredProducts.length ? (
              <div className="flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => setVisibleCount((v) => v + 8)}
                  className="btn inline-flex rounded-xl bg-primary-blue px-6 py-3 font-extrabold text-white hover:brightness-110"
                >
                  Load More
                </button>
              </div>
            ) : null}
          </section>
        </div>
      </div>

      {filtersOpen ? (
        <div className="fixed inset-0 z-50 bg-black/60 p-4 lg:hidden" role="dialog" aria-modal="true">
          <div className="mx-auto w-full max-w-lg">
            <div className="card">
              <div className="flex items-center justify-between gap-3">
                <div className="text-lg font-extrabold text-dark dark:text-light">Filters</div>
                <button
                  type="button"
                  onClick={() => setFiltersOpen(false)}
                  className="btn-ghost h-10 w-10 rounded-full p-0"
                  aria-label="Close filters"
                >
                  ×
                </button>
              </div>
              <div className="mt-4">
                <FilterPanel variant="sheet" />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="btn inline-flex rounded-xl bg-primary-yellow px-4 py-3 font-extrabold text-dark hover:brightness-95"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => setFiltersOpen(false)}
                  className="btn inline-flex rounded-xl bg-primary-red px-4 py-3 font-extrabold text-white hover:brightness-110"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
