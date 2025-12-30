// require("dotenv").config();

// const express = require("express");
// const cors = require("cors");
// const path = require("path");

// const connectDB = require("./utils/db");
// const Academy = require("./models/Academy");

// const lessonsRoute = require("./routes/lessons.routes");

// // Create App
// const app = express();

// // Middlewares
// app.use(cors());
// app.use(express.json());

// // -----------------------------------------------
// // Seed Function (Runs ONLY Once)
// // -----------------------------------------------
// async function insertMany() {
//   try {
//     const count = await Academy.countDocuments();
//     // console.log("xyz",count);

//     if (count > 0) {
//       console.log("⚠️ Academies already exist. Skipping seed.");
//       return;
//     }

//     await Academy.insertMany([
//       {
//         _id: "69365933d7e7daa1ada5874a",
//         code: "shreenath",
//         name: "Shreenath Career Academy",
//         createdAt: new Date("2025-12-08T04:50:59.483Z"),
//       },
//       {
//         _id: "69365933d7e7daa1ada5874b",
//         code: "commando",
//         name: "Commando Academy",
//         createdAt: new Date("2025-12-08T04:50:59.484Z"),
//       },
//     ]);

//     console.log("✅ Academy Seed Data Inserted");
//   } catch (err) {
//     console.error("❌ Seed Insert Error:", err.message);
//   }
// }

// // -----------------------------------------------
// // Lessons route (global)
// // -----------------------------------------------
// app.use("/api/:academyCode/lessons", lessonsRoute);

// // -----------------------------------------------
// // Extract academyCode from path automatically
// // -----------------------------------------------
// app.use((req, res, next) => {
//   const parts = req.path.split("/").filter(Boolean);

//   if (parts[0] === "api" && parts[1]) {
//     req.academyCode = parts[1];
//   }
//   next();
// });

// // -----------------------------------------------
// // Import all other routes
// // -----------------------------------------------
// app.use("//academy", require("./routes/academy.routes"));
// app.use("/api/:academyCode/auth", require("./routes/auth.routes"));
// app.use("/api/:academyCode/admin", require("./routes/admin.routes"));
// app.use("/api/:academyCode/students", require("./routes/candidate.routes"));
// app.use("/api/:academyCode/teachers", require("./routes/teachers.routes"));
// app.use("/api/:academyCode/dashboard", require("./routes/dashboard.routes"));
// app.use("/api/:academyCode/lesson-folders", require("./routes/lessonFolders.routes"));
// app.use("/api/:academyCode/assessments", require("./routes/assessments.routes"));
// app.use("/api", require("./routes/champions.routes"));

// // -----------------------------------------------
// // Static uploads
// // -----------------------------------------------
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// // Root test
// app.get("/", (req, res) => {
//   res.send("Academy Server Running...");
// });

// // -----------------------------------------------
// // Start Server
// // -----------------------------------------------
// const start = async () => {
//   try {
//     await connectDB(process.env.MONGO_URI);
//     console.log("✅ Mongo connected");

//     await insertMany(); // Run seed AFTER DB connects

//     const port = process.env.PORT || 5000;
//     app.listen(port, () => console.log(`✅ Server running on port ${port}`));
//   } catch (err) {
//     console.error("❌ Server failed:", err.message);
//   }
// };

// start();

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDB = require("./utils/db");
const Academy = require("./models/Academy");

// ===============================
// ROUTES
// ===============================
const superAdminRoutes = require("./routes/superAdmin.routes");
const lessonsRoute = require("./routes/lessons.routes");
const feeRoutes = require("./routes/fee.routes");
const settingsRoutes = require("./routes/settings.routes");

// ===============================
// CREATE APP
// ===============================
const app = express();

// ===============================
// GLOBAL MIDDLEWARES
// ===============================
app.use(cors());
app.use(express.json());

// ============================================================================
// ✅ SUPERADMIN ROUTES (SYSTEM LEVEL – NO academyCode)
// MUST BE FIRST
// ============================================================================
app.use("/api/superadmin", superAdminRoutes);

// ============================================================================
// 🌱 SEED ACADEMIES (RUNS ONLY ONCE)
// ============================================================================
async function insertMany() {
  try {
    const count = await Academy.countDocuments();

    if (count > 0) {
      console.log("⚠️ Academies already exist. Skipping seed.");
      return;
    }

    await Academy.insertMany([
      {
        _id: "69365933d7e7daa1ada5874a",
        code: "shreenath",
        name: "Shreenath Career Academy",
        createdAt: new Date("2025-12-08T04:50:59.483Z"),
      },
      {
        _id: "69365933d7e7daa1ada5874b",
        code: "commando",
        name: "Commando Academy",
        createdAt: new Date("2025-12-08T04:50:59.484Z"),
      },
    ]);

    console.log("✅ Academy seed inserted successfully");
  } catch (err) {
    console.error("❌ Seed Insert Error:", err.message);
  }
}

// ============================================================================
// 🔐 TENANT academyCode EXTRACTOR (ONLY FOR TENANT ROUTES)
// ============================================================================
app.use("/api/:academyCode", (req, res, next) => {
  req.academyCode = req.params.academyCode;
  next();
});

// ============================================================================
// 📌 TENANT ROUTES (academyCode REQUIRED)
// ============================================================================
app.use("/api/:academyCode/auth", require("./routes/auth.routes"));
app.use("/api/:academyCode/admin", require("./routes/admin.routes"));
app.use("/api/:academyCode/students", require("./routes/candidate.routes"));
app.use("/api/:academyCode/teachers", require("./routes/teachers.routes"));
app.use("/api/:academyCode/dashboard", require("./routes/dashboard.routes"));
app.use("/api/:academyCode/lessons", lessonsRoute);
app.use("/api/:academyCode/lesson-folders", require("./routes/lessonFolders.routes"));
app.use("/api/:academyCode/assessments", require("./routes/assessments.routes"));
app.use("/api/:academyCode/champions", require("./routes/champions.routes"));
app.use("/api/:academyCode/fees", feeRoutes);
app.use("/api/:academyCode/settings", settingsRoutes);
app.use("/api/:academyCode", require("./routes/academy.routes"));

// ============================================================================
// 📁 STATIC FILES
// ============================================================================
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ============================================================================
// 🧪 ROOT TEST
// ============================================================================
app.get("/", (req, res) => {
  res.send("Academy Server Running...");
});

// ============================================================================
// 🚀 START SERVER
// ============================================================================
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log("✅ Mongo connected");

    await insertMany();

    const port = process.env.PORT || 5000;
    app.listen(port, "0.0.0.0", () =>
      console.log(`🚀 Server running on port ${port}`)
    );
  } catch (err) {
    console.error("❌ Server failed:", err.message);
  }
};

start();
