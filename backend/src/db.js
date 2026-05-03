const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");

const DB_HOST = process.env.DB_HOST || "127.0.0.1";
const DB_PORT = process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306;
const DB_USER = process.env.DB_USER || "root";
const DB_PASSWORD = process.env.DB_PASSWORD || "";
const DB_NAME = process.env.DB_NAME || "mitdb";

let pool;

async function initDb() {
  if (pool) return pool;

  const connection = await mysql.createConnection({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
  });
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
  await connection.end();

  pool = mysql.createPool({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    decimalNumbers: true,
  });

  await pool.query(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
      username VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS categories (
      id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(100) NOT NULL UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS news (
      id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
      title VARCHAR(255) NOT NULL,
      body TEXT NOT NULL,
      author VARCHAR(100) NOT NULL,
      status ENUM('draft','published') NOT NULL DEFAULT 'draft',
      published_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      category_id INT UNSIGNED NOT NULL,
      image_url VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      CONSTRAINT fk_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
    ) ENGINE=InnoDB;
  `);

  await ensureSeedData();
  return pool;
}

async function ensureSeedData() {
  const [adminRows] = await pool.query("SELECT id FROM admin_users WHERE username = ?", ["admin"]);
  if (adminRows.length === 0) {
    const passwordHash = await bcrypt.hash("admin123", 10);
    await pool.query("INSERT INTO admin_users (username, password) VALUES (?, ?)", ["admin", passwordHash]);
  }

  const [categoryRows] = await pool.query("SELECT id FROM categories LIMIT 1");
  if (categoryRows.length === 0) {
    await pool.query("INSERT INTO categories (name) VALUES (?), (?), (?)", ["Teknologi", "Sains", "Humaniora"]);
  }

  const [newsRows] = await pool.query("SELECT id FROM news LIMIT 1");
  if (newsRows.length === 0) {
    const [rows] = await pool.query("SELECT id FROM categories ORDER BY id LIMIT 1");
    const defaultCategoryId = rows[0]?.id || 1;
    await pool.query(
      "INSERT INTO news (title, body, author, status, published_at, category_id) VALUES (?, ?, ?, ?, ?, ?)",
      [
        "Selamat datang di MIT Jabalnur",
        "Ini adalah berita awal yang ditampilkan setelah setup backend. Silakan tambahkan berita lebih lanjut melalui admin panel.",
        "Admin",
        "published",
        new Date(),
        defaultCategoryId,
      ]
    );
  }
}

function getPool() {
  if (!pool) {
    throw new Error("Database pool belum diinisialisasi. Panggil initDb() terlebih dahulu.");
  }
  return pool;
}

module.exports = {
  initDb,
  getPool,
};
