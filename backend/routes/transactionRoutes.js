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

router
  .route("/")
  .post(authenticate, createTransaction) // Use authenticate instead of protect
  .get(authenticate, authorizeAdmin, getAllTransactions); // Use authenticate and authorizeAdmin

router.route("/mytransactions").get(authenticate, getUserTransactions); // Use authenticate instead of protect

router
  .route("/:id/status")
  .put(authenticate, authorizeAdmin, updateTransactionStatus); // Use authenticate and authorizeAdmin

module.exports = router;
