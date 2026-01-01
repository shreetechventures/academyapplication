// controllers/fee.controller.js

const StudentBillingFee = require("../models/StudentBillingFee");
const StudentFee = require("../models/StudentFee");
const FeePayment = require("../models/FeePayment");
const Candidate = require("../models/Candidate");
const { recalculateStudentFee } = require("../utils/recalculateStudentFee");

/* ======================================================
   GET billing cycles for a student
====================================================== */
exports.getStudentBillingCycles = async (req, res) => {
  try {
    const { academyCode, studentId } = req.params;

    const student = await Candidate.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // 1️⃣ Get last billing
    const lastBilling = await StudentBillingFee.findOne({
      academyCode,
      studentId,
      type: "monthly",
    }).sort({ periodEnd: -1 });

    const today = new Date();

    // 2️⃣ Auto-create next month if needed
    // 2️⃣ Auto-create next month if needed
    if (lastBilling && lastBilling.periodEnd < today) {
      const nextStart = new Date(lastBilling.periodEnd);
      nextStart.setDate(nextStart.getDate() + 1);

      const year = nextStart.getFullYear();
      const month = nextStart.getMonth(); // 0-based

      // 🔐 STRONG duplicate check (month-level)
      const alreadyExists = await StudentBillingFee.findOne({
        academyCode,
        studentId,
        type: "monthly",
        periodStart: {
          $gte: new Date(year, month, 1),
          $lte: new Date(year, month + 1, 0),
        },
      });

      if (!alreadyExists) {
        const nextEnd = new Date(nextStart);
        nextEnd.setMonth(nextEnd.getMonth() + 1);
        nextEnd.setDate(nextEnd.getDate() - 1);

        await StudentBillingFee.create({
          academyCode,
          studentId,
          periodStart: nextStart,
          periodEnd: nextEnd,

          baseFee: student.currentFee,
          finalFee: student.currentFee,

          paidAmount: 0,
          discountAmount: 0,
          status: "unpaid",
          type: "monthly",
        });
      }
    }

    // 3️⃣ Return updated list
    const billings = await StudentBillingFee.find({
      academyCode,
      studentId,
    }).sort({ periodStart: 1 });

    res.json({ success: true, data: billings });
  } catch (err) {
    console.error("getStudentBillingCycles error:", err);
    res.status(500).json({ message: "Failed to load billing cycles" });
  }
};

/* ======================================================
   UPDATE billing fee amount (SET FEE)
====================================================== */
exports.updateBillingFeeAmount = async (req, res) => {
  try {
    const { billingId } = req.params;
    const { finalFee } = req.body;

    if (typeof finalFee !== "number" || finalFee < 0) {
      return res.status(400).json({ message: "Invalid fee amount" });
    }

    const billing = await StudentBillingFee.findById(billingId);
    if (!billing) {
      return res.status(404).json({ message: "Billing cycle not found" });
    }

    if (billing.paidAmount > finalFee) {
      return res.status(400).json({
        message: "Fee cannot be less than already paid amount",
      });
    }

    // 1️⃣ Update current billing
    billing.baseFee = finalFee;
    billing.discountAmount = 0; // reset discount
    billing.finalFee = finalFee;

    // 2️⃣ Update status
    billing.status =
      billing.paidAmount === 0
        ? "unpaid"
        : billing.paidAmount < billing.finalFee
        ? "partial"
        : "paid";

    // 3️⃣ Update future month default fee
    await Candidate.findByIdAndUpdate(billing.studentId, {
      currentFee: finalFee,
    });

    await billing.save();

    // 4️⃣ Recalculate student fee summary
    await recalculateStudentFee({
      academyCode: billing.academyCode,
      studentId: billing.studentId,
    });

    res.json({ success: true, data: billing });
  } catch (err) {
    console.error("updateBillingFeeAmount error:", err);
    res.status(500).json({ message: "Failed to update fee" });
  }
};

