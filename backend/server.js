console.log("🔥 SERVER FILE UPDATED AT", new Date().toISOString());

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDB = require("./utils/db");
const tenantResolver = require("./middleware/tenantResolver");

// ROUTES
const publicRoutes = require("./routes/public.routes");
const authRoutes = require("./routes/auth.routes");
const superAdminRoutes = require("./routes/superAdmin.routes");

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

// ✅ CREATE APP FIRST
const app = express();

/* ============================
   🌐 CORS (EXPRESS 4 SAFE)
============================ */
const corsOptions = {
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// ✅ Manual preflight handler (NO app.options("*"))
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

app.use(express.json());
app.set("subdomain offset", 2);

/* ============================
   🌍 PUBLIC + AUTH (NO TENANT)
============================ */
app.use("/api/public", publicRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/superadmin", superAdminRoutes);

/* ============================
   🏫 TENANT RESOLVER
============================ */
app.use("/api", tenantResolver);

/* ============================
   🏫 TENANT ROUTES
============================ */
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

// STATIC FILES
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ============================
   🚀 START SERVER
============================ */
const start = async () => {
  await connectDB(process.env.MONGO_URI);
  console.log("✅ Mongo connected");

  const port = process.env.PORT || 5000;
  app.listen(port, "0.0.0.0", () =>
    console.log(`🚀 Server running on port ${port}`)
  );
};

start();
