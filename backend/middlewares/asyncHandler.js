const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch((error) => {
    res.status(error.status || 500).json({ message: error.message });
  });

module.exports = asyncHandler;
