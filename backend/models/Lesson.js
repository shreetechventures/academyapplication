const mongoose = require("mongoose");

const LessonSchema = new mongoose.Schema({
  academyCode: { type: String, required: true, index: true },
  title: { type: String, required: true },
  youtubeId: { type: String, required: true },
  description: { type: String, default: "" },

  // ⭐ category added instead of folderId
  category: {
    type: String,
    enum: ["police","army", "navy", "airforce"],
    required: true
  },

  addedBy: { type: String },
  addedByRole: { type: String },
  createdAt: { type: Date, default: Date.now }
});

// ⭐ THIS MUST BE PRESENT
module.exports = mongoose.model("Lesson", LessonSchema);
