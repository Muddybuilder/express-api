const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const prisma = require("./prismaClient");
require("dotenv").config();

const commentController = {};

// Get comments associated with the given postId
commentController.getComment = asyncHandler(async (req, res) => {
  // read posts from db
  const comments = await prisma.comment.findMany({
    where: {
      postId: req.body.postId,
    },
  });

  if (!comments) {
    res.status(404).json("No post found.");
    return;
  }
  res.status(200).json(comments);
});

commentController.createComment = [
  body("content")
    .trim()
    .notEmpty()
    .withMessage("content shouldn't be empty")
    .isLength({ min: 1, max: 500 })
    .withMessage("content length must be between 1 to 500 letters"),
  body("authorName").trim(),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json({ errors: errors.array() });
      return;
    }

    const post = await prisma.post.findUnique({
      where: {
        id: +req.params.postId,
      },
    });

    if (!(post && post.published)) {
      res.status(404).json("No post found.");
      return;
    }

    const commentObj = {
      createdAt: new Date(),
      updatedAt: new Date(),
      content: req.body.content,
      authorName: req.body.authorName ? req.body.authorName : null,
      postId: +req.params.postId,
    };

    await prisma.comment.create({
      data: commentObj,
    });

    res.status(201).json("Comment created successfully.");
  }),
];

module.exports = commentController;
