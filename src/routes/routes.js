const express = require('express');
const router = express.Router();


const userController = require('../controllers/userController');
const reviewController = require('../controllers/reviewController');




router.get('/reviews', reviewController.getAllReviews);

router.get('/users', userController.getAllUsers);





module.exports = router;