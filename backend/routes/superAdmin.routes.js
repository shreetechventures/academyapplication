const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();

const User = require("../models/User");
const Academy = require("../models/Academy");
const { authMiddleware } = require("../middleware/auth");

/**
 * ============================================================================
 * ✅ SUPERADMIN → CREATE ACADEMY
 * POST /api/superadmin/create-academy
 * ============================================================================
 */
router.post("/create-academy", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "superadmin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { name, code, address } = req.body;

    if (!name || !code) {
      return res.status(400).json({ message: "Name and code required" });
    }

    const existing = await Academy.findOne({ code });
    if (existing) {
      return res.status(400).json({ message: "Academy code already exists" });
    }

    const academy = new Academy({
      name,
      code,
      address
    });

    await academy.save();

    res.json({
      message: "Academy created successfully",
      academy
    });
  } catch (err) {
    console.error("CREATE ACADEMY ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * ============================================================================
 * ✅ SUPERADMIN → LIST ALL ADMINS
 * GET /api/superadmin/admins
 * ============================================================================
 */
router.get("/admins", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "superadmin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const admins = await User.find({ role: "academyAdmin" })
      .select("-passwordHash")
      .sort({ createdAt: -1 });

    res.json(admins);
  } catch (err) {
    console.error("LIST ADMINS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * ============================================================================
 * ✅ SUPERADMIN → UPDATE ADMIN
 * PUT /api/superadmin/admin/:id
 * ============================================================================
 */
router.put("/admin/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "superadmin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { name, email, password } = req.body;

    const admin = await User.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    if (name) admin.name = name;
    if (email) admin.email = email.toLowerCase();
    if (password) {
      admin.passwordHash = await bcrypt.hash(password, 10);
    }

    await admin.save();

    res.json({ message: "Admin updated successfully" });
  } catch (err) {
    console.error("UPDATE ADMIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * ============================================================================
 * ✅ SUPERADMIN → DELETE ADMIN
 * DELETE /api/superadmin/admin/:id
 * ============================================================================
 */
router.delete("/admin/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "superadmin") {
      return res.status(403).json({ message: "Access denied" });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: "Admin removed successfully" });
  } catch (err) {
    console.error("DELETE ADMIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// ============================================================================
// ✅ SUPERADMIN → LIST ACADEMIES
// GET /api/superadmin/academies
// ============================================================================
router.get("/academies", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "superadmin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const academies = await Academy.find().sort({ createdAt: -1 });
    res.json(academies);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});



// ============================================================================
// ✅ SUPERADMIN → UPDATE ACADEMY
// PUT /api/superadmin/academy/:id
// ============================================================================
router.put("/academy/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "superadmin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { name, address } = req.body;

    const academy = await Academy.findById(req.params.id);
    if (!academy) {
      return res.status(404).json({ message: "Academy not found" });
    }

    if (name) academy.name = name;
    if (address) academy.address = address;

    await academy.save();
    res.json({ message: "Academy updated", academy });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// ============================================================================
// ✅ SUPERADMIN → DELETE ACADEMY
// DELETE /api/superadmin/academy/:id
// ============================================================================
router.delete("/academy/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "superadmin") {
      return res.status(403).json({ message: "Access denied" });
    }

    await Academy.findByIdAndDelete(req.params.id);
    res.json({ message: "Academy deleted" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


/**
 * ============================================================================
 * ✅ SUPERADMIN → CREATE ADMIN
 * POST /api/superadmin/create-admin
 * ============================================================================
 */
router.post("/create-admin", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "superadmin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { name, email, password, academyCode } = req.body;

    if (!name || !email || !password || !academyCode) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const academy = await Academy.findOne({ code: academyCode });
    if (!academy) {
      return res.status(404).json({ message: "Academy not found" });
    }

    const existing = await User.findOne({ email, academyCode });
    if (existing) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new User({
      name,
      email: email.toLowerCase(),
      passwordHash: hashedPassword,
      role: "academyAdmin",
      academyCode
    });

    await admin.save();

    res.json({
      message: "✅ Admin created successfully",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        academyCode
      }
    });

  } catch (err) {
    console.error("CREATE ADMIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
