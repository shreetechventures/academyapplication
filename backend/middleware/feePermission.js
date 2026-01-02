const Academy = require("../models/Academy");

/**
 * 💰 Fee Management Permission Guard
 * 🌱 SEED SAFE
 */
const canManageFees = async (req, res, next) => {
  try {
    /* =========================
       0️⃣ Ensure auth context exists
    ========================= */
    if (!req.user || !req.academyCode) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const { role, permissions = [] } = req.user;
    const academyCode = req.academyCode;

    /* =========================
       1️⃣ Academy Admin → always allowed (UNCHANGED)
    ========================= */
    if (role === "academyAdmin") {
      return next();
    }

    /* =========================
       2️⃣ Teacher → academy setting OR user permission (UNCHANGED)
    ========================= */
    if (role === "teacher") {
      const academy = await Academy.findOne({ code: academyCode });

      if (!academy) {
        return res.status(404).json({
          message: "Academy not found",
        });
      }

      const academyAllows =
        academy.settings?.allowTrainerFeeManagement === true;

      const userAllows = permissions.includes("fee");

      if (academyAllows || userAllows) {
        return next();
      }

      return res.status(403).json({
        message: "Teacher is not allowed to manage fees",
      });
    }

    /* =========================
       3️⃣ Students / others (UNCHANGED)
    ========================= */
    return res.status(403).json({
      message: "Fee management access denied",
    });
  } catch (err) {
    console.error("canManageFees error:", err);
    return res.status(500).json({
      message: "Fee permission check failed",
    });
  }
};

module.exports = { canManageFees };
