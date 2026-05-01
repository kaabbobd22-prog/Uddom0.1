const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  wholesalePrice: { type: mongoose.Schema.Types.Mixed, default: null },
  minWholesaleQty: { type: Number, default: 10 },
  unit: { type: String, default: "Pcs" },
  category: { type: String, required: true },
  subCategory: { type: String },
  childCategory: { type: String },
  isWholesale: { type: Boolean, default: false },
  isFlashSale: { type: Boolean, default: false },
  images: [{ type: String }],
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller' }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);