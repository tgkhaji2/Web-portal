import { blogPosts, events } from "@/lib/content";
import BlogCard from "@/components/BlogCard";
import EventCard from "@/components/EventCard";
import Link from "next/link";

export default function AgendaPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-16 max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-600">Agenda & Blog</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900">Jadwal kegiatan dan artikel kampus</h1>
        <p className="mt-4 text-base leading-7 text-slate-600">
          Jelajahi agenda kampus MIT Jabalnur, termasuk event mendatang dan artikel panduan untuk mahasiswa.
        </p>
        <div className="mt-8 inline-flex items-center rounded-full bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700">
          <span className="mr-2 text-cyan-600">•</span>
          Diperbarui otomatis setiap minggu.
        </div>
      </div>

      <section className="mb-16">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Event Kampus Mendatang</h2>
            <p className="mt-3 text-slate-600">Ikuti semua agenda penting dan persiapkan kehadiranmu.</p>
          </div>
          <Link href="/kontak" className="inline-flex rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
            Hubungi panitia
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>

      <section>
        <div className="mb-10">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Blog Kampus & Agenda</h2>
          <p className="mt-3 text-slate-600">Baca artikel terbaru untuk pengumuman, tips mahasiswa, dan informasi penting.</p>
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          {blogPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </section>
    </main>
  );
}
