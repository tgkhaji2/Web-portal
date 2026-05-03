"use client";
import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-blue-700 text-white p-4">
      <div className="flex justify-between">
        <h1 className="font-bold">MIT Jabalnur</h1>
        <button onClick={() => setOpen(!open)}>☰</button>
      </div>

      {open && (
        <div className="flex flex-col mt-3">
          <Link href="/">Home</Link>
          <Link href="/berita">Berita</Link>
          <Link href="/kontak">Kontak</Link>
        </div>
      )}
    </nav>
  );
}
