const express = require("express");
const router = express.Router();
const postController = require("../controller/postController");

/* GET posts/ */
router.get("/", postController.getPosts);

/* GET posts/:postId */
router.get("/:postId", postController.getPost);

module.exports = router;
