const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: './.env' });

const db = mongoose
  .connect(process.env.CONNECTION_STRING, {
      keepAlive: true,
      useNewUrlParser: true,
      useUnifiedTopology: true
  })
  .then((response) => {
    console.log("connected to mongo db");
  })
  .catch((error) => {
    console.log("\ncan not connect to db. \nReason:\n");
    console.log(error);
  });

module.exports = { db };