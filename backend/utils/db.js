// backend/utils/db.js
const mongoose = require("mongoose");

module.exports = async function connectDB(uri) {
  if (!uri) {
    console.error("❌ MONGO_URI is missing in environment variables");
    process.exit(1); // stop PM2 restart loop
  }

  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};
