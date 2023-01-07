const express = require("express");
const router = express.Router();
const alert = require("alert");
const users = require("../models/model");

router.get("/", (req, res) => {
	res.render("root");
});

router.get("/sendOne/contacts", (req, res) => {
	res.render("sendOne");
});

router.post("/sendMany/contacts", (req, res) => {
	let contacts = Number(req.body.contacts);

	res.render("sendMany", { contacts });
});

router.post("/add/user", (req, res) => {
	const { fullname, number, email, body } = req.body;

	users.findOne({ number }, function (err, data) {
		if (data) {
			alert("Already exists");
			return res.json({
				success: true,
				message: `User already Exists.`,
				fullname: data.fullname,
				number,
				email: data.email,
				body: data.body,
			});
		}

		newUser = new users({
			fullname,
			number,
			email,
			body,
		});
		newUser.save(newUser);
		alert("added");
		return res.json({
			success: true,
			message: `New User Added`,
			fullname,
			number,
			email,
			body,
		});
	});
});

router.get("/contacts/:number", async (req, res) => {
	try {
		const number = req.params.number;
		console.log(number);
		const user = await users.findOne({ number });
		if (!user) {
			return res.json({ message: "User isn't in Contacts List!" });
		}
		console.log(user);
		const { fullname, email, description } = user;
		return res.json({ fullname, number, email, description });
	} catch (error) {
		console.log(error);
	}
});

router.get("/all", async (req, res) => {
	try {
		const result = await users.find({});
		res.json(result);
	} catch (error) {
		console.log(error);
	}
});

module.exports = router;
