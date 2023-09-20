const { DataTypes } = require("sequelize");
const sequelize = require("../database/database");
const crypto = require("crypto");

const User = sequelize.define("User", {
  userId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

User.beforeCreate((user) => {
  const randomChar = crypto.randomBytes(16).toString("hex");
  const passwordData = user.password + randomChar;
  const hash = crypto.createHash("sha256").update(passwordData).digest("hex");
  user.password = hash;
});

module.exports = User;
