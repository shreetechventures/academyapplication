const express = require("express");
const router = express.Router();

const { authMiddleware, permit } = require("../middleware/auth");
const { canManageFees } = require("../middleware/feePermission");

const feeController = require("../controllers/fee.controller");


console.log("authMiddleware =", typeof authMiddleware);
console.log("canManageFees =", typeof canManageFees);
console.log(
  "getAcademyFeeSummary =",
  typeof feeController.getAcademyFeeSummary
);


/* ===================== STUDENT ===================== */

// 📅 Billing cycles (admin / teacher / student)
router.get(
  "/student/:studentId/billing",
  authMiddleware,
  feeController.getStudentBillingCycles
);

// 📊 Billing summary (optional)
router.get(
  "/student/:studentId/summary",
  authMiddleware,
  feeController.getStudentFeeSummary
);

/* ===================== ADMIN / TEACHER ===================== */

// ✏️ Set / update billing fee
router.put(
  "/billing/:billingId/amount",
  authMiddleware,
  canManageFees,
  feeController.updateBillingFeeAmount
);

// 💰 Pay billing fee
router.post(
  "/billing/:billingId/pay",
  authMiddleware,
  canManageFees,
  feeController.payBillingFee
);

// 📜 Payment history
router.get(
  "/billing/:billingId/history",
  authMiddleware,
  feeController.getBillingPaymentHistory
);

// 💸 Apply discount
router.put(
  "/billing/:billingId/discount",
  authMiddleware,
  canManageFees,
  feeController.applyDiscount
);

/* ===================== SUMMARY ===================== */

// 🧾 Academy fee summary (ADMIN only)
router.get(
  "/summary",
  authMiddleware,
  canManageFees,
  feeController.getAcademyFeeSummary
);

module.exports = router;
