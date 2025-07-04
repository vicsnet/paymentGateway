const express = require('express');
const router = express.Router();
const sendMockTokens = require('../services/tokenTransfer');

router.post('/', async (req, res) => {
    console.log('testing 1, 2');
    console.log("✅ Webhook received!");
    console.log("👉 Data:", req.body);
    
  const event = req.body;

  if (event.event === 'charge.success') {
    const metadata = event.data.metadata;
    const wallet = metadata.walletAddress;
    const amount = metadata.usdAmount;

    try {
        console.log('testing');
        
      await sendMockTokens(wallet, amount); // send 1 token per $1
      console.log(`Sent ${amount} tokens to ${wallet}`);
    } catch (err) {
      console.error('Token transfer failed', err);
    }
  }

  res.sendStatus(200);
});

module.exports = router;
