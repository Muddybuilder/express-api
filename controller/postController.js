const asyncHandler = require("express-async-handler");
const prisma = require("./prismaClient");
require("dotenv").config();

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

module.exports = postController;
