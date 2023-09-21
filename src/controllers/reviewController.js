const Review = require("../models/reviewModels"); 


/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Create a new review
 *     tags: [Reviews]
 *     parameters:
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
 *       201:
 *         description: Review created successfully
 *       500:
 *         description: Internal server error
 */


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
