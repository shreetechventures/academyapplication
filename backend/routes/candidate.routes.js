// const express = require("express");
// const router = express.Router();

// const Candidate = require("../models/Candidate");
// const Teacher = require("../models/Teacher");

// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

// const generateStudentCode = require("../utils/studentCodeGenerator");
// const checkStudentLimit = require("../middleware/checkStudentLimit");
// const { authMiddleware, permit } = require("../middleware/auth");
// const { requirePermission } = require("../middleware/permission");

// /* ============================================================
//    ✅ STUDENT LOGIN (PUBLIC – SUBDOMAIN BASED)
//    POST /api/students/login
// ============================================================ */
// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const academyCode = req.academyCode;

//     if (!academyCode) {
//       return res.status(400).json({ message: "Academy context missing" });
//     }

//     const student = await Candidate.findOne({
//       academyCode,
//       email: email.toLowerCase(),
//     });

//     if (!student) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     const match = await bcrypt.compare(password, student.password);
//     if (!match) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     const token = jwt.sign(
//       {
//         id: student._id,
//         role: "student",
//         academyCode,
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: "8h" }
//     );

//     res.json({
//       token,
//       role: "student",
//       name: student.name,
//       userId: student._id.toString(),
//       academyCode,
//     });
//   } catch (err) {
//     console.error("STUDENT LOGIN ERROR:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// /* ============================================================
//    🔐 STUDENT SELF ROUTES (NO requirePermission EVER)
// ============================================================ */

// router.put(
//   "/self/change-password",
//   authMiddleware,
//   permit("student"),
//   async (req, res) => {
//     try {
//       const { currentPassword, newPassword } = req.body;

//       const student = await Candidate.findById(req.user.id);
//       if (!student) {
//         return res.status(404).json({ message: "Student not found" });
//       }

//       const match = await bcrypt.compare(currentPassword, student.password);
//       if (!match) {
//         return res
//           .status(400)
//           .json({ message: "Incorrect current password" });
//       }

//       student.password = await bcrypt.hash(newPassword, 10);
//       await student.save();

//       res.json({ message: "Password updated successfully" });
//     } catch (err) {
//       console.error("STUDENT CHANGE PASSWORD ERROR:", err);
//       res.status(500).json({ message: err.message });
//     }
//   }
// );

// /* ============================================================
//    📊 DASHBOARD COUNTS (ADMIN / TEACHER)
// ============================================================ */

// router.get("/dashboard/students/active", authMiddleware, async (req, res) => {
//   const count = await Candidate.countDocuments({
//     academyCode: req.academyCode,
//     status: "Active",
//   });
//   res.json({ count });
// });

// router.get("/dashboard/students/left", authMiddleware, async (req, res) => {
//   const count = await Candidate.countDocuments({
//     academyCode: req.academyCode,
//     status: "Left",
//   });
//   res.json({ count });
// });

// router.get("/dashboard/trainers", authMiddleware, async (req, res) => {
//   const count = await Teacher.countDocuments({
//     academyCode: req.academyCode,
//   });
//   res.json({ count });
// });

// /* ============================================================
//    👨‍🏫 ADMIN / TEACHER ROUTES (WITH PERMISSIONS)
// ============================================================ */

// router.post(
//   "/create",
//   authMiddleware,
//   requirePermission("studentRegistration"),
//   checkStudentLimit,
//   async (req, res) => {
//     try {
//       const academyCode = req.academyCode;

//       const studentCode = await generateStudentCode(academyCode);

//       const age =
//         new Date().getFullYear() -
//         new Date(req.body.dateOfBirth).getFullYear();

//       const hashedPassword = await bcrypt.hash(req.body.password, 10);

//       const candidate = new Candidate({
//         ...req.body,
//         password: hashedPassword,
//         academyCode,
//         studentCode,
//         age,
//       });

//       await candidate.save();
//       res.json(candidate);
//     } catch (err) {
//       console.error("CREATE STUDENT ERROR:", err);
//       res.status(500).json({ message: err.message });
//     }
//   }
// );

// router.get(
//   "/",
//   authMiddleware,
//   permit("academyAdmin", "teacher"),
//   async (req, res) => {
//     const students = await Candidate.find({
//       academyCode: req.academyCode,
//       status: "Active",
//     });
//     res.json(students);
//   }
// );

// /* ============================================================
//    🚨 KEEP ALL :id ROUTES AT THE VERY END
// ============================================================ */

// router.get("/:id", authMiddleware, async (req, res) => {
//   const student = await Candidate.findById(req.params.id);
//   if (!student) {
//     return res.status(404).json({ message: "Student not found" });
//   }
//   res.json(student);
// });

// router.put(
//   "/:id",
//   authMiddleware,
//   requirePermission("studentRegistration"),
//   async (req, res) => {
//     const updated = await Candidate.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );
//     res.json(updated);
//   }
// );

// router.delete(
//   "/:id",
//   authMiddleware,
//   requirePermission("studentRegistration"),
//   async (req, res) => {
//     await Candidate.findByIdAndDelete(req.params.id);
//     res.json({ success: true });
//   }
// );

