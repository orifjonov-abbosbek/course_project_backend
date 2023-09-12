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

exports.updateRewview = async (req, res) => {
  const reviewId = req.params.reviewId;
  try {
    const review = await Review.findByPk(reviewId);

    if (!review) {
      return res.status(404).json({ message: "review not found" });
    }

    const { reviewName, reviewedItem, group, tags, reviewedText, rating } =
      req.body;

    review.reviewName = reviewName;
    review.reviewedItem = reviewedItem;
    review.group = group;
    review.tags = tags;
    review.reviewedText = reviewedText;
    review.rating = rating;

    await review.save();

    res.json(review);
  } catch (err) {
    console.log("error while updating review", err);
    req.status(500).json({ message: "internal server error" });
  }
};



exports.deleteReview = async (req, res ) => {
  const reviewId = req.params.reviewId;

  try{
    const review = await Review.findByPk(reviewId);

    if(!review){
      return res.status(404).json({message: 'review not found '});

    }
 
    await review.destroy();

    res.status(204).send()
  }
  catch(err){
    console.error('error while deleting review', err);
    req.status(500).json({message: 'internal server error'});
  }
}