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
router.get("/user/myposts/:postId",
  passport.authenticate("jwt", { session: false }),
  postController.getMyPost
)

router.get("/user/myposts",
  passport.authenticate("jwt", { session: false }),
  postController.getMyPosts
)
/* PUT posts/:postid */
router.put(
  "/:postId",
  passport.authenticate("jwt", { session: false }),
  postController.updatePost
);

module.exports = router;
