const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

/* =====================================================
   📁 Ensure upload directory exists
===================================================== */
const uploadDir = path.join("uploads", "champions");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/* =====================================================
   🧾 Multer Storage
===================================================== */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${uuidv4()}${ext}`);
  },
});

/* =====================================================
   🔍 File Filter (IMAGE + VIDEO ONLY)
===================================================== */
const fileFilter = (req, file, cb) => {
  const allowedImage = ["image/jpeg", "image/png", "image/webp"];
  const allowedVideo = ["video/mp4", "video/webm", "video/ogg"];

  if (
    allowedImage.includes(file.mimetype) ||
    allowedVideo.includes(file.mimetype)
  ) {
    cb(null, true);
  } else {
    cb(
      new Error("Only image (jpg, png, webp) and video (mp4, webm) files allowed"),
      false
    );
  }
};

/* =====================================================
   🚦 Limits
===================================================== */
const limits = {
  fileSize: 20 * 1024 * 1024, // 20 MB
};

/* =====================================================
   🚀 Export Upload Middleware
===================================================== */
module.exports = multer({
  storage,
  fileFilter,
  limits,
});
