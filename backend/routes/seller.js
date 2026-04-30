const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
// const Product = require('../models/Product'); // আপনার প্রোডাক্ট মডেল
// const Order = require('../models/Order'); // আপনার অর্ডার মডেল

const JWT_SECRET = process.env.JWT_SECRET || "uddom_super_secret_key_2026";

// টোকেন ভেরিফাই করার মিডলওয়্যার
const verifySeller = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Access Denied. No token provided." });

    try {
        const verified = jwt.verify(token, JWT_SECRET);
        req.seller = verified;
        next();
    } catch (err) {
        res.status(400).json({ message: "Invalid Token" });
    }
};

// ==========================================
// ১. Get Seller Dashboard Stats
// ==========================================
router.get('/stats', verifySeller, async (req, res) => {
    try {
        const sellerId = req.seller.id;

        // এখানে রিয়েল ডাটাবেস কোয়েরি হবে। আপাতত ক্র্যাশ ঠেকানোর জন্য ডামি ডাটা পাঠাচ্ছি:
        // const totalProducts = await Product.countDocuments({ seller: sellerId });
        
        res.json({
            totalSales: 45000,
            pendingOrders: 3,
            totalProducts: 12, // রিয়েল কোয়েরি হলে totalProducts ভেরিয়েবল বসাবেন
            rating: '4.8'
        });
    } catch (error) {
        console.error("Stats Error:", error);
        res.status(500).json({ message: "Error fetching stats" });
    }
});

// ==========================================
// ২. Get Recent Orders
// ==========================================
router.get('/orders/recent', verifySeller, async (req, res) => {
    try {
        const sellerId = req.seller.id;

        // রিয়েল ডাটাবেস কোয়েরি (যদি Order মডেল থাকে):
        // const recentOrders = await Order.find({ seller: sellerId }).sort({ createdAt: -1 }).limit(5);
        
        // ক্র্যাশ ঠেকানোর জন্য আপাতত ডামি অর্ডার লিস্ট (Order মডেল রেডি না হওয়া পর্যন্ত):
        const mockOrders = [
            { _id: 'ORD99812A', type: 'Retail', createdAt: new Date(), totalAmount: 1250, status: 'Pending' },
            { _id: 'ORD99813B', type: 'Wholesale', createdAt: new Date(), totalAmount: 15000, status: 'Processing' }
        ];

        res.json(mockOrders);
    } catch (error) {
        console.error("Orders Error:", error);
        res.status(500).json({ message: "Error fetching recent orders" });
    }
});

// আপনার Seller মডেলটি ইম্পোর্ট করা না থাকলে উপরে করে নিন:
const Seller = require('../models/Seller'); // মডেলের নাম আপনার প্রোজেক্ট অনুযায়ী মেলাবেন

// ==========================================
// ৩. Get Fresh Seller Profile (For Auto-Sync)
// ==========================================
router.get('/profile', verifySeller, async (req, res) => {
    try {
        const sellerId = req.seller.id;
        // ডাটাবেস থেকে সেলারের ফ্রেশ ডাটা আনা হচ্ছে (পাসওয়ার্ড ছাড়া)
        const seller = await Seller.findById(sellerId).select('-password');
        
        if (!seller) return res.status(404).json({ message: "Seller not found" });
        
        res.json(seller);
    } catch (error) {
        console.error("Profile Fetch Error:", error);
        res.status(500).json({ message: "Error fetching fresh profile" });
    }
});

module.exports = router;