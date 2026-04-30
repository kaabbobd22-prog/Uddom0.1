const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// --- ১. রেজিস্ট্রেশন এপিআই (Register) ---
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // চেক করা ইউজার আগে থেকেই আছে কি না
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "User already exists" });

        // পাসওয়ার্ড হ্যাশ করা
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // নতুন ইউজার তৈরি
        user = new User({
            name,
            email,
            password: hashedPassword,
            role: role || 'customer'
        });

        await user.save();
        res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});

// --- ২. লগইন এপিআই (Login) ---
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // ইউজার খুঁজে বের করা
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid Credentials" });

        // পাসওয়ার্ড চেক করা
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid Credentials" });

        // JWT টোকেন তৈরি করা (লগইন সেশন হিসেবে কাজ করবে)
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' } // ৭ দিন পর্যন্ত লগইন থাকবে
        );

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});

module.exports = router;