// routes/payment.js
const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/', async (req, res) => {
  const { email, amount, walletAddress } = req.body;

  if (!email || !amount || !walletAddress) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const response = await axios.post('https://api.paystack.co/transaction/initialize', {
      email,
      amount: amount * 100, // Paystack expects kobo (e.g., ₦1000 = 100000)
      metadata: {
        walletAddress,
        amount,
        email,
      },
      // callback_url: "https://yourdomain.com/payment-success" // optional
    }, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      }
    });

    const { authorization_url } = response.data.data;
    res.json({ url: authorization_url });

  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: 'Payment initialization failed' });
  }
});

module.exports = router;
