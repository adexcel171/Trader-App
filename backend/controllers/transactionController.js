// backend/controllers/transactionController.js
const asyncHandler = require("express-async-handler");
const Transaction = require("../models/Transaction");

const getUserTransactions = asyncHandler(async (req, res) => {
  try {
    // Debug: Check if req.user is set by the authenticate middleware
    console.log("req.user in getUserTransactions:", req.user);

    if (!req.user || !req.user._id) {
      console.error("User or user._id not found:", req.user);
      res.status(401);
      throw new Error("User not authenticated or user._id missing");
    }

    // Find transactions for the authenticated user
    const transactions = await Transaction.find({ userId: req.user._id });
    console.log("Transactions fetched:", transactions);

    // If no transactions found, return an empty array
    if (!transactions || transactions.length === 0) {
      console.log("No transactions found for user:", req.user._id);
      return res.status(200).json([]);
    }

    res.json(transactions);
  } catch (error) {
    console.error("Error in getUserTransactions:", error.message);
    res.status(500);
    throw new Error(
      `Server error while fetching transactions: ${error.message}`
    );
  }
});
