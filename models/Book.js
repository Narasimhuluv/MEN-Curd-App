let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let bookSchema = new Schema(
 {
  name: { type: String, required: true },
  desc: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: String, required: true },
  quantity: { type: Number, required: true },
  authorId: { type: String, required: true },
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment", required: true }],
 },
 { timestamps: true }
);

let Book = mongoose.model("Book", bookSchema);
module.exports = Book;
