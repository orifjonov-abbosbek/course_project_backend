const User = require("../models/userModel");

exports.getallUsers = async (req, res) => {
  try {
    const users = await User.findAll();

    res.status(200).json(users);
  } catch (err) {
    console.error("Error while fetching users", error);
    req.status(500).json({ error: "internal server error " });
  }
};
