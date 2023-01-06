require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
//Use middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(require("./router/auth"));

// Set static folder
app.use(express.static(path.join(__dirname, "/public")));

//use ejs template engine
app.set("view engine", "ejs");

app.listen(process.env.PORT, () => {
	console.log(`Server is running.`);
});
