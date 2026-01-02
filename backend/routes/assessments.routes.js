// const express = require("express");
// const mongoose = require("mongoose");
// const router = express.Router({ mergeParams: true });
// const AssessmentType = require("../models/AssessmentType");
// const AssessmentResult = require("../models/AssessmentResult");
// const { authMiddleware, permit } = require("../middleware/auth");

// const {
//   saveMultiTestAssessment,
// } = require("../controllers/assessments.controller");

// /* ------------------- SCORE CALCULATION ------------------- */
// function calculateScore(assessmentType, rawValue) {
//   if (!assessmentType) return 0;

//   const scheme = assessmentType.scoringScheme || null;
//   const maxScore = assessmentType.maxScore || 100;

//   if (scheme?.mode === "time_desc") {
//     const best = scheme.best || 300;
//     const worst = scheme.worst || 600;

//     if (rawValue <= best) return maxScore;
//     if (rawValue >= worst) return 0;

//     const frac = (worst - rawValue) / (worst - best);
//     return Math.round(maxScore * frac);
//   }

//   if (scheme?.mode === "distance_asc") {
//     const best = scheme.best || 10;
//     const worst = scheme.worst || 2;

//     if (rawValue >= best) return maxScore;
//     if (rawValue <= worst) return 0;

//     const frac = (rawValue - worst) / (best - worst);
//     return Math.round(maxScore * frac);
//   }

//   return Math.round(Math.min(maxScore, rawValue));
// }

// /* ------------------- ASSESSMENT TYPE CRUD ------------------- */

// // Create assessment type
// router.post(
//   "/",
//   authMiddleware,
//   permit("academyAdmin", "teacher"),
//   async (req, res) => {
//     try {
//       const { academyCode } = req.params;

//       const data = {
//         ...req.body,
//         academyCode,
//         createdBy: req.user?.id || req.user?.name,
//       };

//       const at = new AssessmentType(data);
//       await at.save();

//       res.json(at);
//     } catch (err) {
//       console.error("ASSESSMENT TYPE CREATE ERROR:", err);
//       res.status(500).json({ message: "Server error" });
//     }
//   }
// );

// // Get assessment types
// router.get("/", authMiddleware, async (req, res) => {
//   try {
//     const { academyCode } = req.params;

//     const filter = { academyCode };
//     if (req.query.bhartiType) filter.bhartiType = req.query.bhartiType;

//     const list = await AssessmentType.find(filter).sort({ createdAt: -1 });

//     res.json(list);
//   } catch (err) {
//     console.error("ASSESSMENT TYPE LIST ERROR:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// /* ------------------- ASSESSMENT RESULTS ------------------- */

// // Add result
// router.post(
//   "/results",
//   authMiddleware,
//   permit("academyAdmin", "teacher"),
//   async (req, res) => {
//     try {
//       const { academyCode } = req.params;
//       const {
//         studentId,
//         assessmentTypeId,
//         value,
//         score: manualScore,
//         attemptDate,
//         note,
//       } = req.body;

//       // FIX: Prevent null or invalid IDs
//       if (
//         !studentId ||
//         studentId === "null" ||
//         !mongoose.isValidObjectId(studentId)
//       ) {
//         return res.status(400).json({ message: "Valid studentId is required" });
//       }

//       if (
//         !assessmentTypeId ||
//         assessmentTypeId === "null" ||
//         !mongoose.isValidObjectId(assessmentTypeId)
//       ) {
//         return res
//           .status(400)
//           .json({ message: "Valid assessmentTypeId is required" });
//       }

//       if (value === undefined || value === null || value === "") {
//         return res.status(400).json({ message: "Value is required" });
//       }

//       const at = await AssessmentType.findById(assessmentTypeId);
//       if (!at)
//         return res.status(404).json({ message: "Assessment type not found" });

//       const computedScore =
//         typeof manualScore === "number"
//           ? manualScore
//           : calculateScore(at, value);

//       const ar = new AssessmentResult({
//         academyCode,
//         studentId,
//         assessmentTypeId,
//         value,
//         score: computedScore,
//         attemptDate: attemptDate ? new Date(attemptDate) : new Date(),
//         addedBy: req.user?.id || req.user?.name,
//         note: note || "",
//       });

//       await ar.save();
//       res.json(ar);
//     } catch (err) {
//       console.error("ASSESSMENT RESULT CREATE ERROR:", err);
//       res.status(500).json({ message: "Server error" });
//     }
//   }
// );

// // Get ALL results for a student
// router.get("/students/:studentId/results", authMiddleware, async (req, res) => {
//   try {
//     const { academyCode, studentId } = req.params;

