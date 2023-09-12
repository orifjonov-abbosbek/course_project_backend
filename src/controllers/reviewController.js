const Review = require("../models/reviewModels");

const User = require("../models/userModel");

exports.createReview = async (req, res) => {
  try {
    const {
      reviewName,
      reviewedItem,
      group,
      tags,
      reviewedText,
      rating,
      userId,
    } = req.body;

    const review = await Review.create({
      reviewName,
      reviewedItem,
      group,
      tags,
      reviewedText,
      rating,
      userId,
    });

    res.status(201).json(review);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error while creating review" });
  }
};

exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll();

    res.status(200).json(reviews);
  } catch (err) {
    console.error("Error while fetching reviews", err);
    req.status(500).json({ error: "internal server error" });
  }
};

exports.getReviewByUserId = async (req, res) => {
  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const reviews = await Review.findAll({
      where: { userId: user.id },
    });
    res.json(reviews);


    
  } catch (err) {
    console.error("error while fetching specified review", err);
    req.status(500).json({ error: "internal server error" });
  }
};
