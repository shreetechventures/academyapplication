// backend/routes/lessons.routes.js
const express = require("express");
const router = express.Router({ mergeParams: true });
const Lesson = require("../models/Lesson");
const { authMiddleware, permit } = require("../middleware/auth");

// Utility: extract youtube id from URL or return same if already id
function extractYouTubeId(urlOrId) {
  if (!urlOrId) return null;
  // If it's already a short id (no spaces and < 20 chars), return it
  if (/^[A-Za-z0-9_-]{6,20}$/.test(urlOrId)) return urlOrId;

  // Regex patterns to handle many youtube url formats
  const patterns = [
    /(?:youtu\.be\/)([A-Za-z0-9_-]{6,20})/,
    /(?:v=)([A-Za-z0-9_-]{6,20})/,
    /(?:\/embed\/)([A-Za-z0-9_-]{6,20})/,
    /(?:\/v\/)([A-Za-z0-9_-]{6,20})/
  ];

  for (const p of patterns) {
    const m = urlOrId.match(p);
    if (m && m[1]) return m[1];
  }

  // Last attempt: fallback to stripping query params if passed like "watch?v=id&..."
  const qMatch = urlOrId.match(/[?&]v=([A-Za-z0-9_-]{6,20})/);
  if (qMatch && qMatch[1]) return qMatch[1];

  return null;
}


router.post(
  "/",
  authMiddleware,
  permit("academyAdmin", "teacher"),
  async (req, res) => {
    try {
      const { academyCode } = req.params;
      const { title, youtubeUrlOrId, description, category } = req.body;

      if (!title || !youtubeUrlOrId || !category) {
        return res.status(400).json({ message: "Title, YouTube URL and category are required" });
      }

      const youtubeId = extractYouTubeId(youtubeUrlOrId);
      if (!youtubeId) {
        return res.status(400).json({ message: "Invalid YouTube URL/ID." });
      }

      const lesson = new Lesson({
        academyCode,
        title,
        youtubeId,
        description: description || "",
        category,
        addedBy: req.user?.id || req.user?.name,
        addedByRole: req.user?.role
      });

      await lesson.save();
      res.json(lesson);

    } catch (err) {
      console.error("LESSON CREATE ERROR:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);




router.get("/", authMiddleware, async (req, res) => {
  try {
    const { academyCode } = req.params;

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





/**
 * DELETE /api/:academyCode/lessons/:id
 * Allowed: academyAdmin, teacher
 */
router.delete(
  "/:id",
  authMiddleware,
  permit("academyAdmin", "teacher"),
  async (req, res) => {
    try {
      const lesson = await Lesson.findByIdAndDelete(req.params.id);
      if (!lesson) return res.status(404).json({ message: "Lesson not found" });
      res.json({ success: true });
    } catch (err) {
      console.error("LESSON DELETE ERROR:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);



router.put(
  "/:id",
  authMiddleware,
  permit("academyAdmin", "teacher"),
  async (req, res) => {
    try {
      const { title, youtubeUrlOrId, description, category } = req.body;

      if (!category) {
        return res.status(400).json({ message: "Category is required" });
      }

      const youtubeId = extractYouTubeId(youtubeUrlOrId);
      if (!youtubeId) {
        return res.status(400).json({ message: "Invalid YouTube URL or ID" });
      }

      const updated = await Lesson.findByIdAndUpdate(
        req.params.id,
        {
          title,
          youtubeId,
          description: description || "",
          category
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



module.exports = router;
