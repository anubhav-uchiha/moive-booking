const jwt = require("jsonwebtoken");

const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_TOKEN, { expiresIn: "7d" });
};

module.exports = generateRefreshToken;
