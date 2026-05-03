import Link from "next/link";
import { getDetail } from "@/lib/api";

export default async function Detail({ params }) {
  const data = await getDetail(params.id);

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <Link href="/berita" className="text-blue-600 hover:text-blue-800">
          &larr; Kembali ke daftar berita
        </Link>
      </div>

      <article className="border rounded-xl p-6 shadow-sm bg-white">
        <h1 className="text-3xl font-bold mb-4">{data.title}</h1>
        <p className="text-sm text-slate-500 mb-6">ID berita: {data.id}</p>
        <p className="leading-7 text-slate-700">{data.body}</p>
      </article>
    </main>
  );
}
