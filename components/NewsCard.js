import Link from "next/link";

export default function NewsCard({ item }) {
  return (
    <Link
      href={`/berita/${item.id}`}
      className="block border p-4 rounded-lg hover:shadow-lg transition-shadow duration-200 bg-white"
      aria-label={`Baca detail berita ${item.title}`}
    >
      <h2 className="font-bold text-lg mb-2">{item.title}</h2>
      <p className="text-sm text-slate-600 mb-4">{item.body.slice(0, 80)}...</p>
      <span className="text-blue-600 hover:text-blue-800 font-medium">
        Baca selengkapnya
      </span>
    </Link>
  );
}
