const Academy = require("../models/Academy");

module.exports = async function tenantResolver(req, res, next) {
  // ❌ Skip tenant for auth & public & superadmin
  if (
    req.path.startsWith("/auth") ||
    req.path.startsWith("/public") ||
    req.path.startsWith("/superadmin")
  ) {
    return next();
  }

  let subdomain = req.subdomains[0];
  if (subdomain === "www") subdomain = req.subdomains[1];

  if (!subdomain) {
    return res.status(400).json({ message: "Academy subdomain missing" });
  }

  const academy = await Academy.findOne({ code: subdomain });
  if (!academy) {
    return res.status(404).json({ message: "Academy not found" });
  }

  req.academy = academy;
  req.academyCode = academy.code;
  next();
};
