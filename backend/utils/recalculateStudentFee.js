const StudentBillingFee = require("../models/StudentBillingFee");
const StudentFee = require("../models/StudentFee");


async function recalculateStudentFee({ academyCode, studentId }) {
  // 1️⃣ Get all billing entries
  const billings = await StudentBillingFee.find({
    academyCode,
    studentId
  });

  let totalFee = 0;
  let paidFee = 0;

  for (const bill of billings) {
    totalFee += bill.finalFee || 0;
    paidFee += bill.paidAmount || 0;
  }

  const pendingFee = Math.max(totalFee - paidFee, 0);

  // 2️⃣ Upsert StudentFee summary
  const studentFee = await StudentFee.findOneAndUpdate(
    { academyCode, studentId },
    { totalFee, paidFee, pendingFee },
    { upsert: true, new: true }
  );

  return studentFee;
}

module.exports = { recalculateStudentFee };
