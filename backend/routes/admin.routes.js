// backend/routes/admin.routes.js

const express = require('express');
const router = express.Router({ mergeParams: true });
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { authMiddleware, permit } = require('../middleware/auth');


// Create academy-level admin (academyAdmin) - only superadmin or existing academyAdmin
// POST /api/:academyCode/admin/create-academy-admin
router.post('/create-academy-admin', authMiddleware, permit('superadmin','academyAdmin'), async (req, res) => {
const { name, email, password } = req.body;
const academyCode = req.params.academyCode || req.body.academyCode;
if (!academyCode) return res.status(400).json({ message: 'academyCode required' });
const exists = await User.findOne({ email: email.toLowerCase(), academyCode });
if (exists) return res.status(400).json({ message: 'User exists' });
const hash = await bcrypt.hash(password, 10);
const user = new User({ name, email: email.toLowerCase(), passwordHash: hash, role: 'academyAdmin', academyCode, createdBy: req.user.sub });
await user.save();
res.json({ message: 'Academy admin created' });
});


// Create teacher (only superadmin and academyAdmin)
// POST /api/:academyCode/admin/create-teacher
router.post('/create-teacher', authMiddleware, permit('superadmin','academyAdmin'), async (req, res) => {
const { name, email, password } = req.body;
const academyCode = req.params.academyCode || req.body.academyCode;
if (!academyCode) return res.status(400).json({ message: 'academyCode required' });
const exists = await User.findOne({ email: email.toLowerCase(), academyCode });
if (exists) return res.status(400).json({ message: 'User exists' });
const hash = await bcrypt.hash(password, 10);
const user = new User({ name, email: email.toLowerCase(), passwordHash: hash, role: 'teacher', academyCode, createdBy: req.user.sub });
await user.save();
res.json({ message: 'Teacher created' });
});


// Create student (superadmin, academyAdmin, teacher)
// POST /api/:academyCode/admin/create-student
router.post('/create-student', authMiddleware, permit('superadmin','academyAdmin','teacher'), async (req, res) => {
const { name, email, password } = req.body;
const academyCode = req.params.academyCode || req.body.academyCode;
if (!academyCode) return res.status(400).json({ message: 'academyCode required' });
const exists = await User.findOne({ email: email.toLowerCase(), academyCode });
if (exists) return res.status(400).json({ message: 'User exists' });
const hash = await bcrypt.hash(password, 10);
const user = new User({ name, email: email.toLowerCase(), passwordHash: hash, role: 'student', academyCode, createdBy: req.user.sub });
await user.save();
res.json({ message: 'Student created' });
});
module.exports = router;