export default function BlogCard({ post }) {
  return (
    <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="mb-3 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-cyan-600">
        <span className="rounded-full bg-cyan-100 px-2 py-1 font-semibold">{post.category}</span>
        <span>{post.date}</span>
      </div>
      <h3 className="text-xl font-semibold text-slate-900">{post.title}</h3>
      <p className="mt-4 text-sm leading-6 text-slate-600">{post.excerpt}</p>
      <div className="mt-6 text-sm font-semibold text-cyan-600">Baca lebih lanjut →</div>
    </article>
  );
}
