"use client";

import Link from "next/link";
import { useWhatsApp } from "@/contexts/WhatsAppModalContext";

export function Footer() {
  const { open } = useWhatsApp();

  return (
    <footer className="border-t border-[color:var(--border)] bg-white/50 backdrop-blur dark:bg-[#0b1220]/55">
      <div className="container-page py-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="text-2xl font-black tracking-tighter">
              <span className="text-primary-red">CC7</span>{" "}
              <span className="text-primary-blue">Computers</span>
            </div>
            <p className="mt-3 text-sm font-semibold text-dark/70 dark:text-light/70">
              Laptops • Phones • Accessories • Repairs. Fast service in Awka & Onitsha.
            </p>
          </div>

          <div>
            <div className="text-sm font-extrabold text-dark dark:text-light">Links</div>
            <div className="mt-3 grid gap-2 text-sm font-semibold">
              <Link href="/shop" className="text-primary-blue hover:underline">
                Shop
              </Link>
              <Link href="/services" className="text-primary-blue hover:underline">
                Services
              </Link>
              <Link href="/repair/track" className="text-primary-blue hover:underline">
                Track Repair
              </Link>
              <Link href="/contact" className="text-primary-blue hover:underline">
                Contact
              </Link>
            </div>
          </div>

          <div>
            <div className="text-sm font-extrabold text-dark dark:text-light">Contact</div>
            <div className="mt-3 grid gap-2 text-sm font-semibold text-dark/70 dark:text-light/70">
              <div>
                <span className="font-extrabold text-primary-yellow">WhatsApp:</span>{" "}
                <span>{process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "2340000000000"}</span>
              </div>
              <div>
                <span className="font-extrabold text-primary-yellow">Email:</span>{" "}
                <span>support@cc7computers.com</span>
              </div>
              <div>
                <span className="font-extrabold text-primary-yellow">Location:</span>{" "}
                <span>Nigeria</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => open("speak_sales")}
              className="mt-4 inline-flex items-center justify-center rounded-xl bg-primary-yellow px-4 py-3 text-sm font-extrabold text-dark hover:brightness-95"
            >
              Chat with CC7
            </button>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-dark/10 pt-6 text-xs font-semibold text-dark/60 dark:border-light/10 dark:text-light/60 sm:flex-row sm:items-center sm:justify-between">
          <div>© {new Date().getFullYear()} CC7 Computers. All rights reserved.</div>
          <div className="flex items-center gap-3">
            <a href="#" className="text-primary-yellow hover:underline">
              Instagram
            </a>
            <a href="#" className="text-primary-yellow hover:underline">
              Facebook
            </a>
            <a href="#" className="text-primary-yellow hover:underline">
              TikTok
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
