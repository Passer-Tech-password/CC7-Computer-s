"use client";

import { WhatsAppIcon } from "@/components/icons";

const DEFAULT_WHATSAPP_NUMBER = "2340000000000";

function normalizeWhatsappNumber(raw: string) {
  return raw.replace(/[^\d]/g, "");
}

export function WhatsAppFab() {
  const number = normalizeWhatsappNumber(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? DEFAULT_WHATSAPP_NUMBER);
  const message = encodeURIComponent("Hi CC7 Computers! I need help with a laptop/phone repair or a computer purchase.");
  const href = `https://wa.me/${number}?text=${message}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={[
        "fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-xl transition-transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-primary-yellow focus:ring-offset-2",
        "bg-[#25D366] text-white ring-2 ring-primary-yellow ring-offset-2 ring-offset-light dark:ring-offset-dark"
      ].join(" ")}
      aria-label="Chat with us on WhatsApp"
    >
      <WhatsAppIcon className="h-8 w-8" />
    </a>
  );
}

