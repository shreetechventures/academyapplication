// backend/models/User.js

const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
name: { type: String },
email: { type: String, required: true, index: true },
passwordHash: { type: String, required: true },
role: { type: String, enum: ['superadmin','academyAdmin','teacher','student'], required: true },
academyCode: { type: String, default: null },
createdBy: { type: String, ref: 'User' },
createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('User', userSchema);