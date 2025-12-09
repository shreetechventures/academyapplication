const mongoose = require("mongoose");
const Candidate = require("./models/Candidate");

mongoose.connect("mongodb://127.0.0.1:27017/academydb");

async function createStudent() {

  const student = new Candidate({
    academyCode: "shreenath",   // ✅ REQUIRED

    studentCode: "SHREE-0001",
    name: "Raj Patil",

    gender: "Male",
    height: 168,                // ✅ NUMBER
    weight: 58,                  // ✅ NUMBER

    email: "raj@gmail.com",
    contactNumber: "9876543210", // ✅ correct field name

    dateOfBirth: new Date("2003-05-12"),   // ✅ correct format
    admissionDate: new Date("2024-06-01"),

    address: "Satara, Maharashtra",
    emergencyContac1: "9988776655",
    fatherContact: "8899001122",

    practiceFor: "Army",

  });

  await student.save();
  console.log("✅ Candidate Created Successfully!");
  process.exit();
}

createStudent();
