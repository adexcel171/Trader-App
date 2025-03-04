const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");
const asyncHandler = require("./asyncHandler.js");

const authenticate = asyncHandler(async (req, res, next) => {
  try {
    let token;
    console.log("Authorization header:", req.headers.authorization); // Debug

    // Check if Authorization header exists and starts with "Bearer"
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
      console.log("Token received:", token); // Debug

      // Check if JWT_SECRET is defined
      if (!process.env.JWT_SECRET) {
        console.error("JWT_SECRET is not defined");
        req.user = null; // Allow request to proceed without user
        return next();
      }

      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded token:", decoded); // Debug

      // Find the user by ID and exclude the password
      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        console.error("User not found for ID:", decoded.id);
        req.user = null; // Allow request to proceed without user
        return next();
      }

      // Attach user to request and proceed
      req.user = user;
      console.log("Authenticated user:", req.user); // Debug
      next();
    } else {
      console.log("No token provided in Authorization header"); // Debug, not an error
      req.user = null; // Allow request to proceed without user
      next();
    }
  } catch (error) {
    console.error("Authentication error:", error.message);
    // Instead of throwing an error, set req.user to null and proceed
    req.user = null;
    next();
  }
});

const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).send("Not authorized as an admin.");
  }
};

module.exports = { authenticate, authorizeAdmin };
