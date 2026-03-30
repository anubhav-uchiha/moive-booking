const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const authentication = require("../middlewares/auth.middleware");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refresh-token", authentication, authController.refreshToken);

module.exports = router;
