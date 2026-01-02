// backend/middleware/feePermission.js
const Academy = require("../models/Academy");

const canManageFees = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const role = req.user.role;
    const academyCode = req.academyCode;

    // ✅ Admin always allowed
    if (role === "academyAdmin") {
      return next();
    }

    // ✅ Teacher depends on academy setting
    if (role === "teacher") {
      const academy = await Academy.findOne({ code: academyCode });

      if (!academy) {
        return res.status(404).json({ message: "Academy not found" });
      }

      if (academy.settings?.allowTrainerFeeManagement === true) {
        return next();
      }

      return res.status(403).json({
        message: "Teacher is not allowed to manage fees",
      });
    }

    return res.status(403).json({
      message: "Access denied",
    });
  } catch (err) {
    console.error("canManageFees error:", err);
    res.status(500).json({ message: "Permission check failed" });
  }
};

module.exports = { canManageFees }; // ✅ THIS LINE IS CRITICAL
