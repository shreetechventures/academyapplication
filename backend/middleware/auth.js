const jwt = require("jsonwebtoken");
const Academy = require("../models/Academy");
const AcademySubscription = require("../models/AcademySubscription");

const authMiddleware = async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing token" });
  }

  try {
    const token = header.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    req.user = payload;

    console.log("JWT PAYLOAD:", payload);

    /* =========================
       SUPERADMIN → skip academy checks (UNCHANGED)
    ========================= */
    if (payload.role === "superadmin") {
      return next();
    }

    /* =========================
       🌱 SEED FIX: academyCode from JWT ONLY
    ========================= */
    const academyCode = payload.academyCode;

    if (!academyCode) {
      return res.status(403).json({ message: "Academy code missing" });
    }

    req.academyCode = academyCode;

    /* =========================
       ACADEMY VALIDATION (UNCHANGED)
    ========================= */
    const academy = await Academy.findOne({ code: academyCode });
    if (!academy) {
      return res.status(404).json({ message: "Academy not found" });
    }

    if (!academy.isActive) {
      return res.status(403).json({ message: "Academy disabled" });
    }

    /* =========================
       SUBSCRIPTION CHECK (UNCHANGED)
    ========================= */
    const subscription = await AcademySubscription.findOne({ academyCode });
    if (!subscription) {
      return res.status(403).json({ message: "Subscription missing" });
    }

    const today = new Date();
    const graceEnd = new Date(subscription.endDate);
    graceEnd.setDate(
      graceEnd.getDate() + (subscription.gracePeriodDays || 0)
    );

    if (today > graceEnd) {
      return res.status(403).json({ message: "Subscription expired" });
    }

    next();
  } catch (err) {
    console.error("AUTH ERROR:", err);
    return res.status(401).json({ message: "Invalid token" });
  }
};

/* ======================================================
   ROLE PERMISSION (UNCHANGED)
====================================================== */
const permit =
  (...allowed) =>
  (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (allowed.includes(req.user.role)) {
      return next();
    }

    return res.status(403).json({ message: "Forbidden" });
  };

module.exports = { authMiddleware, permit };
