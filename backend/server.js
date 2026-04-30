const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
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
const sellerAuthRoutes = require('./routes/seller/auth'); // 👈 নতুন সেলার অথ রুট
// ==========================================
// 2. Middlewares
// ==========================================
app.use(cors());
app.use(express.json()); // JSON ডেটা রিসিভ করার জন্য

// ==========================================
// 3. API Routes Connect
// ==========================================
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/wholesale', wholesaleRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

// Seller Routes
app.use('/api/seller', sellerRoutes); // Dashboard & Orders: /api/seller/stats
app.use('/api/seller/auth', sellerAuthRoutes); // 👈 ঠিক এখানে পরিবর্তন করা হয়েছে: /api/seller/auth

// ==========================================
// 4. MongoDB Connection
// ==========================================
const uri = process.env.MONGODB_URI;
mongoose.connect(uri)
    .then(() => console.log("✅ UDDOM Database Connected Successfully"))
    .catch(err => console.log("❌ DB Connection Error:", err));

// ==========================================
// 5. Basic Route & Server Start
// ==========================================
app.get('/', (req, res) => {
    res.send('UDDOM Backend Server is Running...');
});

app.listen(PORT, () => {
    console.log(`🚀 Server is flying on port: ${PORT}`);
});