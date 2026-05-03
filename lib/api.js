const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export async function getBerita() {
  const res = await fetch(`${API_BASE}/news`, { cache: "no-store" });
  return res.json();
}

export async function getDetail(id) {
  const res = await fetch(`${API_BASE}/news/${id}`, { cache: "no-store" });
  return res.json();
}

export async function getCategories() {
  const res = await fetch(`${API_BASE}/categories`, { cache: "no-store" });
  return res.json();
}
