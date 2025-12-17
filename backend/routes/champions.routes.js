// const express = require("express");
// const router = express.Router({ mergeParams: true });

// const { authMiddleware } = require("../middleware/auth");
// const Champions = require("../models/Champion");

// // GET all champions
// router.get("/", authMiddleware, async (req, res) => {
//   try {
//     const list = await Champions.find({
//       academyCode: req.academyCode
//     }).sort({ createdAt: -1 });

//     res.json(list);
//   } catch (err) {
//     console.error("Champions Load Error:", err);
//     res.status(500).json({ message: err.message });
//   }
// });

// // ADD champion
// router.post("/", authMiddleware, async (req, res) => {
//   try {
//     const newChamp = await Champions.create({
//       ...req.body,
//       academyCode: req.academyCode
//     });

//     res.status(201).json(newChamp);
//   } catch (err) {
//     console.error("Champion Create Error:", err);
//     res.status(500).json({ message: err.message });
//   }
// });

// module.exports = router;

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
  }
});

const upload = multer({ storage });

// =======================
// ✅ GET ALL CHAMPIONS
// =======================
router.get(
  "/",
  authMiddleware,
  async (req, res) => {
    try {
      const champions = await Champion.find({
        academyCode: req.academyCode
      }).sort({ createdAt: -1 });

      res.json(champions);
    } catch (err) {
      console.error("Load Champions Error:", err);
      res.status(500).json({ message: "Server Error" });
    }
  }
);

// =======================
// ✅ CREATE CHAMPION
// =======================
router.post(
  "/",
  authMiddleware,
  permit("academyAdmin", "teacher"),
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 }
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
        imageUrl: imageFile ? `/uploads/champions/${imageFile.filename}` : "",
        videoUrl: videoFile ? `/uploads/champions/${videoFile.filename}` : ""
      });

      res.json(champion);
    } catch (err) {
      console.error("Champion Create Error:", err);
      res.status(500).json({ message: "Server Error" });
    }
  }
);

module.exports = router;
