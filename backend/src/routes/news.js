const express = require("express");
const authMiddleware = require("../middleware/auth");
const { upload, processImage } = require("../middleware/upload");
const { getPool } = require("../db");
const fs = require("fs");
const path = require("path");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const pool = getPool();
    // Only show published news for public, all news for admin
    const statusFilter = req.headers.authorization ? "" : "WHERE n.status = 'published'";
    const query = `SELECT n.id, n.title, n.body, n.author, n.status, n.published_at, n.image_url, c.name AS category_name, c.id AS category_id
       FROM news n
       JOIN categories c ON n.category_id = c.id
       ${statusFilter}
       ORDER BY n.published_at DESC`;
    
    const [rows] = await pool.query(query);
    return res.json(rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Gagal mengambil berita." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const pool = getPool();
    const [rows] = await pool.query(
      `SELECT n.id, n.title, n.body, n.author, n.status, n.published_at, n.image_url, c.name AS category_name, c.id AS category_id
       FROM news n
       JOIN categories c ON n.category_id = c.id
       WHERE n.id = ? LIMIT 1`,
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Berita tidak ditemukan." });
    }

    // Block access to draft news for non-authenticated users
    if (rows[0].status === 'draft' && !req.headers.authorization) {
      return res.status(403).json({ message: "Akses ditolak." });
    }

    return res.json(rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Gagal mengambil detail berita." });
  }
});

router.post("/", authMiddleware, upload.single("image"), processImage, async (req, res) => {
  const { title, body, author, category_id, status, published_at } = req.body;
  if (!title || !body || !author || !category_id) {
    return res.status(400).json({ message: "Judul, isi, penulis, dan kategori wajib diisi." });
  }

  try {
    const pool = getPool();
    const publishTime = published_at ? new Date(published_at) : new Date();
    const imageUrl = req.imageUrl || null;

    const [result] = await pool.query(
      `INSERT INTO news (title, body, author, status, published_at, category_id, image_url)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [title.trim(), body.trim(), author.trim(), status || "draft", publishTime, category_id, imageUrl]
    );

    const [rows] = await pool.query(
      `SELECT n.id, n.title, n.body, n.author, n.status, n.published_at, n.image_url, c.name AS category_name, c.id AS category_id
       FROM news n
       JOIN categories c ON n.category_id = c.id
       WHERE n.id = ? LIMIT 1`,
      [result.insertId]
    );

    return res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Gagal membuat berita." });
  }
});

router.put("/:id", authMiddleware, upload.single("image"), processImage, async (req, res) => {
  const { title, body, author, category_id, status, published_at } = req.body;
  if (!title || !body || !author || !category_id) {
    return res.status(400).json({ message: "Judul, isi, penulis, dan kategori wajib diisi." });
  }

  try {
    const pool = getPool();
    const publishTime = published_at ? new Date(published_at) : new Date();

    // Get existing news to check for old image
    const [existingNews] = await pool.query("SELECT image_url FROM news WHERE id = ?", [req.params.id]);
    if (existingNews.length === 0) {
      return res.status(404).json({ message: "Berita tidak ditemukan." });
    }

    // Delete old image if new image is uploaded
    if (req.imageUrl && existingNews[0].image_url) {
      const oldImagePath = path.join(__dirname, "../..", "public", existingNews[0].image_url);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    const imageUrl = req.imageUrl || existingNews[0].image_url;

    await pool.query(
      `UPDATE news SET title = ?, body = ?, author = ?, category_id = ?, status = ?, published_at = ?, image_url = ? WHERE id = ?`,
      [title.trim(), body.trim(), author.trim(), category_id, status || "draft", publishTime, imageUrl, req.params.id]
    );

    const [rows] = await pool.query(
      `SELECT n.id, n.title, n.body, n.author, n.status, n.published_at, n.image_url, c.name AS category_name, c.id AS category_id
       FROM news n
       JOIN categories c ON n.category_id = c.id
       WHERE n.id = ? LIMIT 1`,
      [req.params.id]
    );

    return res.json(rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Gagal memperbarui berita." });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const pool = getPool();
    
    // Get news to check for image
    const [news] = await pool.query("SELECT image_url FROM news WHERE id = ?", [req.params.id]);
    if (news.length === 0) {
      return res.status(404).json({ message: "Berita tidak ditemukan." });
    }

    // Delete image file if exists
    if (news[0].image_url) {
      const imagePath = path.join(__dirname, "../..", "public", news[0].image_url);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    const [result] = await pool.query("DELETE FROM news WHERE id = ?", [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Berita tidak ditemukan." });
    }
    return res.json({ message: "Berita berhasil dihapus." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Gagal menghapus berita." });
  }
});

module.exports = router;
