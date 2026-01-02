const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Academy = require("../models/Academy");
const User = require("../models/User");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    /* =========================
       1️⃣ USER CHECK (UNCHANGED)
    ========================= */
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    /* =========================
       2️⃣ ACADEMY STATUS CHECK (UNCHANGED)
    ========================= */
    const academy = await Academy.findOne({ code: user.academyCode });
    if (!academy || !academy.isActive) {
      return res.status(403).json({
        message: "Academy is disabled. Contact super admin.",
      });
    }

    /* =========================
       3️⃣ PASSWORD CHECK (UNCHANGED)
    ========================= */
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    /* =========================
       4️⃣ TOKEN GENERATION (REQUIRED)
       ⚠️ NO LOGIC CHANGE — only completion
    ========================= */
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
        academyCode: user.academyCode,
      },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    /* =========================
       5️⃣ RESPONSE (REQUIRED)
    ========================= */
    return res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        academyCode: user.academyCode,
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
