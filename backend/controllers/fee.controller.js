// backend/controllers/fee.controller.js
const StudentFee = require("../models/StudentFee");
const FeePayment = require("../models/FeePayment");
const Candidate = require("../models/Candidate"); // optional for populate


exports.createFeeStructure = async (req, res) => {
  try {
    const fee = await FeeStructure.create({
      ...req.body,
      academyCode: req.params.academyCode
    });
    res.status(201).json(fee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getFeeStructures = async (req, res) => {
  try {
    const fees = await FeeStructure.find({
      academyCode: req.params.academyCode
    });
    res.json(fees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// DELETE FEE
exports.deleteFeeStructure = async (req, res) => {
  try {
    await FeeStructure.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Assign / create fee for a student (admin)
exports.assignFee = async (req, res) => {
  try {
    const { studentId, totalFee } = req.body;

    if (!studentId || typeof totalFee !== "number") {
      return res.status(400).json({ message: "studentId and totalFee (number) are required" });
    }

    // If already exists, return it (or you may want to update existing — change as needed)
    let existing = await StudentFee.findOne({ studentId, academyCode: req.params.academyCode
 });
    if (existing) {
      return res.status(409).json({ message: "Student fee record already exists", data: existing });
    }

    const fee = await StudentFee.create({
      academyCode: req.params.academyCode,
      studentId,
      totalFee,
      paidFee: 0,
      pendingFee: totalFee
    });

    res.status(201).json({ success: true, data: fee });
  } catch (err) {
    console.error("assignFee error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Get student fee (single) — student or teacher can call depending on permit
exports.getStudentFee = async (req, res) => {
  try {
    const fee = await StudentFee.findOne({
      studentId: req.params.studentId,
      academyCode: req.params.academyCode

    }).populate("studentId", "name phone className");

    if (!fee) return res.status(404).json({ message: "Fee record not found" });

    res.json({ success: true, data: fee });
  } catch (err) {
    console.error("getStudentFee error:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.payFee = async (req, res) => {
  try {
    const { studentId, amount, mode } = req.body;

    if (!studentId || typeof amount !== "number" || !mode) {
      return res.status(400).json({ message: "studentId, amount and mode are required" });
    }

    const fee = await StudentFee.findOne({
      studentId,
academyCode: req.params.academyCode
    });

    if (!fee) return res.status(404).json({ message: "Student fee record not found" });

    const now = new Date();
    const monthName = now.toLocaleString("en-US", { month: "long", year: "numeric" });

    const payment = await FeePayment.create({
      studentFeeId: fee._id,
      amount,
      mode,
      month: monthName
    });

    // update totals
    fee.paidFee += amount;
    fee.pendingFee = Math.max(0, fee.totalFee - fee.paidFee);

    await fee.save();

    res.json({ success: true, data: { fee, payment } });
  } catch (err) {
    console.error("payFee error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Admin/Teacher view - list all student fees for academy
exports.getAllStudentsFee = async (req, res) => {
  try {
    const fees = await StudentFee.find({ academyCode: req.params.academyCode
 })
      .populate("studentId", "name phone className")
      .sort({ pendingFee: -1 });

    res.json({ success: true, data: fees });
  } catch (err) {
    console.error("getAllStudentsFee error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Payment history for a StudentFee record
exports.getPaymentHistory = async (req, res) => {
  try {
    const history = await FeePayment.find({
      studentFeeId: req.params.studentFeeId
    }).sort({ date: -1 });

    res.json({ success: true, data: history });
  } catch (err) {
    console.error("getPaymentHistory error:", err);
    res.status(500).json({ message: err.message });
  }
};


exports.updateStudentFee = async (req, res) => {
  try {
    const fee = await StudentFee.findOne({
      _id: req.params.studentFeeId,
      academyCode: req.params.academyCode
    });

    fee.totalFee = req.body.totalFee;
    fee.pendingFee = Math.max(0, fee.totalFee - fee.paidFee);

    await fee.save();
    res.json({ success: true, data: fee });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




// Add: Admin/Teacher records payment for student (already exists similar to your payFee) — ensure it responds with updated fee + payment
exports.recordPaymentForStudent = async (req, res) => {
  try {
    const { studentFeeId } = req.params; // prefer studentFeeId in URL
    const { amount, mode, month } = req.body;

    if (typeof amount !== "number" || amount <= 0) {
      return res.status(400).json({ message: "amount must be positive number" });
    }

    const fee = await StudentFee.findOne({
      _id: studentFeeId,
      academyCode: req.params.academyCode
    });

    if (!fee) return res.status(404).json({ message: "Student fee record not found" });

    const payment = await FeePayment.create({
      studentFeeId: fee._id,
      amount,
      mode,
      month: month || "",
      receivedBy: req.user?._id || null
    });

    fee.paidFee += amount;
    fee.pendingFee = Math.max(0, fee.totalFee - fee.paidFee);
    await fee.save();

    res.json({ success: true, data: { fee, payment } });
  } catch (err) {
    console.error("recordPaymentForStudent error:", err);
    res.status(500).json({ message: err.message });
  }
};