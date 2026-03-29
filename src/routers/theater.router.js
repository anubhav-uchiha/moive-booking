const express = require("express");
const router = express.Router();

const controller = require("../controllers/theater.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");

// 🏢 OWNER ROUTES
router.post(
  "/",
  authMiddleware,
  roleMiddleware("theater_owner"),
  controller.createTheater,
);

router.get(
  "/my",
  authMiddleware,
  roleMiddleware("theater_owner"),
  controller.getMyTheaters,
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("theater_owner"),
  controller.updateTheater,
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("theater_owner"),
  controller.deleteTheater,
);

// 🌍 PUBLIC ROUTES
router.get("/", controller.getTheaters);
router.get("/:id", controller.getTheaterById);

module.exports = router;
