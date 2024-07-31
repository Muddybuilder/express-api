var express = require("express");
var router = express.Router();
const privatePostController = require("../controller/privatePostController");
const passport = require("passport")

router.use(passport.authenticate("jwt", { session: false }))
/* GET user/posts */
router.get("/", privatePostController.getPosts);

/* POST user/posts */
router.post("/", privatePostController.createPost);

/* GET user/posts/:postId */
router.get("/:postId", privatePostController.getPost);

/* PUT user/posts/:postId */
router.put("/:postId", privatePostController.updatePost);

/* DELETE user/posts/:postId */
router.delete("/:postId", privatePostController.deletePost);

module.exports = router;
