const Review = require("../models/reviewModels");

exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll();

    res.status(200).json(reviews);
  } catch (err) {
    console.error("Error while fetching reviews", err);
    req.status(500).json({ error: "internal server error" });
  }
};
