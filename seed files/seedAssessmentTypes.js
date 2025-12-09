// seedAssessmentTypes.js
const mongoose = require("mongoose");
const AssessmentType = require("./models/AssessmentType");

// CONNECT DB (same as your working seed file)
mongoose.connect("mongodb://127.0.0.1:27017/academydb");

async function seedAssessmentTypes() {
  try {
    const academyCode = "shreenath";

    const types = [
      {
        academyCode,
        title: "1600 Meter Run",
        unit: "seconds",
        bhartiType: "army",
        scoringScheme: { mode: "time_desc", best: 360, worst: 900 },
        maxScore: 60,
        description: "1600m run timed"
      },
      {
        academyCode,
        title: "100 Meter Run",
        unit: "seconds",
        bhartiType: "army",
        scoringScheme: { mode: "time_desc", best: 12, worst: 25 },
        maxScore: 20
      },
      {
        academyCode,
        title: "Gola Fek",
        unit: "meters",
        bhartiType: "army",
        scoringScheme: { mode: "distance_asc", best: 8, worst: 2 },
        maxScore: 20
      }
    ];

    // Clean previous types
    await AssessmentType.deleteMany({ academyCode });

    // Insert fresh data
    await AssessmentType.insertMany(types);

    console.log("✅ Assessment Types Seeded Successfully!");
    process.exit(0);

  } catch (err) {
    console.error("❌ ERROR seeding assessment types:", err);
    process.exit(1);
  }
}

seedAssessmentTypes();
