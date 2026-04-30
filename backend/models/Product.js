// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },

  wholesalePrice: { type: mongoose.Schema.Types.Mixed },
  minWholesaleQty: { type: Number, default: 10 },
  unit: { type: String, default: "Pcs" },

  // ক্যাটাগরি ট্র্যাকিং
  category: { type: String, required: true },
  subCategory: { type: String, required: false }, // Added
  childCategory: { type: String, required: false }, // Added

  isWholesale: { type: Boolean, default: false }, // এটি ট্রু থাকলে হোলসেল হাবে দেখাবে
  isFlashSale: { type: Boolean, default: false }, // Added for Flash Sale
  images: [String],
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller' }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);