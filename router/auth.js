const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

router.get("/", (req, res) => {
	res.render("home");
});

router.post("/", (req, res) => {
	//Grab user input and send message with Html feature added
	const { email, title, body } = req.body;
	const output = `
        <h1>Blog Website Research</h1>
        <p>Details</p>
        <ul>
            <li> Title: ${title}</li>
            <li> From: ${email}</li>
        </ul>
        <h3>${body}</h3>
    `;

	async function sendMail() {
		let testAccount = await nodemailer.createTestAccount();
		try {
			//const accessToken = await OAuth2Client.getAccessToken();

			const transport = nodemailer.createTransport({
				host: "smtp.ethereal.email",
				port: "587",
				secure: false,
				service: "mail",
				auth: {
					user: testAccount.user, // generated ethereal user
					pass: testAccount.pass, // generated ethereal password
				},
			});

			const mailOptions = {
				from: `CoolGuy <${email}>`,
				to: title,
				subject: "Testing",
				html: output,
			};

			const result = await transport.sendMail(mailOptions);
			if (result) {
				console.log(result);
				res.redirect("/success");
			}
		} catch (error) {
			console.log(error);
			res.redirect("/failed");
		}
	}
});

router.get("/success", (req, res) => {
	res.render("success");
});

router.get("/failed", (req, res) => {
	res.render("failed");
});

module.exports = router;
