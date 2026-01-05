const Academy = require("../models/Academy");

module.exports = async function tenantResolver(req, res, next) {
  console.log("🌍 Incoming URL:", req.originalUrl);
  console.log("🌍 Host:", req.headers.host);
  console.log("🌍 Subdomains:", req.subdomains);

  if (
    req.originalUrl.startsWith("/api/auth") ||
    req.originalUrl.startsWith("/api/public") ||
    req.originalUrl.startsWith("/api/superadmin")
  ) {
    console.log("⏭️ Skipping tenant resolver (public/auth)");
    return next();
  }

  let subdomain = req.subdomains[0];
  if (subdomain === "www") subdomain = req.subdomains[1];

  console.log("🏫 Resolved subdomain:", subdomain);

  if (!subdomain) {
    console.log("❌ No subdomain found");
    return res.status(400).json({ message: "Academy subdomain missing" });
  }

  console.log("🔍 Searching academy with academyCode =", subdomain);

  // ❌ CURRENTLY WRONG (INTENTIONAL FOR LOGGING)
  const academy = await Academy.findOne({ code: subdomain });

  console.log("🏫 Academy DB result:", academy);

  if (!academy) {
    console.log("❌ Academy NOT FOUND");
    return res.status(404).json({ message: "Academy not found" });
  }

  req.academy = academy;
  req.academyCode = academy.code;

  console.log("✅ Tenant resolved:", req.academyCode);
  next();
};
