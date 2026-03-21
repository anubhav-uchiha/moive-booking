const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const logger = require("./utils/logger");
const errorHandler = require("./middlewares/error.middleware");

const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const stream = {
  write: (message) => logger.info(message.trim()),
};

app.use(morgan("combined", { stream }));

app.get("/", (req, res) => {
  res.json({ success: true, message: "API is running..." });
});
app.use(errorHandler);
module.exports = app;
