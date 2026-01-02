const express = require("express");
const router = express.Router();

const Lesson = require("../models/Lesson");
const { authMiddleware, permit } = require("../middleware/auth");

/* ======================================================
   🎥 Utility: Extract YouTube ID
====================================================== */
function extractYouTubeId(urlOrId) {
  if (!urlOrId) return null;

  // Already an ID
  if (/^[A-Za-z0-9_-]{6,20}$/.test(urlOrId)) return urlOrId;

  const patterns = [
    /youtu\.be\/([A-Za-z0-9_-]{6,20})/,
    /v=([A-Za-z0-9_-]{6,20})/,
    /\/embed\/([A-Za-z0-9_-]{6,20})/,
    /\/v\/([A-Za-z0-9_-]{6,20})/,
  ];

  for (const p of patterns) {
    const match = urlOrId.match(p);
    if (match?.[1]) return match[1];
  }

  const q = urlOrId.match(/[?&]v=([A-Za-z0-9_-]{6,20})/);
  return q?.[1] || null;
}

/* ======================================================
   ➕ CREATE LESSON
====================================================== */
router.post(
  "/",
  authMiddleware,
  permit("academyAdmin", "teacher"),
  async (req, res) => {
    try {
      const academyCode = req.academyCode;
      const { title, youtubeUrlOrId, description, category } = req.body;

      if (!title || !youtubeUrlOrId || !category) {
        return res.status(400).json({
          message: "Title, YouTube URL/ID and category are required",
        });
      }

      const youtubeId = extractYouTubeId(youtubeUrlOrId);
      if (!youtubeId) {
        return res.status(400).json({
          message: "Invalid YouTube URL or ID",
        });
      }

      const lesson = await Lesson.create({
        academyCode,
        title,
        youtubeId,
        description: description || "",
        category,
        addedBy: req.user?.id || req.user?.name,
        addedByRole: req.user?.role,
      });

      res.json(lesson);
    } catch (err) {
      console.error("LESSON CREATE ERROR:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

/* ======================================================
   📚 GET LESSONS
====================================================== */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const academyCode = req.academyCode;

    const filter = { academyCode };
    if (req.query.category) {
      filter.category = req.query.category;
    }

    const lessons = await Lesson.find(filter).sort({ createdAt: -1 });
    res.json(lessons);
  } catch (err) {
    console.error("LESSON LIST ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ======================================================
   ✏️ UPDATE LESSON
====================================================== */
router.put(
  "/:id",
  authMiddleware,
  permit("academyAdmin", "teacher"),
  async (req, res) => {
    try {
      const academyCode = req.academyCode;
      const { id } = req.params;
      const { title, youtubeUrlOrId, description, category } = req.body;

      if (!category) {
        return res.status(400).json({ message: "Category is required" });
      }

      const youtubeId = extractYouTubeId(youtubeUrlOrId);
      if (!youtubeId) {
        return res.status(400).json({
          message: "Invalid YouTube URL or ID",
        });
      }

      const updated = await Lesson.findOneAndUpdate(
        { _id: id, academyCode }, // 🔐 SECURITY FIX
        {
          title,
          youtubeId,
          description: description || "",
          category,
        },
        { new: true }
      );

      if (!updated) {
        return res.status(404).json({ message: "Lesson not found" });
      }

      res.json(updated);
    } catch (err) {
      console.error("LESSON UPDATE ERROR:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

/* ======================================================
   🗑️ DELETE LESSON
====================================================== */
router.delete(
  "/:id",
  authMiddleware,
  permit("academyAdmin", "teacher"),
  async (req, res) => {
    try {
      const academyCode = req.academyCode;
      const { id } = req.params;

      const deleted = await Lesson.findOneAndDelete({
        _id: id,
        academyCode, // 🔐 SECURITY FIX
      });

      if (!deleted) {
        return res.status(404).json({ message: "Lesson not found" });
      }

      res.json({ success: true });
    } catch (err) {
      console.error("LESSON DELETE ERROR:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
