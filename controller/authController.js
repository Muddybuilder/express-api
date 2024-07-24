const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const prisma = require("./prismaClient");
const {generateAccessToken,authenticateToken} = require('../auth/jwt')
require("dotenv").config();

authController = {};
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

    const password = req.body.password;

    bcrypt.hash(password, process.env.SALT, async (err, hash) => {
      const userObj = {
        email: req.body.email,
        name: req.body.username,
        passwordHash: hash,
      };
      const user = await prisma.userAuth.create({
        data: userObj,
      });
      res.json({
        message: "User registered successfully",
        token: generateAccessToken(user.email),
      });
    });
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
      res.json({errors: errors.array()});
      return;
    };

    const email = req.body.email;
    const password = req.body.password;

    const user = await prisma.user.findUnique({
        email: email
    })
    if (!user) {
      res.json({message: "User not found"});
      return;
    };
    bcrypt.compare(password, user.passwordHash, (err, result) => {
      if (result) {
        const token = generateAccessToken(user.email);
        res.json({token: token, message: "Login successful"});
      } else {
        res.json({message: "Wrong password"});
      }
    })
  })
];

module.exports = authController;
