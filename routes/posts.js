const passport = require("passport");

const express = require("express");
const router = express.Router();

/* GET posts. */
router.get("/", function (req, res, next) {
  res.send("not implemented yet!");
});

/* POST posts. */
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  function (req, res, next) {
    res.json("authenticated, not implemented yet!");
  }
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
