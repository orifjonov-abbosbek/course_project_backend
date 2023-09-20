const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const Review = require("../models/Review");
const User = require("../models/User");
const Comment = require("../models/Comment");

// Create a new review
router.post("/reviews", async (req, res) => {
  try {
    const {
      reviewName,
      reviewedItem,
      group,
      tags,
      reviewText,
      imageUrl,
      rating,
      userId,
    } = req.body;

    const review = await Review.create({
      reviewName,
      reviewedItem,
      group,
      tags,
      reviewText,
      imageUrl,
      rating,
      userId,
    });

    res.status(201).json({ review });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating the review" });
  }
});

// Get all reviews
router.get("/reviews", async (req, res) => {
  try {
    const reviews = await Review.findAll({
      include: [
        {
          model: User,
          attributes: ["username", "email"], 
        },
        {
          model: Comment,
          attributes: ["commentText"], 
        },
      ],
    });

    res.status(200).json({ reviews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching reviews" });
  }
});

// Get a single review by ID
router.get("/reviews/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const review = await Review.findByPk(id, {
      include: [
        {
          model: User,
          attributes: ["username", "email"], // Include User information
        },
        {
          model: Comment,
          attributes: ["commentText"], // Include associated comments
        },
      ],
    });

    if (!review) {
      res.status(404).json({ error: "Review not found" });
    } else {
      res.status(200).json({ review });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching the review" });
  }
});

// Update a review by ID
router.put("/reviews/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const review = await Review.findByPk(id);

    if (!review) {
      res.status(404).json({ error: "Review not found" });
    } else {
      const {
        reviewName,
        reviewedItem,
        group,
        tags,
        reviewText,
        imageUrl,
        rating,
      } = req.body;

      await review.update({
        reviewName,
        reviewedItem,
        group,
        tags,
        reviewText,
        imageUrl,
        rating,
      });

      res.status(200).json({ review });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating the review" });
  }
});

// Delete a review by ID
router.delete("/reviews/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const review = await Review.findByPk(id);

    if (!review) {
      res.status(404).json({ error: "Review not found" });
    } else {
      await review.destroy();
      res.status(204).end();
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting the review" });
  }
});

module.exports = router;
