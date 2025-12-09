// backend/utils/db.js

const mongoose = require('mongoose');


module.exports = async function connectDB(uri) {
return mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
};