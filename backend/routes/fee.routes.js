const express = require("express");
const router = express.Router({ mergeParams: true });

const { authMiddleware, permit } = require("../middleware/auth");
const feeController = require("../controllers/fee.controller");

// Assign fee
router.post(
  "/assign",
  authMiddleware,
  permit("academyAdmin"),
  feeController.assignFee
);

// Record payment
router.post(
  "/pay/:studentFeeId",
  authMiddleware,
  permit("academyAdmin", "teacher"),
  feeController.recordPaymentForStudent
);

// Update fee
router.put(
  "/update/:studentFeeId",
  authMiddleware,
  permit("academyAdmin", "teacher"),
  feeController.updateStudentFee
);

// Get all fees
router.get(
  "/all",
  authMiddleware,
  permit("academyAdmin", "teacher"),
  feeController.getAllStudentsFee
);

// Get student fee
router.get(
  "/student/:studentId",
  authMiddleware,
  feeController.getStudentFee
);

// Payment history
router.get(

  "/history/:studentFeeId",
  authMiddleware,
  feeController.getPaymentHistory
);

module.exports = router;
