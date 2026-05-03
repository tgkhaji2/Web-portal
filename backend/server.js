const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const { initDb } = require("./src/db");
const authRoutes = require("./src/routes/auth");
const categoriesRoutes = require("./src/routes/categories");
const newsRoutes = require("./src/routes/news");

dotenv.config();

const app = express();
app.use(express.json());

// Serve static files from public directory
app.use(express.static(path.join(__dirname, "public")));

const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      "http://localhost:3000",
      "http://localhost:3001",
      /^https:\/\/.*\.app\.github\.dev$/,
    ];

    if (!origin || allowedOrigins.some((allowed) => {
      if (allowed instanceof RegExp) {
        return allowed.test(origin);
      }
      return allowed === origin;
    })) {
      callback(null, true);
    } else {
      callback(new Error("CORS error"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/news", newsRoutes);

app.get("/api/ping", (req, res) => res.json({ message: "Backend API siap" }));

const PORT = process.env.PORT || 4000;

initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Backend berjalan di http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Gagal menginisialisasi database:", error);
    process.exit(1);
  });
