const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const prisma = require("./prismaClient");
require("dotenv").config();

const privatePostController = {};

privatePostController.getPosts = asyncHandler(async (req, res) => {
  const user = req.user;

  // read posts from db
  const posts = await prisma.post.findMany({
    where: {
      authorId: user.id,
    },
  });

  if (!posts) {
    res.status(404).json("No post found.");
    return;
  }
  res.status(200).json(posts);
});
privatePostController.getPost = asyncHandler(async (req, res) => {
  const user = req.user;

  // read posts from db
  const post = await prisma.post.findUnique({
    where: {
      id: +req.params.postId,
      authorId: user.id,
    },
  });

  if (!post) {
    res.status(404).json("No post found.");
    return;
  }
  const comments = await prisma.comment.findMany({
    where: {
      postId: +req.params.postId,
    },
  });

  res.json({ post, comments });

});

privatePostController.createPost = [
  body("title")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Title should be at least 1 character long."),
  body("content")
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage("Content should be between 1 to 500 characters long."),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json({ errors: errors.array() });
      return;
    }

    const user = req.user;

    const postObj = {
      createdAt: new Date(),
      updatedAt: new Date(),
      title: req.body.title,
      published: false,
      content: req.body.content,
      authorId: user.id,
    };

    const post = await prisma.post.create({
      data: postObj,
    });
    res.status(201).json({ message: "post created!", postId: post.id });
  }),
];
privatePostController.updatePost = [
  body("title")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Title should be at least 1 character long."),
  body("content")
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage("Content should be between 1 to 500 characters long."),
  body("published")
    .trim()
    .toBoolean()
    .isBoolean()
    .withMessage("Must be boolean true or false."),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json({ errors: errors.array() });
      return;
    }

    const user = req.user;
    const post = await prisma.post.findMany({
      where: {
        authorId: user.id,
        id: +req.params.postId,
      },
    });

    if (!post) {
      res.status(404).json("No post found.");
    }

    const postObj = {
      updatedAt: new Date(),
      title: req.body.title,
      published: req.body.published,
      content: req.body.content,
    };

    await prisma.post.update({
      where: {
        authorId: user.id,
        id: +req.params.postId,
      },
      data: postObj,
    });
    res.json({ message: "post updated!", postId: post.id });
  }),
];
privatePostController.deletePost = asyncHandler(async (req, res) => {
  const postId = +req.params.postId;
  const user = req.user;

  await prisma.comment.deleteMany({
    where: {
      postId: postId,
    },
  });
  await prisma.post.delete({
    where: {
      id: postId,
      authorId: user.id,
    },
  });

  res.json({ message: "Post and Comments were deleted." });
});

module.exports = privatePostController;
