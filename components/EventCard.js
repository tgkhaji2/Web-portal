export default function EventCard({ event }) {
  return (
    <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">
          {event.tag}
        </span>
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{event.date}</span>
      </div>
      <h3 className="text-xl font-semibold text-slate-900">{event.title}</h3>
      <p className="mt-4 text-sm leading-6 text-slate-600">{event.description}</p>
      <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-slate-500">
        <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1">
          <strong>Waktu:</strong> {event.time}
        </span>
        <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1">
          <strong>Lokasi:</strong> {event.location}
        </span>
      </div>
    </article>
  );
}
