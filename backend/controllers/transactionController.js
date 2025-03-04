// backend/controllers/transactionController.js
const asyncHandler = require("express-async-handler");
const Transaction = require("../models/Transaction");
const io = require("../socket/socket");

const createTransaction = asyncHandler(async (req, res) => {
  const { cryptoName, quantity, totalAmount, type } = req.body;
  if (!req.user || !req.user._id) {
    res.status(401);
    throw new Error("User not authenticated");
  }
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
    res.status(400);
    throw new Error("Invalid transaction data");
  }
});

const updateTransactionStatus = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findById(req.params.id);
  if (!transaction) {
    res.status(404);
    throw new Error("Transaction not found");
  }
  const now = new Date();
  const createdAt = new Date(transaction.createdAt);
  const hoursDiff = (now - createdAt) / (1000 * 60 * 60);
  if (hoursDiff > 24) {
    res.status(403);
    throw new Error("Status updates not allowed after 24 hours");
  }
  transaction.status = req.body.status || transaction.status;
  transaction.lastModified = Date.now();
  const updatedTransaction = await transaction.save();
  io.getIO().emit("transactionUpdated", updatedTransaction);
  res.json(updatedTransaction);
});

const getUserTransactions = asyncHandler(async (req, res) => {
  if (!req.user || !req.user._id) {
    res.status(401);
    throw new Error("User not authenticated or user._id missing");
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
