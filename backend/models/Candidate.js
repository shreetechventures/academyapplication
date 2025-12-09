const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema({
  academyCode: { type: String, required: true },

  studentCode: { type: String, unique: true },

  name: { type: String, required: true },
  address: String,
  gender: { type: String, enum: ["Male", "Female", "Other"] },
  height: Number,
  weight: Number,

  contactNumber: { type: String, required: true },
  fatherContact: String,
  emergencyContact1: String,
  emergencyContact2: String,

  dateOfBirth: { type: Date, required: true },
  age: Number,
  admissionDate: Date,

  email: String,

  // practiceFor: {
  //   type: String,
  //   enum: ["Police", "Army", "Navy", "Airforce", "Talathi", "Saral Seva", "Staff Selection"]
  // },

  practiceFor: {
  type: [String],
  required: true
},


  status: {
  type: String,
  enum: ["Active", "Left"],
  default: "Active"
},

password: { type: String, required: true }


}, { timestamps: true });

// module.exports = mongoose.model("Candidate", candidateSchema);
module.exports =
  mongoose.models.Candidate || mongoose.model("Candidate", candidateSchema);

