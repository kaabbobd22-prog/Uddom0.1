const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// 1. Create new order (from Checkout page)
router.post('/', async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        const savedOrder = await newOrder.save();
        res.status(201).json({ success: true, order: savedOrder, message: 'Order placed successfully!' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// 2. Get a user's order history
// BUG FIX: Was querying { user: id } but Order model field is 'customer'
router.get('/user/:userId', async (req, res) => {
    try {
        const orders = await Order.find({ customer: req.params.userId })
            .populate('products.product', 'name images price')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 3. Get orders for a seller (by seller ObjectId)
router.get('/seller/:sellerId', async (req, res) => {
    try {
        const { status } = req.query;
        let filter = { seller: req.params.sellerId };
        if (status && status !== 'All') filter.status = status;
        const orders = await Order.find(filter)
            .populate('customer', 'name email phone')
            .populate('products.product', 'name images')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 4. Update order status
router.patch('/:id/status', async (req, res) => {
    try {
        const updated = await Order.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );
        if (!updated) return res.status(404).json({ message: 'Order not found' });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// 5. Get single order by ID (for OrderTracking page)
router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('customer', 'name email phone')
            .populate('products.product', 'name images price');
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;