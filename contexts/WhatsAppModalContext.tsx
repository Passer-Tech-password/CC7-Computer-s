"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { WhatsAppIcon } from "@/components/icons";

type WhatsAppTemplateKey = "track_repair" | "check_order" | "speak_sales";

type WhatsAppTemplate = {
  key: WhatsAppTemplateKey;
  label: string;
  message: string;
};

const DEFAULT_NUMBER = "2340000000000";

const TEMPLATES: WhatsAppTemplate[] = [
  {
    key: "track_repair",
    label: "Track my repair",
    message: "Hi CC7, I want to track my repair job. My job number is: "
  },
  {
    key: "check_order",
    label: "Check order status",
    message: "Hi CC7, please help me check my order status. My order number is: "
  },
  { key: "speak_sales", label: "Speak to sales", message: "Hi CC7, I want to buy a laptop/phone. Please assist me." }
];

function normalizeWhatsappNumber(raw: string) {
  return raw.replace(/[^\d]/g, "");
}

type WhatsAppContextValue = {
  open: (template?: WhatsAppTemplateKey) => void;
};

const WhatsAppContext = createContext<WhatsAppContextValue | null>(null);

export function WhatsAppProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState(TEMPLATES[2].message);

  const number = useMemo(
    () => normalizeWhatsappNumber(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? DEFAULT_NUMBER),
    []
  );

  const waLink = useMemo(() => `https://wa.me/${number}?text=${encodeURIComponent(message)}`, [number, message]);

  const openModal = useCallback((template?: WhatsAppTemplateKey) => {
    if (template) {
      const found = TEMPLATES.find((t) => t.key === template);
      if (found) setMessage(found.message);
    }
    setOpen(true);
  }, []);

  const value = useMemo<WhatsAppContextValue>(() => ({ open: openModal }), [openModal]);

  return (
    <WhatsAppContext.Provider value={value}>
      {children}

      <button
        type="button"
        onClick={() => openModal()}
        className={[
          "fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-xl transition-transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-primary-yellow focus:ring-offset-2",
          "bg-[#25D366] text-white ring-2 ring-primary-yellow ring-offset-2 ring-offset-light dark:ring-offset-dark"
        ].join(" ")}
        aria-label="Chat with CC7 on WhatsApp"
      >
        <WhatsAppIcon className="h-8 w-8" />
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 bg-black/60 p-4" role="dialog" aria-modal="true">
          <div className="mx-auto w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-[#0b1220]">
            <div className="flex items-center justify-between border-b border-dark/10 p-4 dark:border-light/10">
              <div className="min-w-0">
                <div className="text-xs font-extrabold text-primary-blue">WhatsApp</div>
                <div className="truncate text-lg font-black text-dark dark:text-light">Chat with CC7</div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="btn-ghost h-10 w-10 rounded-full p-0"
                aria-label="Close WhatsApp modal"
              >
                ×
              </button>
            </div>

            <div className="p-5">
              <div className="text-sm font-extrabold text-dark dark:text-light">Quick templates</div>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                {TEMPLATES.map((t) => (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => setMessage(t.message)}
                    className="rounded-xl border border-dark/10 bg-white px-3 py-3 text-xs font-extrabold text-dark hover:border-primary-blue/50 hover:bg-primary-blue/5 dark:border-light/10 dark:bg-[#0b1220] dark:text-light"
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="mt-5">
                <label className="block text-sm font-extrabold text-dark dark:text-light mb-1">Message</label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full rounded-xl border border-dark/15 bg-white px-4 py-3 text-sm font-semibold text-dark outline-none focus:ring-2 focus:ring-primary-blue dark:border-light/15 dark:bg-[#0b1220] dark:text-light"
                />
              </div>

              <div className="mt-4 rounded-xl border border-primary-yellow/40 bg-primary-yellow/15 p-4">
                <div className="text-xs font-extrabold text-dark/70 dark:text-light/70">Link preview</div>
                <div className="mt-1 break-all text-xs font-semibold text-primary-blue">{waLink}</div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-dark/10 p-4 dark:border-light/10">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="btn inline-flex rounded-xl bg-primary-yellow px-5 py-3 font-extrabold text-dark hover:brightness-95"
              >
                Close
              </button>
              <a
                href={waLink}
                target="_blank"
                rel="noreferrer"
                onClick={() => setOpen(false)}
                className="btn inline-flex rounded-xl bg-primary-blue px-6 py-3 font-extrabold text-white hover:brightness-110"
              >
                Open WhatsApp
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </WhatsAppContext.Provider>
  );
}

export function useWhatsApp() {
  const ctx = useContext(WhatsAppContext);
  if (!ctx) throw new Error("useWhatsApp must be used inside <WhatsAppProvider />");
  return ctx;
}

