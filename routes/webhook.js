const express = require('express');
const router = express.Router();
const axios = require('axios');
const Transaction = require('../models/Transaction');
const sendMockTokens = require('../services/tokenTransfer');

router.post('/', async (req, res) => {
  const event = req.body;

  if (event.event === 'charge.success') {
    const { reference, metadata } = event.data;
    const { walletAddress, amount, email } = metadata;

    const existing = await Transaction.findOne({ paystackRef: reference });
    if (existing) return res.status(200).send('Already processed');

    const tx = new Transaction({
      email,
      wallet: walletAddress,
      paystackRef: reference,
      amount,
      status: 'paid',
    });
    await tx.save();

    try {
      const txHash = await sendMockTokens(walletAddress, amount);
      tx.txHash = txHash;
      tx.status = 'success';
    } catch (err) {
      tx.status = 'failed';
      tx.error = err.message;

      try {
        await axios.post('https://api.paystack.co/refund', {
          transaction: reference
        }, {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json'
          }
        });

        tx.status = 'refunded';
        tx.refundTime = new Date();
      } catch (refundErr) {
        console.error('Refund failed:', refundErr.message);
      }
    }

    await tx.save();
  }

  res.sendStatus(200);
});

module.exports = router;
