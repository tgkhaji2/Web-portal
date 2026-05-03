import Link from "next/link";
import { getDetail } from "@/lib/api";

const categories = ["Teknologi", "Sains", "Humaniora"];

export default async function Detail({ params }) {
  const data = await getDetail(params.id);
  const category = categories[data.userId % categories.length];

  const apiBaseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000").replace(/\/+$/, "");
  const imageBaseUrl = apiBaseUrl.replace(/\/api$/, "");

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <div className="mb-8">
        <Link href="/berita" className="inline-flex text-sm font-semibold text-cyan-600 transition hover:text-cyan-800">
          &larr; Kembali ke semua berita
        </Link>
      </div>

      <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg">
        {data.image_url && (
          <div className="overflow-hidden">
            <img 
              src={data.image_url.startsWith("http") ? data.image_url : `${imageBaseUrl}${data.image_url}`} 
              alt={data.title} 
              className="h-64 w-full object-cover" 
            />
          </div>
        )}
        <div className="bg-gradient-to-r from-cyan-500 to-slate-800 px-8 py-8 text-white">
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-100">Kategori</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight">{data.title}</h1>
          <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-200">
            <span className="rounded-full bg-white/15 px-3 py-1">{data.category_name}</span>
            <span className="rounded-full bg-white/15 px-3 py-1">ID Berita: {data.id}</span>
          </div>
        </div>

        <div className="space-y-6 px-8 py-10 text-slate-700">
          <p>{data.body}</p>
          <div className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
            <p className="text-sm text-slate-500">Berita ini berasal dari sumber resmi kampus. Jika Anda memiliki pertanyaan lebih lanjut, silakan kunjungi halaman kontak.</p>
          </div>
        </div>
      </article>
    </main>
  );
}
