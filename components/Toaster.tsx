"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast: "rounded-2xl border border-dark/10 bg-white text-dark shadow-xl dark:border-light/10 dark:bg-dark dark:text-light",
          title: "font-extrabold",
          description: "text-sm font-semibold text-dark/70 dark:text-light/70",
          actionButton: "bg-primary-blue text-white font-extrabold",
          cancelButton: "bg-primary-yellow text-dark font-extrabold"
        }
      }}
    />
  );
}

