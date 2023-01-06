const express = require("express");
const router = express.Router();

//Mailing dependencies
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const Oauth2 = google.auth.OAuth2;

//Nodemailer environemnts
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const sender = process.env.SENDER_ID;
const refreshToken = process.env.REFRESH_TOKEN;
const Redirect_URL = process.env.REDIRECT_URL;

//Generate Access token with refresh tooken
const OAuth2Client = new google.auth.OAuth2(
	clientId,
	clientSecret,
	Redirect_URL
);
OAuth2Client.setCredentials({ refresh_token: refreshToken });

router.get("/", (req, res) => {
	res.render("home");
});

router.post("/", (req, res) => {
	//Grab user input and send message with Html feature added
	const { fromEmail, user, toEmail, title, body } = req.body;
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
		//let testAccount = await nodemailer.createTestAccount();
		try {
			const accessToken = await OAuth2Client.getAccessToken();

			const transport = nodemailer.createTransport({
				host: "smtp.gmail.com",
				port: "587",
				secure: false,
				service: "mail",
				auth: {
					type: "OAuth2",
					user: sender,
					clientId: clientId,
					clientSecret: clientSecret,
					refreshToken: refreshToken,
					accessToken: accessToken,
				},
			});

			const mailOptions = {
				from: `${user} <${fromEmail}>`,
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
