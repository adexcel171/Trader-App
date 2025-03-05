const asyncHandler = require("express-async-handler");
const Transaction = require("../models/Transaction");
const socket = require("../socket/socket"); // Import the socket module

const createTransaction = asyncHandler(async (req, res) => {
  const { cryptoName, quantity, totalAmount, type, userName } = req.body;

  // Validate required fields
  if (!cryptoName || !quantity || !totalAmount || !type) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Use provided userName or default to "guest" if no authenticated user
  const transactionData = {
    userId: req.user?._id || null,
    userName: userName || req.user?.name || "guest",
    cryptoName,
    quantity,
    totalAmount,
    status: "pending",
    type,
  };

  // Create the transaction
  const transaction = await Transaction.create(transactionData);

  if (transaction) {
    socket.getIO().emit("transactionCreated", transaction); // Use socket.getIO()
    res.status(201).json(transaction);
  } else {
    res.status(400).json({ message: "Invalid transaction data" });
  }
});

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

  socket.getIO().emit("transactionUpdated", updatedTransaction); // Use socket.getIO()
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
