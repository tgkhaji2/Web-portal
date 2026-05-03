"use client";
import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

const initialNewsForm = {
  title: "",
  body: "",
  author: "",
  categoryId: "",
  status: "published",
  published_at: "",
};

export default function AdminPanel() {
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [loginForm, setLoginForm] = useState({ username: "admin", password: "admin123" });
  const [errorMessage, setErrorMessage] = useState("");
  const [categories, setCategories] = useState([]);
  const [newsList, setNewsList] = useState([]);
  const [newsForm, setNewsForm] = useState(initialNewsForm);
  const [newCategory, setNewCategory] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const savedToken = window.localStorage.getItem("adminToken");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  useEffect(() => {
    if (!token) return;
    loadAdminData();
  }, [token]);

  const authHeaders = () => ({
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  });

  const handleError = async (response) => {
    if (response.status === 401) {
      logout();
      throw new Error("Token tidak valid atau sudah kedaluwarsa.");
    }
    const body = await response.json().catch(() => null);
    throw new Error(body?.message || "Terjadi kesalahan server.");
  };

  const loadAdminData = async () => {
    try {
      setErrorMessage("");
      const [categoriesRes, newsRes] = await Promise.all([
        fetch(`${API_BASE}/categories`),
        fetch(`${API_BASE}/news`),
      ]);

      if (!categoriesRes.ok) await handleError(categoriesRes);
      if (!newsRes.ok) await handleError(newsRes);

      setCategories(await categoriesRes.json());
      setNewsList(await newsRes.json());
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const login = async (event) => {
    event.preventDefault();
    try {
      setErrorMessage("");
      setStatusMessage("");
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      });
      if (!response.ok) await handleError(response);
      const data = await response.json();
      window.localStorage.setItem("adminToken", data.token);
      setToken(data.token);
      setUser(data.user);
      setStatusMessage("Login berhasil. Memuat data...");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const logout = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("adminToken");
    }
    setToken("");
    setUser(null);
    setNewsList([]);
    setCategories([]);
    setStatusMessage("Anda telah logout.");
  };

  const addCategory = async (event) => {
    event.preventDefault();
    if (!newCategory.trim()) {
      setErrorMessage("Nama kategori wajib diisi.");
      return;
    }

    try {
      setErrorMessage("");
      const response = await fetch(`${API_BASE}/categories`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ name: newCategory.trim() }),
      });
      if (!response.ok) await handleError(response);
      const created = await response.json();
      setCategories((prev) => [...prev, created]);
      setNewCategory("");
      setStatusMessage(`Kategori "${created.name}" berhasil dibuat.`);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const addNews = async (event) => {
    event.preventDefault();
    if (!newsForm.title.trim() || !newsForm.body.trim() || !newsForm.author.trim() || !newsForm.categoryId) {
      setErrorMessage("Semua field berita harus diisi.");
      return;
    }

    try {
      setErrorMessage("");
      const payload = {
        title: newsForm.title.trim(),
        body: newsForm.body.trim(),
        author: newsForm.author.trim(),
        category_id: Number(newsForm.categoryId),
        status: newsForm.status,
        published_at: newsForm.published_at || new Date().toISOString(),
      };

      const response = await fetch(`${API_BASE}/news`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });
      if (!response.ok) await handleError(response);
      const created = await response.json();
      setNewsList((prev) => [created, ...prev]);
      setNewsForm(initialNewsForm);
      setStatusMessage("Berita baru berhasil ditambahkan.");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-600">Panel Admin</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">Kelola berita dan kategori</h1>
        <p className="mt-4 max-w-3xl text-slate-600">
          Masuk untuk membuat berita baru, menambahkan kategori, dan mengatur status publish secara langsung.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      {statusMessage && (
        <div className="mb-6 rounded-3xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          {statusMessage}
        </div>
      )}

      {!token ? (
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">Login Admin</h2>
          <form onSubmit={login} className="mt-6 space-y-5">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Username</span>
              <input
                type="text"
                value={loginForm.username}
                onChange={(event) => setLoginForm({ ...loginForm, username: event.target.value })}
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Password</span>
              <input
                type="password"
                value={loginForm.password}
                onChange={(event) => setLoginForm({ ...loginForm, password: event.target.value })}
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
              />
            </label>
            <button type="submit" className="inline-flex items-center justify-center rounded-full bg-cyan-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-cyan-500">
              Masuk sebagai admin
            </button>
          </form>
        </section>
      ) : (
        <section className="space-y-8">
          <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-slate-500">Login sebagai</p>
              <p className="text-xl font-semibold text-slate-900">{user?.username}</p>
            </div>
            <button onClick={logout} className="rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
              Logout
            </button>
          </div>

          <div className="grid gap-8 xl:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-slate-900">Tambah kategori</h2>
              <form onSubmit={addCategory} className="mt-6 space-y-5">
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Nama kategori</span>
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(event) => setNewCategory(event.target.value)}
                    className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                  />
                </label>
                <button type="submit" className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                  Tambah kategori
                </button>
              </form>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-slate-900">Tambah berita</h2>
              <form onSubmit={addNews} className="mt-6 space-y-5">
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Judul berita</span>
                  <input
                    type="text"
                    value={newsForm.title}
                    onChange={(event) => setNewsForm({ ...newsForm, title: event.target.value })}
                    className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Isi berita</span>
                  <textarea
                    rows="5"
                    value={newsForm.body}
                    onChange={(event) => setNewsForm({ ...newsForm, body: event.target.value })}
                    className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Penulis</span>
                  <input
                    type="text"
                    value={newsForm.author}
                    onChange={(event) => setNewsForm({ ...newsForm, author: event.target.value })}
                    className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Kategori</span>
                  <select
                    value={newsForm.categoryId}
                    onChange={(event) => setNewsForm({ ...newsForm, categoryId: event.target.value })}
                    className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                  >
                    <option value="">Pilih kategori</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-medium text-slate-700">Status publish</span>
                    <select
                      value={newsForm.status}
                      onChange={(event) => setNewsForm({ ...newsForm, status: event.target.value })}
                      className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-slate-700">Tanggal publish</span>
                    <input
                      type="datetime-local"
                      value={newsForm.published_at}
                      onChange={(event) => setNewsForm({ ...newsForm, published_at: event.target.value })}
                      className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                    />
                  </label>
                </div>
                <button type="submit" className="inline-flex items-center justify-center rounded-full bg-cyan-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-cyan-500">
                  Simpan berita
                </button>
              </form>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-slate-900">Kategori yang tersedia</h2>
              <ul className="mt-6 space-y-3 text-slate-700">
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <li key={category.id} className="rounded-3xl border border-slate-100 bg-slate-50 px-4 py-3">
                      {category.name}
                    </li>
                  ))
                ) : (
                  <li className="text-slate-500">Belum ada kategori.</li>
                )}
              </ul>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-slate-900">Berita terbaru</h2>
              <div className="mt-6 space-y-3 text-slate-700">
                {newsList.length > 0 ? (
                  newsList.map((item) => (
                    <div key={item.id} className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
                      <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                      <p className="mt-1 text-xs text-slate-500">{item.category_name} • {item.author} • {new Date(item.published_at).toLocaleString()}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500">Belum ada berita.</p>
                )}
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
