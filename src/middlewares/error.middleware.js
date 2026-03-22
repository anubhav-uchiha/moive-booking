const logger = require("../utils/logger");

const errorHandler = (err, req, res, next) => {
  logger.error(`${err.statusCode || 500} - ${err.message}`);
  return res.status(err.statusCode || 500).json({
    success: false,
    message: err.details || err.message || "Internal Server Error",
  });
};

module.exports = errorHandler;
