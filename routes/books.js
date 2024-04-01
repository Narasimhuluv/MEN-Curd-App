let express = require("express");
const auth = require("../middlewares/auth");
const Book = require("../models/Book");
const User = require("../models/User");
const Comment = require("../models/Comment");
let router = express.Router();

router.get("/", auth.isVerified, async (req, res, next) => {
 console.log(req.user, "req.user");
 try {
  let allBooks = await Book.find({});
  return res.status(201).json({ books: allBooks });
 } catch (error) {
  next(error);
 }
});

router.post("/new", auth.isVerified, async (req, res, next) => {
 let { name, desc, category, price, quantity } = req.body;
 let user = req.user;
 req.body.authorId = user && user.userId;
 if (!name || !price || !category) {
  return res
   .status(400)
   .json({ error: "mandatory to fill the name , price and category fields " });
 }
 try {
  let createBook = await Book.create(req.body);
  return res.status(201).json({ book: createBook });
 } catch (error) {
  next(error);
 }
});

router.get("/:id", auth.isVerified, async (req, res, next) => {
 let { id } = req.params;
 try {
  let singleBook = await Book.findById(id).populate("comments");
  return res.status(201).json({ book: singleBook });
 } catch (error) {
  next(error);
 }
});

router.put("/:id/edit", auth.isVerified, async (req, res, next) => {
  let { id } = req.params;
  let user = req.user
 try {
  let updateBook = await Book.findByIdAndUpdate(id, req.body);
  let singleBook = await Book.findById(id);
  console.log(singleBook, "single book")
   if (user.userId == singleBook.authorId && updateBook) {
   return res.status(201).json({ updatedBook: singleBook });
  }
 } catch (error) {
  next(error);
 }
});

router.delete("/:id/delete", auth.isVerified, async (req, res, next) => {
 let { id } = req.params;
 try {
  let deleteBook = await Book.findByIdAndDelete(id);
  return res.status(201).redirect("/books");
 } catch (error) {
  next(error);
 }
});

router.post("/:id/comment", auth.isVerified, async (req, res, next) => {
 let { id } = req.params;
 req.body.bookId = id;
 try {
  let comment = await Comment.create(req.body);
  let updateBook = await Book.findByIdAndUpdate(id, {
   $push: { comments: comment.id },
  });
  let singleBook = await Book.findById(id).populate("comments");

  return res.status(201).json({ updateBook: singleBook });
 } catch (error) {
  next(error);
 }
});

module.exports = router;
