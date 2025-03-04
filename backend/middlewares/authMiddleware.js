const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");
const asyncHandler = require("./asyncHandler.js");

const authenticate = asyncHandler(async (req, res, next) => {
  try {
    let token;
    console.log("Authorization header:", req.headers.authorization); // Debug

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
      console.log("Token received:", token); // Debug

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded token:", decoded); // Debug

      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user) {
        console.error("User not found for ID:", decoded.id);
        res.status(401);
        throw new Error("User not found");
      }

      console.log("Authenticated user:", req.user); // Debug
      next();
    } else {
      console.error("No token provided in Authorization header");
      res.status(401);
      throw new Error("Not authorized, no token");
    }
  } catch (error) {
    console.error("Authentication error:", error.message);
    res.status(401);
    throw new Error("Not authorized, token failed");
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
