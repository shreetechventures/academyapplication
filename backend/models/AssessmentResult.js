const mongoose = require("mongoose");

const AssessmentResultSchema = new mongoose.Schema(
  {
    academyCode: { type: String, required: true },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
      required: true,
    },
    assessmentTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AssessmentType",
      required: true,
    },
    value: { type: mongoose.Schema.Types.Mixed, required: true },
    score: { type: Number, default: null },
    attemptDate: { type: Date, default: Date.now },
    addedBy: String,
    note: { type: String, default: "" },
  },
  { timestamps: true }
);

// ✔ FIXED
module.exports =
  mongoose.models.AssessmentResult ||
  mongoose.model("AssessmentResult", AssessmentResultSchema);
