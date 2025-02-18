const mongoose = require("mongoose");

const cryptoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  rate: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Crypto", cryptoSchema);
