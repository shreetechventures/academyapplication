const StudentBillingFee = require("../models/StudentBillingFee");
const { recalculateStudentFee } = require("./recalculateStudentFee");

function getPeriodEnd(startDate) {
  const end = new Date(startDate);
  end.setMonth(end.getMonth() + 1);
  end.setDate(end.getDate() - 1);
  return end;
}

async function generateNextBillingCycle(student) {
  if (!student || student.status === "Left") return;

  const academyCode = student.academyCode;

  const lastCycle = await StudentBillingFee.findOne({
    academyCode,
    studentId: student._id,
    type: "monthly",
  }).sort({ periodEnd: -1 });

  let periodStart;

  if (!lastCycle) {
    if (!student.admissionDate) return;
    periodStart = new Date(student.admissionDate);
  } else {
    periodStart = new Date(lastCycle.periodEnd);
    periodStart.setDate(periodStart.getDate() + 1);
  }

  const today = new Date();
  if (periodStart > today) return;

  const periodEnd = getPeriodEnd(periodStart);

  await StudentBillingFee.create({
  academyCode,
  studentId: student._id,
  periodStart,
  periodEnd,

  // ✅ FUTURE MONTH FEE
  baseFee: student.currentFee || 0,
  discountAmount: 0,
  finalFee: student.currentFee || 0,

  paidAmount: 0,
  status: "unpaid",
  type: "monthly",
});

}

module.exports = { generateNextBillingCycle };
