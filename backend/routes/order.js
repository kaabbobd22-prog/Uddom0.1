// routes/order.js
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// ১. নতুন অর্ডার তৈরি করা (Checkout পেজ থেকে কল হবে)
router.post('/', async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        const savedOrder = await newOrder.save();
        res.status(201).json({ success: true, order: savedOrder, message: "Order placed successfully!" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ২. ইউজারের নিজের অর্ডার হিস্ট্রি দেখার জন্য
router.get('/user/:userId', async (req, res) => {
    try {
        const orders = await Order.find({ user: req.params.userId }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ৩. সেলারের অর্ডার দেখার জন্য (OrderManagement.jsx-এ ব্যবহার করা হয়েছে)
router.get('/seller/:sellerName', async (req, res) => {
    try {
        const { status } = req.query;
        // যে অর্ডারগুলোতে এই সেলারের আইটেম আছে সেগুলো খুঁজবে
        let filter = { "items.seller": req.params.sellerName };

        if (status && status !== 'All') {
            filter.status = status;
        }

        const orders = await Order.find(filter).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ৪. অর্ডার স্ট্যাটাস আপডেট করা (OrderManagement.jsx থেকে কল হবে)
router.patch('/:id/status', async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );
        res.json(updatedOrder);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});
// একটি নির্দিষ্ট অর্ডার ফেচ করার রাউট
router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: "Order not found" });
        res.json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;