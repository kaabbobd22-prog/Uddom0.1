const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().lean();
    res.status(200).json(categories);
  } catch (error) {
    console.error("Category Fetch Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to load categories",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
});

module.exports = router;