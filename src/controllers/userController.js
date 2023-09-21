const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const config = require("../config/conf");
const { Op } = require("sequelize");

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user.
 *     tags:
 *       - User
 *     requestBody:
 *       description: User registration data.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 required: true
 *               email:
 *                 type: string
 *                 required: true
 *               password:
 *                 type: string
 *                 required: true
 *     responses:
 *       201:
 *         description: User registered successfully.
 *       400:
 *         description: Username or email already exists.
 *       500:
 *         description: Internal server error.
 */

exports.register = async (req, res) => {
  try {
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ username: req.body.username }, { email: req.body.email }],
      },
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    const newUser = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login as a user.
 *     tags:
 *       - User
 *     requestBody:
 *       description: User login data.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 required: true
 *               password:
 *                 type: string
 *                 required: true
 *     responses:
 *       200:
 *         description: Authentication successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *       401:
 *         description: Invalid credentials.
 *       500:
 *         description: Internal server error.
 */
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log("Received username:", username);

    const user = await User.findOne({ where: { username } });

    if (!user) {
      console.log("User not found");
      return res.status(401).json({ message: "User not found" });
    }

    console.log("User data from the database:", user);

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      console.log("Invalid password");
      return res.status(401).json({ message: "Invalid password" });
    }

    const payload = {
      userId: user.userId,
    };


    const token = config.generateToken(payload);

    res.status(200).json({ message: "Authentication successful", token });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get a list of all users.
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal server error.
 */

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID.
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user by ID.
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: UUID of the user to delete.
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: User deleted successfully.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */


    exports.deleteUserById = async (req, res) => {
      try {
        const userUuid = req.params.uuid; 

        const user = await User.findOne({ where: { userId: userUuid } });
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        await User.destroy({
          where: { userId: userUuid },
        });

        res.status(200).json({ message: "User deleted successfully" });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
    };

