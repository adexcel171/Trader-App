const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/authMiddleware");
const Transaction = require("../models/transactionModel.js");

// Admin-restricted route to fetch all transactions
router.get(
  "/api/transactions",
  authenticate,

  async (req, res) => {
    try {
      // Fetch all transactions (admin-only logic)
      const transactions = await Transaction.find({});
      res.status(200).json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

// User-specific route to fetch user transactions
router.get("/api/mytransactions", authenticate, async (req, res) => {
  try {
    // Fetch transactions for the authenticated user
    const transactions = await Transaction.find({ user: req.user._id });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
