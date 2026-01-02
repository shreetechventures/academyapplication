const express = require("express");
const router = express.Router();

const Candidate = require("../models/Candidate");
const Teacher = require("../models/Teacher");
const AcademySubscription = require("../models/AcademySubscription");

const { authMiddleware, permit } = require("../middleware/auth");

/* =========================================================
   📊 DASHBOARD COUNTS
========================================================= */

// Total Active Students
router.get("/students/active", authMiddleware, async (req, res) => {
  const academyCode = req.academyCode;

  const count = await Candidate.countDocuments({
    academyCode,
    status: "Active",
  });

  res.json({ count });
});

// Total Left Students
router.get("/students/left", authMiddleware, async (req, res) => {
  const academyCode = req.academyCode;

  const count = await Candidate.countDocuments({
    academyCode,
    status: "Left",
  });

  res.json({ count });
});

// Total Trainers
router.get("/trainers", authMiddleware, async (req, res) => {
  const academyCode = req.academyCode;

  const count = await Teacher.countDocuments({
    academyCode,
  });

  res.json({ count });
});

/* =========================================================
   📊 ADMIN ONLY – SUBSCRIPTION INFO
========================================================= */

router.get(
  "/subscription-info",
  authMiddleware,
  permit("academyAdmin"),
  async (req, res) => {
    try {
      const academyCode = req.academyCode;

      const subscription = await AcademySubscription.findOne({
        academyCode,
        status: "active",
      });

      if (!subscription) {
        return res.json(null);
      }

      const activeStudents = await Candidate.countDocuments({
        academyCode,
        status: "Active",
      });

      const maxStudents = subscription.maxStudents;
      const remaining = Math.max(maxStudents - activeStudents, 0);
      const usagePercent = Math.round(
        (activeStudents / maxStudents) * 100
      );

      res.json({
        maxStudents,
        remaining,
        used: activeStudents,
        usagePercent,
        expiryDate: subscription.endDate,
        showWarning: usagePercent >= 90,
      });
    } catch (err) {
      console.error("Subscription info error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
