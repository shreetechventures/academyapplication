const express = require("express");
const router = express.Router();

const Academy = require("../models/Academy");
const { authMiddleware } = require("../middleware/auth");

/* ======================================================
   CREATE ACADEMY
   🔐 Only SUPERADMIN
====================================================== */
// POST /api/academy/create
router.post("/create", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "superadmin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { code, name, branding } = req.body;

    if (!code || !name) {
      return res
        .status(400)
        .json({ message: "code and name required" });
    }

    const exists = await Academy.findOne({ code });
    if (exists) {
      return res.status(400).json({ message: "Academy code exists" });
    }

    const academy = new Academy({ code, name, branding });
    await academy.save();

    res.json({
      message: "Academy created",
      academy,
    });
  } catch (err) {
    console.error("CREATE ACADEMY ERROR:", err);
    res.status(500).json({ message: "Failed to create academy" });
  }
});

/* ======================================================
   GET CURRENT ACADEMY (SUBDOMAIN / JWT BASED)
====================================================== */
// GET /api/academy
router.get("/", authMiddleware, async (req, res) => {
  try {
    const academyCode = req.academyCode;

    const academy = await Academy.findOne({ code: academyCode });

    if (!academy) {
      return res.status(404).json({ message: "Academy not found" });
    }

    return res.json({
      _id: academy._id,
      code: academy.code,
      name: academy.name,
      branding: academy.branding || {},
    });
  } catch (err) {
    console.error("GET ACADEMY ERROR:", err);
    return res.status(500).json({ message: "Failed to load academy" });
  }
});

module.exports = router;
