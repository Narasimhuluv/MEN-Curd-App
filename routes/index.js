var express = require("express");
const auth = require("../middlewares/auth");
const Book = require("../models/Book");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
 res.render("index", { title: "Express" });
});

router.get("/protect", auth.isVerified, (req, res) => {
 res.status(201).json({ message: "Protected Route" });
});

router.get("/profile", auth.isVerified, async (req, res, next) => {
 let user = req.user;
 try {
  let userBooks = await Book.find({ authorId: user.userId });
  return res.status(201).json({ userData: userBooks });
 } catch (error) {
  next(error);
 }
});

module.exports = router;
