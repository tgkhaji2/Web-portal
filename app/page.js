import { getBerita } from "@/lib/api";
import NewsCard from "@/components/NewsCard";

export default async function Home() {
  const data = await getBerita();

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        MIT Jabalnur
      </h1>

      <div className="grid md:grid-cols-3 gap-4">
        {data.slice(0, 6).map((item) => (
          <NewsCard key={item.id} item={item} />
        ))}
      </div>
    </main>
  );
}
