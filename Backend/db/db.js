const mongoose = require("mongoose");

function connectToDb() {
  mongoose
    .connect(process.env.DB_CONNECT)
    .then(() => {
      console.log("Connected to Db");
    })
    .catch((error) => {
      console.log("Unable to Connect to Db :", error);
    });
}

module.exports = connectToDb;
