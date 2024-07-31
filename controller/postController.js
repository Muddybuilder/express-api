const asyncHandler = require("express-async-handler");
const prisma = require("./prismaClient");
require("dotenv").config();
const {body, validationResult} = require("express-validator")
const postController = {};

postController.getPosts = asyncHandler(async (req, res) => {
  // read posts from db
  const posts = await prisma.post.findMany({
    where: {
      published: true,
    },
  });
  res.status(200).json(posts);
});

postController.getPost = asyncHandler(async (req, res) => {
  const postId = +req.params.postId;

  const post = await prisma.post.findUnique({
    where: {
      id: postId,
      published: true,
    },
  });

  if (!post) {
    res.status(404).json("No post found.");
    return;
  }

  const comments = await prisma.comment.findMany({
    where: {
      postId: postId,
    },
  });

  res.json({ post, comments });
});

postController.createComment = [
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
      res.status(404).json({ errors: errors.array() });
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
    console.log(commentObj)

    await prisma.comment.create({
      data: commentObj,
    });

    res.status(201).json("Comment created successfully.");
  }),
];

module.exports = postController;
