// backend/routes/lessonFolders.routes.js

const express = require("express");
const router = express.Router({ mergeParams: true });
const LessonFolder = require("../models/LessonFolder");
const { authMiddleware, permit } = require("../middleware/auth");

// GET ALL FOLDERS
router.get("/", authMiddleware, async (req, res) => {
  const { academyCode } = req.params;
  const folders = await LessonFolder.find({ academyCode });
  res.json(folders);
});

// CREATE folder
router.post(
  "/",
  authMiddleware,
  permit("academyAdmin", "teacher"),
  async (req, res) => {
    const { academyCode } = req.params;

    const folder = new LessonFolder({
      academyCode,
      name: req.body.name,
      description: req.body.description,
    });

    await folder.save();
    res.json(folder);
  }
);

// UPDATE folder
router.put(
  "/:id",
  authMiddleware,
  permit("academyAdmin", "teacher"),
  async (req, res) => {
    const updated = await LessonFolder.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  }
);

// DELETE folder
router.delete(
  "/:id",
  authMiddleware,
  permit("academyAdmin", "teacher"),
  async (req, res) => {
    await LessonFolder.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  }
);

module.exports = router;
