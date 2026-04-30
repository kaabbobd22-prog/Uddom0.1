const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema({
    ownerName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    
    // Store Settings Info (রেজিস্ট্রেশনের পর সেটিংসে গিয়ে ফিলাপ করবে)
    storeName: { type: String, default: '' },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    tradeLicenseOrNID: { type: String, default: '' }, // ভেরিফিকেশনের জন্য
    
    // Admin Approval Flag
    isApproved: { type: Boolean, default: false }, // অ্যাডমিন ট্রু না করা পর্যন্ত প্রোডাক্ট অ্যাড করতে পারবে না
    
    // Status
    status: { type: String, enum: ['Pending', 'Active', 'Suspended'], default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('Seller', sellerSchema);