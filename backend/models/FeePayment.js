// backend/models/FeePayment.js

const mongoose = require("mongoose");

const FeePaymentSchema = new mongoose.Schema(
  {
    // 🔗 Link to student fee summary
    studentFeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentFee",
      required: function () {
        // ✅ Required only for payments, not discounts
        return this.type === "payment";
      },
    },

    // 🔗 Link to specific billing cycle (month)
    billingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentBillingFee",
      required: true,
    },

    // 💰 Amount paid or discounted
    amount: {
      type: Number,
      required: true,
    },

    // 💳 Payment mode (ONLY for payments)
    mode: {
      type: String,
      enum: ["cash", "online", "bank"],
      required: function () {
        return this.type === "payment";
      },
    },

    // 🧾 Type of entry
    type: {
      type: String,
      enum: ["payment", "discount"],
      default: "payment",
    },

    // 📝 Optional note (used for discount text)
    note: {
      type: String,
    },

    // 👤 Who performed the action
    receivedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // 📅 Optional month label (legacy / optional)
    month: {
      type: String,
    },

    // 📆 Date of action
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FeePayment", FeePaymentSchema);
