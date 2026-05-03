const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Seller  = require('../models/Seller');
const User    = require('../models/User');
const Product = require('../models/Product');
const Order   = require('../models/Order');
const Category = require('../models/Category');

const JWT_SECRET = process.env.JWT_SECRET || 'uddom_super_secret_key_2026';

// ── Admin Auth Middleware ──────────────────────────────────────
const verifyAdmin = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided.' });
    try {
        const verified = jwt.verify(token, JWT_SECRET);
        if (verified.role !== 'admin') return res.status(403).json({ message: 'Admin access only.' });
        req.admin = verified;
        next();
    } catch {
        res.status(400).json({ message: 'Invalid Token' });
    }
};

// ── ADMIN LOGIN ────────────────────────────────────────────────
// AdminLogin.jsx form was completely static with no onSubmit handler
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, role: 'admin' });
        if (!user) return res.status(401).json({ message: 'Invalid admin credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid admin credentials' });

        const token = jwt.sign({ id: user._id, role: 'admin' }, JWT_SECRET, { expiresIn: '1d' });
        res.json({ success: true, token, admin: { id: user._id, name: user.name, email: user.email } });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

// ── DASHBOARD STATS ────────────────────────────────────────────
// ── DASHBOARD STATS ────────────────────────────────────────────
router.get('/stats', verifyAdmin, async (req, res) => {
    try {
        const [totalSellers, totalCustomers, totalProducts, totalOrders, orders] = await Promise.all([
            Seller.countDocuments(),
            User.countDocuments({ role: 'customer' }),
            Product.countDocuments(),
            Order.countDocuments(),
            Order.find().sort({ createdAt: -1 }).limit(5)
                .populate('customer', 'name')
                .lean()
        ]);

        const revenue = await Order.aggregate([
            { $match: { paymentStatus: 'Paid' } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);

        res.json({
            totalSellers,
            totalCustomers,
            totalProducts,
            totalOrders,
            totalRevenue: revenue[0]?.total || 0,
            recentOrders: orders
        });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

// ── SELLERS ────────────────────────────────────────────────────
router.get('/sellers', verifyAdmin, async (req, res) => {
    try {
        const sellers = await Seller.find().sort({ createdAt: -1 }).select('-password');
        res.json(sellers);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

router.put('/sellers/approve/:id', verifyAdmin, async (req, res) => {
    try {
        const updated = await Seller.findByIdAndUpdate(
            req.params.id,
            { isApproved: true, status: 'Active' },
            { new: true }
        ).select('-password');
        if (!updated) return res.status(404).json({ message: 'Seller not found' });
        res.json({ message: 'Seller approved', seller: updated });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

router.put('/sellers/suspend/:id', verifyAdmin, async (req, res) => {
    try {
        const updated = await Seller.findByIdAndUpdate(
            req.params.id,
            { isApproved: false, status: 'Suspended' },
            { new: true }
        ).select('-password');
        res.json({ message: 'Seller suspended', seller: updated });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

router.delete('/sellers/:id', verifyAdmin, async (req, res) => {
    try {
        await Seller.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Seller deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// ── CUSTOMERS ─────────────────────────────────────────────────
router.get('/customers', verifyAdmin, async (req, res) => {
    try {
        const customers = await User.find({ role: 'customer' })
            .select('-password')
            .sort({ createdAt: -1 });
        res.json(customers);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

router.delete('/customers/:id', verifyAdmin, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Customer deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// ── ORDERS ────────────────────────────────────────────────────
router.get('/orders', verifyAdmin, async (req, res) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;
        const skip = (page - 1) * parseInt(limit);
        let filter = {};
        if (status && status !== 'All') filter.status = status;
        const [orders, total] = await Promise.all([
            Order.find(filter)
                .populate('customer', 'name email phone')
                .populate('seller', 'storeName ownerName')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit)),
            Order.countDocuments(filter)
        ]);
        res.json({ orders, total });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

router.patch('/orders/:id/status', verifyAdmin, async (req, res) => {
    try {
        const updated = await Order.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// ── PRODUCTS ──────────────────────────────────────────────────
router.get('/products', verifyAdmin, async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const skip = (page - 1) * parseInt(limit);
        const [products, total] = await Promise.all([
            Product.find()
                .populate('seller', 'storeName ownerName')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit)),
            Product.countDocuments()
        ]);
        res.json({ products, total });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

router.delete('/products/:id', verifyAdmin, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

router.patch('/products/:id/flash-sale', verifyAdmin, async (req, res) => {
    try {
        const updated = await Product.findByIdAndUpdate(
            req.params.id,
            { isFlashSale: req.body.isFlashSale },
            { new: true }
        );
        res.json({ success: true, product: updated });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// ── CATEGORIES ────────────────────────────────────────────────
router.get('/categories', verifyAdmin, async (req, res) => {
    try {
        const categories = await Category.find().sort({ Category: 1 });
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

router.post('/categories', verifyAdmin, async (req, res) => {
    try {
        const cat = new Category(req.body);
        await cat.save();
        res.status(201).json({ success: true, category: cat });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

router.put('/categories/:id', verifyAdmin, async (req, res) => {
    try {
        const updated = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ success: true, category: updated });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

router.delete('/categories/:id', verifyAdmin, async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Category deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// ── REPORTS ───────────────────────────────────────────────────
router.get('/reports', verifyAdmin, async (req, res) => {
    try {
        const { from, to } = req.query;
        let dateFilter = {};
        if (from && to) dateFilter = { createdAt: { $gte: new Date(from), $lte: new Date(to) } };

        const [salesByDay, topProducts, topSellers] = await Promise.all([
            Order.aggregate([
                { $match: { ...dateFilter, paymentStatus: 'Paid' } },
                { $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    revenue: { $sum: '$totalAmount' },
                    count: { $sum: 1 }
                }},
                { $sort: { _id: 1 } }
            ]),
            Order.aggregate([
                { $unwind: '$products' },
                { $group: { _id: '$products.product', totalSold: { $sum: '$products.quantity' } } },
                { $sort: { totalSold: -1 } },
                { $limit: 5 },
                { $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'product' } },
                { $unwind: '$product' }
            ]),
            Order.aggregate([
                { $match: { paymentStatus: 'Paid' } },
                { $group: { _id: '$seller', revenue: { $sum: '$totalAmount' } } },
                { $sort: { revenue: -1 } },
                { $limit: 5 },
                { $lookup: { from: 'sellers', localField: '_id', foreignField: '_id', as: 'seller' } },
                { $unwind: '$seller' }
            ])
        ]);

        res.json({ salesByDay, topProducts, topSellers });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});
module.exports = router;