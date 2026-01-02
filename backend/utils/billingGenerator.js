const StudentBillingFee = require("../models/StudentBillingFee");
const { recalculateStudentFee } = require("./recalculateStudentFee");

/* =====================================================
   🗓️ Get month end date safely
===================================================== */
function getPeriodEnd(startDate) {
  const end = new Date(startDate);
  end.setMonth(end.getMonth() + 1);
  end.setDate(end.getDate() - 1);
  end.setHours(23, 59, 59, 999);
  return end;
}

/* =====================================================
   🔁 Generate next billing cycle (MONTH SAFE)
===================================================== */
async function generateNextBillingCycle(student) {
  if (!student || student.status === "Left") return;

  const academyCode = student.academyCode;

  /* ----------------------------------
     1️⃣ Find last billing
  ---------------------------------- */
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

  // Normalize time
  periodStart.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (periodStart > today) return;

  const year = periodStart.getFullYear();
  const month = periodStart.getMonth();

  /* ----------------------------------
     2️⃣ STRONG duplicate protection
  ---------------------------------- */
  const alreadyExists = await StudentBillingFee.findOne({
    academyCode,
    studentId: student._id,
    type: "monthly",
    periodStart: {
      $gte: new Date(year, month, 1),
      $lte: new Date(year, month + 1, 0),
    },
  });

  if (alreadyExists) return;

  /* ----------------------------------
     3️⃣ Create billing
  ---------------------------------- */
  const periodEnd = getPeriodEnd(periodStart);

  const billing = await StudentBillingFee.create({
    academyCode,
    studentId: student._id,
    periodStart,
    periodEnd,

    baseFee: student.currentFee || 0,
    discountAmount: 0,
    finalFee: student.currentFee || 0,

    paidAmount: 0,
    status: "unpaid",
    type: "monthly",
  });

  /* ----------------------------------
     4️⃣ Sync summary (CRITICAL)
  ---------------------------------- */
  await recalculateStudentFee({
    academyCode,
    studentId: student._id,
  });

  return billing;
}

module.exports = { generateNextBillingCycle };
