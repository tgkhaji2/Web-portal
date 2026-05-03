import Link from "next/link";
import { getBerita } from "@/lib/api";
import NewsSearch from "@/components/NewsSearch";

export default async function Page() {
  const data = await getBerita();

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-12 max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-600">Berita Kampus</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900">Informasi terbaru & pengumuman</h1>
        <p className="mt-4 text-base leading-7 text-slate-600">
          Cari dan baca berita kampus terbaru. Gunakan pencarian cepat untuk menemukan topik yang paling relevan.
        </p>
        <div className="mt-8">
          <Link href="/agenda" className="inline-flex rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
            Lihat agenda dan event kampus
          </Link>
        </div>
      </div>

      <NewsSearch news={data} />
    </main>
  );
}
