const Review = require("../models/reviewModels"); 

// Create a new review
exports.createReview = async (req, res) => {
  try {
    const {
      reviewName,
      reviewedItem,
      group,
      tags,
      reviewText,
      imageUrl,
      rating,
    } = req.body;

    const newReview = await Review.create({
      reviewName,
      reviewedItem,
      group,
      tags,
      reviewText,
      imageUrl,
      rating,
      userId: req.user.id, 
    });

    res
      .status(201)
      .json({ message: "Review created successfully", review: newReview });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update a review by ID
exports.updateReview = async (req, res) => {
  try {
    const {
      reviewName,
      reviewedItem,
      group,
      tags,
      reviewText,
      imageUrl,
      rating,
    } = req.body;
    const reviewId = req.params.id;

    const updatedReview = await Review.update(
      {
        reviewName,
        reviewedItem,
        group,
        tags,
        reviewText,
        imageUrl,
        rating,
      },
      {
        where: { reviewId },
      }
    );

    if (updatedReview[0] === 0) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.status(200).json({ message: "Review updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a review by ID
exports.deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.id;

    const deletedRows = await Review.destroy({
      where: { reviewId },
    });

    if (deletedRows === 0) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all reviews
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll();
    res.status(200).json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
