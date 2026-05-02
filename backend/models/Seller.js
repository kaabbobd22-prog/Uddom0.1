const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema({
    ownerName: { type: String, required: true },
    email:     { type: String, required: true, unique: true },
    password:  { type: String, required: true },

    // Store Identity (filled in StoreSettings)
    storeName:         { type: String, default: '' },
    tagline:           { type: String, default: '' },
    description:       { type: String, default: '' },
    businessType:      { type: String, default: 'Retailer / Shop Owner' },
    phone:             { type: String, default: '' },
    address:           { type: String, default: '' },
    tradeLicenseOrNID: { type: String, default: '' },

    // Admin Approval
    isApproved: { type: Boolean, default: false },

    // Account Status
    status: { type: String, enum: ['Pending', 'Active', 'Suspended'], default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('Seller', sellerSchema);
