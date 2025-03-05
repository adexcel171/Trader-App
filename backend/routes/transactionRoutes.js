const express = require("express");
const router = express.Router();
const {
  createTransaction,
  updateTransactionStatus,
  getUserTransactions,
  getAllTransactions,
} = require("../controllers/transactionController");
const { authenticate } = require("../middlewares/authMiddleware");

// Allow createTransaction to work without authentication (guests can sell)
router.route("/").post(createTransaction).get(authenticate, getAllTransactions);

router.route("/mytransactions").get(authenticate, getUserTransactions);

router.route("/:id/status").put(authenticate, updateTransactionStatus);

module.exports = router;
