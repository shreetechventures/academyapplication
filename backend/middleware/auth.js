// backend/middleware/auth.js

const jwt = require('jsonwebtoken');


const authMiddleware = (req, res, next) => {
const header = req.headers.authorization;
if (!header) return res.status(401).json({ message: 'Missing token' });
const token = header.split(' ')[1];
try {
const payload = jwt.verify(token, process.env.JWT_SECRET);
// Tenant enforcement: payload.academyCode should match route param if present
if (
  req.academyCode &&
  payload.academyCode &&
  req.academyCode !== payload.academyCode &&
  payload.role !== 'superadmin'
) {
  return res.status(403).json({ message: 'Academy mismatch' });
}

req.user = payload;
next();
} catch (err) {
return res.status(401).json({ message: 'Invalid token' });
}
};


const permit = (...allowed) => (req, res, next) => {
if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
if (allowed.includes(req.user.role)) return next();
return res.status(403).json({ message: 'Forbidden' });
};


module.exports = { authMiddleware, permit };