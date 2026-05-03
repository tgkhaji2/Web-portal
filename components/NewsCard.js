import Link from "next/link";

export default function NewsCard({ item }) {
  const apiBaseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000").replace(/\/+$/, "");
  const imageBaseUrl = apiBaseUrl.replace(/\/api$/, "");

  return (
    <Link
      href={`/berita/${item.id}`}
      className="group block overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
      aria-label={`Baca detail berita ${item.title}`}
    >
      {item.image_url && (
        <div className="mb-4 overflow-hidden rounded-2xl">
          <img 
            src={item.image_url.startsWith("http") ? item.image_url : `${imageBaseUrl}${item.image_url}`}
            alt={item.title} 
            className="h-48 w-full object-cover transition group-hover:scale-105" 
          />
        </div>
      )}
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="inline-flex rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">
          {item.category_name}
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
