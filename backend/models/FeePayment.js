
// backend/models/FeePayment.js
const mongoose = require("mongoose");

const FeePaymentSchema = new mongoose.Schema({
  studentFeeId: { type: mongoose.Schema.Types.ObjectId, ref: "StudentFee", required: true },
  amount: { type: Number, required: true },
  mode: { type: String, enum: ["cash", "online", "bank"], required: true },
  date: { type: Date, default: Date.now },
  receivedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // optional

  // auto-generated month label
  month: { type: String }
}, { timestamps: true });


module.exports = mongoose.model("FeePayment", FeePaymentSchema);
