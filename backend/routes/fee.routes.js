// backend/routes/fee.routes.js

const express = require("express");
const router = express.Router({ mergeParams: true });

const { authMiddleware, permit } = require("../middleware/auth");
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

/* ===================== SUMMARY ===================== */

// academy fee summary
router.get(
  "/summary",
  authMiddleware,
  // canManageFees, // or 
  permit("academyAdmin"),
  feeController.getAcademyFeeSummary
);


module.exports = router;
