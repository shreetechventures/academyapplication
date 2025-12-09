
// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
// const User = require('./models/User');

// mongoose.connect('mongodb://127.0.0.1:27017/academydb', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });

// async function seedUser() {
//   try {

//     // Remove old users (optional)
//     await User.deleteMany();

//     // Plain password
//     const plainPassword = "123456";

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(plainPassword, 10);

//     // Create user with hashed password
//     const user = await User.create({
//       name: "Shreenath Admin",
//       email: "admin@shreenath.com",
//       passwordHash: hashedPassword,   // ✅ STORE HASHED PASSWORD
//       role: "academyAdmin",
//       academyCode: "shreenath"
//     });

//     console.log("✅ User inserted with hashed password:");
//     console.log({
//       email: user.email,
//       role: user.role,
//       academyCode: user.academyCode
//     });

//     process.exit();

//   } catch (err) {
//     console.error("❌ Error seeding user:", err);
//     process.exit();
//   }
// }

// seedUser();



const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

mongoose.connect("mongodb://127.0.0.1:27017/academydb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function seedUsers() {
  try {
    console.log("🔄 Removing old users (optional)...");
    await User.deleteMany(); // remove old users only

    // password
    const plainPassword = "123456";
    const hashed = await bcrypt.hash(plainPassword, 10);

    console.log("👤 Creating admin users...");

    await User.create([
      {
        name: "Shreenath Admin",
        email: "admin@shreenath.com",
        passwordHash: hashed,
        role: "academyAdmin",
        academyCode: "shreenath",
      },
      {
        name: "Commando Admin",
        email: "admin@commando.com",
        passwordHash: hashed,
        role: "academyAdmin",
        academyCode: "commando",
      },
            {
        name: "Demo Admin",
        email: "demo@admin.com",
        passwordHash: hashed,
        role: "academyAdmin",
        academyCode: "demoadmin",
      },
    ]);

    console.log("🎉 Users seeded successfully!");
    process.exit();

  } catch (err) {
    console.error("❌ Error while seeding users:", err);
    process.exit();
  }
}

seedUsers();
