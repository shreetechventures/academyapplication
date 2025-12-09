const mongoose = require("mongoose");

const LessonFolderSchema = new mongoose.Schema({
  academyCode: { type: String, required: true },
  name: { type: String, required: true },  // folder title
  description: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("LessonFolder", LessonFolderSchema);
