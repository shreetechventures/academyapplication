// require("dotenv").config();

// const express = require("express");
// const cors = require("cors");
// const path = require("path");

// const connectDB = require("./utils/db");
// const Academy = require("./models/Academy");

// // ===============================
// // ROUTES
// // ===============================
// const superAdminRoutes = require("./routes/superAdmin.routes");
// const lessonsRoute = require("./routes/lessons.routes");
// const feeRoutes = require("./routes/fee.routes");
// const settingsRoutes = require("./routes/settings.routes");
// const publicRoutes = require("./routes/public.routes");

// // ===============================
// // CREATE APP
// // ===============================
// const app = express();

// // ===============================
// // GLOBAL MIDDLEWARES
// // ===============================
// app.use(cors());
// app.use(express.json());

// // ============================================================================
// // ✅ SUPERADMIN ROUTES (SYSTEM LEVEL – NO academyCode)
// // MUST BE FIRST
// // ============================================================================
// app.use("/api/public", publicRoutes);

// app.use("/api/superadmin", superAdminRoutes);

// // ============================================================================
// // 🌱 SEED ACADEMIES (RUNS ONLY ONCE)
// // ============================================================================
// async function insertMany() {
//   try {
//     const count = await Academy.countDocuments();

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

//     console.log("✅ Academy seed inserted successfully");
//   } catch (err) {
//     console.error("❌ Seed Insert Error:", err.message);
//   }
// }

// // ============================================================================
// // 🔐 TENANT academyCode EXTRACTOR (ONLY FOR TENANT ROUTES)
// // ============================================================================
// app.use("/api/:academyCode", (req, res, next) => {
//   req.academyCode = req.params.academyCode;
//   next();
// });

// // ============================================================================
// // 📌 TENANT ROUTES (academyCode REQUIRED)
// // ============================================================================
// app.use("/api/:academyCode/auth", require("./routes/auth.routes"));
// app.use("/api/:academyCode/admin", require("./routes/admin.routes"));
// app.use("/api/:academyCode/students", require("./routes/candidate.routes"));
// app.use("/api/:academyCode/teachers", require("./routes/teachers.routes"));
// app.use("/api/:academyCode/dashboard", require("./routes/dashboard.routes"));
// app.use("/api/:academyCode/lessons", lessonsRoute);
// app.use("/api/:academyCode/lesson-folders", require("./routes/lessonFolders.routes"));
// app.use("/api/:academyCode/assessments", require("./routes/assessments.routes"));
// app.use("/api/:academyCode/champions", require("./routes/champions.routes"));
// app.use("/api/:academyCode/fees", feeRoutes);
// app.use("/api/:academyCode/settings", settingsRoutes);
// app.use("/api/:academyCode", require("./routes/academy.routes"));

// // ============================================================================
// // 📁 STATIC FILES
// // ============================================================================
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// // ============================================================================
// // 🧪 ROOT TEST
// // ============================================================================
// app.get("/", (req, res) => {
//   res.send("Academy Server Running...");
// });

// // ============================================================================
// // 🚀 START SERVER
// // ============================================================================
// const start = async () => {
//   try {
//     await connectDB(process.env.MONGO_URI);
//     console.log("✅ Mongo connected");

//     await insertMany();

//     const port = process.env.PORT || 5000;
//     app.listen(port, "0.0.0.0", () =>
//       console.log(`🚀 Server running on port ${port}`)
//     );
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
const publicRoutes = require("./routes/public.routes");
const superAdminRoutes = require("./routes/superAdmin.routes");

const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");
const studentRoutes = require("./routes/candidate.routes");
const teacherRoutes = require("./routes/teachers.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const lessonsRoutes = require("./routes/lessons.routes");
const lessonFoldersRoutes = require("./routes/lessonFolders.routes");
const assessmentRoutes = require("./routes/assessments.routes");
const championsRoutes = require("./routes/champions.routes");
const feeRoutes = require("./routes/fee.routes");
const settingsRoutes = require("./routes/settings.routes");
const academyRoutes = require("./routes/academy.routes");

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
// 🌍 PUBLIC & SUPERADMIN (NO TENANT)
// ============================================================================
app.use("/api/public", publicRoutes);
app.use("/api/superadmin", superAdminRoutes);

// ============================================================================
// 🏫 TENANT RESOLVER (SUBDOMAIN → academyCode)
// ============================================================================
// ============================================================================
// 🏫 TENANT RESOLVER (SUBDOMAIN → academyCode)
// SKIP public & superadmin
// ============================================================================
app.use("/api", async (req, res, next) => {
  // ⛔ Skip non-tenant routes
  if (
    req.path.startsWith("/public") ||
    req.path.startsWith("/superadmin")
  ) {
    return next();
  }

  const subdomain = req.subdomains[0];

  if (!subdomain) {
    return res.status(400).json({ message: "Academy subdomain missing" });
  }

  const academy = await Academy.findOne({ code: subdomain });

  if (!academy) {
    return res.status(404).json({ message: "Academy not found" });
  }

  req.academyCode = academy.code;
  req.academy = academy;

  next();
});


// ============================================================================
// 🏫 TENANT ROUTES (NO academyCode in URL anymore)
// ============================================================================
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/lessons", lessonsRoutes);
app.use("/api/lesson-folders", lessonFoldersRoutes);
app.use("/api/assessments", assessmentRoutes);
app.use("/api/champions", championsRoutes);
app.use("/api/fees", feeRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/academy", academyRoutes);

// ============================================================================
// 📁 STATIC FILES
// ============================================================================
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ============================================================================
// 🚀 START SERVER
// ============================================================================
const start = async () => {
  await connectDB(process.env.MONGO_URI);
  console.log("✅ Mongo connected");

  const port = process.env.PORT || 5000;
  app.listen(port, "0.0.0.0", () =>
    console.log(`🚀 Server running on port ${port}`)
  );
};

start();
