const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// ১. হোলসেল হাবের সব প্রোডাক্ট এবং ক্যাটাগরি ফিল্টারিং
router.get('/products', async (req, res) => {
  try {
    const { category, sort } = req.query;
    let query = { isWholesale: true };

    if (category) {
      query.category = category;
    }

    let sortOptions = {};
    if (sort === 'moq_low') sortOptions = { minWholesaleQty: 1 };
    if (sort === 'savings') sortOptions = { price: -1 }; // বেশি রিটেইল প্রাইস মানে বেশি সেভিং

    const products = await Product.find(query)
      .populate('seller', 'storeName isVerified')
      .sort(sortOptions);

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ২. RFQ (Request for Quotation) সাবমিট করা
// ইউজার যখন কাস্টম কোড চাইবে তখন এটি কাজ করবে
router.post('/rfq', async (req, res) => {
  // এখানে আপনি একটি নতুন RFQ মডেল তৈরি করে ডাটা সেভ করতে পারেন
  // আপাতত আমরা একটি সাকসেস মেসেজ দিচ্ছি
  const { productId, quantity, message } = req.body;
  res.json({ success: true, message: "Your bulk inquiry has been sent to the seller." });
});

module.exports = router;