// backend/routes/router.js
const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/authMiddleware.js");
const {
  createTransaction,
  updateTransactionStatus,
  getUserTransactions,
  getAllTransactions,
} = require("../controllers/transactionController.js"); // Adjust path as needed

// Admin-restricted route to fetch all transactions
router.get("/", authenticate, getAllTransactions);

// User-specific route to fetch user transactions
router.get("/mytransactions", authenticate, getUserTransactions);

// Add POST route to create a new transaction
router.post("/", authenticate, createTransaction);

// Add PUT route to update transaction status (if needed elsewhere)
router.put("/:id/status", authenticate, updateTransactionStatus);

module.exports = router;
