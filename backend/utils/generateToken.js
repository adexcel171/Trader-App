const jwt = require("jsonwebtoken");

const generateToken = (userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "100d",
  });
  return token;
};

module.exports = generateToken;
