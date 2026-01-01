const express = require("express");
const router = express.Router({ mergeParams: true });
const multer = require("multer");
const Champion = require("../models/Champion");
const { authMiddleware, permit } = require("../middleware/auth");

// =======================
// MULTER CONFIG
// =======================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/champions");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// =======================
// ✅ GET ALL CHAMPIONS
// =======================
router.get("/", authMiddleware, async (req, res) => {
  try {
    const champions = await Champion.find({
      academyCode: req.academyCode,
    }).sort({ createdAt: -1 });

    res.json(champions);
  } catch (err) {
    console.error("Load Champions Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// =======================
// ✅ CREATE CHAMPION
// =======================
router.post(
  "/",
  authMiddleware,
  permit("academyAdmin", "teacher"),
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { name, examName, year } = req.body;

      if (!name || !examName || !year) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const imageFile = req.files?.image?.[0];
      const videoFile = req.files?.video?.[0];

      const champion = await Champion.create({
        academyCode: req.academyCode,
        name,
        examName,
        year,
        imageUrl: imageFile
          ? `/uploads/champions/${imageFile.filename}`
          : "",
        videoUrl: videoFile
          ? `/uploads/champions/${videoFile.filename}`
          : "",
      });

      res.json(champion);
    } catch (err) {
      console.error("Champion Create Error:", err);
      res.status(500).json({ message: "Server Error" });
    }
  }
);

// =======================
// ✅ UPDATE CHAMPION
// =======================
router.put(
  "/:id",
  authMiddleware,
  permit("academyAdmin", "teacher"),
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { name, examName, year } = req.body;

      const champion = await Champion.findOne({
        _id: id,
        academyCode: req.academyCode,
      });

      if (!champion) {
        return res.status(404).json({ message: "Champion not found" });
      }

      if (name) champion.name = name;
      if (examName) champion.examName = examName;
      if (year) champion.year = year;

      if (req.files?.image?.[0]) {
        champion.imageUrl = `/uploads/champions/${req.files.image[0].filename}`;
      }

      if (req.files?.video?.[0]) {
        champion.videoUrl = `/uploads/champions/${req.files.video[0].filename}`;
      }

      await champion.save();
      res.json(champion);
    } catch (err) {
      console.error("Champion Update Error:", err);
      res.status(500).json({ message: "Server Error" });
    }
  }
);

// =======================
// ✅ DELETE CHAMPION
// =======================
router.delete(
  "/:id",
  authMiddleware,
  permit("academyAdmin", "teacher"),
  async (req, res) => {
    try {
      const { id } = req.params;

      const champion = await Champion.findOneAndDelete({
        _id: id,
        academyCode: req.academyCode,
      });

      if (!champion) {
        return res.status(404).json({ message: "Champion not found" });
      }

      res.json({ message: "Champion deleted successfully" });
    } catch (err) {
      console.error("Champion Delete Error:", err);
      res.status(500).json({ message: "Server Error" });
    }
  }
);

module.exports = router;
