const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const reviewController = require("../controllers/reviewController");
const multer = require("multer");

const { v4: uuidv4 } = require("uuid");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "../upload/")); 
  },
  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname);
    const uniqueFilename = uuidv4();
    cb(null, `${uniqueFilename}${fileExtension}`);
  },
});

const upload = multer({ storage });

router.post("/register", userController.register);
router.post("/login", userController.login);

router.get("/users/:uuid", userController.getUserById);

router.get("/users", userController.getAllUsers);

router.post("/reviews", upload.single("image"), reviewController.createReview);

router.get("/reviews", reviewController.getAllReviews);

router.delete("/users/:uuid", userController.deleteUserById);

module.exports = router;
