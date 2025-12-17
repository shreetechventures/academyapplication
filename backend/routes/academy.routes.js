// backend/routes/academy.routes.js

const express = require('express');
const router = express.Router({ mergeParams: true });
const Academy = require('../models/Academy');
const { authMiddleware, permit } = require('../middleware/auth');


// Create academy - only superadmin
// POST //academy/create
router.post('/create', authMiddleware, permit('superadmin'), async (req, res) => {
const { code, name, branding } = req.body;
if (!code || !name) return res.status(400).json({ message: 'code and name required' });
const exists = await Academy.findOne({ code });
if (exists) return res.status(400).json({ message: 'Academy code exists' });
const a = new Academy({ code, name, branding });
await a.save();
res.json({ message: 'Academy created', academy: a });
});


// GET /api/:academyCode
router.get("/", async (req, res) => {
  try {
    const academy = await Academy.findOne({ code: req.params.academyCode });
    if (!academy) return res.status(404).json({ message: "Academy not found" });
    res.json(academy);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;