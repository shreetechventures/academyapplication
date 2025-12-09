const express = require("express");
const router = express.Router({ mergeParams: true });

const Candidate = require("../models/Candidate");
const Teacher = require("../models/Teacher");
const { authMiddleware } = require("../middleware/auth");

// Total Active Students
router.get("/students/active", authMiddleware, async (req, res) => {
  const count = await Candidate.countDocuments({
    academyCode: req.params.academyCode,
    status: "Active"
  });
  res.json({ count });
});

// Total Left Students
router.get("/students/left", authMiddleware, async (req, res) => {
  const count = await Candidate.countDocuments({
    academyCode: req.params.academyCode,
    status: "Left"
  });
  res.json({ count });
});

// Total Trainers
router.get("/trainers", authMiddleware, async (req, res) => {
  const count = await Teacher.countDocuments({
    academyCode: req.params.academyCode
  });
  res.json({ count });
});

module.exports = router;
