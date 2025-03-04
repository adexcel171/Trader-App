const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");
const asyncHandler = require("./asyncHandler.js");

// Middleware to authenticate user
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
        return res.status(500).json({ message: "Server configuration error" });
      }

      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded token:", decoded); // Debug

      // Find the user by ID and exclude the password
      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        console.error("User not found for ID:", decoded.id);
        return res.status(401).json({ message: "User not found" });
      }

      // Attach user to request and proceed
      req.user = user;
      console.log("Authenticated user:", req.user); // Debug
      next();
    } else {
      console.log("No token provided in Authorization header"); // Debug
      return res
        .status(401)
        .json({ message: "Not authorized, no token provided" });
    }
  } catch (error) {
    console.error("Authentication error:", error.message);
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
});

// Middleware to authorize admin users
const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    return res.status(403).json({ message: "Not authorized as an admin" });
  }
};

module.exports = { authenticate, authorizeAdmin };