//     if (!mongoose.isValidObjectId(studentId)) {
//       return res.status(400).json({ message: "Invalid studentId" });
//     }

//     const results = await AssessmentResult.find({ academyCode, studentId })
//       .populate("assessmentTypeId")
//       .sort({ attemptDate: 1 });

//     res.json(results);
//   } catch (err) {
//     console.error("ASSESSMENT RESULT LIST ERROR:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // Get results for specific test for a student
// router.get(
//   "/students/:studentId/results/:assessmentTypeId",
//   authMiddleware,
//   async (req, res) => {
//     try {
//       const { academyCode, studentId, assessmentTypeId } = req.params;

//       if (
//         !mongoose.isValidObjectId(studentId) ||
//         !mongoose.isValidObjectId(assessmentTypeId)
//       ) {
//         return res.status(400).json({ message: "Invalid ID(s)" });
//       }

//       const results = await AssessmentResult.find({
//         academyCode,
//         studentId,
//         assessmentTypeId,
//       }).sort({ attemptDate: 1 });

//       res.json(results);
//     } catch (err) {
//       console.error("ASSESSMENT TYPE RESULT ERROR:", err);
//       res.status(500).json({ message: "Server error" });
//     }
//   }
// );

// // Student summary (for dashboard)
// router.get("/students/:studentId/summary", authMiddleware, async (req, res) => {
//   try {
//     const { academyCode, studentId } = req.params;

//     if (!mongoose.isValidObjectId(studentId)) {
//       return res.status(400).json({ message: "Invalid studentId" });
//     }

//     const agg = await AssessmentResult.aggregate([
//       {
//         $match: {
//           academyCode,
//           studentId: new mongoose.Types.ObjectId(studentId),
//         },
//       },
//       {
//         $group: {
//           _id: "$assessmentTypeId",
//           avgScore: { $avg: "$score" },
//           bestScore: { $max: "$score" },
//           attempts: { $sum: 1 },
//           lastAttempt: { $max: "$attemptDate" },
//         },
//       },
//     ]);

//     const populated = await Promise.all(
//       agg.map(async (g) => {
//         const at = await AssessmentType.findById(g._id);
//         return { assessmentType: at, stats: g };
//       })
//     );

//     res.json(populated);
//   } catch (err) {
//     console.error("ASSESSMENT SUMMARY ERROR:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // DELETE result
// router.delete(
//   "/result/:id",
//   authMiddleware,
//   permit("academyAdmin", "teacher"),
//   async (req, res) => {
//     try {
//       const deleted = await AssessmentResult.findByIdAndDelete(req.params.id);

//       if (!deleted) {
//         return res.status(404).json({ message: "Result not found" });
//       }

//       res.json({ success: true, message: "Result deleted" });
//     } catch (err) {
//       console.error("DELETE RESULT ERROR:", err);
//       res.status(500).json({ message: "Server error" });
//     }
//   }
// );

// // UPDATE RESULT
// router.put(
//   "/result/:id",
//   authMiddleware,
//   permit("academyAdmin", "teacher"),
//   async (req, res) => {
//     try {
//       const { id } = req.params;
//       const { value, note, attemptDate } = req.body;

//       const existing = await AssessmentResult.findById(id).populate(
//         "assessmentTypeId"
//       );

//       if (!existing) {
//         return res.status(404).json({ message: "Result not found" });
//       }

//       // 🧮 SCORE RECALCULATION LOGIC (if you want automatic scoring)
//       let newScore = existing.score;
//       if (value !== undefined) {
//         // SCORE = find scoring from assessment type table
//         const type = existing.assessmentTypeId;

//         if (type && type.scoring && Array.isArray(type.scoring)) {
//           const matched = type.scoring.find(
//             (row) => value >= row.min && value <= row.max
//           );
//           newScore = matched ? matched.score : 0;
//         }
//       }

//       const updated = await AssessmentResult.findByIdAndUpdate(
//         id,
//         {
//           value,
//           note,
//           score: newScore,
//           attemptDate: attemptDate
//             ? new Date(attemptDate)
//             : existing.attemptDate,
//         },
//         { new: true }
//       );

//       res.json(updated);
//     } catch (err) {
//       console.error("UPDATE RESULT ERROR:", err);
//       res.status(500).json({ message: "Server error" });
//     }
//   }
// );

// // ✅ LAST COMPLETED ASSESSMENT (Student Dashboard)
// router.get(
//   "/students/:studentId/last-exam",
//   async (req, res) => {
//     try {
//       const { studentId } = req.params;
//       const academyCode = req.academyCode; // auto-extracted middleware

