// Comment.js
const { DataTypes } = require("sequelize");
const sequelize = require("../database/database");

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

module.exports = Comment;

const User = require("./userModel");
const Review = require("./reviewModels");

Comment.associate = (models) => {
  Comment.belongsTo(User, {
    foreignKey: "userId",
  });

  Comment.belongsTo(Review, {
    foreignKey: "reviewId",
  });
};
