const express = require('express');
const axios = require('axios');
const router = express.Router();

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

router.post('/create-payment', async (req, res) => {
  const { email, amount, walletAddress } = req.body;

  try {
    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email,
        amount: amount * 100, // in kobo
        metadata: {
          walletAddress,
          usdAmount: amount,
        }
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.json({ authorization_url: response.data.data.authorization_url });
  } catch (error) {
    console.error(error.response.data);
    res.status(500).json({ error: 'Failed to initialize payment' });
  }
});

module.exports = router;
