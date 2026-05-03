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
  image: null,
};

export default function AdminPanel() {
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [loginForm, setLoginForm] = useState({ username: "admin", password: "admin123" });
  const [errorMessage, setErrorMessage] = useState("");
  const [categories, setCategories] = useState([]);
  const [newsList, setNewsList] = useState([]);
  const [newsForm, setNewsForm] = useState(initialNewsForm);
  const [editingNewsId, setEditingNewsId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [newCategory, setNewCategory] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [deleteModal, setDeleteModal] = useState({ show: false, newsId: null, title: "" });

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

  const authHeaders = (json = true) => {
    const headers = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    if (json) {
      headers["Content-Type"] = "application/json";
    }
    return headers;
  };

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
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      if (token) {
        const profileRes = await fetch(`${API_BASE}/auth/me`, { headers });
        if (profileRes.ok) {
          const profile = await profileRes.json();
          setUser(profile.user);
        } else {
          await handleError(profileRes);
        }
      }

      const [categoriesRes, newsRes] = await Promise.all([
        fetch(`${API_BASE}/categories`, { headers }),
        fetch(`${API_BASE}/news`, { headers }),
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

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setNewsForm({ ...newsForm, image: file });
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const confirmDelete = (newsId, title) => {
    setDeleteModal({ show: true, newsId, title });
  };

  const deleteNews = async () => {
    try {
      setErrorMessage("");
      const response = await fetch(`${API_BASE}/news/${deleteModal.newsId}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (!response.ok) await handleError(response);
      setNewsList((prev) => prev.filter((item) => item.id !== deleteModal.newsId));
      setDeleteModal({ show: false, newsId: null, title: "" });
      setStatusMessage("Berita berhasil dihapus.");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const resetNewsForm = () => {
    setNewsForm(initialNewsForm);
    setImagePreview(null);
    setEditingNewsId(null);
  };

  const handleEdit = (item) => {
    setErrorMessage("");
    setStatusMessage("");
    setEditingNewsId(item.id);
    setNewsForm({
      title: item.title,
      body: item.body,
      author: item.author,
      categoryId: item.category_id || item.categoryId || "",
      status: item.status || "published",
      published_at: item.published_at ? new Date(item.published_at).toISOString().slice(0, 16) : "",
      image: null,
    });
    setImagePreview(item.image_url || null);
  };

  const saveNews = async (event) => {
    event.preventDefault();
    if (!newsForm.title.trim() || !newsForm.body.trim() || !newsForm.author.trim() || !newsForm.categoryId) {
      setErrorMessage("Semua field berita harus diisi.");
      return;
    }

    try {
      setErrorMessage("");
      const formData = new FormData();
      formData.append("title", newsForm.title.trim());
      formData.append("body", newsForm.body.trim());
      formData.append("author", newsForm.author.trim());
      formData.append("category_id", Number(newsForm.categoryId));
      formData.append("status", newsForm.status);
      formData.append("published_at", newsForm.published_at || new Date().toISOString());
      if (newsForm.image) {
        formData.append("image", newsForm.image);
      }

      const response = await fetch(`${API_BASE}/news${editingNewsId ? `/${editingNewsId}` : ""}`, {
        method: editingNewsId ? "PUT" : "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });
      if (!response.ok) await handleError(response);
      const result = await response.json();

      if (editingNewsId) {
        setNewsList((prev) => prev.map((item) => (item.id === result.id ? result : item)));
        setStatusMessage("Berita berhasil diperbarui.");
      } else {
        setNewsList((prev) => [result, ...prev]);
        setStatusMessage("Berita baru berhasil ditambahkan.");
      }

      resetNewsForm();
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
              <form onSubmit={saveNews} className="mt-6 space-y-5">
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
                  <span className="text-sm font-medium text-slate-700">Gambar berita (opsional)</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                  />
                  {imagePreview && (
                    <div className="mt-3">
                      <img src={imagePreview} alt="Preview" className="h-32 w-auto rounded-lg object-cover" />
                    </div>
                  )}
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
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <button type="submit" className="inline-flex items-center justify-center rounded-full bg-cyan-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-cyan-500">
                    {editingNewsId ? "Perbarui berita" : "Simpan berita"}
                  </button>
                  {editingNewsId && (
                    <button
                      type="button"
                      onClick={resetNewsForm}
                      className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      Batal edit
                    </button>
                  )}
                </div>
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
              <h2 className="text-2xl font-semibold text-slate-900">Kelola Berita</h2>
              <div className="mt-6">
                {newsList.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full table-auto">
                      <thead>
                        <tr className="border-b border-slate-200">
                              <th className="px-4 py-2 text-left text-sm font-semibold text-slate-700">Judul</th>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-slate-700">Kategori</th>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-slate-700">Status</th>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-slate-700">Tanggal</th>
                          <th className="px-4 py-2 text-center text-sm font-semibold text-slate-700">Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {newsList.map((item) => (
                          <tr key={item.id} className="border-b border-slate-100">
                            <td className="px-4 py-3 text-sm text-slate-900">{item.title}</td>
                            <td className="px-4 py-3 text-sm text-slate-600">{item.category_name || "-"}</td>
                            <td className="px-4 py-3 text-sm text-slate-600">{item.status}</td>
                            <td className="px-4 py-3 text-sm text-slate-600">{new Date(item.published_at).toLocaleDateString()}</td>
                            <td className="px-4 py-3 text-center">
                              <button 
                                onClick={() => handleEdit(item)}
                                className="mr-2 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-500"
                              >
                                Edit
                              </button>
                              <button 
                                onClick={() => confirmDelete(item.id, item.title)}
                                className="rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white hover:bg-red-500"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-slate-500">Belum ada berita.</p>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {deleteModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
            <h3 className="text-lg font-semibold text-slate-900">Konfirmasi Hapus</h3>
            <p className="mt-2 text-sm text-slate-600">
              Apakah Anda yakin ingin menghapus berita "{deleteModal.title}"? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setDeleteModal({ show: false, newsId: null, title: "" })}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                onClick={deleteNews}
                className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
