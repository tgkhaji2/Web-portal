const express = require("express");
const authMiddleware = require("../middleware/auth");
const { getPool } = require("../db");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const pool = getPool();
    const [rows] = await pool.query("SELECT id, name FROM categories ORDER BY name ASC");
    return res.json(rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Gagal mengambil kategori." });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  const { name } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ message: "Nama kategori wajib diisi." });
  }

  try {
    const pool = getPool();
    const [result] = await pool.query("INSERT INTO categories (name) VALUES (?)", [name.trim()]);
    const [rows] = await pool.query("SELECT id, name FROM categories WHERE id = ?", [result.insertId]);
    return res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ message: "Kategori sudah ada." });
    }
    return res.status(500).json({ message: "Gagal membuat kategori." });
  }
});

module.exports = router;
