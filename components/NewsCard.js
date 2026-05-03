import Link from "next/link";

const programs = ["Teknologi", "Sains", "Humaniora"];

export default function NewsCard({ item }) {
  const category = programs[item.userId % programs.length];

  return (
    <Link
      href={`/berita/${item.id}`}
      className="group block overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
      aria-label={`Baca detail berita ${item.title}`}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="inline-flex rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">
          {category}
        </span>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          #{item.id}
        </span>
      </div>
      <h2 className="text-xl font-semibold text-slate-900 group-hover:text-cyan-600">{item.title}</h2>
      <p className="mt-4 text-sm leading-6 text-slate-600">{item.body.slice(0, 100)}...</p>
      <div className="mt-6 text-sm font-semibold text-cyan-600 transition group-hover:text-cyan-800">
        Baca selengkapnya →
      </div>
    </Link>
  );
}
