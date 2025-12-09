
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect('mongodb://127.0.0.1:27017/academydb');

async function seedAdmin() {

  await User.deleteMany(); // clear old users if any 

  const admin = await User.create({
    name: "Shreenath Admin",
    email: "admin@shreenath.com",
    password: "123456",
    role: "academyAdmin",
    academyCode: "shreenath"
  });

  // console.log("Academy Admin Created:");
  // console.log(admin);

  process.exit();
}

seedAdmin();
