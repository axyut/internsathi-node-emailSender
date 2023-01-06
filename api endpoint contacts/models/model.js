const mongoose = require("mongoose");

const defineSchema = new mongoose.Schema({
	fullname: String,
	number: Number,
	email: String,
	body: String,
});
const users = mongoose.model("users", defineSchema);

module.exports = users;
