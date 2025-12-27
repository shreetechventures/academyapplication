const mongoose = require("mongoose");

const academySubscriptionSchema = new mongoose.Schema({
  academyCode: { type: String, required: true, index: true },

  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },

  gracePeriodDays: { type: Number, default: 3 },

  maxStudents: { type: Number, required: true },

  remark: { type: String },

  status: {
    type: String,
    enum: ["active", "expired", "disabled"],
    default: "active"
  },

  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model(
  "AcademySubscription",
  academySubscriptionSchema
);
