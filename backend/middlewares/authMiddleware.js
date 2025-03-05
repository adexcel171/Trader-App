const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");
const asyncHandler = require("./asyncHandler.js");

const authenticate = asyncHandler(async (req, res, next) => {
  let token;

  // Check for Bearer token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    console.log("Token received:", token); // Debug log
  }

  if (!token) {
    console.log("No token provided in request"); // Debug log
    return res
      .status(401)
      .json({ message: "Not authorized, no token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId).select("-password");
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Not authorized, user not found." });
    }
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message); // Debug log
    return res.status(401).json({ message: "Not authorized, token failed." });
  }
});

const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    return res.status(403).json({ message: "Not authorized as an admin." });
  }
};

module.exports = { authenticate, authorizeAdmin };
