require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

async function seedSuperAdmin() {
  await mongoose.connect(process.env.MONGO_URI);

  const exists = await User.findOne({ role: "superadmin" });
  if (exists) {
    console.log("⚠️ SuperAdmin already exists");
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash("123456", 10);

  await User.create({
    name: "Super Admin",
    email: "superadmin@careeracademy.com",
    passwordHash,
    role: "superadmin",
    academyCode: null,
    createdBy: null
  });

  console.log("✅ SuperAdmin created successfully");
  process.exit(0);
}

seedSuperAdmin();
