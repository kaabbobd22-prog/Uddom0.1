const express = require('express');
const router = express.Router();
const Seller = require('../models/Seller'); // আপনার সেলার মডেলের পাথ ঠিক করে নিন
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || "uddom_super_secret_key_2026";

// অ্যাডমিন ভেরিফাই মিডলওয়্যার (ঐচ্ছিক, আপনার সিকিউরিটির জন্য)
const verifyAdmin = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided." });

    try {
        const verified = jwt.verify(token, JWT_SECRET);
        // এখানে role 'admin' কিনা চেক করতে পারেন
        req.admin = verified;
        next();
    } catch (err) {
        res.status(400).json({ message: "Invalid Token" });
    }
};

// ==========================================
// ১. সব সেলার ফেচ করার এপিআই
// ==========================================
router.get('/sellers', verifyAdmin, async (req, res) => {
    try {
        const sellers = await Seller.find().sort({ createdAt: -1 });
        res.status(200).json(sellers);
    } catch (error) {
        console.error("Fetch Sellers Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

// ==========================================
// ২. সেলার অ্যাপ্রুভ (Verify) করার এপিআই
// ==========================================
router.put('/sellers/approve/:id', verifyAdmin, async (req, res) => {
    try {
        const sellerId = req.params.id;

        const updatedSeller = await Seller.findByIdAndUpdate(
            sellerId, 
            { isApproved: true, status: 'Active' }, // ডাটাবেসে অ্যাপ্রুভ করা হচ্ছে
            { returnDocument: 'after' }
        );

        if (!updatedSeller) {
            return res.status(404).json({ message: "Seller not found" });
        }

        res.status(200).json({ message: "Seller approved successfully", seller: updatedSeller });
    } catch (error) {
        console.error("Approve Seller Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;