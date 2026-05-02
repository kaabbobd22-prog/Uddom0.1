const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Seller = require('../../models/Seller');

const JWT_SECRET = process.env.JWT_SECRET || "uddom_super_secret_key_2026";

// ==========================================
// 1. POST /api/seller/auth/register
// ==========================================
router.post('/register', async (req, res) => {
    try {
        const { ownerName, email, password } = req.body;

        if (!ownerName || !email || !password)
            return res.status(400).json({ message: "ownerName, email, and password are required." });

        const existingSeller = await Seller.findOne({ email });
        if (existingSeller) return res.status(400).json({ message: "Email already registered!" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newSeller = new Seller({ ownerName, email, password: hashedPassword });
        await newSeller.save();

        res.status(201).json({ success: true, message: "Registration successful! Please login to continue." });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// ==========================================
// 2. POST /api/seller/auth/login
// ==========================================
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const seller = await Seller.findOne({ email });
        if (!seller) return res.status(404).json({ message: "Seller not found!" });

        if (seller.status === 'Suspended')
            return res.status(403).json({ message: "Your account has been suspended. Contact support." });

        const isMatch = await bcrypt.compare(password, seller.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials!" });

        const token = jwt.sign(
            { id: seller._id, isApproved: seller.isApproved },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            token,
            seller: {
                id: seller._id,
                ownerName: seller.ownerName,
                email: seller.email,
                storeName: seller.storeName,
                phone: seller.phone,
                address: seller.address,
                tradeLicenseOrNID: seller.tradeLicenseOrNID,
                isApproved: seller.isApproved,
                status: seller.status
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// ==========================================
// 3. PUT /api/seller/auth/settings/:id
// ==========================================
router.put('/settings/:id', async (req, res) => {
    try {
        const { storeName, phone, address, tradeLicenseOrNID, tagline, description, businessType } = req.body;

        const updatedSeller = await Seller.findByIdAndUpdate(
            req.params.id,
            {
                storeName,
                phone,
                address,
                tradeLicenseOrNID,
                tagline,
                description,
                businessType,
                status: 'Pending'  // Resubmit for admin review on every settings update
            },
            { new: true }
        ).select('-password');

        if (!updatedSeller) return res.status(404).json({ message: "Seller not found" });

        res.json({
            success: true,
            message: "Store settings saved! Your profile is pending Admin approval.",
            seller: updatedSeller
        });
    } catch (error) {
        res.status(500).json({ message: "Error updating settings", error: error.message });
    }
});

module.exports = router;
