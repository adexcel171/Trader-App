// backend/routes/transactionRoutes.js
const express = require("express");
const router = express.Router();
const {
  createTransaction,
  updateTransactionStatus,
  getUserTransactions,
  getAllTransactions,
} = require("../controllers/transactionController");
const {
  authenticate,
  authorizeAdmin,
} = require("../middlewares/authMiddleware");

// Debug: Log imported controllers to ensure they are defined
console.log("Imported controllers:", {
  createTransaction,
  updateTransactionStatus,
  getUserTransactions,
  getAllTransactions,
});

router
  .route("/")
  .post(authenticate, createTransaction)
  .get(authenticate, authorizeAdmin, getAllTransactions);

router.route("/mytransactions").get(authenticate, getUserTransactions);

router
  .route("/:id/status")
  .put(authenticate, authorizeAdmin, updateTransactionStatus);

module.exports = router;
