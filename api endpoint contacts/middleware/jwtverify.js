const jwt = require("jsonwebtoken");

//Middleware
function verifyToken(req, res, next) {
	const token = req.headers["authorization"];
	console.log(token);
	if (typeof token !== "undefined") {
		jwt.verify(token, process.env.JWT, (err, data) => {
			if (err) {
				res.send(err);
			}
			req.data = data;
			next();
		});
	} else {
		res.json({ message: "Undefined Token." });
	}
}

module.exports = verifyToken;
