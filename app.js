require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const webhookRouter = require('./routes/webhook');
const paymentRouter = require('./routes/payment');

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB error:', err));


app.use(cors());

app.use('/webhook', webhookRouter);
app.use('/create-payment', paymentRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});