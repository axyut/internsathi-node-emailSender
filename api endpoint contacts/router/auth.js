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

router.post("/contacts", async (req, res) => {
	try {
		const number = req.body.number;

		const user = await users.findOne({ number });
		if (!user) {
			return res.json({ message: "User isn't in Contacts List!" });
		}

		const { fullname, email, body } = user;
		return res.render("result", { fullname, number, email, body });
	} catch (error) {
		console.log(error);
	}
});

router.get("/all", async (req, res) => {
	const resultsPerPage = 4;
	try {
		let page = req.query.page ? Number(req.query.page) : 1;
		const result = await users.find({});
		const numOfResults = result.length;
		const numberOfPages = Math.ceil(numOfResults / resultsPerPage);

		if (page > numberOfPages) {
			res.redirect(`/blogs?page=${encodeURIComponent(numberOfPages)}`);
		} else if (page < 1) {
			res.redirect(`/blogs?page=${encodeURIComponent("1")}`);
		}

		const specificResult = await users.find({}).limit(resultsPerPage);

		res.render("manyResult", { specificResult });
	} catch (error) {
		console.log(error);
	}
});

router.get("*", (req, res) => {
	res.send("error 404");
});

module.exports = router;
