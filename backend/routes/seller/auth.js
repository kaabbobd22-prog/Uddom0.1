const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Seller = require('../../models/Seller');

const JWT_SECRET = process.env.JWT_SECRET || "uddom_super_secret_key_2026";

// ==========================================
// ১. Seller Registration
// ==========================================
router.post('/register', async (req, res) => {
    try {
        const { ownerName, email, password } = req.body;

        // চেক করা ইমেইল আগে থেকেই আছে কি না
        const existingSeller = await Seller.findOne({ email });
        if (existingSeller) return res.status(400).json({ message: "Email already registered!" });

        // পাসওয়ার্ড হ্যাশ করা
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newSeller = new Seller({
            ownerName,
            email,
            password: hashedPassword
        });

        await newSeller.save();
        res.status(201).json({ success: true, message: "Registration successful! Please login to continue." });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// ==========================================
// ২. Seller Login
// ==========================================
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const seller = await Seller.findOne({ email });
        if (!seller) return res.status(404).json({ message: "Seller not found!" });

        const isMatch = await bcrypt.compare(password, seller.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials!" });

        // টোকেন তৈরি করা
        const token = jwt.sign({ id: seller._id, isApproved: seller.isApproved }, JWT_SECRET, { expiresIn: '7d' });

        res.json({
            success: true,
            token,
            seller: {
                id: seller._id,
                ownerName: seller.ownerName,
                storeName: seller.storeName,
                isApproved: seller.isApproved, // ফ্রন্টএন্ডে এটি দিয়ে অ্যাক্সেস কন্ট্রোল করবেন
                status: seller.status
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// ==========================================
// ৩. Store Settings Update (Send Request to Admin)
// ==========================================
router.put('/settings/:id', async (req, res) => {
    try {
        const { storeName, phone, address, tradeLicenseOrNID } = req.body;

        // সেটিংস আপডেট করা
        const updatedSeller = await Seller.findByIdAndUpdate(
            req.params.id,
            {
                storeName,
                phone,
                address,
                tradeLicenseOrNID,
                status: 'Pending' // আপডেট করার পর স্ট্যাটাস আবার পেন্ডিং হয়ে যাবে (অ্যাডমিন রিভিউর জন্য)
            },
            { new: true }
        );

        res.json({
            success: true,
            message: "Store settings saved successfully! Your profile is pending Admin approval.",
            seller: updatedSeller
        });

    } catch (error) {
        res.status(500).json({ message: "Error updating settings", error: error.message });
    }
});

module.exports = router;