//       const lastResult = await AssessmentResult.findOne({
//         academyCode,
//         studentId,
//       })
//         .sort({ attemptDate: -1 })
//         .populate("assessmentTypeId", "title unit");

//       if (!lastResult) {
//         return res.json(null);
//       }

//       res.json({
//         assessmentTitle: lastResult.assessmentTypeId.title,
//         unit: lastResult.assessmentTypeId.unit,
//         value: lastResult.value,
//         score: lastResult.score,
//         attemptDate: lastResult.attemptDate,
//       });
//     } catch (err) {
//       console.error("Last exam fetch error:", err);
//       res.status(500).json({ message: "Server error" });
//     }
//   }
// );




// // 🔥 NEW MULTI TEST ROUTE
// router.post("/multi", saveMultiTestAssessment);

// module.exports = router;




const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const AssessmentType = require("../models/AssessmentType");
const AssessmentResult = require("../models/AssessmentResult");
const { authMiddleware, permit } = require("../middleware/auth");

const {
  saveMultiTestAssessment,
} = require("../controllers/assessments.controller");

/* ------------------- SCORE CALCULATION ------------------- */
function calculateScore(assessmentType, rawValue) {
  if (!assessmentType) return 0;

  const scheme = assessmentType.scoringScheme || null;
  const maxScore = assessmentType.maxScore || 100;

  if (scheme?.mode === "time_desc") {
    const best = scheme.best || 300;
    const worst = scheme.worst || 600;

    if (rawValue <= best) return maxScore;
    if (rawValue >= worst) return 0;

    const frac = (worst - rawValue) / (worst - best);
    return Math.round(maxScore * frac);
  }

  if (scheme?.mode === "distance_asc") {
    const best = scheme.best || 10;
    const worst = scheme.worst || 2;

    if (rawValue >= best) return maxScore;
    if (rawValue <= worst) return 0;

    const frac = (rawValue - worst) / (best - worst);
    return Math.round(maxScore * frac);
  }

  return Math.round(Math.min(maxScore, rawValue));
}

/* ------------------- ASSESSMENT TYPE CRUD ------------------- */

