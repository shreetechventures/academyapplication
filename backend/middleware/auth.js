// // backend/middleware/auth.js

// const jwt = require('jsonwebtoken');

// const authMiddleware = (req, res, next) => {
// const header = req.headers.authorization;
// if (!header) return res.status(401).json({ message: 'Missing token' });
// const token = header.split(' ')[1];
// try {
// const payload = jwt.verify(token, process.env.JWT_SECRET);
// // Tenant enforcement: payload.academyCode should match route param if present
// if (
//   req.academyCode &&
//   payload.academyCode &&
//   req.academyCode !== payload.academyCode &&
//   payload.role !== 'superadmin'
// ) {
//   return res.status(403).json({ message: 'Academy mismatch' });
// }

// req.user = payload;
// next();
// } catch (err) {
// return res.status(401).json({ message: 'Invalid token' });
// }
// };

// const permit = (...allowed) => (req, res, next) => {
// if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
// if (allowed.includes(req.user.role)) return next();
// return res.status(403).json({ message: 'Forbidden' });
// };

// module.exports = { authMiddleware, permit };












// const jwt = require("jsonwebtoken");
// const Academy = require("../models/Academy");
// const AcademySubscription = require("../models/AcademySubscription");

// const authMiddleware = async (req, res, next) => {
//   const header = req.headers.authorization;
//   if (!header) return res.status(401).json({ message: "Missing token" });

//   const token = header.split(" ")[1];

//   try {
//     const payload = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = payload;

//     // Super admin bypass
//     if (payload.role === "superadmin") return next();

//     const academyCode = payload.academyCode;
//     if (!academyCode)
//       return res.status(403).json({ message: "Academy missing" });

//     const academy = await Academy.findOne({ code: academyCode });
//     if (!academy) return res.status(404).json({ message: "Academy not found" });

//     const subscription = await AcademySubscription.findOne({ academyCode });
//     if (!subscription)
//       return res.status(403).json({ message: "Subscription not configured" });

//     const today = new Date();
//     const endDate = new Date(subscription.endDate);

//     const warningStart = new Date(endDate);
//     warningStart.setDate(warningStart.getDate() - 5);

//     const graceEnd = new Date(endDate);
//     graceEnd.setDate(graceEnd.getDate() + subscription.gracePeriodDays);

//     let showWarning = false;

//     if (today <= endDate) {
//       subscription.status = "active";
//       academy.isActive = true;

//       if (today >= warningStart) showWarning = true;
//     } else if (today <= graceEnd) {
//       subscription.status = "expired";
//       academy.isActive = true;
//       showWarning = true;
//     } else {
//       subscription.status = "disabled";
//       academy.isActive = false;
//     }

//     subscription.updatedAt = new Date();
//     await subscription.save();
//     await academy.save();

//     if (!academy.isActive) {
//       return res.status(403).json({
//         message: "Academy subscription expired. Contact support.",
//       });
//     }

//     res.setHeader("X-Subscription-Warning", showWarning);
//     next();
//   } catch (err) {
//     return res.status(401).json({ message: "Invalid token" });
//   }
// };

// const permit =
//   (...allowed) =>
//   (req, res, next) => {
//     if (!req.user) return res.status(401).json({ message: "Unauthorized" });
//     if (allowed.includes(req.user.role)) return next();
//     return res.status(403).json({ message: "Forbidden" });
//   };

// module.exports = { authMiddleware, permit };












const jwt = require("jsonwebtoken");
const Academy = require("../models/Academy");
const AcademySubscription = require("../models/AcademySubscription");

const authMiddleware = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ message: "Missing token" });
  }

  const token = header.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;

    // ✅ Superadmin bypass
    if (payload.role === "superadmin") return next();

    const academyCode = payload.academyCode;
    if (!academyCode) {
      return res.status(403).json({ message: "Academy missing" });
    }

    const academy = await Academy.findOne({ code: academyCode });
    if (!academy) {
      return res.status(404).json({ message: "Academy not found" });
    }

    // 🚫 MANUAL DISABLE HAS HIGHEST PRIORITY
    if (!academy.isActive) {
      return res.status(403).json({
        message: "Academy is disabled by Super Admin.",
      });
    }

    const subscription = await AcademySubscription.findOne({ academyCode });
    if (!subscription) {
      return res.status(403).json({
        message: "Subscription not configured. Contact support.",
      });
    }

    const today = new Date();
    const endDate = new Date(subscription.endDate);

    const warningStart = new Date(endDate);
    warningStart.setDate(warningStart.getDate() - 5);

    const graceEnd = new Date(endDate);
    graceEnd.setDate(graceEnd.getDate() + (subscription.gracePeriodDays || 0));

    let showWarning = false;

    // 🔐 Subscription logic ONLY
    if (today <= endDate) {
      subscription.status = "active";
      if (today >= warningStart) showWarning = true;
    } 
    else if (today <= graceEnd) {
      subscription.status = "expired";
      showWarning = true;
    } 
    else {
      subscription.status = "disabled";

      return res.status(403).json({
        message: "Academy subscription expired. Contact support.",
      });
    }

    subscription.updatedAt = new Date();
    await subscription.save();

    res.setHeader("X-Subscription-Warning", showWarning);
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

const permit =
  (...allowed) =>
  (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (allowed.includes(req.user.role)) return next();
    return res.status(403).json({ message: "Forbidden" });
  };

module.exports = { authMiddleware, permit };
