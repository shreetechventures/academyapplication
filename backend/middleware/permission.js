const Academy = require("../models/Academy");

const permissionMap = {
  fee: "allowTrainerFeeManagement",
  studentRegistration: "allowTrainerStudentRegistration",
};

const requirePermission = (permissionKey) => {
  return async (req, res, next) => {
    try {
      const { role, academyCode } = req.user;

      // Admin always allowed
      if (role === "academyAdmin") return next();

      // Trainer → check academy setting
      if (role === "teacher") {
        const academy = await Academy.findOne({ code: academyCode });

        const settingKey = permissionMap[permissionKey];

        if (!academy?.settings?.[settingKey]) {
          return res.status(403).json({
            message: "Permission denied by academy admin",
          });
        }

        return next();
      }

      return res.status(403).json({ message: "Access denied" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Permission check failed" });
    }
  };
};

module.exports = { requirePermission };
