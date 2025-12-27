const AcademySubscription = require("../models/AcademySubscription");
const Candidate = require("../models/Candidate");

const checkStudentLimit = async (academyCode) => {
  const subscription = await AcademySubscription.findOne({ academyCode });

  const count = await Candidate.countDocuments({
    academyCode,
    status: "Active"
  });

  if (count >= subscription.maxStudents) {
    throw new Error("Student limit reached. Upgrade subscription.");
  }
};
