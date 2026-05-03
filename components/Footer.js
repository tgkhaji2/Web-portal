export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-6 py-12 grid gap-8 md:grid-cols-3">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">MIT Jabalnur</p>
          <p className="mt-4 text-sm leading-6 text-slate-400">
            Portal kampus yang menampilkan berita terbaru, kegiatan akademik, dan informasi penting untuk mahasiswa.
          </p>
        </div>

        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">Quick link</p>
          <ul className="mt-4 space-y-2 text-sm text-slate-400">
            <li>Beranda</li>
            <li>Berita</li>
            <li>Kontak</li>
          </ul>
        </div>

        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">Hubungi</p>
          <p className="mt-4 text-sm leading-6 text-slate-400">
            email: info@mitjabalnur.ac.id<br />
            telepon: +62 123 4567 890
          </p>
        </div>
      </div>
      <div className="border-t border-slate-800 px-6 py-4 text-center text-sm text-slate-500">
        © 2026 MIT Jabalnur. Semua hak cipta dilindungi.
      </div>
    </footer>
  );
}
