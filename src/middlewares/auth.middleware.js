const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const authentication = async (req, res, next) => {
  try {
    const authenticateRequest = req.headers.authorization;
    if (!authenticateRequest || !authenticateRequest.startsWith("Bearer ")) {
      const error = new Error("Authrntication Token missing");
      error.statusCode = 400;
      return next(error);
    }

    const token = authenticateRequest?.split(" ")[1];

    if (!token) {
      const error = new Error("No token found");
      error.statusCode = 404;
      return next(error);
    }
    const decoded = JsonWebTokenError.verify(token, process.env.JWT_TOKEN);

    if (!decoded) {
      const error = new Error("Anauthorized token");
      error.statusCode = 401;
      return next(error);
    }

    const user = await User.findOne({
      _id: decoded._id,
      is_deleted: decoded.is_deleted,
      is_admin: decoded.is_admin,
    });

    if (!user) {
      const error = new Error("User not Authorized");
      error.statusCode = 401;
      return next(error);
    }

    req.user = user;
    next();
  } catch (error) {
    return next(error);
  }
};

module.exports = authentication;
