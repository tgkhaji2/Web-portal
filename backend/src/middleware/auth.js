const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token tidak ditemukan." });
  }

  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "mit_secret_key");
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token tidak valid atau kedaluwarsa." });
  }
}

module.exports = authMiddleware;
