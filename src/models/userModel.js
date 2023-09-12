const { DataTypes } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
const sequelize = require("../config/database");
const crypto = require("crypto"); 

const User = sequelize.define("User", {
  id: {
    type: DataTypes.UUID,
    defaultValue: uuidv4(),
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
