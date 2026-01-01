const express = require("express");
const router = express.Router();
const PlanEnquiry = require("../models/PlanEnquiry");

// CREATE ENQUIRY
router.post("/plan-enquiry", async (req, res) => {
  try {
    const {
      academyName,
      adminName,
      phone,
      city,
      plan,
      message,
    } = req.body;

    if (!academyName || !adminName || !phone || !city || !plan) {
      return res.status(400).json({
        message: "All required fields must be filled",
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
      message: "Enquiry submitted successfully",
      enquiryId: enquiry._id,
    });
  } catch (err) {
    console.error("Enquiry Error:", err);
    res.status(500).json({
      message: "Server error",
    });
  }
});

module.exports = router;
