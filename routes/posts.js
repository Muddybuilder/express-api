const passport = require("passport");

const express = require("express");
const router = express.Router();
const postController = require("../controller/postController");

/* GET posts. */
router.get("/", postController.getPosts);

/* POST posts. */
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  postController.createPost
);

/* GET posts/:postid */
router.get("/:postId", 
  postController.getPost
);

/* PUT posts/:postid */
router.put(
  "/:postId",
  passport.authenticate("jwt", { session: false }),
  postController.updatePost
);

module.exports = router;
