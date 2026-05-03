const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getPool } = require("../db");

const router = express.Router();

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username dan password wajib diisi." });
  }

  try {
    const pool = getPool();
    const [rows] = await pool.query("SELECT * FROM admin_users WHERE username = ? LIMIT 1", [username]);
    if (rows.length === 0) {
      return res.status(401).json({ message: "Username atau password salah." });
    }

    const user = rows[0];
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: "Username atau password salah." });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET || "mit_secret_key",
      { expiresIn: "4h" }
    );

    return res.json({ token, user: { id: user.id, username: user.username } });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Gagal memproses login." });
  }
});

router.get("/me", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token tidak ditemukan." });
  }

  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "mit_secret_key");
    return res.json({ user: { id: payload.id, username: payload.username } });
  } catch (error) {
    return res.status(401).json({ message: "Token tidak valid atau kedaluwarsa." });
  }
});

module.exports = router;
