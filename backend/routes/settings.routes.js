const express = require("express");
const router = express.Router({ mergeParams: true });

const { authMiddleware, permit } = require("../middleware/auth");
const Academy = require("../models/Academy");

/**
 * =====================================
 * GET ACADEMY SETTINGS
 * GET /api/:academyCode/settings
 * =====================================
 */
router.get(
  "/",
  authMiddleware,
  permit("academyAdmin"),
  async (req, res) => {
    const { academyCode } = req.params;

    const academy = await Academy.findOne({ code: academyCode }).select(
      "settings"
    );

    if (!academy) {
      return res.status(404).json({ message: "Academy not found" });
    }

    res.json({ settings: academy.settings || {} });
  }
);

/**
 * =====================================
 * UPDATE FEE PERMISSION
 * PUT /api/:academyCode/settings/fee-permission
 * =====================================
 */
router.put(
  "/permissions",
  authMiddleware,
  permit("academyAdmin"),
  async (req, res) => {
    const { academyCode } = req.params;
    const {
      allowTrainerFeeManagement,
      allowTrainerStudentRegistration,
    } = req.body;

    await Academy.updateOne(
      { code: academyCode },
      {
        $set: {
          "settings.allowTrainerFeeManagement": allowTrainerFeeManagement,
          "settings.allowTrainerStudentRegistration":
            allowTrainerStudentRegistration,
        },
      }
    );

    res.json({ message: "Permissions updated successfully" });
  }
);


module.exports = router;
