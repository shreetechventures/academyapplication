// backend/models/StudentMonthlyFee.js
const mongoose = require("mongoose");

const StudentMonthlyFeeSchema = new mongoose.Schema({
  academyCode: { type: String, required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Candidate", required: true },

  month: { type: String, required: true }, // "2025-04"
  feeAmount: { type: Number, required: true },

  paidAmount: { type: Number, default: 0 },

  status: {
    type: String,
    enum: ["paid", "unpaid", "partial"],
    default: "unpaid"
  }
}, { timestamps: true });

module.exports = mongoose.model("StudentMonthlyFee", StudentMonthlyFeeSchema);
