const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const transactionSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    userName: {
      type: String,
      required: false,
      default: "guest",
    },
    cryptoName: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "delivered", "cancelled"],
      default: "pending",
    },
    type: {
      type: String,
      required: true,
    },
    lastModified: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

transactionSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Transaction", transactionSchema);
