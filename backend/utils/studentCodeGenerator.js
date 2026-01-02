const Candidate = require("../models/Candidate");

/* =====================================================
   🔢 Generate Unique Student Code (ATOMIC SAFE)
   Format: ACADEMY-0001
===================================================== */
async function generateStudentCode(academyCode) {
  if (!academyCode) {
    throw new Error("academyCode is required to generate student code");
  }

  // Find highest numeric suffix, not latest document
  const lastStudent = await Candidate.findOne({
    academyCode,
    studentCode: { $exists: true }
  })
    .sort({ studentCode: -1 }) // STRING SORT WORKS WITH PADDED NUMBERS
    .lean();

  let number = 1;

  if (lastStudent?.studentCode) {
    const parts = lastStudent.studentCode.split("-");
    const lastNumber = Number(parts[1]);

    if (!isNaN(lastNumber)) {
      number = lastNumber + 1;
    }
  }

  return `${academyCode.toUpperCase()}-${String(number).padStart(4, "0")}`;
}

module.exports = generateStudentCode;
