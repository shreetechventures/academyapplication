const express = require("express");
const router = express.Router();

const Academy = require("../models/Academy");
const { authMiddleware, permit } = require("../middleware/auth");

/* ============================================================
   🔐 GET FULL SETTINGS (ADMIN ONLY)
   GET /api/settings
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
      console.error("LOAD SETTINGS ERROR:", err);
      res.status(500).json({ message: "Failed to load settings" });
    }
  }
);

/* ============================================================
   👀 GET PERMISSIONS (ADMIN + TEACHER)
   GET /api/settings/permissions
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
          academy.settings?.allowTrainerFeeManagement ?? false,
        allowTrainerStudentRegistration:
          academy.settings?.allowTrainerStudentRegistration ?? false,
      });
    } catch (err) {
      console.error("LOAD PERMISSIONS ERROR:", err);
      res.status(500).json({ message: "Failed to load permissions" });
    }
  }
);

/* ============================================================
   ✏️ UPDATE PERMISSIONS (ADMIN ONLY)
   PUT /api/settings/permissions
============================================================ */
router.put(
  "/permissions",
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

      academy.settings = {
        ...academy.settings,
        allowTrainerFeeManagement:
          req.body.allowTrainerFeeManagement ?? false,
        allowTrainerStudentRegistration:
          req.body.allowTrainerStudentRegistration ?? false,
      };

      await academy.save();

      res.json({
        message: "Permissions updated successfully",
        settings: academy.settings,
      });
    } catch (err) {
      console.error("UPDATE PERMISSIONS ERROR:", err);
      res.status(500).json({ message: "Failed to update permissions" });
    }
  }
);

module.exports = router;
