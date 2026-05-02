const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const Product = require('../models/Product');
const Category = require('../models/Category');

// BUG FIX: Cloudinary credentials were hardcoded. Now using env vars.
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'uddom_products',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp']
    }
});
const upload = multer({ storage });

// GET all products (supports ?seller=id, ?category=, ?page=, ?limit=, ?isFlashSale=, ?isWholesale=)
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 12, seller, category, isFlashSale, isWholesale, search } = req.query;
        const skip = (page - 1) * parseInt(limit);

        let query = {};
        if (seller)      query.seller = seller;
        if (category)    query.category = category;
        if (isFlashSale) query.isFlashSale = isFlashSale === 'true';
        if (isWholesale) query.isWholesale = isWholesale === 'true';
        if (search)      query.name = { $regex: search, $options: 'i' };

        const [products, total] = await Promise.all([
            Product.find(query)
                .populate('seller', 'name storeName')
                .skip(skip)
                .limit(parseInt(limit))
                .lean(),
            Product.countDocuments(query)
        ]);

        res.json({ products, total, page: Number(page), pages: Math.ceil(total / limit) });
    } catch (error) {
        console.error('Products Fetch Error:', error);
        res.status(500).json({ success: false, message: 'Error fetching products' });
    }
});

// GET single product
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('seller', 'name storeName');
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching product details' });
    }
});

// POST add product (with image upload)
router.post('/add', upload.array('images', 5), async (req, res) => {
    try {
        const { name, price, description, category, subCategory, childCategory,
                isWholesale, minOrder, wholesaleTiers, sellerId, isFlashSale, unit } = req.body;

        const imageUrls = req.files ? req.files.map(f => f.path) : [];

        const newProduct = new Product({
            name, description, price: Number(price),
            category, subCategory, childCategory,
            unit: unit || 'Pcs',
            isWholesale: isWholesale === 'true' || isWholesale === true,
            isFlashSale: isFlashSale === 'true' || isFlashSale === true,
            minWholesaleQty: Number(minOrder) || 10,
            wholesalePrice: wholesaleTiers ? JSON.parse(wholesaleTiers) : null,
            images: imageUrls,
            seller: sellerId && mongoose.Types.ObjectId.isValid(sellerId) ? sellerId : null
        });

        const saved = await newProduct.save();
        res.status(201).json({ success: true, product: saved });
    } catch (error) {
        console.error('Product Add Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// PUT update product
router.put('/:id', upload.array('images', 5), async (req, res) => {
    try {
        const updates = { ...req.body };
        if (req.files && req.files.length > 0) {
            updates.images = req.files.map(f => f.path);
        }
        const updated = await Product.findByIdAndUpdate(req.params.id, updates, { new: true });
        if (!updated) return res.status(404).json({ message: 'Product not found' });
        res.json({ success: true, product: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// DELETE product
router.delete('/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;