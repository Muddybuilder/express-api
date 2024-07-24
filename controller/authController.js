const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const prisma = require("./prismaClient");
const { generateAccessToken } = require("../auth/jwt");
require("dotenv").config();

const authController = {};
authController.register = [
  body("username")
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage("Username must be between 1 and 30 characters.")
    .escape()
    .isAlphanumeric()
    .withMessage("Username must only contain letters and numbers."),
  body("email").trim().normalizeEmail().isEmail().withMessage("Invalid email."),
  body("password")
    .trim()
    .isLength({ min: 6, max: 30 })
    .withMessage("Password must be between 6 and 30 characters long.")
    .escape(),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json({ errors: errors.array() });
      return;
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email: req.body.email,
      },
    });

    if (existingUser) {
      res.json({ errors: ["user email already exists"] });
      return;
    }

    const hashedPassword = await bcrypt.hash(
      req.body.password,
      +process.env.SALT
    );
    const userObj = {
      name: req.body.username,
      email: req.body.email,
      passwordHash: hashedPassword,
    };
    await prisma.user.create({
      data: userObj,
    });
    res.status(201).json('User created');
  }),
];

authController.login = [
  body("email").trim().normalizeEmail().isEmail().withMessage("Invalid email."),

  body("password")
    .trim()
    .isLength({ min: 6, max: 30 })
    .withMessage("Password must be between 6 and 30 characters long.")
    .escape(),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json({ errors: errors.array() });
      return;
    }

    const email = req.body.email;
    const password = req.body.password;

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      res.json({ message: "User not found" });
      return;
    }
    bcrypt.compare(password, user.passwordHash, (err, result) => {
      if (result) {
        const token = generateAccessToken(user.email);
        res.json({ token: token, message: "Login successful" });
      } else {
        res.json({ message: "Wrong password" });
      }
    });
  }),
];

module.exports = authController;
