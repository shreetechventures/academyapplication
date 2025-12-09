// const mongoose = require('mongoose');
// const Academy = require('./models/Academy');

// mongoose.connect('mongodb://127.0.0.1:27017/academydb');

// async function seed() {

//   await Academy.deleteMany(); // clean old ones if exist

//   const academy = await Academy.create({
//     name: "Shreenath Carrier Academy",
//     code: "shreenath",
//     logo: "",
//     themeColor: "#1e3799"
//   });

//   console.log("Academy Created:", academy);
//   process.exit();
// }

// seed();



const mongoose = require('mongoose');
const Academy = require('./models/Academy');

mongoose.connect('mongodb://127.0.0.1:27017/academydb');

async function seed() {

  await Academy.deleteMany(); // clean old ones if exist

  await Academy.create([
    {
      name: "Shreenath Career Academy",
      code: "shreenath",
      // customDomain: "shreenath.localhost",
      themeColor: "#1e3799"
    },
    {
      name: "Commando Academy",
      code: "commando",
      // customDomain: "eklavya.localhost",
      themeColor: "#b33939"
    },
        {
      name: "demo academy",
      code: "demoadmin",
      // customDomain: "eklavya.localhost",
      themeColor: "#b33939"
    }
  ]);
  process.exit();
}

seed();
