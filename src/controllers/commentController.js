const Review = require('../models/reviewModels')

exports.createComment = async (req, res) => {
  const { text, userId, reviewId } = req.body;

  const review = await Review.findByPk(reviewId);

  if (!review) {
    return res.status(404).json({ message: "Review not found" });
  }

  try {
    const comment = await Comment.create({
      text,
      userId,
      reviewId,
    });
    res.status(201).json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
