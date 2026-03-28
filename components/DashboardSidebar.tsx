"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type SidebarItem = {
  href: string;
  label: string;
};

const ITEMS: SidebarItem[] = [
  { href: "/dashboard", label: "Dashboard Overview" },
  { href: "/dashboard/products", label: "Products Management" },
  { href: "/dashboard/orders", label: "Orders Management" },
  { href: "/dashboard/repairs", label: "Repair Jobs Management" },
  { href: "/dashboard/customers", label: "Customers" },
  { href: "/dashboard/reports", label: "Reports" }
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="h-full w-full bg-primary-blue text-white">
      <div className="p-5">
        <div className="text-2xl font-black tracking-tight">
          <span className="text-primary-yellow">CC7</span> Admin
        </div>
        <div className="mt-1 text-xs font-bold text-white/80">Staff Dashboard</div>
      </div>

      <nav className="px-3 pb-5">
        <div className="flex flex-col gap-1">
          {ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "rounded-xl px-4 py-3 text-sm font-extrabold transition",
                  active ? "bg-white/15 text-white" : "text-white/90 hover:bg-white/10"
                ].join(" ")}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}

