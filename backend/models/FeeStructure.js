// backend/models/FeeStructure.js
// const mongoose = require("mongoose");

// const FeeStructureSchema = new mongoose.Schema({
//   academyCode: {
//     type: String,   // academyCode ("shreenath")
//     required: true
//   },
//   className: { type: String, required: true },
//   tuitionFee: { type: Number, default: 0 },
//   examFee: { type: Number, default: 0 },
//   otherFee: { type: Number, default: 0 },
//   totalFee: { type: Number, required: true }
// }, { timestamps: true });

// module.exports = mongoose.model("FeeStructure", FeeStructureSchema);


const mongoose = require("mongoose");

const FeeStructureSchema = new mongoose.Schema({
  academyCode: {
    type: String,
    required: true
  },

  className: { type: String, required: true },

  // ✅ DIRECT MONTHLY FEE
  monthlyFee: { type: Number, required: true },

  // Optional / event-based fees
  examFee: { type: Number, default: 0 },
  otherFee: { type: Number, default: 0 }

}, { timestamps: true });

module.exports = mongoose.model("FeeStructure", FeeStructureSchema);
