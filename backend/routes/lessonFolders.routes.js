const express = require("express");
const router = express.Router();

const LessonFolder = require("../models/LessonFolder");
const { authMiddleware, permit } = require("../middleware/auth");

/* =======================
   📂 GET ALL FOLDERS
======================= */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const academyCode = req.academyCode;

    const folders = await LessonFolder.find({ academyCode }).sort({
      createdAt: -1,
    });

    res.json(folders);
  } catch (err) {
    console.error("LOAD FOLDERS ERROR:", err);
    res.status(500).json({ message: "Failed to load folders" });
  }
});

/* =======================
   ➕ CREATE FOLDER
======================= */
router.post(
  "/",
  authMiddleware,
  permit("academyAdmin", "teacher"),
  async (req, res) => {
    try {
      const academyCode = req.academyCode;
      const { name, description } = req.body;

      if (!name) {
        return res.status(400).json({ message: "Folder name is required" });
      }

      const folder = await LessonFolder.create({
        academyCode,
        name,
        description: description || "",
      });

      res.json(folder);
    } catch (err) {
      console.error("CREATE FOLDER ERROR:", err);
      res.status(500).json({ message: "Failed to create folder" });
    }
  }
);

/* =======================
   ✏️ UPDATE FOLDER
======================= */
router.put(
  "/:id",
  authMiddleware,
  permit("academyAdmin", "teacher"),
  async (req, res) => {
    try {
      const academyCode = req.academyCode;
      const { id } = req.params;

      const updated = await LessonFolder.findOneAndUpdate(
        { _id: id, academyCode }, // 🔐 SECURITY FIX
        req.body,
        { new: true }
      );

      if (!updated) {
        return res.status(404).json({ message: "Folder not found" });
      }

      res.json(updated);
    } catch (err) {
      console.error("UPDATE FOLDER ERROR:", err);
      res.status(500).json({ message: "Failed to update folder" });
    }
  }
);

/* =======================
   🗑️ DELETE FOLDER
======================= */
router.delete(
  "/:id",
  authMiddleware,
  permit("academyAdmin", "teacher"),
  async (req, res) => {
    try {
      const academyCode = req.academyCode;
      const { id } = req.params;

      const deleted = await LessonFolder.findOneAndDelete({
        _id: id,
        academyCode, // 🔐 SECURITY FIX
      });

      if (!deleted) {
        return res.status(404).json({ message: "Folder not found" });
      }

      res.json({ success: true });
    } catch (err) {
      console.error("DELETE FOLDER ERROR:", err);
      res.status(500).json({ message: "Failed to delete folder" });
    }
  }
);

module.exports = router;
