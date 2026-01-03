const express = require("express");
const router = express.Router({ mergeParams: true });

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { authMiddleware } = require("../middleware/auth");

const User = require("../models/User"); // Academy Admin
const Teacher = require("../models/Teacher"); // Teacher
const Candidate = require("../models/Candidate"); // Student
const Academy = require("../models/Academy");

function resolveAcademyCode(req) {
  const subdomains = req.subdomains || [];

  // www.shreenath.careeracademy.cloud
  if (subdomains[0] === "www") {
    return subdomains[1];
  }

  return subdomains[0];
}

// ============================================================================
// 🔐 Helper → Send Login Token
// ============================================================================
function sendToken(user, role, academyCode, res) {
  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
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

// ============================================================================
// 🔐 CHANGE PASSWORD (Admin + Teacher + Student)
// ============================================================================
router.put("/change-password", authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Identify model by user role
    let model = null;
    if (req.user.role === "academyAdmin") model = User;
    if (req.user.role === "teacher") model = Teacher;
    if (req.user.role === "student") model = Candidate;

    if (!model) return res.status(400).json({ message: "Invalid role" });

    const user = await model.findById(req.user.id).select("+password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const valid = await bcrypt.compare(
      currentPassword,
      user.password || user.passwordHash
    );
    if (!valid)
      return res.status(400).json({ message: "Incorrect current password" });

    // Hash new password
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

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
const academyCode = req.academyCode || resolveAcademyCode(req);

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // 0️⃣ Super Admin Login
    if (
      email === process.env.SUPERADMIN_EMAIL &&
      password === process.env.SUPERADMIN_PASSWORD
    ) {
      const token = jwt.sign(
        { email, role: "superadmin" },
        process.env.JWT_SECRET,
        { expiresIn: "8h" }
      );

      return res.json({
        token,
        role: "superadmin",
        name: "SuperAdmin",
        userId: "superadmin"
      });
    }

    // 1️⃣ Check academy exists
    const academy = await Academy.findOne({ code: academyCode });
    if (!academy)
      return res.status(400).json({ message: "Academy not found" });

    // 2️⃣ Academy Admin Login
    let user = await User.findOne({
      email: email.toLowerCase(),
      academyCode
    }).select("+passwordHash");

    if (user) {
      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) return res.status(401).json({ message: "Invalid password" });

      return sendToken(user, "academyAdmin", academyCode, res);
    }

    // 3️⃣ Teacher Login
    let teacherUser = await Teacher
      .findOne({ email: email.toLowerCase(), academyCode })
      .select("+password");

    if (teacherUser) {
      const valid = await bcrypt.compare(password, teacherUser.password);
      if (!valid) return res.status(401).json({ message: "Invalid password" });

      return sendToken(teacherUser, "teacher", academyCode, res);
    }

    // 4️⃣ Student Login (Candidate)
    let student = await Candidate
      .findOne({ email: email.toLowerCase(), academyCode })
      .select("+password");

    if (student) {
      const valid = await bcrypt.compare(password, student.password);
      if (!valid) return res.status(401).json({ message: "Invalid password" });

      return sendToken(student, "student", academyCode, res);
    }

    // 5️⃣ No user found
    return res.status(404).json({ message: "User not found" });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