// CREATE assessment type
router.post(
  "/",
  authMiddleware,
  permit("academyAdmin", "teacher"),
  async (req, res) => {
    try {
      const academyCode = req.academyCode;

      const data = {
        ...req.body,
        academyCode,
        createdBy: req.user?.id || req.user?.name,
      };

      const at = new AssessmentType(data);
      await at.save();

      res.json(at);
    } catch (err) {
      console.error("ASSESSMENT TYPE CREATE ERROR:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// GET assessment types
router.get("/", authMiddleware, async (req, res) => {
  try {
    const academyCode = req.academyCode;

    const filter = { academyCode };
    if (req.query.bhartiType) filter.bhartiType = req.query.bhartiType;

    const list = await AssessmentType.find(filter).sort({ createdAt: -1 });

    res.json(list);
  } catch (err) {
    console.error("ASSESSMENT TYPE LIST ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ------------------- ASSESSMENT RESULTS ------------------- */

// ADD result
router.post(
  "/results",
  authMiddleware,
  permit("academyAdmin", "teacher"),
  async (req, res) => {
    try {
      const academyCode = req.academyCode;
      const {
        studentId,
        assessmentTypeId,
        value,
        score: manualScore,
        attemptDate,
        note,
      } = req.body;

      if (!studentId || !mongoose.isValidObjectId(studentId)) {
        return res.status(400).json({ message: "Valid studentId is required" });
      }

      if (
        !assessmentTypeId ||
        !mongoose.isValidObjectId(assessmentTypeId)
      ) {
        return res
          .status(400)
          .json({ message: "Valid assessmentTypeId is required" });
      }

      if (value === undefined || value === null || value === "") {
        return res.status(400).json({ message: "Value is required" });
      }

      const at = await AssessmentType.findById(assessmentTypeId);
      if (!at) {
        return res.status(404).json({ message: "Assessment type not found" });
      }

      const computedScore =
        typeof manualScore === "number"
          ? manualScore
          : calculateScore(at, value);

      const ar = new AssessmentResult({
        academyCode,
        studentId,
        assessmentTypeId,
        value,
        score: computedScore,
        attemptDate: attemptDate ? new Date(attemptDate) : new Date(),
        addedBy: req.user?.id || req.user?.name,
        note: note || "",
      });

      await ar.save();
      res.json(ar);
    } catch (err) {
      console.error("ASSESSMENT RESULT CREATE ERROR:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// GET all results for a student
router.get(
  "/students/:studentId/results",
  authMiddleware,
  async (req, res) => {
    try {
      const academyCode = req.academyCode;
      const { studentId } = req.params;

      if (!mongoose.isValidObjectId(studentId)) {
        return res.status(400).json({ message: "Invalid studentId" });
      }

      const results = await AssessmentResult.find({
        academyCode,
        studentId,
      })
        .populate("assessmentTypeId")
        .sort({ attemptDate: 1 });

      res.json(results);
    } catch (err) {
      console.error("ASSESSMENT RESULT LIST ERROR:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// GET results for specific test
router.get(
  "/students/:studentId/results/:assessmentTypeId",
  authMiddleware,
  async (req, res) => {
    try {
      const academyCode = req.academyCode;
      const { studentId, assessmentTypeId } = req.params;

      if (
        !mongoose.isValidObjectId(studentId) ||
        !mongoose.isValidObjectId(assessmentTypeId)
      ) {
        return res.status(400).json({ message: "Invalid ID(s)" });
      }

      const results = await AssessmentResult.find({
        academyCode,
        studentId,
        assessmentTypeId,
      }).sort({ attemptDate: 1 });

      res.json(results);
    } catch (err) {
      console.error("ASSESSMENT TYPE RESULT ERROR:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// STUDENT SUMMARY
router.get(
  "/students/:studentId/summary",
  authMiddleware,
  async (req, res) => {
    try {
      const academyCode = req.academyCode;
      const { studentId } = req.params;

      if (!mongoose.isValidObjectId(studentId)) {
        return res.status(400).json({ message: "Invalid studentId" });
      }

      const agg = await AssessmentResult.aggregate([
        {
          $match: {
            academyCode,
            studentId: new mongoose.Types.ObjectId(studentId),
          },
        },
        {
          $group: {
            _id: "$assessmentTypeId",
            avgScore: { $avg: "$score" },
            bestScore: { $max: "$score" },
            attempts: { $sum: 1 },
            lastAttempt: { $max: "$attemptDate" },
          },
        },
      ]);

      const populated = await Promise.all(
        agg.map(async (g) => {
          const at = await AssessmentType.findById(g._id);
          return { assessmentType: at, stats: g };
        })
      );

      res.json(populated);
    } catch (err) {
      console.error("ASSESSMENT SUMMARY ERROR:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// DELETE result
router.delete(
  "/result/:id",
  authMiddleware,
  permit("academyAdmin", "teacher"),
  async (req, res) => {
    try {
      const deleted = await AssessmentResult.findByIdAndDelete(req.params.id);

      if (!deleted) {
        return res.status(404).json({ message: "Result not found" });
      }

      res.json({ success: true, message: "Result deleted" });
    } catch (err) {
      console.error("DELETE RESULT ERROR:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// UPDATE result
router.put(
  "/result/:id",
  authMiddleware,
  permit("academyAdmin", "teacher"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { value, note, attemptDate } = req.body;

      const existing = await AssessmentResult.findById(id).populate(
        "assessmentTypeId"
      );

      if (!existing) {
        return res.status(404).json({ message: "Result not found" });
      }

      let newScore = existing.score;
      if (value !== undefined) {
        const type = existing.assessmentTypeId;
        if (type && type.scoring && Array.isArray(type.scoring)) {
          const matched = type.scoring.find(
            (row) => value >= row.min && value <= row.max
          );
          newScore = matched ? matched.score : 0;
        }
      }

      const updated = await AssessmentResult.findByIdAndUpdate(
        id,
        {
          value,
          note,
          score: newScore,
          attemptDate: attemptDate
            ? new Date(attemptDate)
            : existing.attemptDate,
        },
        { new: true }
      );

      res.json(updated);
    } catch (err) {
      console.error("UPDATE RESULT ERROR:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// LAST COMPLETED ASSESSMENT (Student Dashboard)
router.get(
  "/students/:studentId/last-exam",
  authMiddleware,
  async (req, res) => {
    try {
      const academyCode = req.academyCode;
      const { studentId } = req.params;

      const lastResult = await AssessmentResult.findOne({
        academyCode,
        studentId,
      })
        .sort({ attemptDate: -1 })
        .populate("assessmentTypeId", "title unit");

      if (!lastResult) {
        return res.json(null);
      }

      res.json({
        assessmentTitle: lastResult.assessmentTypeId.title,
        unit: lastResult.assessmentTypeId.unit,
        value: lastResult.value,
        score: lastResult.score,
        attemptDate: lastResult.attemptDate,
      });
    } catch (err) {
      console.error("Last exam fetch error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// MULTI TEST ENTRY
router.post(
  "/multi",
  authMiddleware,
  permit("academyAdmin", "teacher"),
  saveMultiTestAssessment
);

module.exports = router;
