const passport = require("passport");

const express = require("express");
const router = express.Router();
const postController = require("../controller/postController");

/* GET posts. */
router.get("/", postController.getPosts);


router.get("/:userid", 
  passport.authenticate("jwt", { session: false }),
  postController.getUserPosts);

/* POST posts. */
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  postController.createPost
);

/* GET posts/:postid */
router.get("/:postid", function (req, res, next) {
  res.send("not implemented yet!");
});

/* PUT posts/:postid */
router.put(
  "/:postid",
  passport.authenticate("jwt", { session: false }),
  function (req, res, next) {
    res.send("not implemented yet!");
  }
);

module.exports = router;
