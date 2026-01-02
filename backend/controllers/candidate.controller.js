const AcademySubscription = require("../models/AcademySubscription");
const Candidate = require("../models/Candidate");

/**
 * 🔒 Check if academy has reached student limit
 * ❗ Logic unchanged
 */
const checkStudentLimit = async (academyCode) => {
  try {
    /* =========================
       1️⃣ Get subscription
    ========================= */
    const subscription = await AcademySubscription.findOne({ academyCode });

    if (!subscription) {
      throw new Error("Subscription not found for academy");
    }

    /* =========================
       2️⃣ Count active students (UNCHANGED)
    ========================= */
    const count = await Candidate.countDocuments({
      academyCode,
      status: "Active",
    });

    /* =========================
       3️⃣ Limit check (UNCHANGED)
    ========================= */
    if (count >= subscription.maxStudents) {
      throw new Error("Student limit reached. Upgrade subscription.");
    }

    return true; // ✅ explicit success
  } catch (err) {
    // rethrow so controller can handle it
    throw err;
  }
};

module.exports = { checkStudentLimit };
