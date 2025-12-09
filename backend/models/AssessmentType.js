const mongoose = require("mongoose");

const AssessmentTypeSchema = new mongoose.Schema({
  academyCode: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: "" },
  unit: {
    type: String,
    enum: ["seconds", "meters", "count"],
    default: "count",
    required: true
  },
  bhartiType: { type: String, default: "army" },
  scoringScheme: {
    mode: { type: String, enum: ["time_desc", "distance_asc", "count_asc"] },
    best: Number,
    worst: Number
  },
  maxScore: { type: Number, default: 100 },
  createdAt: { type: Date, default: Date.now }
});

// ✔ FIXED: prevents OverwriteModelError
module.exports =
  mongoose.models.AssessmentType ||
  mongoose.model("AssessmentType", AssessmentTypeSchema);
