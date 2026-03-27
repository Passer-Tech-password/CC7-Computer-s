/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useCartContext } from "@/contexts/CartContext";
import { formatNgn } from "@/lib/products";

export default function CartPage() {
  const { items, itemCount, subtotalNgn, removeItem, setQuantity, clearCart } = useCartContext();

  const isEmpty = items.length === 0;
  const subtotalLabel = useMemo(() => formatNgn(subtotalNgn), [subtotalNgn]);

  return (
    <div className="container-page py-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-black text-dark dark:text-light">Your Cart</h1>
            <p className="mt-1 text-sm font-semibold text-dark/70 dark:text-light/70">
              {itemCount === 1 ? "1 item" : `${itemCount} items`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/shop" className="btn inline-flex rounded-xl bg-primary-blue px-4 py-2.5 font-extrabold text-white hover:brightness-110">
              Continue shopping
            </Link>
            <button
              type="button"
              onClick={clearCart}
              disabled={isEmpty}
              className={[
                "btn inline-flex rounded-xl px-4 py-2.5 font-extrabold",
                isEmpty
                  ? "cursor-not-allowed bg-dark/10 text-dark/40 dark:bg-light/10 dark:text-light/40"
                  : "bg-primary-yellow text-dark hover:brightness-95"
              ].join(" ")}
            >
              Clear
            </button>
          </div>
        </div>

        {isEmpty ? (
          <div className="card">
            <h2 className="text-xl font-extrabold text-dark dark:text-light">Cart is empty</h2>
            <p className="mt-2 text-sm font-semibold text-dark/70 dark:text-light/70">
              Add products from the shop to see them here.
            </p>
            <Link
              href="/shop"
              className="mt-4 btn inline-flex rounded-xl bg-primary-red px-6 py-3 font-extrabold text-white hover:brightness-110"
            >
              Go to Shop
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
            <div className="card p-0 overflow-hidden">
              <div className="divide-y divide-dark/10 dark:divide-light/10">
                {items.map((item) => (
                  <div key={item.productId} className="flex gap-4 p-4">
                    <div className="h-20 w-28 overflow-hidden rounded-xl bg-dark/5 dark:bg-light/5">
                      <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <Link href={`/shop/${item.productId}`} className="block">
                            <div className="truncate text-base font-extrabold text-dark hover:text-primary-blue dark:text-light">
                              {item.name}
                            </div>
                          </Link>
                          <div className="mt-1 text-xs font-bold text-dark/60 dark:text-light/60">
                            {item.brand} • {item.model}
                          </div>
                        </div>
                        <div className="text-lg font-black text-primary-red">{formatNgn(item.priceNgn)}</div>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setQuantity(item.productId, item.quantity - 1)}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-dark/5 text-dark transition hover:bg-dark/10 dark:bg-light/5 dark:text-light dark:hover:bg-light/10"
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <input
                            type="number"
                            min={1}
                            max={99}
                            value={item.quantity}
                            onChange={(e) => setQuantity(item.productId, Number(e.target.value))}
                            className="h-10 w-16 rounded-xl border border-dark/15 bg-white text-center text-sm font-extrabold text-dark outline-none focus:ring-2 focus:ring-primary-blue dark:border-light/15 dark:bg-[#0b1220] dark:text-light"
                          />
                          <button
                            type="button"
                            onClick={() => setQuantity(item.productId, item.quantity + 1)}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-dark/5 text-dark transition hover:bg-dark/10 dark:bg-light/5 dark:text-light dark:hover:bg-light/10"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItem(item.productId)}
                          className="text-sm font-extrabold text-primary-red hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h2 className="text-xl font-extrabold text-dark dark:text-light">Order Summary</h2>
              <div className="mt-4 flex items-center justify-between text-sm font-bold text-dark/70 dark:text-light/70">
                <span>Subtotal</span>
                <span className="text-base font-black text-primary-red">{subtotalLabel}</span>
              </div>
              <div className="mt-2 text-xs font-semibold text-dark/60 dark:text-light/60">
                Delivery and taxes are calculated at checkout.
              </div>

              <button
                type="button"
                className="mt-6 btn inline-flex w-full rounded-2xl bg-primary-red py-4 text-base font-black text-white hover:brightness-110"
              >
                Checkout
              </button>

              <Link
                href="/contact"
                className="mt-3 btn inline-flex w-full rounded-2xl bg-primary-blue py-4 text-base font-black text-white hover:brightness-110"
              >
                Need help?
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
