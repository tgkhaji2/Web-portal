"use client";
import { useState } from "react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-12 max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-600">Kontak</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900">Hubungi tim MIT Jabalnur</h1>
        <p className="mt-4 text-base leading-7 text-slate-600">
          Kami siap membantu kamu dengan informasi pendaftaran, kegiatan kampus, dan pertanyaan umum.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">Informasi kantor</h2>
          <p className="mt-4 text-slate-600 leading-7">
            Alamat: Jalan Kampus No. 12, Kota Pendidikan<br />
            Email: info@mitjabalnur.ac.id<br />
            Telepon: +62 123 4567 890
          </p>
          <div className="mt-8 space-y-6">
            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Jam operasional</p>
              <p className="mt-2 text-slate-700">Senin - Jumat, 08:00 - 16:00</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Tim layanan</p>
              <p className="mt-2 text-slate-700">Layanan Akademik, Pendaftaran, dan Informasi Mahasiswa</p>
            </div>
          </div>
        </section>

        <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">Kirim pesan</h2>
          <p className="mt-3 text-slate-600">Tuliskan pesanmu dan tim kami akan menghubungi kembali.</p>

          <div className="mt-6 space-y-5">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Nama lengkap</span>
              <input type="text" required className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100" />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Email</span>
              <input type="email" required className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100" />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Pesan</span>
              <textarea rows="5" required className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100" />
            </label>
          </div>

          <button type="submit" className="mt-6 inline-flex items-center justify-center rounded-full bg-cyan-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-cyan-500">
            Kirim pesan
          </button>

          {submitted && (
            <p className="mt-6 rounded-3xl bg-emerald-50 p-4 text-sm text-emerald-800">
              Terima kasih! Pesanmu telah kami terima. Kami akan menghubungi kamu segera.
            </p>
          )}
        </form>
      </div>
    </main>
  );
}
