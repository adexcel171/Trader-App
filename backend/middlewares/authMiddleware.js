const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");
const asyncHandler = require("./asyncHandler.js");

const authenticate = asyncHandler(async (req, res, next) => {
  let token;

  // Read JWT from the 'jwt' cookie
  token = req.cookies.jwt;

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token.");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId).select("-password");
    next();
  } catch (error) {
    res.status(401);
    throw new Error("Not authorized, token failed.");
  }
});

const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).send("Not authorized as an admin.");
  }
};

module.exports = { authenticate, authorizeAdmin };
