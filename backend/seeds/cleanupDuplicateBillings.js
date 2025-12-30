// backend/seeds/cleanupDuplicateBillings.js

require("dotenv").config();
const mongoose = require("mongoose");

const StudentBillingFee = require("../models/StudentBillingFee");

const MONGO_URI = process.env.MONGO_URI;

async function cleanupDuplicateBillings() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected");

    // 1️⃣ Find duplicates by student + month + year
    const duplicates = await StudentBillingFee.aggregate([
      {
        $group: {
          _id: {
            studentId: "$studentId",
            year: { $year: "$periodStart" },
            month: { $month: "$periodStart" },
          },
          count: { $sum: 1 },
          ids: { $push: "$_id" },
        },
      },
      { $match: { count: { $gt: 1 } } },
    ]);

    if (duplicates.length === 0) {
      console.log("🎉 No duplicate billing records found");
      process.exit(0);
    }

    console.log(`⚠️ Found ${duplicates.length} duplicate month groups`);

    // 2️⃣ Remove duplicates (keep earliest)
    for (const dup of duplicates) {
      const { ids } = dup;

      // Fetch full records sorted by createdAt
      const records = await StudentBillingFee.find({
        _id: { $in: ids },
      }).sort({ createdAt: 1 });

      // Keep first, remove rest
      const toDelete = records.slice(1).map((r) => r._id);

      if (toDelete.length > 0) {
        await StudentBillingFee.deleteMany({
          _id: { $in: toDelete },
        });

        console.log(
          `🗑️ Removed ${toDelete.length} duplicate(s) for student ${dup._id.studentId} | ${dup._id.month}/${dup._id.year}`
        );
      }
    }

    console.log("✅ Duplicate cleanup completed");
    process.exit(0);
  } catch (err) {
    console.error("❌ Cleanup failed:", err);
    process.exit(1);
  }
}

cleanupDuplicateBillings();
