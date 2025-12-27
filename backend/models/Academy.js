// // backend/models/Academy.js

// const mongoose = require("mongoose");

// const academySchema = new mongoose.Schema({
//   code: { type: String, required: true, index: true }, // e.g. shreenath
//   name: { type: String, required: true },
//   isActive: { type: Boolean, default: true }, // 🔑 REQUIRED

//   branding: {
//     logoUrl: String,
//     primaryColor: String,
//   },
//   createdAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model("Academy", academySchema);

// backend/models/Academy.js

const mongoose = require("mongoose");

const academySchema = new mongoose.Schema({
  code: { type: String, required: true, index: true },
  name: { type: String, required: true },
  isActive: { type: Boolean, default: true },

  branding: {
    logoUrl: String,
    primaryColor: String,
  },

  // 🔥 NEW
  settings: {
    allowTrainerFeeManagement: {
      type: Boolean,
      default: false, // 🔐 OFF by default
    },
    allowTrainerStudentRegistration: {
      type: Boolean,
      default: false,
    },
  },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Academy", academySchema);
