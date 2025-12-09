// backend/routes/academy.routes.js

const express = require('express');
const router = express.Router();
const Academy = require('../models/Academy');
const { authMiddleware, permit } = require('../middleware/auth');


// Create academy - only superadmin
// POST /api/academy/create
router.post('/create', authMiddleware, permit('superadmin'), async (req, res) => {
const { code, name, branding } = req.body;
if (!code || !name) return res.status(400).json({ message: 'code and name required' });
const exists = await Academy.findOne({ code });
if (exists) return res.status(400).json({ message: 'Academy code exists' });
const a = new Academy({ code, name, branding });
await a.save();
res.json({ message: 'Academy created', academy: a });
});


// Get academy info (public) - GET /api/academy/:code
router.get('/:code', async (req, res) => {
const code = req.params.code;
const academy = await Academy.findOne({ code });
if (!academy) return res.status(404).json({ message: 'Not found' });
res.json(academy);
});


module.exports = router;