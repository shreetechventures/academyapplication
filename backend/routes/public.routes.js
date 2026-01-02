const express = require("express");
const router = express.Router();
const PlanEnquiry = require("../models/PlanEnquiry");

/* ======================================================
   📩 CREATE PLAN ENQUIRY (PUBLIC)
   POST /api/plan-enquiry
====================================================== */
router.post("/plan-enquiry", async (req, res) => {
  try {
    let {
      academyName,
      adminName,
      phone,
      city,
      plan,
      message,
    } = req.body;

    // 🧼 Normalize input
    academyName = academyName?.trim();
    adminName = adminName?.trim();
    phone = phone?.trim();
    city = city?.trim();
    plan = plan?.trim();
    message = message?.trim() || "";

    if (!academyName || !adminName || !phone || !city || !plan) {
      return res.status(400).json({
        message: "All required fields must be filled",
      });
    }

    // 📞 Basic phone validation (India-safe, non-breaking)
    if (!/^[0-9+]{10,15}$/.test(phone)) {
      return res.status(400).json({
        message: "Invalid phone number",
      });
    }

    const enquiry = await PlanEnquiry.create({
      academyName,
      adminName,
      phone,
      city,
      plan,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully",
      enquiryId: enquiry._id,
    });
  } catch (err) {
    console.error("PLAN ENQUIRY ERROR:", err);
    res.status(500).json({
      message: "Server error",
    });
  }
});

module.exports = router;
