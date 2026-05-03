"use client";
import { useState } from "react";
import Link from "next/link";

const navItems = [
  { label: "Beranda", href: "/" },
  { label: "Berita", href: "/berita" },
  { label: "Agenda", href: "/agenda" },
  { label: "Admin", href: "/admin" },
  { label: "Kontak", href: "/kontak" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3 text-slate-900">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500 text-sm font-bold text-white shadow-lg">
            M
          </div>
          <div>
            <p className="font-semibold">MIT Jabalnur</p>
            <p className="text-xs text-slate-500">Portal Kampus</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-medium text-slate-700 transition hover:text-cyan-600">
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-700 transition hover:bg-slate-100 md:hidden"
          aria-label="Buka menu"
        >
          ☰
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white px-6 pb-4 md:hidden">
          <nav className="flex flex-col gap-3 py-4">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="rounded-xl px-4 py-3 text-slate-700 transition hover:bg-slate-100">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
