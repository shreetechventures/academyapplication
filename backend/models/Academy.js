// backend/models/Academy.js

const mongoose = require('mongoose');


const academySchema = new mongoose.Schema({
code: { type: String, required: true, index: true }, // e.g. shreenath
name: { type: String, required: true },
branding: {
logoUrl: String,
primaryColor: String
},
createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Academy', academySchema);