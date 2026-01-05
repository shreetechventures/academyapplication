const express = require("express");
const router = express.Router();

const { authMiddleware, permit } = require("../middleware/auth");
const Academy = require("../models/Academy");

/* =====================================================
   ⚙️ GET ACADEMY SETTINGS
   GET /api/settings
===================================================== */
router.get(
  "/",
  authMiddleware,
  permit("academyAdmin"),
  async (req, res) => {
    try {
      // const academyCode = req.academyCode;
              const academyCode = req.params.academyCode || req.user.academyCode;


      const academy = await Academy.findOne({ code: academyCode }).select(
        "settings"
      );

      if (!academy) {
        return res.status(404).json({ message: "Academy not found" });
      }

      res.json({
        success: true,
        settings: academy.settings || {},
      });
    } catch (err) {
      console.error("GET SETTINGS ERROR:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

/* =====================================================
   🔐 UPDATE ACADEMY PERMISSIONS
   PUT /api/settings/permissions
===================================================== */
// router.put(
//   "/permissions",
//   authMiddleware,
//   permit("academyAdmin"),
//   async (req, res) => {
//     try {
//       const academyCode = req.academyCode;

//       const {
//         allowTrainerFeeManagement = false,
//         allowTrainerStudentRegistration = false,
//       } = req.body;

//       await Academy.updateOne(
//         { code: academyCode },
//         {
//           $set: {
//             "settings.allowTrainerFeeManagement":
//               Boolean(allowTrainerFeeManagement),
//             "settings.allowTrainerStudentRegistration":
//               Boolean(allowTrainerStudentRegistration),
//           },
//         }
//       );

//       res.json({
//         success: true,
//         message: "Permissions updated successfully",
//       });
//     } catch (err) {
//       console.error("UPDATE SETTINGS ERROR:", err);
//       res.status(500).json({ message: "Server error" });
//     }
//   }
// );

// ✅ GET PERMISSIONS FOR CURRENT USER (Admin / Teacher)
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

module.exports = router;
