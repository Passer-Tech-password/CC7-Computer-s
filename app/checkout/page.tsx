"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartContext } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { RepairStepper } from "@/components/RepairStepper";
import { formatNgn } from "@/lib/products";
import { calcDeliveryFee, calcSubtotal, generateOrderNumber, saveOrder } from "@/lib/orders";
import { toast } from "sonner";
import { isApiEnabled } from "@/lib/api-client";
import { createOrder as apiCreateOrder } from "@/lib/api";

const STEPS = [
  { key: "review", label: "Review Cart" },
  { key: "details", label: "Pickup Details" },
  { key: "payment", label: "Payment" }
];

function clampStep(step: number) {
  return Math.max(0, Math.min(STEPS.length - 1, step));
}

export default function CheckoutPage() {
  const router = useRouter();
  const { user, userData } = useAuth();
  const { items, setItemsDirect } = useCartContext();
  const [step, setStep] = useState(0);
  const [pickup, setPickup] = useState(true);
  const [name, setName] = useState(userData?.displayName || user?.email || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const subtotal = useMemo(() => calcSubtotal(items), [items]);
  const deliveryFee = useMemo(() => calcDeliveryFee(subtotal, pickup), [subtotal, pickup]);
  const total = useMemo(() => subtotal + deliveryFee, [subtotal, deliveryFee]);

  const canContinue = useMemo(() => {
    if (step === 0) return items.length > 0;
    if (step === 1) return Boolean(name.trim() && email.trim());
    return true;
  }, [step, items.length, name, email]);

  async function payNow() {
    if (items.length === 0) return;
    setLoading(true);
    try {
      if (isApiEnabled()) {
        try {
          const created = await apiCreateOrder({
            userUid: user?.uid || null,
            items: items.map((i) => ({
              productId: i.productId,
              name: i.name,
              brand: i.brand,
              model: i.model,
              imageUrl: i.imageUrl,
              priceNgn: i.priceNgn,
              quantity: i.quantity
            })),
            subtotalNgn: subtotal,
            deliveryFeeNgn: deliveryFee,
            totalNgn: total,
            pickup,
            customerName: name,
            customerEmail: email,
            customerPhone: phone || undefined,
            note: note || undefined
          });
          setItemsDirect([]);
          toast.success("Order confirmed", { description: `Order number: ${created.orderNumber}` });
          router.push(`/success?order=${encodeURIComponent(created.orderNumber)}&id=${encodeURIComponent(created.id)}`);
          return;
        } catch (e) {
          console.error("API create order failed:", e);
          toast.error("API unavailable", {
            description: e instanceof Error ? e.message : "Completing checkout via Firebase for now."
          });
        }
      }

      const orderNumber = generateOrderNumber();
      const orderId = await saveOrder({
        orderNumber,
        userUid: user?.uid || null,
        items: items.map((i) => ({
          productId: i.productId,
          name: i.name,
          brand: i.brand,
          model: i.model,
          imageUrl: i.imageUrl,
          priceNgn: i.priceNgn,
          quantity: i.quantity
        })),
        subtotalNgn: subtotal,
        deliveryFeeNgn: deliveryFee,
        totalNgn: total,
        pickup,
        customerName: name,
        customerEmail: email,
        customerPhone: phone || undefined,
        createdAtMs: Date.now(),
        status: "paid"
      });
      setItemsDirect([]);
      router.push(`/success?order=${encodeURIComponent(orderNumber)}&id=${encodeURIComponent(orderId)}`);
    } catch (err) {
      console.error(err);
      toast.error("Payment failed", { description: "Paystack simulation failed. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-page py-10">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center rounded-full bg-primary-blue/15 px-3 py-1 text-sm font-extrabold text-primary-blue">
              Secure Checkout
            </div>
            <h1 className="mt-3 text-3xl font-black text-dark dark:text-light">Checkout</h1>
            <p className="mt-2 text-sm font-semibold text-dark/70 dark:text-light/70">
              Yellow → Blue → Red stepper guides you to a successful order.
            </p>
          </div>
          <Link href="/cart" className="text-sm font-bold text-primary-blue hover:underline">
            Return to cart →
          </Link>
        </div>

        <div className="card">
          <RepairStepper steps={STEPS} activeIndex={step} variant="booking" />
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <section className="card">
            {step === 0 ? (
              <div className="flex flex-col gap-4">
                <h2 className="text-xl font-extrabold text-dark dark:text-light">Step 1: Cart Review</h2>
                {items.length === 0 ? (
                  <p className="text-sm font-semibold text-dark/70 dark:text-light/70">Your cart is empty.</p>
                ) : (
                  <div className="divide-y divide-dark/10 dark:divide-light/10">
                    {items.map((i) => (
                      <div key={i.productId} className="grid grid-cols-[72px_1fr_auto] items-center gap-3 py-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={i.imageUrl} alt={i.name} className="h-16 w-18 rounded-lg object-cover" />
                        <div className="min-w-0">
                          <div className="truncate text-sm font-extrabold text-dark dark:text-light">{i.name}</div>
                          <div className="mt-0.5 text-xs font-semibold text-dark/60 dark:text-light/60">
                            {i.brand} • {i.model}
                          </div>
                        </div>
                        <div className="text-sm font-black text-primary-red">{formatNgn(i.priceNgn)}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : null}

            {step === 1 ? (
              <div className="flex flex-col gap-4">
                <h2 className="text-xl font-extrabold text-dark dark:text-light">Step 2: Pickup Details</h2>
                <div className="rounded-xl border border-primary-yellow/40 bg-primary-yellow/15 p-4 text-sm font-semibold text-dark">
                  Pickup at CC7 store is the default. We’ll message you when your order is ready.
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-extrabold text-dark dark:text-light mb-1">Pickup or Delivery</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setPickup(true)}
                        className={[
                          "rounded-xl border px-4 py-3 text-sm font-extrabold",
                          pickup
                            ? "border-primary-blue bg-primary-blue/10 text-primary-blue"
                            : "border-dark/10 bg-white text-dark dark:border-light/10 dark:bg-[#0b1220] dark:text-light"
                        ].join(" ")}
                      >
                        Pickup at Store
                      </button>
                      <button
                        type="button"
                        onClick={() => setPickup(false)}
                        className={[
                          "rounded-xl border px-4 py-3 text-sm font-extrabold",
                          !pickup
                            ? "border-primary-blue bg-primary-blue/10 text-primary-blue"
                            : "border-dark/10 bg-white text-dark dark:border-light/10 dark:bg-[#0b1220] dark:text-light"
                        ].join(" ")}
                      >
                        Delivery (₦3,500)
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-extrabold text-dark dark:text-light mb-1">Full Name</label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-xl border border-dark/15 bg-white px-4 py-3 text-sm font-semibold text-dark outline-none focus:ring-2 focus:ring-primary-blue dark:border-light/15 dark:bg-[#0b1220] dark:text-light"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-extrabold text-dark dark:text-light mb-1">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-dark/15 bg-white px-4 py-3 text-sm font-semibold text-dark outline-none focus:ring-2 focus:ring-primary-blue dark:border-light/15 dark:bg-[#0b1220] dark:text-light"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-extrabold text-dark dark:text-light mb-1">Phone (optional)</label>
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+234…"
                      className="w-full rounded-xl border border-dark/15 bg-white px-4 py-3 text-sm font-semibold text-dark outline-none focus:ring-2 focus:ring-primary-blue dark:border-light/15 dark:bg-[#0b1220] dark:text-light"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-extrabold text-dark dark:text-light mb-1">Order Note (optional)</label>
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      rows={4}
                      className="w-full rounded-xl border border-dark/15 bg-white px-4 py-3 text-sm font-semibold text-dark outline-none focus:ring-2 focus:ring-primary-blue dark:border-light/15 dark:bg-[#0b1220] dark:text-light"
                    />
                  </div>
                </div>
              </div>
            ) : null}

            {step === 2 ? (
              <div className="flex flex-col gap-4">
                <h2 className="text-xl font-extrabold text-dark dark:text-light">Step 3: Payment (Simulation)</h2>
                <p className="text-sm font-semibold text-dark/70 dark:text-light/70">
                  This is a simulated Paystack payment step. Clicking Pay Now will create an order and show a success page.
                </p>
                <div className="rounded-xl border border-dark/10 bg-white p-4 dark:border-light/10 dark:bg-[#0b1220]">
                  <div className="text-xs font-extrabold text-primary-blue">Payment Summary</div>
                  <div className="mt-2 flex items-center justify-between text-sm font-bold">
                    <span className="text-dark/70 dark:text-light/70">Subtotal</span>
                    <span className="text-primary-red">{formatNgn(subtotal)}</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-sm font-bold">
                    <span className="text-dark/70 dark:text-light/70">Delivery</span>
                    <span className="text-primary-blue">{deliveryFee === 0 ? "Free" : formatNgn(deliveryFee)}</span>
                  </div>
                  <div className="mt-3 h-px w-full bg-dark/10 dark:bg-light/10" />
                  <div className="mt-3 flex items-center justify-between text-lg font-black">
                    <span className="text-dark dark:text-light">Total</span>
                    <span className="text-primary-red">{formatNgn(total)}</span>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={() => setStep((s) => clampStep(s - 1))}
                disabled={step === 0}
                className={[
                  "btn inline-flex rounded-2xl px-6 py-3 text-base font-black",
                  step === 0
                    ? "cursor-not-allowed bg-dark/10 text-dark/40 dark:bg-light/10 dark:text-light/40"
                    : "bg-primary-yellow text-dark hover:brightness-95"
                ].join(" ")}
              >
                Back
              </button>
              {step < 2 ? (
                <button
                  type="button"
                  onClick={() => canContinue && setStep((s) => clampStep(s + 1))}
                  disabled={!canContinue}
                  className={[
                    "btn inline-flex rounded-2xl px-7 py-3 text-base font-black",
                    canContinue
                      ? "bg-primary-blue text-white hover:brightness-110"
                      : "cursor-not-allowed bg-dark/10 text-dark/40 dark:bg-light/10 dark:text-light/40"
                  ].join(" ")}
                >
                  Continue
                </button>
              ) : (
                <button
                  type="button"
                  onClick={payNow}
                  disabled={loading}
                  className="btn inline-flex rounded-2xl bg-primary-red px-7 py-3 text-base font-black text-white hover:brightness-110"
                >
                  {loading ? "Processing…" : "Pay Now"}
                </button>
              )}
            </div>
          </section>

          <aside className="card">
            <h2 className="text-xl font-extrabold text-dark dark:text-light">Order Summary</h2>
            <div className="mt-4 flex items-center justify-between text-sm font-bold text-dark/70 dark:text-light/70">
              <span>Subtotal</span>
              <span className="text-base font-black text-primary-red">{formatNgn(subtotal)}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm font-bold text-dark/70 dark:text-light/70">
              <span>Delivery</span>
              <span className="text-sm font-black text-primary-blue">
                {deliveryFee === 0 ? "Free" : formatNgn(deliveryFee)}
              </span>
            </div>
            <div className="mt-3 h-px w-full bg-dark/10 dark:bg-light/10" />
            <div className="mt-3 flex items-center justify-between text-lg font-black">
              <span className="text-dark dark:text-light">Total</span>
              <span className="text-primary-red">{formatNgn(total)}</span>
            </div>
            <div className="mt-4 text-xs font-semibold text-dark/60 dark:text-light/60">
              You’ll receive an email confirmation after payment.
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
