const StudentBillingFee = require("../models/StudentBillingFee");
const StudentFee = require("../models/StudentFee");
const FeePayment = require("../models/FeePayment");
const Candidate = require("../models/Candidate");
const { recalculateStudentFee } = require("../utils/recalculateStudentFee");

/* ======================================================
   GET billing cycles for a student (ADMIN / TEACHER)
====================================================== */
exports.getStudentBillingCycles = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await Candidate.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // ✅ TRUST student record
    const academyCode = student.academyCode;

    const billings = await StudentBillingFee.find({
      academyCode,
      studentId,
    }).sort({ periodStart: 1 });

    return res.json({
      success: true,
      data: billings,
    });
  } catch (err) {
    console.error("getStudentBillingCycles error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to load billing cycles",
    });
  }
};

/* ======================================================
   UPDATE billing fee amount
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

    billing.baseFee = finalFee;
    billing.discountAmount = 0;
    billing.finalFee = finalFee;

    billing.status =
      billing.paidAmount === 0
        ? "unpaid"
        : billing.paidAmount < billing.finalFee
        ? "partial"
        : "paid";

    await Candidate.findByIdAndUpdate(billing.studentId, {
      currentFee: finalFee,
    });

    await billing.save();

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
   PAY billing fee
====================================================== */
exports.payBillingFee = async (req, res) => {
  try {
    const { billingId } = req.params;
    const { amount, mode } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid payment amount" });
    }

    const billing = await StudentBillingFee.findById(billingId);
    if (!billing) {
      return res.status(404).json({ message: "Billing not found" });
    }

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

    const payment = await FeePayment.create({
      studentFeeId: studentFee._id,
      billingId,
      amount,
      mode,
      receivedBy: req.user?._id,
    });

    billing.paidAmount += amount;
    billing.status =
      billing.paidAmount >= billing.finalFee ? "paid" : "partial";
    await billing.save();

    studentFee.paidFee += amount;
    studentFee.pendingFee = Math.max(
      studentFee.totalFee - studentFee.paidFee,
      0
    );
    await studentFee.save();

    res.json({ success: true, data: payment });
  } catch (err) {
    console.error("payBillingFee error:", err);
    res.status(500).json({ message: "Payment failed" });
  }
};

/* ======================================================
   PAYMENT HISTORY
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
    const { studentId } = req.params;
    const academyCode = req.academyCode;

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
   APPLY DISCOUNT
====================================================== */
exports.applyDiscount = async (req, res) => {
  try {
    const { billingId } = req.params;
    const { discountAmount } = req.body;

    if (typeof discountAmount !== "number" || discountAmount < 0) {
      return res.status(400).json({ message: "Invalid discount amount" });
    }

    const billing = await StudentBillingFee.findById(billingId);
    if (!billing) {
      return res.status(404).json({ message: "Billing not found" });
    }

    billing.discountAmount = discountAmount;
    billing.finalFee = Math.max(
      billing.baseFee - discountAmount,
      billing.paidAmount
    );

    billing.status =
      billing.paidAmount >= billing.finalFee
        ? "paid"
        : billing.paidAmount > 0
        ? "partial"
        : "unpaid";

    await billing.save();

    await FeePayment.create({
      studentFeeId: null,
      billingId,
      amount: discountAmount,
      type: "discount",
      note: `Discount of ₹${discountAmount} applied`,
      receivedBy: req.user?._id,
    });

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

/* ======================================================
   🧾 ACADEMY FEE SUMMARY (ADMIN / TEACHER)
====================================================== */
exports.getAcademyFeeSummary = async (req, res) => {
  try {
    const academyCode = req.academyCode;

    const result = await StudentFee.aggregate([
      { $match: { academyCode } },
      {
        $group: {
          _id: null,
          totalFee: { $sum: "$totalFee" },
          paidFee: { $sum: "$paidFee" },
          pendingFee: { $sum: "$pendingFee" },
          students: { $sum: 1 },
        },
      },
    ]);

    const summary =
      result.length > 0
        ? result[0]
        : {
            totalFee: 0,
            paidFee: 0,
            pendingFee: 0,
            students: 0,
          };

    res.json({ success: true, data: summary });
  } catch (err) {
    console.error("getAcademyFeeSummary error:", err);
    res.status(500).json({ message: "Failed to load academy summary" });
  }
};
