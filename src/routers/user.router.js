const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");

router.get("/profile", authMiddleware, userController.getProfile);

router.put("/profile", authMiddleware, userController.updateProfile);

router.put("/change-password", authMiddleware, userController.changePassword);

router.delete("/delete", authMiddleware, userController.softDeleteAccount);

router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  userController.getAllUsers,
);

router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  userController.getUserById,
);

router.put(
  "/:id/status",
  authMiddleware,
  roleMiddleware("admin"),
  userController.updateUserStatus,
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  userController.deleteUserByAdmin,
);

module.exports = router;
