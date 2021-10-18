const express = require("express")
const cors = require("cors")
//NOTE: Remove, // const mongoose = require("mongoose")
const dotenv = require('dotenv');
const v1Routes = require("./routes/v1/user")
const { db } = require("./db");

dotenv.config({ path: './.env' });

// initializing express
const app = express()

// mongoDb connection
const port = process.env.PORT || 4009;

// middleware instances
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


// initiate the routes
app.use("/user-service", v1Routes)

db.then(() => {
	app.listen(port, () => {
		console.log(`listen to ${port}`);
		console.log("connected to the database");
	});
}).catch((err) => {
	console.log("error is ", err);
	process.exit(1);
});