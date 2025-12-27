const AcademySubscription = require("../models/AcademySubscription");
const Candidate = require("../models/Candidate");

const checkStudentLimit = async (req, res, next) => {
  try {
    const academyCode = req.academyCode;

    // 1️⃣ Get subscription
    const subscription = await AcademySubscription.findOne({ academyCode });

    if (!subscription) {
      return res.status(403).json({
        message: "Subscription not configured. Contact support.",
      });
    }

    // 2️⃣ Count ACTIVE students only
    const activeCount = await Candidate.countDocuments({
      academyCode,
      status: "Active",
    });

    // 3️⃣ Enforce limit
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
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = checkStudentLimit;
