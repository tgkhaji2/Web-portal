export async function getBerita() {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts");
  return res.json();
}

export async function getDetail(id) {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${id}`
  );
  return res.json();
}
