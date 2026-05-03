const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const Seller = require('../models/Seller');
const Product = require('../models/Product');
const Order = require('../models/Order');

const JWT_SECRET = process.env.JWT_SECRET || "uddom_super_secret_key_2026";

// ==========================================
// Auth Middleware
// ==========================================
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
// 1. GET /api/seller/profile
// ==========================================
router.get('/profile', verifySeller, async (req, res) => {
    try {
        const seller = await Seller.findById(req.seller.id).select('-password');
        if (!seller) return res.status(404).json({ message: "Seller not found" });
        res.json(seller);
    } catch (error) {
        res.status(500).json({ message: "Error fetching profile" });
    }
});

// ==========================================
// 2. GET /api/seller/stats   (Dashboard KPIs)
// ==========================================
router.get('/stats', verifySeller, async (req, res) => {
    try {
        const sellerId = req.seller.id;

        const [totalProducts, pendingOrders, allOrders] = await Promise.all([
            Product.countDocuments({ seller: sellerId }),
            Order.countDocuments({ seller: sellerId, status: 'Pending' }),
            Order.find({ seller: sellerId, status: 'Delivered' }).select('totalAmount')
        ]);

        const totalSales = allOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

        // Average rating placeholder (add Review model later)
        res.json({
            totalSales,
            pendingOrders,
            totalProducts,
            rating: '4.8'
        });
    } catch (error) {
        console.error("Stats Error:", error);
        res.status(500).json({ message: "Error fetching stats" });
    }
});

// ==========================================
// 3. GET /api/seller/orders/recent   (Dashboard recent orders)
// ==========================================
router.get('/orders/recent', verifySeller, async (req, res) => {
    try {
        const sellerId = req.seller.id;
        const recentOrders = await Order.find({ seller: sellerId })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('customer', 'name email');
        res.json(recentOrders);
    } catch (error) {
        console.error("Recent Orders Error:", error);
        res.status(500).json({ message: "Error fetching recent orders" });
    }
});

router.get('/orders/seller/me', verifySeller, async (req, res) => {
    try {
        const sellerId = req.seller.id;
        const { status } = req.query;

        const filter = { seller: sellerId };
        // Status filter logic frontend onujayi
        if (status && status !== 'All') filter.status = status;

        const orders = await Order.find(filter)
            .sort({ createdAt: -1 })
            .populate('customer', 'name email phone'); // Phone add kora hoyeche logistics er jonno

        res.json(orders);
    } catch (error) {
        console.error("Seller Orders Error:", error);
        res.status(500).json({ message: "Error fetching orders" });
    }
});

// ==========================================
// 5. PATCH /api/seller/orders/:orderId/status (Frontend PATCH use korche)[cite: 1]
// ==========================================
router.patch('/orders/:orderId/status', verifySeller, async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        const order = await Order.findOneAndUpdate(
            { _id: req.params.orderId, seller: req.seller.id },
            { status },
            { new: true }
        );

        if (!order) return res.status(404).json({ message: "Order not found or unauthorized" });

        res.json({ success: true, order });
    } catch (error) {
        console.error("Status Update Error:", error);
        res.status(500).json({ message: "Error updating order status" });
    }
});

// ==========================================
// 6. GET /api/seller/products   (All products by this seller)
// ==========================================
router.get('/products', verifySeller, async (req, res) => {
    try {
        const sellerId = req.seller.id;
        const products = await Product.find({ seller: sellerId }).sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        console.error("Seller Products Error:", error);
        res.status(500).json({ message: "Error fetching products" });
    }
});

// ==========================================
// 7. DELETE /api/seller/products/:productId
// ==========================================
router.delete('/products/:productId', verifySeller, async (req, res) => {
    try {
        const product = await Product.findOneAndDelete({
            _id: req.params.productId,
            seller: req.seller.id
        });
        if (!product) return res.status(404).json({ message: "Product not found or unauthorized" });
        res.json({ success: true, message: "Product deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting product" });
    }
});

// ==========================================
// 8. GET /api/seller/finance   (Finance / earnings summary)
// ==========================================
router.get('/finance', verifySeller, async (req, res) => {
    try {
        const sellerId = req.seller.id;

        const deliveredOrders = await Order.find({ seller: sellerId, status: 'Delivered' });
        const pendingOrders = await Order.find({ seller: sellerId, status: { $in: ['Pending', 'Processing', 'Shipped'] } });

        const totalEarnings = deliveredOrders.reduce((s, o) => s + (o.totalAmount || 0), 0);
        const pendingBalance = pendingOrders.reduce((s, o) => s + (o.totalAmount || 0), 0);

        // Transactions: last 20 delivered/cancelled orders as ledger entries
        const transactions = await Order.find({ seller: sellerId })
            .sort({ createdAt: -1 })
            .limit(20)
            .select('orderID totalAmount status paymentMethod createdAt');

        res.json({
            totalEarnings,
            pendingBalance,
            availableToWithdraw: Math.max(0, totalEarnings - pendingBalance),
            totalWithdrawn: 0,  // Extend with a Withdrawal model later
            transactions
        });
    } catch (error) {
        console.error("Finance Error:", error);
        res.status(500).json({ message: "Error fetching finance data" });
    }
});

// ==========================================
// 9. GET /api/seller/reports   (Business analytics)
// ==========================================
router.get('/reports', verifySeller, async (req, res) => {
    try {
        const sellerId = req.seller.id;
        const { range = '30D' } = req.query;

        // Build date filter
        const now = new Date();
        const dayMap = { '7D': 7, '30D': 30, '3M': 90, '1Y': 365 };
        const days = dayMap[range] || 30;
        const fromDate = new Date(now - days * 24 * 60 * 60 * 1000);

        const orders = await Order.find({
            seller: sellerId,
            createdAt: { $gte: fromDate }
        }).populate('products.product', 'name');

        const totalOrders = orders.length;
        const netRevenue = orders.filter(o => o.status === 'Delivered').reduce((s, o) => s + o.totalAmount, 0);
        const avgOrderValue = totalOrders > 0 ? Math.round(netRevenue / totalOrders) : 0;

        // Top 5 products by revenue
        const productMap = {};
        orders.forEach(order => {
            order.products.forEach(item => {
                const key = item.product?._id?.toString() || 'unknown';
                const name = item.product?.name || 'Unknown Product';
                if (!productMap[key]) productMap[key] = { name, sales: 0, revenue: 0 };
                productMap[key].sales += item.quantity;
                productMap[key].revenue += item.quantity * item.priceAtPurchase;
            });
        });

        const topProducts = Object.values(productMap)
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5);

        res.json({
            totalOrders,
            netRevenue,
            avgOrderValue,
            conversionRate: '3.8%',  // Needs pageview tracking to compute properly
            topProducts
        });
    } catch (error) {
        console.error("Reports Error:", error);
        res.status(500).json({ message: "Error generating reports" });
    }
});

// ==========================================
// 10. GET /api/seller/inventory   (Stock list - same as products but inventory-focused)
// ==========================================
router.get('/inventory', verifySeller, async (req, res) => {
    try {
        const products = await Product.find({ seller: req.seller.id })
            .select('name price category isWholesale images createdAt')
            .sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Error fetching inventory" });
    }
});

module.exports = router;
