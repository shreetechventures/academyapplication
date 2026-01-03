const express = require("express");
const router = express.Router({ mergeParams: true });

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { authMiddleware } = require("../middleware/auth");

const User = require("../models/User");       // Academy Admin
const Teacher = require("../models/Teacher"); // Teacher
const Candidate = require("../models/Candidate"); // Student
const Academy = require("../models/Academy");

/* =====================================================
   🔐 HELPER → SEND TOKEN
===================================================== */
function sendToken(user, role, academyCode, res) {
  const token = jwt.sign(
    {
      id: user._id,
      role,
      academyCode,
    },
    process.env.JWT_SECRET,
    { expiresIn: "8h" }
  );

  return res.json({
    token,
    role,
    name: user.name,
    userId: user._id.toString(),
    academyCode,
  });
}

/* =====================================================
   🔐 SUPERADMIN LOGIN (ENV BASED – NO DB)
   POST /api/auth/superadmin/login
===================================================== */
router.post("/superadmin/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email !== process.env.SUPERADMIN_EMAIL ||
      password !== process.env.SUPERADMIN_PASSWORD
    ) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { role: "superadmin" },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );

    return res.json({
      token,
      role: "superadmin",
      name: "Super Admin",
      userId: "superadmin",
    });
  } catch (err) {
    console.error("SUPERADMIN LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =====================================================
   🔐 ACADEMY USERS LOGIN
   POST /api/auth/login
===================================================== */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const academyCode = req.academyCode;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // 1️⃣ Validate academy
    const academy = await Academy.findOne({ code: academyCode });
    if (!academy) {
      return res.status(400).json({ message: "Academy not found" });
    }

    // 2️⃣ Academy Admin
    const admin = await User.findOne({
      email: email.toLowerCase(),
      academyCode,
    }).select("+passwordHash");

    if (admin) {
      const ok = await bcrypt.compare(password, admin.passwordHash);
      if (!ok) return res.status(401).json({ message: "Invalid password" });

      return sendToken(admin, "academyAdmin", academyCode, res);
    }

    // 3️⃣ Teacher
    const teacher = await Teacher.findOne({
      email: email.toLowerCase(),
      academyCode,
    }).select("+password");

    if (teacher) {
      const ok = await bcrypt.compare(password, teacher.password);
      if (!ok) return res.status(401).json({ message: "Invalid password" });

      return sendToken(teacher, "teacher", academyCode, res);
    }

    // 4️⃣ Student
    const student = await Candidate.findOne({
      email: email.toLowerCase(),
      academyCode,
    }).select("+password");

    if (student) {
      const ok = await bcrypt.compare(password, student.password);
      if (!ok) return res.status(401).json({ message: "Invalid password" });

      return sendToken(student, "student", academyCode, res);
    }

    return res.status(404).json({ message: "User not found" });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =====================================================
   🔐 CHANGE PASSWORD (ADMIN / TEACHER / STUDENT)
===================================================== */
router.put("/change-password", authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    let model;
    if (req.user.role === "academyAdmin") model = User;
    if (req.user.role === "teacher") model = Teacher;
    if (req.user.role === "student") model = Candidate;

    if (!model) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await model.findById(req.user.id).select("+password +passwordHash");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const valid = await bcrypt.compare(
      currentPassword,
      user.password || user.passwordHash
    );

    if (!valid) {
      return res.status(400).json({ message: "Incorrect current password" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    if (user.passwordHash) user.passwordHash = hashed;
    else user.password = hashed;

    await user.save();
    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("CHANGE PASSWORD ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
