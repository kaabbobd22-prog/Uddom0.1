const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const axios = require('axios'); // 👈 axios ইম্পোর্ট করা হয়েছে
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
// server.js
app.use(cors({
  origin: ['https://your-frontend-link.onrender.com', 'http://localhost:5173'], // ফ্রন্টএন্ডের লিঙ্ক দিন
  credentials: true
}));

app.use(express.json());

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
app.use('/api/seller', sellerRoutes); 
app.use('/api/seller/auth', sellerAuthRoutes);

// ==========================================
// 4. MongoDB Connection
// ==========================================
const uri = process.env.MONGODB_URI;
mongoose.connect(uri)
    .then(() => console.log("✅ UDDOM Database Connected Successfully"))
    .catch(err => console.log("❌ DB Connection Error:", err));

// ==========================================
// 5. Render Keep-Alive (Self-Ping Logic)
// ==========================================
// প্রতি ১০ মিনিটে সার্ভার নিজেকে হিট করবে যাতে Render স্লিপ মোডে না যায়
// server.js
const SERVER_URL = `https://uddom-mern.onrender.com/ping`; // আপনার দেওয়া লিঙ্কটি এখানে বসলো

setInterval(async () => {
  try {
    const response = await axios.get(SERVER_URL);
    console.log(`📡 Keep-Alive Ping Sent: Status ${response.status}`);
  } catch (error) {
    console.error("❌ Keep-Alive Ping Failed:", error.message);
  }
}, 600000); // ১০ মিনিট পরপর
// পিং রাউট

app.get('/ping', (req, res) => {
  res.status(200).send("Server is awake! 🚀");
});

// ==========================================
// 6. Basic Route & Server Start
// ==========================================
app.get('/', (req, res) => {
    res.send('UDDOM Backend Server is Running...');
});

app.listen(PORT, () => {
    console.log(`🚀 Server is flying on port: ${PORT}`);
});
// server.js এর শেষে
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`🚀 Server is flying on port: ${PORT}`);
    });
}

module.exports = app; // ভেরসেলের জন্য এটি প্রয়োজন