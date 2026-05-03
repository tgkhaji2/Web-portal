import { getBerita } from "@/lib/api";
import NewsCard from "@/components/NewsCard";

export default async function Page() {
  const data = await getBerita();

  return (
    <main className="p-6">
      <h1 className="text-xl font-bold mb-4">
        Semua Berita
      </h1>

      <div className="grid md:grid-cols-3 gap-4">
        {data.map((item) => (
          <NewsCard key={item.id} item={item} />
        ))}
      </div>
    </main>
  );
}
