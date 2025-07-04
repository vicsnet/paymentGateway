require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const paystackRoutes = require('./routes/paystack');
const webhookRoutes = require('./routes/webhook');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api', paystackRoutes);
app.use('/webhook', webhookRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));