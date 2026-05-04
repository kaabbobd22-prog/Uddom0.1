const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ==========================================
// 1. Route Imports
// ==========================================
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const wholesaleRoutes = require('./routes/wholesale');
const orderRoutes = require('./routes/order');
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');
const sellerRoutes = require('./routes/seller');
const sellerAuthRoutes = require('./routes/seller/auth');

// ==========================================
// 2. Middlewares
// ==========================================
app.use((req, res, next) => {
    const allowedOrigins = [
        'https://uddom0-1-harj.vercel.app',
        'http://localhost:5173',
        'http://localhost:3000'
    ];
    const origin = req.headers.origin;

    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    // Pre-flight requests (OPTIONS) এর জন্য সাথে সাথে রেসপন্স দেওয়া
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});
app.use(express.json());

// ==========================================
// 3. API Routes
// ==========================================
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/wholesale', wholesaleRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/seller/auth', sellerAuthRoutes);

// ==========================================
// 4. MongoDB Connection
// ==========================================
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ UDDOM Database Connected Successfully'))
    .catch(err => console.log('❌ DB Connection Error:', err));

// ==========================================
// 5. Keep-Alive Ping (Render free tier)
// ==========================================
const SERVER_URL = process.env.SERVER_URL || `http://localhost:${PORT}/ping`;
setInterval(async () => {
    try {
        const res = await axios.get(SERVER_URL);
        console.log(`📡 Keep-Alive Ping: ${res.status}`);
    } catch (err) {
        console.error('❌ Keep-Alive Ping Failed:', err.message);
    }
}, 600000);

app.get('/ping', (req, res) => res.status(200).send('Server is awake! 🚀'));
app.get('/', (req, res) => res.send('UDDOM Backend Server is Running...'));

// ==========================================
// 6. Start Server — called ONCE only
// ==========================================
app.listen(PORT, () => console.log(`🚀 Server running on port: ${PORT}`));
module.exports = app;
