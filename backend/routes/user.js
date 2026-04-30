// routes/user.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// ১. ইউজারের প্রোফাইল ফেচ করা
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ২. প্রোফাইলে নতুন অ্যাড্রেস যোগ করা
router.post('/:id/address', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.addresses.push(req.body);
        const updatedUser = await user.save();
        
        // পাসওয়ার্ড ছাড়া ইউজার অবজেক্ট রিটার্ন করা
        const userObj = updatedUser.toObject();
        delete userObj.password;
        
        res.json({ success: true, user: userObj });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ৩. প্রোফাইল থেকে অ্যাড্রেস ডিলিট করা
router.delete('/:id/address/:addressId', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.addresses = user.addresses.filter(addr => String(addr._id) !== req.params.addressId);
        const updatedUser = await user.save();
        
        const userObj = updatedUser.toObject();
        delete userObj.password;

        res.json({ success: true, user: userObj });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;