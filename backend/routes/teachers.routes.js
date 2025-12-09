const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const Teacher = require("../models/Teacher");
const { authMiddleware, permit } = require("../middleware/auth");

router.post(
  "/create",
  authMiddleware,
  permit("academyAdmin"),
  async (req, res) => {
    try {
      const academyCode = req.user.academyCode;

      if (!req.body.password) {
        return res.status(400).json({ message: "Password is required" });
      }

      if (!req.body.designation) {
        return res.status(400).json({ message: "Designation is required" });
      }

      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      const teacher = new Teacher({
        ...req.body,
        password: hashedPassword,
        academyCode,
        status: "Active",
      });

      await teacher.save();

      res.json({
        message: "Teacher Registered Successfully",
        teacher,
      });

    } catch (err) {
      console.error("TEACHER REGISTER ERROR:", err);
      res.status(500).json({ message: err.message });
    }
  }
);


//change password for teacher
router.put("/change-password", authMiddleware, async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.user.id);
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    const match = await bcrypt.compare(req.body.currentPassword, teacher.password);
    if (!match) return res.status(400).json({ message: "Incorrect current password" });

    teacher.password = await bcrypt.hash(req.body.newPassword, 10);
    await teacher.save();

    res.json({ message: "Password updated" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



/* ===============================
   GET ALL ACTIVE TEACHERS
================================= */
router.get(
  "/",
  authMiddleware,
  permit("academyAdmin"),  // Only Admin can see teachers
  async (req, res) => {
    try {
      const teachers = await Teacher.find({
        academyCode: req.academyCode,
        status: "Active"
      });

      res.json(teachers);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

/* ===============================
   GET SINGLE TEACHER
================================= */
router.get("/:id", authMiddleware, permit("academyAdmin"), async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    res.json(teacher);
  } catch (err) {
    res.status(400).json({ message: "Invalid Teacher ID" });
  }
});

/* ===============================
   UPDATE TEACHER
================================= */
router.put(
  "/:id",
  authMiddleware,
  permit("academyAdmin"),
  async (req, res) => {
    try {
      const updated = await Teacher.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      res.json(updated);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

/* ===============================
   MARK TEACHER AS LEFT
================================= */
router.put(
  "/:id/leave",
  authMiddleware,
  permit("academyAdmin"),
  async (req, res) => {
    try {
      await Teacher.findByIdAndUpdate(
        req.params.id,
        { status: "Left" },
        { new: true }
      );
      res.json({ message: "Teacher marked as Left" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

/* ===============================
   GET ALL LEFT TEACHERS
================================= */
router.get(
  "/left/all",
  authMiddleware,
  permit("academyAdmin"),
  async (req, res) => {
    try {
      const teachers = await Teacher.find({
        academyCode: req.academyCode,
        status: "Left"
      });

      res.json(teachers);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// Get all left teachers
router.get("/left/all",
  authMiddleware,
  permit("academyAdmin"),
  async (req, res) => {
    try {
      const teachers = await Teacher.find({
        academyCode: req.academyCode,
        status: "Left"
      });

      res.json(teachers);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

router.put("/:id/restore",
  authMiddleware,
  permit("academyAdmin"),
  async (req, res) => {
    try {
      const teacher = await Teacher.findByIdAndUpdate(
        req.params.id,
        { status: "Active" },
        { new: true }
      );

      res.json({ message: "Teacher restored", teacher });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

//password
router.post("/create",
  authMiddleware,
  permit("academyAdmin"),
  async (req, res) => {
    try {
      const academyCode = req.user.academyCode;

      // hash password
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      const teacher = new Teacher({
        ...req.body,
        password: hashedPassword,   // save hashed password
        select: false,
        academyCode
      });

      await teacher.save();

      res.json({ message: "Teacher Registered Successfully", teacher });

    } catch (err) {
      console.error("Teacher Register Error:", err);
      res.status(500).json({ message: err.message });
    }
  }
);

//change password
router.put("/change-password",
  authMiddleware,
  permit("teacher", "academyAdmin"),
  async (req, res) => {
    try {
      const userId = req.user.id;

      const teacher = await Teacher.findById(userId);

      const valid = await bcrypt.compare(req.body.currentPassword, teacher.password);

      if (!valid) return res.status(400).json({ message: "Wrong current password" });

      const newHashed = await bcrypt.hash(req.body.newPassword, 10);

      teacher.password = newHashed;
      await teacher.save();

      res.json({ message: "Password updated successfully" });

    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);



module.exports = router;
