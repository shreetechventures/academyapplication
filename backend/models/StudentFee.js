// backend/models/StudentFee.js
const mongoose = require("mongoose");

const StudentFeeSchema = new mongoose.Schema({
  academyCode: { type: String, required: true }, // your academy code (e.g. "shreenath")
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Candidate", required: true },

  totalFee: { type: Number, required: true },
  paidFee: { type: Number, default: 0 },
  pendingFee: { type: Number, default: 0 },

}, { timestamps: true });

module.exports = mongoose.model("StudentFee", StudentFeeSchema);
