const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    Category: { type: String, required: true },
    icon: { type: String }, // Notun icon field
    SubCategory: { type: String, required: true },
    ChildCategory: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);