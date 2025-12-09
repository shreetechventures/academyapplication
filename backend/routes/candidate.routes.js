const express = require("express");
const router = express.Router({ mergeParams: true });

const Candidate = require("../models/Candidate");
const Teacher = require("../models/Teacher");
const generateStudentCode = require("../utils/studentCodeGenerator");
const { authMiddleware, permit } = require("../middleware/auth");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// ============================================================================
// 📌 DASHBOARD COUNTS
// ============================================================================
router.get("/dashboard/students/active", authMiddleware, async (req, res) => {
  const count = await Candidate.countDocuments({
    academyCode: req.academyCode,
    status: "Active"
  });
  res.json({ count });
});

router.get("/dashboard/students/left", authMiddleware, async (req, res) => {
  const count = await Candidate.countDocuments({
    academyCode: req.academyCode,
    status: "Left"
  });
  res.json({ count });
});

router.get("/dashboard/trainers", authMiddleware, async (req, res) => {
  const count = await Teacher.countDocuments({
    academyCode: req.academyCode
  });
  res.json({ count });
});


// ============================================================================
// 📌 CREATE STUDENT
// ============================================================================
router.post("/create", authMiddleware, permit("academyAdmin", "teacher"), async (req, res) => {
  try {
    const academyCode = req.academyCode;

    const studentCode = await generateStudentCode(academyCode);

    const age =
      new Date().getFullYear() -
      new Date(req.body.dateOfBirth).getFullYear();

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const candidate = new Candidate({
      ...req.body,
      password: hashedPassword,
      select: false,
      academyCode,
      studentCode,
      age
    });

    await candidate.save();
    res.json(candidate);

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});


// ============================================================================
// 📌 GET ALL ACTIVE STUDENTS
// ============================================================================
router.get("/", authMiddleware, permit("academyAdmin", "teacher"), async (req, res) => {
  try {
    const students = await Candidate.find({
      academyCode: req.academyCode,
      status: "Active"
    });

    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ============================================================================
// 📌 DELETE STUDENT
// ============================================================================
router.delete("/:id", authMiddleware, permit("academyAdmin", "teacher"), async (req, res) => {
  try {
    await Candidate.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ============================================================================
// 📌 UPDATE STUDENT
// ============================================================================
router.put("/:id", authMiddleware, permit("academyAdmin", "teacher"), async (req, res) => {
  const updated = await Candidate.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});


// ============================================================================
// 📌 GET ONE STUDENT
// ============================================================================
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const student = await Candidate.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(student);
  } catch (err) {
    return res.status(400).json({ message: "Invalid student ID" });
  }
});


// ============================================================================
// 📌 MARK STUDENT AS LEFT
// ============================================================================
router.put("/:id/leave", authMiddleware, permit("academyAdmin", "teacher"), async (req, res) => {
  try {
    const student = await Candidate.findByIdAndUpdate(
      req.params.id,
      { status: "Left" },
      { new: true }
    );

    res.json({ message: "Student marked as Left", student });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ============================================================================
// 📌 GET ALL LEFT STUDENTS
// ============================================================================
router.get("/left/all", authMiddleware, permit("academyAdmin", "teacher"), async (req, res) => {
  try {
    const students = await Candidate.find({
      academyCode: req.academyCode,
      status: "Left"
    });

    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ============================================================================
// 📌 STUDENT LOGIN  (IMPORTANT)
// ============================================================================
router.post("/login", async (req, res) => {
  try {
    const academyCode = req.academyCode;
    const { email, password } = req.body;

    const student = await Candidate.findOne({ academyCode, email });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const match = await bcrypt.compare(password, student.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: student._id, role: "student", academyCode },
      process.env.JWT_SECRET,
      { expiresIn: "7h" }
    );

    res.json({
      token,
      role: "student",
      name: student.name,
      userId: student._id.toString(),
      academyCode
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// ============================================================================
// 📌 STUDENT CHANGE PASSWORD
// ============================================================================
router.put("/change-password", authMiddleware, async (req, res) => {
  try {
    const student = await Candidate.findById(req.user.id);

    if (!student) return res.status(404).json({ message: "Student not found" });

    const match = await bcrypt.compare(req.body.currentPassword, student.password);
    if (!match) return res.status(400).json({ message: "Incorrect current password" });

    student.password = await bcrypt.hash(req.body.newPassword, 10);
    await student.save();

    res.json({ message: "Password updated" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
