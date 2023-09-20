const Comment = require("../models/Comment");

exports.createComment = async (req, res) => {
  try {
    const { text, userId, reviewId } = req.body;
    const comment = await Comment.create({
      text,
      userId,
      reviewId,
    });

    res.status(201).json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while creating a comment" });
  }
};

