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

router
  .route("/")
  .post(authenticate, createTransaction)
  .get(authenticate, authorizeAdmin, getAllTransactions); // Added authorizeAdmin for admin-only access

router.route("/mytransactions").get(authenticate, getUserTransactions);

router
  .route("/:id/status")
  .put(authenticate, authorizeAdmin, updateTransactionStatus); // Added authorizeAdmin

module.exports = router;
