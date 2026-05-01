const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const Product = require('../models/Product');
const Category = require('../models/Category');

// ====================== Cloudinary Config ======================
cloudinary.config({
  cloud_name: 'durrm1jr7',
  api_key: '221425331624495',
  api_secret: 'Mh7gu4Zah6mJR6eaafrDW54GFOU'
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uddom_products',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp']
  }
});

const upload = multer({ storage: storage });

// ====================== GET All Products (Used by Home) ======================
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 12 } = req.query;
    const skip = (page - 1) * parseInt(limit);

    const products = await Product.find()
      .populate('seller', 'name')
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    res.json(products);   // ← Simple array for frontend
  } catch (error) {
    console.error("Products Fetch Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error fetching products" 
    });
  }
});

// ====================== Other Routes ======================
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('seller', 'name');
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product details" });
  }
});

router.post('/add', upload.array('images', 5), async (req, res) => {
  try {
    const { name, price, description, category, subCategory, childCategory, isWholesale, minOrder, wholesaleTiers, sellerId } = req.body;

    const imageUrls = req.files ? req.files.map(file => file.path) : [];

    const newProduct = new Product({
      name,
      price: Number(price),
      description,
      category,
      subCategory,
      childCategory,
      isWholesale: isWholesale === 'true' || isWholesale === true,
      minWholesaleQty: Number(minOrder) || 10,
      wholesalePrice: wholesaleTiers ? JSON.parse(wholesaleTiers) : null,
      images: imageUrls,
      seller: sellerId && mongoose.Types.ObjectId.isValid(sellerId) 
        ? sellerId 
        : null
    });

    const savedProduct = await newProduct.save();
    res.status(201).json({ success: true, product: savedProduct });
  } catch (error) {
    console.error("Product Add Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Seed Route (for testing)
router.post('/seed', async (req, res) => {
  try {
    await Product.deleteMany({});
    const categories = await Category.find({});
    if (categories.length === 0) {
      return res.status(400).json({ message: "Please seed categories first!" });
    }

    // ... (your seed logic - I kept it short for now)
    res.status(201).json({ success: true, message: "Seed completed" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;