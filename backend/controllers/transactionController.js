const asyncHandler = require("express-async-handler");
const Transaction = require("../models/Transaction"); // Adjust path

const createTransaction = asyncHandler(async (req, res) => {
  const { cryptoName, quantity, totalAmount, type } = req.body;
  const user = req.user._id;

  const transaction = await Transaction.create({
    user,
    cryptoName,
    quantity,
    totalAmount,
    type,
    status: "pending",
  });

  res.status(201).json(transaction);
});

const getUserTransactions = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find({ user: req.user._id });
  res.json(transactions);
});

const getAllTransactions = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find({});
  res.json(transactions);
});

const updateTransactionStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const transaction = await Transaction.findById(id);
  if (!transaction) {
    res.status(404);
    throw new Error("Transaction not found");
  }

  transaction.status = status;
  await transaction.save();

  res.json(transaction);
});

module.exports = {
  createTransaction,
  getUserTransactions,
  getAllTransactions,
  updateTransactionStatus,
};
