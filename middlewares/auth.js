let jwt = require("jsonwebtoken");

module.exports = {
 isVerified: async (req, res, next) => {
  let token = req.headers.authorization;
  try {
   if (token) {
    let payload = jwt.verify(token, process.env.SECRET);
    req.user = payload;
    next();
   } else {
    return res.status(400).json({ error: "Required Token" });
   }
  } catch (error) {
   next(error);
  }
 },
};
