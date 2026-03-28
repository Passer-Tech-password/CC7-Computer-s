"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState, useRef, useEffect } from "react";
import { useCart } from "@/hooks/useCart";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/contexts/AuthContext";
import { useRole } from "@/hooks/useRole";
import { CartIcon, CloseIcon, MenuIcon, MoonIcon, SunIcon, SearchIcon, UserIcon } from "@/components/icons";

type NavItem = {
  href: string;
  label: string;
};

const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/services", label: "Services" },
  { href: "/repair/track", label: "Track Repair" },
  { href: "/contact", label: "Contact" }
];

function NavLink({ href, label, onClick }: NavItem & { onClick?: () => void }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={[
        "rounded-full px-3 py-2 text-sm font-semibold transition",
        "hover:bg-white/60 hover:dark:bg-white/10",
        isActive ? "bg-white/70 text-dark shadow-sm dark:bg-white/10 dark:text-light" : "text-dark/80 dark:text-light/80"
      ].join(" ")}
    >
      {label}
    </Link>
  );
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { itemCount } = useCart();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { isStaff } = useRole();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const badge = useMemo(() => {
    if (itemCount <= 0) return null;
    return (
      <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-primary-yellow px-1 text-xs font-bold text-dark shadow-sm">
        {itemCount > 99 ? "99+" : itemCount}
      </span>
    );
  }, [itemCount]);

  return (
    <header className="sticky top-0 z-50 border-b border-[color:var(--border)] bg-white/60 backdrop-blur dark:bg-[#0b1220]/55">
      <div className="container-page flex h-16 items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-1">
          <span className="text-2xl font-black tracking-tighter">
            <span className="text-primary-red">CC7</span>
          </span>
          <span className="text-sm font-bold text-primary-blue tracking-widest hidden sm:inline pt-1">
            COMPUTERS
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            className="btn-ghost inline-flex h-10 w-10 items-center justify-center rounded-full"
            aria-label="Search"
          >
            <SearchIcon className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            className="btn-ghost hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-full"
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
          </button>

          <Link href="/cart" className="btn-ghost relative inline-flex h-10 w-10 items-center justify-center rounded-full">
            <CartIcon className="h-5 w-5" />
            {badge}
          </Link>

          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen((v) => !v)}
                className="btn-ghost inline-flex h-10 w-10 items-center justify-center rounded-full border border-dark/10 dark:border-light/10"
                aria-label="User menu"
              >
                <UserIcon className="h-5 w-5" />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-dark ring-1 ring-black ring-opacity-5 divide-y divide-dark/10 dark:divide-light/10 focus:outline-none">
                  <div className="py-1">
                    <Link
                      href={isStaff ? "/dashboard" : "/account"}
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2 text-sm text-dark dark:text-light hover:bg-dark/5 dark:hover:bg-light/5"
                    >
                      {isStaff ? "Staff Dashboard" : "My Account"}
                    </Link>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => {
                        logout();
                        setDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-primary-red hover:bg-dark/5 dark:hover:bg-light/5 font-medium"
                    >
                      Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="hidden md:inline-flex btn-primary text-sm px-4 py-2">
              Log In
            </Link>
          )}

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="btn-ghost inline-flex h-10 w-10 items-center justify-center rounded-full md:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="border-t border-[color:var(--border)] bg-white/60 px-4 py-3 backdrop-blur dark:bg-[#0b1220]/55 md:hidden">
          <div className="container-page flex flex-col gap-2 px-0">
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.href} {...item} onClick={() => setMobileOpen(false)} />
            ))}
            <div className="h-px w-full bg-dark/10 dark:bg-light/10 my-2" />
            {user ? (
              <NavLink href="/dashboard" label="Dashboard" onClick={() => setMobileOpen(false)} />
            ) : (
              <NavLink href="/login" label="Log In" onClick={() => setMobileOpen(false)} />
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}
