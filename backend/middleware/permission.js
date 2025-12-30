// const Academy = require("../models/Academy");

// const permissionMap = {
//   studentRegistration: "allowTrainerStudentRegistration",
//   fee: "allowTrainerFeeManagement",
// };

// const requirePermission = (permissionKey) => {
//   return async (req, res, next) => {
//     try {
//       const { role, academyCode } = req.user;

//       // ✅ Admin always allowed
//       if (role === "academyAdmin") return next();

//       // ✅ Teacher permission check
//       if (role === "teacher") {
//         const academy = await Academy.findOne({ code: academyCode });
//         const settingKey = permissionMap[permissionKey];

//         if (!academy?.settings?.[settingKey]) {
//           return res
//             .status(403)
//             .json({ message: "Permission denied by academy admin" });
//         }

//         return next();
//       }

//       // ❌ Students must NEVER reach here
//       return res.status(403).json({ message: "Access denied" });
//     } catch (err) {
//       res.status(500).json({ message: "Permission check failed" });
//     }
//   };
// };

// module.exports = { requirePermission };



const Academy = require("../models/Academy");

const permissionMap = {
  studentRegistration: "allowTrainerStudentRegistration",
  fee: "allowTrainerFeeManagement",
};

const requirePermission = (permissionKey) => {
  return async (req, res, next) => {
    try {
      const { role } = req.user;

      // ✅ SUPERADMIN → always allowed
      if (role === "superadmin") {
        return next();
      }

      // ✅ ACADEMY ADMIN → always allowed
      if (role === "academyAdmin") {
        return next();
      }

      // ✅ TEACHER → permission-based
      if (role === "teacher") {
        const academyCode = req.params.academyCode || req.user.academyCode;

        if (!academyCode) {
          return res
            .status(400)
            .json({ message: "academyCode missing for permission check" });
        }

        const academy = await Academy.findOne({ code: academyCode });

        if (!academy) {
          return res.status(404).json({ message: "Academy not found" });
        }

        const settingKey = permissionMap[permissionKey];

        if (!settingKey) {
          return res.status(500).json({
            message: "Invalid permission key configuration",
          });
        }

        if (!academy.settings?.[settingKey]) {
          return res
            .status(403)
            .json({ message: "Permission denied by academy admin" });
        }

        return next();
      }

      // ❌ STUDENT or unknown roles
      return res.status(403).json({ message: "Access denied" });
    } catch (err) {
      console.error("Permission middleware error:", err);
      res.status(500).json({ message: "Permission check failed" });
    }
  };
};

module.exports = { requirePermission };
