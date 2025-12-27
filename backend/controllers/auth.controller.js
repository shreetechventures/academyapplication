// controllers/auth.controller.js

const Academy = require("../models/Academy");
const User = require("../models/User");

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // ✅ CHECK ACADEMY STATUS
  const academy = await Academy.findOne({ code: user.academyCode });
  if (!academy || !academy.isActive) {
    return res.status(403).json({
      message: "Academy is disabled. Contact super admin.",
    });
  }

  // 🔐 Password check
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // generate token...
};
