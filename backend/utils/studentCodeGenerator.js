// backend/utils/studentCodeGenerator.js
const Candidate = require("../models/Candidate");

async function generateStudentCode(academyCode) {
  const lastStudent = await Candidate.findOne({ academyCode })
    .sort({ createdAt: -1 });

  let number = 1;
  if (lastStudent?.studentCode) {
    number = parseInt(lastStudent.studentCode.split("-")[1]) + 1;
  }

  return `${academyCode.toUpperCase()}-${String(number).padStart(4, "0")}`;
}

module.exports = generateStudentCode;
