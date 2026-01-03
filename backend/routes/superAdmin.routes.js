const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();

const User = require("../models/User");
const Academy = require("../models/Academy");
const AcademySubscription = require("../models/AcademySubscription");
const SubscriptionPayment = require("../models/SubscriptionPayment");
const { authMiddleware, permit } = require("../middleware/auth");

/**
 * ============================================================================
 * ✅ SUPERADMIN → CREATE ACADEMY
 * POST /api/superadmin/create-academy
 * ============================================================================
 */


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
      {
        id: "superadmin",
        role: "superadmin",
      },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );

    res.json({
      token,
      role: "superadmin",
      name: "Super Admin",
    });
  } catch (err) {
    console.error("SUPERADMIN LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// MARK SUBSCRIPTION PAID
router.post(
  "/subscription/mark-paid",
  authMiddleware,
  permit("superadmin"),
  async (req, res) => {
    const { academyCode, durationMonths, maxStudents, remark } = req.body;

    if (!academyCode || !durationMonths || !maxStudents) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + Number(durationMonths));

    let subscription = await AcademySubscription.findOne({ academyCode });

    if (!subscription) {
      subscription = new AcademySubscription({
        academyCode,
        startDate,
        endDate,
        maxStudents,
        remark, // ✅ SAVE REMARK

        status: "active",
      });
    } else {
      subscription.startDate = startDate;
      subscription.endDate = endDate;
      if (maxStudents) subscription.maxStudents = maxStudents;
      subscription.remark = remark; // ✅ SAVE REMARK

      subscription.status = "active";
    }

    await subscription.save();

    await Academy.updateOne({ code: academyCode }, { isActive: true });

    await SubscriptionPayment.create({
      academyCode,
      durationMonths,
      markedBy: req.user.id,
      remark,
      paidOn: new Date(), // explicit
    });

    res.json({ message: "Subscription activated successfully" });
  }
);

router.post("/create-academy", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "superadmin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { name, code, address, durationMonths, maxStudents, remark } =
      req.body;

    if (!name || !code) {
      return res.status(400).json({ message: "Name and code required" });
    }

    const existing = await Academy.findOne({ code });
    if (existing) {
      return res.status(400).json({ message: "Academy code already exists" });
    }

    // 1️⃣ Create academy
    const academy = new Academy({
      name,
      code,
      address,
      isActive: true,
    });
    await academy.save();

    // 2️⃣ Create subscription (NO PAYMENT HERE)
    if (durationMonths && maxStudents) {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + Number(durationMonths));

      await AcademySubscription.create({
        academyCode: code,
        startDate,
        endDate,
        maxStudents,
        remark,
        status: "active",
      });
    }

    res.json({
      message: "✅ Academy created successfully",
      academy,
    });
  } catch (err) {
    console.error("CREATE ACADEMY ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ HISTORY ROUTE (FIRST)
router.get(
  "/subscription/:academyCode/history",
  authMiddleware,
  permit("superadmin"),
  async (req, res) => {
    const history = await SubscriptionPayment.find({
      academyCode: req.params.academyCode,
    }).sort({ createdAt: -1 });

    res.json(history);
  }
);

// ✅ SUBSCRIPTION ROUTE (SECOND)
router.get(
  "/subscription/:academyCode",
  authMiddleware,
  permit("superadmin"),
  async (req, res) => {
    const sub = await AcademySubscription.findOne({
      academyCode: req.params.academyCode,
    });

    res.json(sub || null);
  }
);

// ENABLE / DISABLE ACADEMY
router.put(
  "/academy/:id/toggle",
  authMiddleware,
  permit("superadmin"),
  async (req, res) => {
    const academy = await Academy.findById(req.params.id);
    if (!academy) return res.status(404).json({ message: "Not found" });

    academy.isActive = !academy.isActive;
    await academy.save();

    res.json({
      message: academy.isActive ? "Academy enabled" : "Academy disabled",
      isActive: academy.isActive,
    });
  }
);

// ✅ GET TOTAL REGISTERED ACADEMIES
router.get(
  "/academies/count",
  authMiddleware,
  permit("superadmin"),
  async (req, res) => {
    try {
      const count = await Academy.countDocuments();
      res.json({ count });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

/**
 * ============================================================================
 * ✅ SUPERADMIN → LIST ALL ADMINS
 * GET /api/superadmin/admins
 * ============================================================================
 */
router.get("/admins", authMiddleware,   permit("superadmin"),
async (req, res) => {
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
// router.get("/academies", authMiddleware, async (req, res) => {
//   try {
//     if (req.user.role !== "superadmin") {
//       return res.status(403).json({ message: "Access denied" });
//     }

//     const academies = await Academy.find().sort({ createdAt: -1 });
//     res.json(academies);
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// });


router.get(
  "/academies",
  authMiddleware,
  permit("superadmin"),
  async (req, res) => {
    const academies = await Academy.find().sort({ createdAt: -1 });
    res.json(academies);
  }
);

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
      academyCode,
    });

    await admin.save();

    res.json({
      message: "✅ Admin created successfully",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        academyCode,
      },
    });
  } catch (err) {
    console.error("CREATE ADMIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
