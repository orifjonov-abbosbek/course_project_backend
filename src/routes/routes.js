const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const reviewController = require("../controllers/reviewController");

const { verifyToken } = require("../config/conf")




router.post("/register", userController.register);
router.post("/login", userController.login);

router.get("/users/:uuid", userController.getUserById);

router.get("/users", userController.getAllUsers);

router.post("/reviews", verifyToken, reviewController.createReview)
 



router.get("/reviews", reviewController.getAllReviews);

router.delete("/users/:uuid", userController.deleteUserById);

module.exports = router;
