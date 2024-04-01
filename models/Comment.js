let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let commentSchema = new Schema(
 {
  content: { type: String, required: true },
  bookId: { type: Schema.Types.ObjectId, ref: "Book", required: true },
 },
 { timestamps: true }
);

let Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
