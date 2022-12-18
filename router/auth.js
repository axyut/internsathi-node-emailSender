const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

router.get("/", (req, res) => {
	res.render("home");
});

router.post("/", (req, res) => {
	//Grab user input and send message with Html feature added
	const { fromEmail, toEmail, title, body } = req.body;
	const output = `
        <h4>Mailing Message Service</h4>
        <h2>${title}</h2>
        <p>Details</p>
        <ul>
            <li> From: ${fromEmail}</li>
            <li> To: ${toEmail}</li>
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
				from: `CoolGuy <${fromEmail}>`,
				to: toEmail,
				subject: title,
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
	sendMail();
});

router.get("/success", (req, res) => {
	res.render("success");
});

router.get("/failed", (req, res) => {
	res.render("failed");
});

module.exports = router;
