const mongoose = require("mongoose");

const StudentBillingFeeSchema = new mongoose.Schema(
  {
    academyCode: { type: String, required: true },

    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
      required: true,
    },

    periodStart: { type: Date, required: true },
    periodEnd: { type: Date, required: true },

    // ✅ BASE FEE (copied from student.currentFee)
    baseFee: {
      type: Number,
      required: true,
      default: 0,
    },

    // ✅ DISCOUNT (month-wise)
    discountAmount: {
      type: Number,
      default: 0,
    },

    // ✅ FINAL PAYABLE
    finalFee: {
      type: Number,
      required: true,
      default: 0,
    },

    paidAmount: { type: Number, default: 0 },

    status: {
      type: String,
      enum: ["pending","paid", "unpaid", "partial"],
      default: "unpaid",
    },

    type: {
      type: String,
      enum: ["monthly", "extra"],
      default: "monthly",
    },

    label: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StudentBillingFee", StudentBillingFeeSchema);
