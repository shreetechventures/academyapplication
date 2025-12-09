const Candidate = require("../models/Candidate");
const AssessmentType = require("../models/AssessmentType");
const AssessmentResult = require("../models/AssessmentResult");
const { sendWhatsAppMessage } = require("../utils/whatsapp");

async function getOrCreateType(academyCode, title, unitHint) {
  const allowed = ["seconds", "meters", "count"];
  let unit = unitHint;

  if (unitHint === "time") unit = "seconds";
  if (unitHint === "marks") unit = "count";
  if (!allowed.includes(unit)) unit = "count";

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

exports.saveMultiTestAssessment = async (req, res) => {
  try {
    const { academyCode } = req.params;
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

    if (!studentId)
      return res.status(400).json({ message: "studentId is required" });

    const student = await Candidate.findOne({ _id: studentId, academyCode });
    if (!student) return res.status(404).json({ message: "Student not found" });

    const attemptDate = testDate ? new Date(testDate) : new Date();

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

    for (const t of tests) {
      if (!t.value && t.value !== 0) continue;

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

    // WhatsApp message
    let whatsapp = null;

    if (sendWhatsApp && createdResults.length) {
      const formatted = createdResults
        .map((r) => `${r.assessmentTypeId?.title}: ${r.value}`)
        .join("\n");

      const message =
        `📋 Defence Academy - Test Results\n` +
        `Name: ${student.name}\n` +
        `Date: ${attemptDate.toLocaleDateString()}\n\n` +
        `${formatted}`;

      const sendStatus = [];

      const numbers = [
        student.contactNumber,
        student.fatherContact,
        student.emergencyContact1,
      ].filter(Boolean);

      for (const num of numbers) {
        const result = await sendWhatsAppMessage(num, message);
        sendStatus.push({ numbers: num, ...result });
      }

      whatsapp = { sentTo: numbers };
    }

    res.json({
      success: true,
      createdCount: createdResults.length,
      results: createdResults,
      whatsapp,
    });
  } catch (err) {
    console.error("saveMultiTestAssessment error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
