const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  email: String,
  wallet: String,
  paystackRef: String,
  amount: Number,
  status: String, // 'pending' | 'paid' | 'success' | 'failed' | 'refunded'
  txHash: String,
  refundTime: Date,
  error: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

transactionSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Transaction', transactionSchema);