const express = require('express');
const router = express.Router();
const Category = require('../models/Category'); // মডেলের পাথ ঠিক আছে কিনা চেক করবেন

// GET all categories
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        console.error("Category Fetch Error:", error);
        res.status(500).json({ message: "Failed to load categories" });
    }
});

module.exports = router;