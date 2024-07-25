const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const prisma = require("./prismaClient");
const { generateAccessToken } = require("../auth/jwt");
const { json } = require("express");
require("dotenv").config();

const postController = {};

postController.getPosts = asyncHandler(async (req, res) => {
  // read posts from db
  const posts = await prisma.post.findMany();
  const publishedPosts = posts.filter((post) => post.published);
  res.status(200).json(publishedPosts);
});

postController.getUserPosts = asyncHandler(async (req, res) => {
  const user = req.user;
  const posts = await prisma.post.findMany({
    where: {
      author: { id: user.id },
    },
  });
  if (user.id !== +req.params.userid) {
    const filteredPosts = posts.filter((post) => post.published);
    res.json(filteredPosts);
    return;
  }
  res.status(200).json(posts);
});
postController.createPost = [
  body("title")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Title should be at least 1 character long.")
    .escape(),
  body("content")
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage("Content should be between 1 to 500 characters long.")
    .escape(),

  asyncHandler(async (req, res) => {
    const user = req.user;

    const postObj = {
      createdAt: new Date(),
      updatedAt: new Date(),
      title: req.body.title,
      published: false,
      content: req.body.content,
      authorId: user.id,
    };

    await prisma.post.create({
      data: postObj,
    });
    res.status(201).json("post created!");
  }),
];

module.exports = postController;
