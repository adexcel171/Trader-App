const asyncHandler = require("express-async-handler");
const Transaction = require("../models/Transaction");
const socket = require("../socket/socket");

const createTransaction = asyncHandler(async (req, res) => {
  const { cryptoName, quantity, totalAmount, type, userName } = req.body;

  if (!cryptoName || !quantity || !totalAmount || !type) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const transactionData = {
    userId: req.user?._id || null,
    userName: userName || req.user?.username || "guest",
    cryptoName,
    quantity,
    totalAmount,
    status: "pending",
    type,
  };

  const transaction = await Transaction.create(transactionData);

  if (transaction) {
    socket.getIO().emit("transactionCreated", transaction);
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

  if (!req.user || !req.user.isAdmin) {
    return res
      .status(403)
      .json({ message: "Only admins can update transaction status" });
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

  socket.getIO().emit("transactionUpdated", updatedTransaction); // Broadcast to all clients
  res.status(200).json(updatedTransaction);
});

const getUserTransactions = asyncHandler(async (req, res) => {
  if (!req.user || !req.user._id) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  const { page = 1, limit = 10, startDate, endDate, search } = req.query;
  const query = {
    $or: [
      { userId: req.user._id },
      { userId: null, userName: req.user.username },
    ],
  };

  // Date filtering
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  // Search by cryptoName or userName
  if (search) {
    query.$or = [
      { cryptoName: { $regex: search, $options: "i" } },
      { userName: { $regex: search, $options: "i" } },
    ];
  }

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    sort: { createdAt: -1 }, // Newest first
    populate: "userId", // Populate username/email
  };

  const transactions = await Transaction.paginate(query, options);
  res.status(200).json({
    transactions: transactions.docs,
    totalPages: transactions.totalPages,
    currentPage: transactions.page,
  });
});

const getAllTransactions = asyncHandler(async (req, res) => {
  if (!req.user || !req.user.isAdmin) {
    return res
      .status(403)
      .json({ message: "Only admins can view all transactions" });
  }

  const transactions = await Transaction.find({}).populate(
    "userId",
    "username email"
  );
  res.status(200).json(transactions || []);
});

module.exports = {
  createTransaction,
  updateTransactionStatus,
  getUserTransactions,
  getAllTransactions,
};
