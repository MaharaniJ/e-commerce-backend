const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");
const secretKey = process.env.SECRET_KEY;

let authenticate1 = async function (req, res, next) {
  console.log("header MEssage", req.headers);
  if (req.headers.authorization) {
    const token =
      req.headers.authorization && req.headers.authorization.split(" ")[1];
    try {
      const decode = await jwt.verify(token, secretKey);
      console.log(decode);
      const rootUser = await User.findOne({
        _id: decode._id,
        "tokens.token": token,
      });

      if (!rootUser) {
        throw new Error("User Not Found");x
      }

      req.token = token; // Update to use req.headers.authorization
      req.rootUser = rootUser;
      req.userID = rootUser._id;

      next();
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};
module.exports = authenticate1;
