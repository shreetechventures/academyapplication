// middleware/feePermission.js
const Academy = require("../models/Academy");

const canManageFees = async (req, res, next) => {
  try {
    const { role, academyCode, permissions = [] } = req.user;

    // ✅ 1. Academy Admin → always allowed
    if (role === "academyAdmin") {
      return next();
    }

    // ✅ 2. Teacher → check academy setting OR user permission
    if (role === "teacher") {
      const academy = await Academy.findOne({ code: academyCode });

      const academyAllows =
        academy?.settings?.allowTrainerFeeManagement === true;

      const userAllows = permissions.includes("fee");

      if (academyAllows || userAllows) {
        return next();
      }

      return res.status(403).json({
        message: "Teacher is not allowed to manage fees",
      });
    }

    // ❌ 3. Students / others
    return res.status(403).json({
      message: "Fee management access denied",
    });
  } catch (err) {
    console.error("canManageFees error:", err);
    res.status(500).json({
      message: "Fee permission check failed",
    });
  }
};

module.exports = { canManageFees };
