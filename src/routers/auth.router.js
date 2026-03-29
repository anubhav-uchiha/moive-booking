const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// PUBLIC
router.post("/register", authController.register);
router.post("/login", authController.login);

// PROTECTED
router.get("/profile", authMiddleware, authController.getProfile);
router.post("/logout", authMiddleware, authController.logout);
router.post("/refresh-token", authMiddleware, authController.refreshToken);

module.exports = router;
