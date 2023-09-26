const express = require("express");
const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const Review = require("../models/reviewModels");


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

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ["image/jpeg", "image/png"];
    const isAllowed = allowedMimeTypes.includes(file.mimetype);

    if (isAllowed) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG and PNG are allowed."));
    }
  },
});


/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Create a new review with optional image upload
 *     tags: [Reviews]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: image
 *         type: file
 *         description: The image file to upload (optional)
 *       - in: formData
 *         name: reviewName
 *         type: string
 *         required: true
 *       - in: formData
 *         name: reviewedItem
 *         type: string
 *         required: true
 *       - in: formData
 *         name: group
 *         type: string
 *         required: true
 *       - in: formData
 *         name: tags
 *         type: array
 *         items:
 *           type: string
 *       - in: formData
 *         name: reviewText
 *         type: string
 *         required: true
 *       - in: formData
 *         name: rating
 *         type: number
 *         required: true
 *     responses:
 *       201:
 *         description: Review created successfully
 *       400:
 *         description: Bad request, validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

exports.createReview = async function (req, res) {
  try {
    const { reviewName, reviewedItem, group, tags, reviewText, rating } =
      req.body;

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let imageUrl = null;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

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

/**
 * @swagger
 * /api/reviews/{id}:
 *   put:
 *     summary: Update a review by ID
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         type: string
 *         required: true
 *       - in: body
 *         name: review
 *         description: Review object
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             reviewName:
 *               type: string
 *             reviewedItem:
 *               type: string
 *             group:
 *               type: string
 *             tags:
 *               type: array
 *               items:
 *                 type: string
 *             reviewText:
 *               type: string
 *             imageUrl:
 *               type: string
 *             rating:
 *               type: number
 *     responses:
 *       200:
 *         description: Review updated successfully
 *       404:
 *         description: Review not found
 *       500:
 *         description: Internal server error
 */

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

/**
 * @swagger
 * /api/reviews/{id}:
 *   delete:
 *     summary: Delete a review by ID
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *       404:
 *         description: Review not found
 *       500:
 *         description: Internal server error
 */
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

/**
 * @swagger
 * /api/reviews:
 *   get:
 *     summary: Get all reviews
 *     tags: [Reviews]
 *     responses:
 *       200:
 *         description: List of reviews
 *         schema:
 *           type: array
 *           items:
 *             $ref: "#/definitions/Review"
 *       500:
 *         description: Internal server error
 */

exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll();
    res.status(200).json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
