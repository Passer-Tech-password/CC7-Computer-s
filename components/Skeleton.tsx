"use client";

export function Skeleton({ className }: { className?: string }) {
  return <div className={["animate-pulse rounded-xl bg-dark/10 dark:bg-light/10", className ?? ""].join(" ")} />;
}

