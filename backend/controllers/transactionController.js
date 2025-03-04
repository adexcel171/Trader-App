// backend/controllers/transactionController.js
const asyncHandler = require("express-async-handler");
const Transaction = require("../models/Transaction");
const io = require("../socket/socket");

const createTransaction = asyncHandler(async (req, res) => {
  const { cryptoName, quantity, totalAmount, type } = req.body;

  // Ensure user is authenticated
  if (!req.user || !req.user._id) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  // Validate required fields
  if (!cryptoName || !quantity || !totalAmount || !type) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Create the transaction
  const transaction = await Transaction.create({
    userId: req.user._id,
    userName: req.user.name,
    cryptoName,
    quantity,
    totalAmount,
    status: "pending",
    type,
  });

  if (transaction) {
    io.getIO().emit("transactionCreated", transaction);
    res.status(201).json(transaction);
  } else {
    res.status(400).json({ message: "Invalid transaction data" });
  }
});

// Other handlers remain unchanged
const updateTransactionStatus = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findById(req.params.id);
  if (!transaction) {
    return res.status(404).json({ message: "Transaction not found" });
  }

  const now = new Date();
  const createdAt = new Date(transaction.createdAt);
  const hoursDiff = (now - createdAt) / (1000 * 60 * 60);
  if (hoursDiff > 24) {
    return res
      .status(403)
      .json({ message: "Status updates not allowed after 24 hours" });
  }

  transaction.status = req.body.status || transaction.status;
  transaction.lastModified = Date.now();
  const updatedTransaction = await transaction.save();

  io.getIO().emit("transactionUpdated", updatedTransaction);
  res.status(200).json(updatedTransaction);
});

const getUserTransactions = asyncHandler(async (req, res) => {
  if (!req.user || !req.user._id) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  const transactions = await Transaction.find({ userId: req.user._id });
  res.status(200).json(transactions || []);
});

const getAllTransactions = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find({}).populate(
    "userId",
    "name email"
  );
  res.status(200).json(transactions || []);
});

module.exports = {
  createTransaction,
  updateTransactionStatus,
  getUserTransactions,
  getAllTransactions,
};
