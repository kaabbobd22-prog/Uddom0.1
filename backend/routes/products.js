const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const Product = require('../models/Product');
const Category = require('../models/Category');

// Cloudinary Config
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

// ১. সব প্রোডাক্ট গেট করা (Home Page এর জন্য)
router.get('/', async (req, res) => {
    try {
        const products = await Product.find().populate('seller', 'name');
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Error fetching products" });
    }
});

// ২. নতুন প্রোডাক্ট যোগ করা (Seller/Admin এর জন্য)
router.post('/add', upload.array('images', 5), async (req, res) => {
    try {
        const {
            name, price, description, category, subCategory, childCategory,
            isWholesale, minOrder, wholesaleTiers, sellerId
        } = req.body;


        const imageUrls = req.files ? req.files.map(file => file.path) : [];
        let parsedTiers = [];
        try {
            if (req.body.wholesaleTiers) {
                parsedTiers = JSON.parse(req.body.wholesaleTiers);
            }
        } catch (e) {
            console.log("JSON Parsing Error:", e);
            parsedTiers = []; // এরর হলে খালি অ্যারে সেট করবে
        }
        const newProduct = new Product({
            name,
            price,
            description,
            category,
            subCategory,
            childCategory,
            isWholesale: isWholesale === 'true', // FormData থেকে স্ট্রিং আসে তাই বুলিয়ান চেক
            minWholesaleQty: minOrder || 1,
            // wholesaleTiers ফ্রন্টএন্ড থেকে JSON স্ট্রিং হিসেবে আসবে
            wholesalePrice: wholesaleTiers ? JSON.parse(wholesaleTiers) : [],
            images: imageUrls,
            seller: sellerId && mongoose.Types.ObjectId.isValid(sellerId)
                ? sellerId
                : new mongoose.Types.ObjectId() // যদি আইডি না থাকে তবে একটি র‍্যান্ডম আইডি তৈরি করবে
        });

        const savedProduct = await newProduct.save();
        res.status(201).json({ success: true, product: savedProduct });
        // routes/product.js
    } catch (error) {
        console.log(error); // এটি আপনার ব্যাকএন্ড টার্মিনালে এরর দেখাবে
        res.status(500).json({ message: error.message }); // এটি ফ্রন্টএন্ডে এরর মেসেজ পাঠাবে
    }
});


// ১. প্রতিটি ক্যাটাগরির জন্য রিয়েল ইমেজ আইডি বা কি-ওয়ার্ড
const categoryImageMap = {
    "Electronics & Gadgets": "1519389483159-262852735f45", // Tech
    "Fashion: Men": "1539106723140-6923a0fb9535", // Men Fashion
    "Fashion: Women": "1567401893414-76b7b1e5a7a5", // Women Fashion
    "Home & Kitchen": "1584622650111-993a426fbf0a", // Kitchen
    "Beauty & Personal Care": "1522335789203-aabd1fc54bc9", // Beauty
    "Baby & Kids": "1515488042361-ee00e0ddd4e4", // Baby
    "Health & Wellness": "1506126613408-eca07ce68773", // Wellness
    "Sports & Outdoors": "1517836357463-d25dfeac3438", // Sports
    "Groceries & Household": "1542838132-92c53300491e", // Grocery
    "Books & Stationery": "1512820790803-83ca734da794", // Books
    "Automotive & Pets": "1511919884226-fd3cad34687c" // Car
};

// ২. আপডেট করা Seed Route
router.post('/seed', async (req, res) => {
    try {
        await Product.deleteMany({});

        const categories = await Category.find({});
        if (categories.length === 0) return res.status(400).json({ message: "আগে Category Seed করুন!" });

        const productsToInsert = [];
        const dummySellerId = new mongoose.Types.ObjectId();

        categories.forEach((cat, catIdx) => {
            if (cat.ChildCategory && cat.ChildCategory.length > 0) {
                cat.ChildCategory.forEach((child, childIdx) => {
                    for (let i = 1; i <= 2; i++) {
                        const retailPrice = Math.floor(Math.random() * 4500) + 500;
                        const wholesale = retailPrice - Math.floor(retailPrice * 0.2);

                        // ✅ এখন Unsplash-এর স্ট্যাটিক ইমেজ সার্ভিস ব্যবহার করা হচ্ছে যা কখনো ব্রোকেন হবে না
                        const imgId = categoryImageMap[cat.Category] || "1505740420928-5e560c06d30e";
                        const realImageUrl = `https://images.unsplash.com/photo-${imgId}?auto=format&fit=crop&w=800&q=80&sig=${catIdx}${childIdx}${i}`;

                        productsToInsert.push({
                            name: `Premium ${child} - Pro Edition`,
                            description: `Elevate your lifestyle with this ${child}. Part of our ${cat.SubCategory} premium lineup.`,
                            price: retailPrice,
                            wholesalePrice: wholesale,
                            minWholesaleQty: Math.floor(Math.random() * 10) + 5,
                            unit: "Pcs",
                            category: cat.Category,
                            subCategory: cat.SubCategory,
                            childCategory: child,
                            isWholesale: Math.random() > 0.5,
                            isFlashSale: Math.random() > 0.8,
                            images: [realImageUrl],
                            seller: dummySellerId
                        });
                    }
                });
            }
        });

        const insertedProducts = await Product.insertMany(productsToInsert);
        res.status(201).json({ success: true, message: `${insertedProducts.length} টি রিয়েল ইমেজ সহ প্রোডাক্ট আপডেট হয়েছে!` });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});
// ৪. সিঙ্গেল প্রোডাক্ট ডিটেইলস (Product Details Page এর জন্য)
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('seller', 'name');
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: "Error fetching product details" });
    }
});

module.exports = router;
// routes/product.js

// ১. র‍্যান্ডম প্রোডাক্ট গেট করা (Home Page এর জন্য)
router.get('/random/items', async (req, res) => {
    try {
        // aggregate logic ব্যবহার করে ডাটাবেস থেকে র‍্যান্ডম ১০টি প্রোডাক্ট নেওয়া
        const products = await Product.aggregate([{ $sample: { size: 10 } }]);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Error fetching random products" });
    }
});

// ২. ব্রাউজিং হিস্ট্রি অনুযায়ী প্রোডাক্ট গেট করা
router.post('/suggested/items', async (req, res) => {
    try {
        const { categories } = req.body; // ফ্রন্টএন্ড থেকে ইউজারের ভিউ করা ক্যাটাগরি লিস্ট আসবে

        if (!categories || categories.length === 0) {
            // যদি হিস্ট্রি না থাকে তবে র‍্যান্ডম কিছু প্রোডাক্ট দিবে
            const randomProducts = await Product.aggregate([{ $sample: { size: 8 } }]);
            return res.json(randomProducts);
        }

        // ইউজারের ভিউ করা ক্যাটাগরিগুলোর ওপর ভিত্তি করে প্রোডাক্ট ফিল্টার করা
        const suggested = await Product.find({ category: { $in: categories } })
            .limit(8)
            .sort({ createdAt: -1 });
        res.json(suggested);
    } catch (error) {
        res.status(500).json({ message: "Error fetching suggested products" });
    }
});

// সব প্রোডাক্ট ডিলিট করার API
router.delete('/delete-all', async (req, res) => {
    try {
        await Product.deleteMany({});
        res.status(200).json({ success: true, message: "সব প্রোডাক্ট সফলভাবে ডিলিট করা হয়েছে। এবার ম্যানুয়ালি অ্যাড করুন।" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});