// router.put(
//   "/:id/leave",
//   authMiddleware,
//   requirePermission("studentRegistration"),
//   async (req, res) => {
//     const student = await Candidate.findByIdAndUpdate(
//       req.params.id,
//       { status: "Left" },
//       { new: true }
//     );
//     res.json({ message: "Student marked as Left", student });
//   }
// );

// /* ============================================================
//    📌 GET ALL LEFT STUDENTS
// ============================================================ */

// router.get(
//   "/left/all",
//   authMiddleware,
//   permit("academyAdmin", "teacher"),
//   async (req, res) => {
//     try {
//       const students = await Candidate.find({
//         academyCode: req.academyCode,
//         status: "Left",
//       });

//       res.json(students);
//     } catch (err) {
//       res.status(500).json({ message: err.message });
//     }
//   }
// );

// module.exports = router;




const express = require("express");
const router = express.Router();

const Candidate = require("../models/Candidate");
const Teacher = require("../models/Teacher");
const StudentBillingFee = require("../models/StudentBillingFee");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateStudentCode = require("../utils/studentCodeGenerator");
const checkStudentLimit = require("../middleware/checkStudentLimit");
const { authMiddleware, permit } = require("../middleware/auth");
const { requirePermission } = require("../middleware/permission");

/* ============================================================
   ✅ STUDENT LOGIN (PUBLIC – SUBDOMAIN BASED)
============================================================ */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const academyCode = req.academyCode;

    if (!academyCode) {
      return res.status(400).json({ message: "Academy context missing" });
    }

    const student = await Candidate.findOne({
      academyCode,
      email: email.toLowerCase(),
    });

    if (!student) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, student.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: student._id,
        role: "student",
        academyCode,
      },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({
      token,
      role: "student",
      name: student.name,
      userId: student._id.toString(),
      academyCode,
    });
  } catch (err) {
    console.error("STUDENT LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ============================================================
   🔐 STUDENT SELF ROUTES
============================================================ */
router.put(
  "/self/change-password",
  authMiddleware,
  permit("student"),
  async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;

      const student = await Candidate.findById(req.user.id);
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }

      const match = await bcrypt.compare(currentPassword, student.password);
      if (!match) {
        return res
          .status(400)
          .json({ message: "Incorrect current password" });
      }

      student.password = await bcrypt.hash(newPassword, 10);
      await student.save();

      res.json({ message: "Password updated successfully" });
    } catch (err) {
      console.error("STUDENT CHANGE PASSWORD ERROR:", err);
      res.status(500).json({ message: err.message });
    }
  }
);

/* ============================================================
   👨‍🏫 CREATE STUDENT (ADMIN / TEACHER)
============================================================ */
router.post(
  "/create",
  authMiddleware,
  requirePermission("studentRegistration"),
  checkStudentLimit,
  async (req, res) => {
    try {
      const academyCode = req.academyCode;

      const studentCode = await generateStudentCode(academyCode);

      const age =
        new Date().getFullYear() -
        new Date(req.body.dateOfBirth).getFullYear();

      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      const candidate = new Candidate({
        ...req.body,
        password: hashedPassword,
        academyCode,
        studentCode,
        age,
      });

      await candidate.save();

      /* =====================================================
         ✅ CREATE INITIAL BILLING (🔥 THIS FIXES YOUR ISSUE)
      ===================================================== */
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);

      await StudentBillingFee.create({
        academyCode,
        studentId: candidate._id,
        periodStart: startDate,
        periodEnd: endDate,
        baseFee: candidate.currentFee || 0,
        finalFee: candidate.currentFee || 0,
        paidAmount: 0,
        status: "pending",
      });

      res.json(candidate);
    } catch (err) {
      console.error("CREATE STUDENT ERROR:", err);
      res.status(500).json({ message: err.message });
    }
  }
);

/* ============================================================
   📋 LIST STUDENTS
============================================================ */
router.get(
  "/",
  authMiddleware,
  permit("academyAdmin", "teacher"),
  async (req, res) => {
    const students = await Candidate.find({
      academyCode: req.academyCode,
      status: "Active",
    });
    res.json(students);
  }
);

/* ============================================================
   🚨 KEEP ID ROUTES LAST
============================================================ */
router.get("/:id", authMiddleware, async (req, res) => {
  const student = await Candidate.findById(req.params.id);
  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }
  res.json(student);
});

router.put(
  "/:id",
  authMiddleware,
  requirePermission("studentRegistration"),
  async (req, res) => {
    const updated = await Candidate.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  }
);

router.delete(
  "/:id",
  authMiddleware,
  requirePermission("studentRegistration"),
  async (req, res) => {
    await Candidate.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  }
);

router.put(
  "/:id/leave",
  authMiddleware,
  requirePermission("studentRegistration"),
  async (req, res) => {
    const student = await Candidate.findByIdAndUpdate(
      req.params.id,
      { status: "Left" },
      { new: true }
    );
    res.json({ message: "Student marked as Left", student });
  }
);

router.get(
  "/left/all",
  authMiddleware,
  permit("academyAdmin", "teacher"),
  async (req, res) => {
    const students = await Candidate.find({
      academyCode: req.academyCode,
      status: "Left",
    });
    res.json(students);
  }
);

module.exports = router;
