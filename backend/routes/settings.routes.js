const express = require("express");
const router = express.Router();

const Academy = require("../models/Academy");
const { authMiddleware, permit } = require("../middleware/auth");

/* ============================================================
   🔐 ADMIN SETTINGS (ADMIN ONLY)
============================================================ */
router.get(
  "/",
  authMiddleware,
  permit("academyAdmin"),
  async (req, res) => {
    try {
      const academy = await Academy.findOne({
        academyCode: req.academyCode,
      });

      if (!academy) {
        return res.status(404).json({ message: "Academy not found" });
      }

      res.json({ settings: academy.settings });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

/* ============================================================
   ✅ PERMISSIONS (ADMIN + TEACHER)
============================================================ */
router.get(
  "/permissions",
  authMiddleware,
  async (req, res) => {
    try {
      const academy = await Academy.findOne({
        academyCode: req.academyCode,
      }).select("settings");

      if (!academy) {
        return res.status(404).json({ message: "Academy not found" });
      }

      res.json({
        allowTrainerFeeManagement:
          academy.settings?.allowTrainerFeeManagement || false,
        allowTrainerStudentRegistration:
          academy.settings?.allowTrainerStudentRegistration || false,
      });
    } catch (err) {
      console.error("PERMISSIONS ERROR:", err);
      res.status(500).json({ message: "Failed to load permissions" });
    }
  }
);

module.exports = router;
