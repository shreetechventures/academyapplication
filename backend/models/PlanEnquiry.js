const mongoose = require("mongoose");

const PlanEnquirySchema = new mongoose.Schema(
  {
    academyName: {
      type: String,
      required: true,
      trim: true,
    },

    adminName: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
    },

    city: {
      type: String,
      required: true,
    },

    plan: {
      type: String,
      enum: ["BASIC", "STANDARD", "PREMIUM"],
      required: true,
    },

    message: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["NEW", "CONTACTED", "CONVERTED"],
      default: "NEW",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PlanEnquiry", PlanEnquirySchema);