/* ======================================================
   PAY billing fee (ADMIN / TEACHER)
====================================================== */
exports.payBillingFee = async (req, res) => {
  try {
    const { billingId } = req.params;
    const { amount, mode } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid payment amount" });
    }

    if (!mode) {
      return res.status(400).json({ message: "Payment mode required" });
    }

    // 1️⃣ Billing
    const billing = await StudentBillingFee.findById(billingId);
    if (!billing) {
      return res.status(404).json({ message: "Billing not found" });
    }

    // 2️⃣ StudentFee summary
    const studentFee = await StudentFee.findOne({
      academyCode: billing.academyCode,
      studentId: billing.studentId,
    });

    if (!studentFee) {
      return res.status(404).json({ message: "Student fee summary not found" });
    }

    const remaining = billing.finalFee - billing.paidAmount;
    if (amount > remaining) {
      return res.status(400).json({ message: "Payment exceeds remaining fee" });
    }

    // 3️⃣ Payment entry
    const payment = await FeePayment.create({
      studentFeeId: studentFee._id,
      billingId,
      amount,
      mode,
      receivedBy: req.user?._id,
    });

    // 4️⃣ Update billing
    billing.paidAmount += amount;
    billing.status =
      billing.paidAmount >= billing.finalFee ? "paid" : "partial";
    await billing.save();

    // 5️⃣ Update summary
    studentFee.paidFee += amount;
    studentFee.pendingFee = Math.max(
      studentFee.totalFee - studentFee.paidFee,
      0
    );
    await studentFee.save();

    res.json({
      success: true,
      message: "Payment recorded successfully",
      data: payment,
    });
  } catch (err) {
    console.error("payBillingFee error:", err);
    res.status(500).json({ message: "Payment failed" });
  }
};

/* ======================================================
   PAYMENT HISTORY (per billing)
====================================================== */
exports.getBillingPaymentHistory = async (req, res) => {
  try {
    const { billingId } = req.params;

    const history = await FeePayment.find({ billingId }).sort({
      createdAt: -1,
    });

    res.json({ success: true, data: history });
  } catch (err) {
    console.error("getBillingPaymentHistory error:", err);
    res.status(500).json({ message: "Failed to load payment history" });
  }
};

/* ======================================================
   STUDENT FEE SUMMARY
====================================================== */
exports.getStudentFeeSummary = async (req, res) => {
  try {
    const { academyCode, studentId } = req.params;

    const summary = await StudentFee.findOne({
      academyCode,
      studentId,
    });

    res.json({ success: true, data: summary || null });
  } catch (err) {
    console.error("getStudentFeeSummary error:", err);
    res.status(500).json({ message: "Failed to load fee summary" });
  }
};

/* ======================================================
   APPLY DISCOUNT (MONTH-WISE)
====================================================== */
exports.applyDiscount = async (req, res) => {
  try {
    const { discountAmount } = req.body;
    const { billingId } = req.params;

    if (typeof discountAmount !== "number" || discountAmount < 0) {
      return res.status(400).json({ message: "Invalid discount amount" });
    }

    const billing = await StudentBillingFee.findById(billingId);
    if (!billing) {
      return res.status(404).json({ message: "Billing not found" });
    }

    // 1️⃣ Apply discount on billing
    billing.discountAmount = discountAmount;

    billing.finalFee = Math.max(
      billing.baseFee - discountAmount,
      billing.paidAmount // prevent finalFee < paid
    );

    // 2️⃣ Update status
    if (billing.paidAmount >= billing.finalFee) {
      billing.status = "paid";
    } else if (billing.paidAmount > 0) {
      billing.status = "partial";
    } else {
      billing.status = "unpaid";
    }

    await billing.save();

    // 3️⃣ Get student fee summary (optional link)
    const studentFee = await StudentFee.findOne({
      academyCode: billing.academyCode,
      studentId: billing.studentId,
    });

    // 4️⃣ Create DISCOUNT history entry (NO mode ❗)
    await FeePayment.create({
      studentFeeId: studentFee?._id,
      billingId: billing._id,
      amount: discountAmount,
      type: "discount",
      note: `Discount of ₹${discountAmount} applied`,
      receivedBy: req.user?._id,
    });

    // 5️⃣ Recalculate totals
    await recalculateStudentFee({
      academyCode: billing.academyCode,
      studentId: billing.studentId,
    });

    res.json({ success: true, data: billing });
  } catch (err) {
    console.error("applyDiscount error:", err);
    res.status(500).json({ message: "Failed to apply discount" });
  }
};



/* =====================================================
   🧾 ACADEMY FEE SUMMARY
===================================================== */
exports.getAcademyFeeSummary = async (req, res) => {
  try {
    const academyCode = req.academyCode;

    const result = await StudentBillingFee.aggregate([
      { $match: { academyCode } },
      {
        $group: {
          _id: null,
          totalFee: { $sum: "$finalFee" },
          totalPaid: { $sum: "$paidAmount" },
        },
      },
    ]);

    const summary = result[0] || { totalFee: 0, totalPaid: 0 };

    res.json({
      total: summary.totalFee,
      received: summary.totalPaid,
      pending: Math.max(summary.totalFee - summary.totalPaid, 0),
    });
  } catch (err) {
    console.error("ACADEMY FEE SUMMARY ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
