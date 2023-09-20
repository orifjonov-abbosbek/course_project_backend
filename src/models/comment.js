const { DataTypes } = require("sequelize");
const sequelize = require("../database/database");
const User = require("./userModel");
const Review = require("./reviewModel");

const Comment = sequelize.define("Comment", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  text: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Comment.belongsTo(User, {
  foreignKey: "userId",
});

Comment.belongsTo(Review, {
  foreignKey: "reviewId",
});

module.exports = Comment;
