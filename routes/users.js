var express = require("express");
const User = require("../models/User");
var router = express.Router();
let jwt = require("jsonwebtoken");

/* GET users listing. */
router.post("/new", async (req, res, next) => {
 let { email } = req.body;
 try {
  let existUser = await User.findOne({ email: email });
  if (!existUser) {
   let create = await User.create(req.body);
   return res.status(201).json({ user: create });
  } else {
   return res.status(400).json({ error: "Already User exists" });
  }
 } catch (error) {
  next(error);
 }
});

router.post("/login", async (req, res, next) => {
 let { email, password } = req.body;
 if (!email || !password) {
  return res.status(400).json({ error: "Email and Password is required" });
 }
 try {
  let existUser = await User.findOne({ email: email });
  if (!existUser) {
   return res.status(400).json({ error: "User is Not registerd" });
  }

  // verifyUser
  let verifyUser = await existUser.verifyPassword(password);
  if (!verifyUser) {
   return res.status(400).json({ error: "Password Is incorrect" });
  }

  //  generate token
  let token = await existUser.signToken();
  let userObj = await existUser.userObject(token);
  res.status(200).json({ user: userObj });
 } catch (error) {
  next(error);
 }
});

module.exports = router;
