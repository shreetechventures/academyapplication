const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { authMiddleware, permit } = require("../middleware/auth");

/* ======================================================
   CREATE ACADEMY ADMIN
   🔐 superadmin OR academyAdmin
====================================================== */
// POST /api/admin/create-academy-admin
router.post(
  "/create-academy-admin",
  authMiddleware,
  permit("superadmin", "academyAdmin"),
  async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const academyCode = req.academyCode;

      if (!academyCode) {
        return res.status(400).json({ message: "academyCode missing" });
      }

      const exists = await User.findOne({
        email: email.toLowerCase(),
        academyCode,
      });

      if (exists) {
        return res.status(400).json({ message: "User exists" });
      }

      const hash = await bcrypt.hash(password, 10);

      const user = new User({
        name,
        email: email.toLowerCase(),
        password: hash,
        role: "academyAdmin",
        academyCode,
        createdBy: req.user.id,
      });

      await user.save();

      res.json({ message: "Academy admin created" });
    } catch (err) {
      console.error("CREATE ACADEMY ADMIN ERROR:", err);
      res.status(500).json({ message: "Failed to create academy admin" });
    }
  }
);

/* ======================================================
   CREATE TEACHER
   🔐 superadmin OR academyAdmin
====================================================== */
// POST /api/admin/create-teacher
router.post(
  "/create-teacher",
  authMiddleware,
  permit("superadmin", "academyAdmin"),
  async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const academyCode = req.academyCode;

      if (!academyCode) {
        return res.status(400).json({ message: "academyCode missing" });
      }

      const exists = await User.findOne({
        email: email.toLowerCase(),
        academyCode,
      });

      if (exists) {
        return res.status(400).json({ message: "User exists" });
      }

      const hash = await bcrypt.hash(password, 10);

      const user = new User({
        name,
        email: email.toLowerCase(),
        password: hash,
        role: "teacher",
        academyCode,
        createdBy: req.user.id,
      });

      await user.save();

      res.json({ message: "Teacher created" });
    } catch (err) {
      console.error("CREATE TEACHER ERROR:", err);
      res.status(500).json({ message: "Failed to create teacher" });
    }
  }
);

/* ======================================================
   CREATE STUDENT USER
   🔐 superadmin, academyAdmin, teacher
====================================================== */
// POST /api/admin/create-student
router.post(
  "/create-student",
  authMiddleware,
  permit("superadmin", "academyAdmin", "teacher"),
  async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const academyCode = req.academyCode;

      if (!academyCode) {
        return res.status(400).json({ message: "academyCode missing" });
      }

      const exists = await User.findOne({
        email: email.toLowerCase(),
        academyCode,
      });

      if (exists) {
        return res.status(400).json({ message: "User exists" });
      }

      const hash = await bcrypt.hash(password, 10);

      const user = new User({
        name,
        email: email.toLowerCase(),
        password: hash,
        role: "student",
        academyCode,
        createdBy: req.user.id,
      });

      await user.save();

      res.json({ message: "Student created" });
    } catch (err) {
      console.error("CREATE STUDENT ERROR:", err);
      res.status(500).json({ message: "Failed to create student" });
    }
  }
);

module.exports = router;
