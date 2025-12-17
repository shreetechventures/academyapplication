const mongoose = require("mongoose");

const TeacherSchema = new mongoose.Schema({
  academyCode: { type: String, required: true },

  name: { type: String, required: true },
  address: { type: String },
  height: { type: String },
  weight: { type: String },
  contactNumber: { type: String, required: true },
  dateOfBirth: { type: String },
  age: { type: Number },

  emergencyContact1: { type: String },
  emergencyContact2: { type: String },
  fatherContact: { type: String },

  joiningDate: { type: String },
  email: { type: String, required: true, unique: true },

  experience: { type: String },

  // NEW FIELD
  designation: { type: String, required: true },

  password: { type: String, required: true , select: false }, 

  status: { type: String, default: "Active" }
});

module.exports = mongoose.model("Teacher", TeacherSchema);
