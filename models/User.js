let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let bcrypt = require("bcrypt");
let jwt = require("jsonwebtoken");

let userSchema = new Schema(
 {
  name: { type: String, required: true },
  email: { type: String, required: true, Math: /@/ },
  password: { type: String, required: true },
 },
 { timestamps: true }
);

userSchema.pre("save", async function () {
 if ((this.password, this.isModified("password"))) {
  this.password = await bcrypt.hash(this.password, 10);
 } else {
  next();
 }
});

userSchema.methods.verifyPassword = async function (password) {
 try {
  let results = await bcrypt.compare(password, this.password);
  return results;
 } catch (error) {
  return error;
 }
 bcrypt.compare();
};

userSchema.methods.signToken = async function () {
 let payload = { userId: this.id, name: this.name, email: this.email };
 try {
  let token = await jwt.sign(payload, process.env.SECRET);
  return token;
 } catch (error) {
  return error;
 }
};

userSchema.methods.userObject = function (token) {
 return {
  name: this.name,
  email: this.email,
  token: token,
 };
};

let User = mongoose.model("User", userSchema);
module.exports = User;
