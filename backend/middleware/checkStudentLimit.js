const AcademySubscription = require("../models/AcademySubscription");
const Candidate = require("../models/Candidate");

/**
 * 🔒 Enforce student limit per subscription
 * 🌱 SEED SAFE: academyCode from auth middleware
 */
const checkStudentLimit = async (req, res, next) => {
  try {
    /* =========================
       0️⃣ Ensure auth ran
    ========================= */
    const academyCode = req.academyCode;

    if (!academyCode) {
      return res.status(401).json({
        message: "Unauthorized: academy context missing",
      });
    }

    /* =========================
       1️⃣ Get subscription (UNCHANGED)
    ========================= */
    const subscription = await AcademySubscription.findOne({ academyCode });

    if (!subscription) {
      return res.status(403).json({
        message: "Subscription not configured. Contact support.",
      });
    }

    /* =========================
       2️⃣ Count ACTIVE students only (UNCHANGED)
    ========================= */
    const activeCount = await Candidate.countDocuments({
      academyCode,
      status: "Active",
    });

    /* =========================
       3️⃣ Enforce limit (UNCHANGED)
    ========================= */
    if (activeCount >= subscription.maxStudents) {
      return res.status(403).json({
        message:
          "You have reached your plan limit. Upgrade your plan to add more students.",
        code: "STUDENT_LIMIT_REACHED",
      });
    }

    next();
  } catch (err) {
    console.error("STUDENT LIMIT ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = checkStudentLimit;
