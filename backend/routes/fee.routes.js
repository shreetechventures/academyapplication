// const express = require("express");
// const router = express.Router({ mergeParams: true });

// const { authMiddleware, permit } = require("../middleware/auth");
// const feeController = require("../controllers/fee.controller");

// // Assign fee
// router.post(
//   "/assign",
//   authMiddleware,
//   permit("academyAdmin"),
//   feeController.assignFee
// );

// // Record payment
// router.post(
//   "/pay/:studentFeeId",
//   authMiddleware,
//   // permit("academyAdmin", "teacher"),
//     canManageFees, // 🔥 HERE

//   feeController.recordPaymentForStudent
// );

// // Update fee
// router.put(
//   "/update/:studentFeeId",
//   authMiddleware,
//   permit("academyAdmin", "teacher"),
//   feeController.updateStudentFee
// );

// // Get all fees
// router.get(
//   "/all",
//   authMiddleware,
//   permit("academyAdmin", "teacher"),
//   feeController.getAllStudentsFee
// );

// // Get student fee
// router.get(
//   "/student/:studentId",
//   authMiddleware,
//   feeController.getStudentFee
// );

// // Payment history
// router.get(

//   "/history/:studentFeeId",
//   authMiddleware,
//   feeController.getPaymentHistory
// );

// module.exports = router;

// const express = require("express");
// const router = express.Router({ mergeParams: true });

// const { authMiddleware } = require("../middleware/auth");
// const { canManageFees } = require("../middleware/feePermission");
// const feeController = require("../controllers/fee.controller");
// const { requirePermission } = require("../middleware/permission");

// router.put(
//   "/billing/:billingId/amount",
//   authMiddleware,
//   canManageFees,
//   requirePermission("fee"),
//   feeController.updateBillingFeeAmount
// );

// // Assign fee → ADMIN ONLY
// router.post(
//   "/assign",
//   authMiddleware,
//   canManageFees,
//     requirePermission("fee"),

//   feeController.assignFee
// );

// // Record payment
// router.post(
//   "/pay/:studentFeeId",
//   authMiddleware,
//   canManageFees,
//     requirePermission("fee"),

//   // feeController.recordPaymentForStudent
//   feeController.assignFee
// );

// // Update fee
// router.put(
//   "/update/:studentFeeId",
//   authMiddleware,
//   canManageFees,
//   // feeController.updateStudentFee
// feeController.updateStudentFee
// );

// // Get all fees
// router.get(
//   "/all",
//   authMiddleware,
//   canManageFees,
//   feeController.getAllStudentsFee
// );

// // Get student fee (view only → all roles)
// router.get(
//   "/student/:studentId",
//   authMiddleware,
//   feeController.getStudentFee
// );

// // Payment history (view only)
// router.get(
//   "/history/:studentFeeId",
//   authMiddleware,
//   feeController.getPaymentHistory
// );

// module.exports = router;






// backend/routes/fee.routes.js

const express = require("express");
const router = express.Router({ mergeParams: true });

const { authMiddleware } = require("../middleware/auth");
const { canManageFees } = require("../middleware/feePermission");

const feeController = require("../controllers/fee.controller");

/* ===================== STUDENT ===================== */

// billing cycles
router.get(
  "/student/:studentId/billing",
  authMiddleware,
  feeController.getStudentBillingCycles
);

// billing summary (optional, if you use it)
router.get(
  "/student/:studentId/summary",
  authMiddleware,
  feeController.getStudentFeeSummary
);

/* ===================== ADMIN / TEACHER ===================== */

// set / update billing fee
router.put(
  "/billing/:billingId/amount",
  authMiddleware,
  canManageFees,
  feeController.updateBillingFeeAmount
);

// pay billing fee
router.post(
  "/billing/:billingId/pay",
  authMiddleware,
  canManageFees,
  feeController.payBillingFee
);

// payment history
router.get(
  "/billing/:billingId/history",
  authMiddleware,
  feeController.getBillingPaymentHistory
);

router.put(
  "/billing/:billingId/discount",
  authMiddleware,
  canManageFees,
  feeController.applyDiscount
);

module.exports = router;
