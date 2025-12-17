// seedStudentFees.js
require("dotenv").config();
const mongoose = require("mongoose");

const StudentFee = require("./models/StudentFee"); // adjust the path if needed

const run = async () => {
  try {
    console.log("Connecting to MongoDB...");

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log("Connected ✔");

    const academyCode = "shreenath"; // change if needed

    const result = await StudentFee.updateMany(
      {},
      { $set: { academyCode } }
    );

    console.log(`Updated ${result.modifiedCount} fee records 🎉`);
    console.log("Seeding complete.");

    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
};

run();
