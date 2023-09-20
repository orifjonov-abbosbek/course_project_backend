const { DataTypes } = require("sequelize");
const sequelize = require("../database/database");
const User = require("./userModel");
const Comment = require("./comment");

const Review = sequelize.define("Review", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  reviewName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  reviewedItem: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  group: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
  },
  reviewText: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  rating: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 0,
      max: 10,
    },
  },
});

Review.belongsTo(User, {
  foreignKey: "userId",
});

Review.hasMany(Comment, {
  foreignKey: "reviewId",
});
module.exports = Review;
