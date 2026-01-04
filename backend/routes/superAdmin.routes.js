const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); // kept safe
const router = express.Router();

const User = require("../models/User");
const Academy = require("../models/Academy");
const AcademySubscription = require("../models/AcademySubscription");
const SubscriptionPayment = require("../models/SubscriptionPayment");

const { authMiddleware, permit } = require("../middleware/auth");

/* =====================================================
   🔐 MARK SUBSCRIPTION PAID
===================================================== */
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
        remark,
        status: "active",
      });
    } else {
      subscription.startDate = startDate;
      subscription.endDate = endDate;
      subscription.maxStudents = maxStudents;
      subscription.remark = remark;
      subscription.status = "active";
    }

    await subscription.save();
    await Academy.updateOne({ code: academyCode }, { isActive: true });

    await SubscriptionPayment.create({
      academyCode,
      durationMonths,
      markedBy: req.user.id,
      remark,
      paidOn: new Date(),
    });

    res.json({ message: "Subscription activated successfully" });
  }
);

/* =====================================================
   🏫 CREATE ACADEMY
===================================================== */
router.post(
  "/create-academy",
  authMiddleware,
  permit("superadmin"),
  async (req, res) => {
    try {
      const { name, code, address, durationMonths, maxStudents, remark } =
        req.body;

      if (!name || !code) {
        return res.status(400).json({ message: "Name and code required" });
      }

      const existing = await Academy.findOne({ code });
      if (existing) {
        return res.status(400).json({ message: "Academy code already exists" });
      }

      const academy = await Academy.create({
        name,
        code,
        address,
        isActive: true,
      });

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
  }
);

/* =====================================================
   📜 SUBSCRIPTION HISTORY
===================================================== */
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

/* =====================================================
   🔁 TOGGLE ACADEMY
===================================================== */
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

/* =====================================================
   📊 COUNT ACADEMIES
===================================================== */
router.get(
  "/academies/count",
  authMiddleware,
  permit("superadmin"),
  async (req, res) => {
    const count = await Academy.countDocuments();
    res.json({ count });
  }
);

/* =====================================================
   👤 LIST ADMINS
===================================================== */
router.get(
  "/admins",
  authMiddleware,
  permit("superadmin"),
  async (req, res) => {
    const admins = await User.find({ role: "academyAdmin" })
      .select("-passwordHash")
      .sort({ createdAt: -1 });

    res.json(admins);
  }
);

/* =====================================================
   ✏️ UPDATE ADMIN
===================================================== */
router.put(
  "/admin/:id",
  authMiddleware,
  permit("superadmin"),
  async (req, res) => {
    const { name, email, password } = req.body;

    const admin = await User.findById(req.params.id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    if (name) admin.name = name;
    if (email) admin.email = email.toLowerCase();
    if (password) {
      admin.passwordHash = await bcrypt.hash(password, 10);
    }

    await admin.save();
    res.json({ message: "Admin updated successfully" });
  }
);

/* =====================================================
   ❌ DELETE ADMIN
===================================================== */
router.delete(
  "/admin/:id",
  authMiddleware,
  permit("superadmin"),
  async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Admin removed successfully" });
  }
);

/* =====================================================
   🏫 LIST ACADEMIES
===================================================== */
router.get(
  "/academies",
  authMiddleware,
  permit("superadmin"),
  async (req, res) => {
    const academies = await Academy.find().sort({ createdAt: -1 });
    res.json(academies);
  }
);

/* =====================================================
   ✏️ UPDATE ACADEMY
===================================================== */
router.put(
  "/academy/:id",
  authMiddleware,
  permit("superadmin"),
  async (req, res) => {
    const { name, address } = req.body;

    const academy = await Academy.findById(req.params.id);
    if (!academy) return res.status(404).json({ message: "Academy not found" });

    if (name) academy.name = name;
    if (address) academy.address = address;

    await academy.save();
    res.json({ message: "Academy updated", academy });
  }
);

/* =====================================================
   ❌ DELETE ACADEMY
===================================================== */
router.delete(
  "/academy/:id",
  authMiddleware,
  permit("superadmin"),
  async (req, res) => {
    await Academy.findByIdAndDelete(req.params.id);
    res.json({ message: "Academy deleted" });
  }
);

/* =====================================================
   👤 CREATE ADMIN
===================================================== */
router.post(
  "/create-admin",
  authMiddleware,
  permit("superadmin"),
  async (req, res) => {
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

    const admin = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash: await bcrypt.hash(password, 10),
      role: "academyAdmin",
      academyCode,
    });

    res.json({
      message: "✅ Admin created successfully",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        academyCode,
      },
    });
  }
);

module.exports = router;
