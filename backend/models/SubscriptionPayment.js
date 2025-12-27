const mongoose = require("mongoose");

const subscriptionPaymentSchema = new mongoose.Schema(
  {
    academyCode: { type: String, required: true, index: true },

    // amount: { type: Number, required: true },
    durationMonths: { type: Number, required: true },

    paidOn: { type: Date, default: Date.now },
    markedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    remark:{type : String},
  },
  {
    timestamps: true, // ✅ THIS FIXES Invalid Date
  }
);

module.exports = mongoose.model(
  "SubscriptionPayment",
  subscriptionPaymentSchema
);
