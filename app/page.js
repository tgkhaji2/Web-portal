import { getBerita } from "@/lib/api";
import { events } from "@/lib/content";
import EventCard from "@/components/EventCard";
import Link from "next/link";
import NewsCard from "@/components/NewsCard";

export default async function Home() {
  const data = await getBerita();
  const featured = data.slice(0, 3);

  return (
    <main>
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-600 text-white">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.3),_transparent_30%)]" />
        <div className="relative mx-auto max-w-7xl px-6 py-24 lg:py-32">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full bg-cyan-400/20 px-4 py-1 text-sm font-medium text-cyan-200">
              Selamat datang di portal resmi kampus
            </span>
            <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
              Berita & Informasi MIT Jabalnur
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-200">
              Dapatkan update terbaru tentang program, kegiatan, dan prestasi kampus.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="/berita" className="inline-flex items-center justify-center rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-300">
                Lihat semua berita
              </Link>
              <Link href="/kontak" className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:border-cyan-300 hover:bg-white/20">
                Hubungi kami
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-600">Berita unggulan</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">Berita terbaru dari kampus</h2>
            <p className="mt-4 max-w-2xl text-slate-600">
              Simak informasi terbaru tentang kegiatan akademik, event kampus, dan pencapaian mahasiswa.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:w-auto">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Total berita</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">{data.length}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Tentang kami</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">MIT</p>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-6 xl:grid-cols-3">
          {featured.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-600">Event kampus</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">Agenda kampus yang akan datang</h2>
            <p className="mt-4 max-w-2xl text-slate-600">
              Lihat jadwal kegiatan, seminar, dan event penting lain yang diselenggarakan di MIT Jabalnur.
            </p>
          </div>
          <Link href="/agenda" className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
            Lihat agenda lengkap
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {events.slice(0, 3).map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>
    </main>
  );
}
