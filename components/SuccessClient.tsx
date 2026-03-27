"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export function SuccessClient() {
  const search = useSearchParams();
  const orderNo = search.get("order");
  const orderId = search.get("id");

  return (
    <div className="container-page py-16">
      <div className="mx-auto max-w-2xl">
        <div className="card text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald-500 text-white shadow-glow">
            ✓
          </div>
          <h1 className="mt-4 text-3xl font-black text-dark dark:text-light">Order Confirmed</h1>
          <p className="mt-2 text-sm font-semibold text-dark/75 dark:text-light/75">
            Thank you! Your order {orderNo ? <span className="font-black text-primary-blue">{orderNo}</span> : null} has
            been received. We’ll notify you when it’s ready for pickup.
          </p>
          {orderId ? (
            <p className="mt-1 text-xs font-semibold text-dark/60 dark:text-light/60">Order ID: {orderId}</p>
          ) : null}

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Link
              href="/dashboard"
              className="btn inline-flex w-full rounded-2xl bg-primary-blue px-6 py-4 text-base font-black text-white hover:brightness-110"
            >
              View My Orders
            </Link>
            <Link
              href="/shop"
              className="btn inline-flex w-full rounded-2xl bg-primary-yellow px-6 py-4 text-base font-black text-dark hover:brightness-95"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

