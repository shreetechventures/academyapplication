const Candidate = require("../models/Candidate");
const AssessmentType = require("../models/AssessmentType");
const AssessmentResult = require("../models/AssessmentResult");
const { sendWhatsAppMessage } = require("../utils/whatsapp");

/* ======================================================
   🔁 Get or Create Assessment Type
====================================================== */
async function getOrCreateType(academyCode, title, unitHint) {
  const allowedUnits = ["seconds", "meters", "count"];

  let unit = unitHint;
  if (unitHint === "time") unit = "seconds";
  if (unitHint === "marks") unit = "count";
  if (!allowedUnits.includes(unit)) unit = "count";

  let type = await AssessmentType.findOne({ academyCode, title });

  if (!type) {
    type = await AssessmentType.create({
      academyCode,
      title,
      unit,
      scoringScheme: null,
      maxScore: null,
    });
  }

  return type;
}

/* ======================================================
   ✅ SAVE MULTI TEST ASSESSMENT (SEED SAFE)
====================================================== */
exports.saveMultiTestAssessment = async (req, res) => {
  try {
    const {
      studentId,
      testDate,
      sendWhatsApp,
      hundredMeterTime,
      sixteenHundredMeterTime,
      pushUps,
      sitUps,
      pullUps,
      longJump,
      highJump,
      golaFek,
      writtenScore,
    } = req.body;

    /* =========================
       1️⃣ Validate input
    ========================= */
    if (!studentId) {
      return res.status(400).json({ message: "studentId is required" });
    }

    /* =========================
       2️⃣ Load student (SOURCE OF TRUTH)
    ========================= */
    const student = await Candidate.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // 🌱 SEED RULE
    const academyCode = student.academyCode;

    const attemptDate = testDate ? new Date(testDate) : new Date();

    /* =========================
       3️⃣ Test definitions
    ========================= */
    const tests = [
      { title: "100 Meter", unit: "time", value: hundredMeterTime },
      { title: "1600 Meter", unit: "time", value: sixteenHundredMeterTime },
      { title: "Push-Ups", unit: "count", value: pushUps },
      { title: "Sit-Ups", unit: "count", value: sitUps },
      { title: "Pull-Ups", unit: "count", value: pullUps },
      { title: "Long Jump", unit: "meters", value: longJump },
      { title: "High Jump", unit: "meters", value: highJump },
      { title: "Gola Fek / Shot Put", unit: "meters", value: golaFek },
      { title: "Written Exam Score", unit: "marks", value: writtenScore },
    ];

    const createdResults = [];
    const addedBy = req.user?.role || "system";

    /* =========================
       4️⃣ Save results
    ========================= */
    for (const t of tests) {
      if (t.value === undefined || t.value === null) continue;

      const typeDoc = await getOrCreateType(academyCode, t.title, t.unit);

      const result = await AssessmentResult.create({
        academyCode,
        studentId,
        assessmentTypeId: typeDoc._id,
        value: t.value,
        score: null,
        attemptDate,
        addedBy,
      });

      createdResults.push(result);
    }

    /* =========================
       5️⃣ WhatsApp notification
    ========================= */
    let whatsapp = null;

    if (sendWhatsApp && createdResults.length) {
      const populated = await AssessmentResult.find({
        _id: { $in: createdResults.map((r) => r._id) },
      }).populate("assessmentTypeId", "title");

      const formatted = populated
        .map((r) => `${r.assessmentTypeId.title}: ${r.value}`)
        .join("\n");

      const message =
        `📋 Defence Academy - Test Results\n` +
        `Name: ${student.name}\n` +
        `Date: ${attemptDate.toLocaleDateString()}\n\n` +
        `${formatted}`;

      const numbers = [
        student.contactNumber,
        student.fatherContact,
        student.emergencyContact1,
      ].filter(Boolean);

      for (const num of numbers) {
        await sendWhatsAppMessage(num, message);
      }

      whatsapp = { sentTo: numbers };
    }

    /* =========================
       6️⃣ Response
    ========================= */
    return res.json({
      success: true,
      createdCount: createdResults.length,
      results: createdResults,
      whatsapp,
    });
  } catch (err) {
    console.error("saveMultiTestAssessment error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
