// server.js
const express = require('express');
const cors = require('cors');

const vendorRoutes = require('./routes/vendor');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/vendors', vendorRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));