const jwt = require("jsonwebtoken");
require("dotenv").config();

function generateAccessToken(email) {
  return jwt.sign({email:email}, process.env.TOKEN_SECRET, { expiresIn: "90m" });
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    console.log(err);

    if (err) return res.sendStatus(403);

    req.user = user;

    next();
  });
}

module.exports = {generateAccessToken, authenticateToken}
