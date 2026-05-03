const multer = require("multer");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

// Configuration
const UPLOAD_DIR = path.join(__dirname, "../..", "public", "images");
const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3 MB
const ALLOWED_FORMATS = ["jpg", "jpeg", "png", "webp"];

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Storage configuration
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase().slice(1);
  
  if (!ALLOWED_FORMATS.includes(ext)) {
    return cb(new Error(`Format file tidak didukung. Gunakan: ${ALLOWED_FORMATS.join(", ")}`));
  }
  
  cb(null, true);
};

// Multer middleware
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
});

// Custom middleware to process and save image
const processImage = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  try {
    // Generate unique filename with timestamp
    const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.webp`;
    const filePath = path.join(UPLOAD_DIR, fileName);

    // Resize and convert to WebP using sharp
    await sharp(req.file.buffer)
      .resize(800, 600, {
        fit: "cover",
        withoutEnlargement: true,
      })
      .webp({ quality: 80 })
      .toFile(filePath);

    // Store image URL in request object
    req.imageUrl = `/images/${fileName}`;

    next();
  } catch (error) {
    return res.status(400).json({ error: `Error processing image: ${error.message}` });
  }
};

module.exports = {
  upload,
  processImage,
  MAX_FILE_SIZE,
  ALLOWED_FORMATS,
};
