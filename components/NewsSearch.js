"use client";
import { useMemo, useState } from "react";
import NewsCard from "@/components/NewsCard";

export default function NewsSearch({ news }) {
  const [query, setQuery] = useState("");

  const filteredNews = useMemo(() => {
    if (!query) return news;
    return news.filter((item) => item.title.toLowerCase().includes(query.toLowerCase()));
  }, [news, query]);

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Cari Berita Kampus</h2>
            <p className="mt-2 text-sm text-slate-600">Temukan berita berdasarkan judul atau topik kampus.</p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-4 sm:w-[320px]">
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari judul berita..."
              className="w-full bg-transparent text-slate-900 outline-none placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {filteredNews.length > 0 ? (
          filteredNews.map((item) => <NewsCard key={item.id} item={item} />)
        ) : (
          <div className="col-span-full rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600 shadow-sm">
            <p className="text-lg font-semibold">Tidak ada berita yang cocok.</p>
            <p className="mt-2 text-sm">Coba kata kunci lain atau lihat semua berita di halaman utama.</p>
          </div>
        )}
      </div>
    </div>
  );
}
