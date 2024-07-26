
var express = require('express');
var router = express.Router();
const commentController = require("../controller/commentController")


/* GET comments/:commentid */
router.get('/:postId', commentController.getComment);

/* POST comments/:commentid */
router.post('/:postId', commentController.createComment);

module.exports = router;
