// models/User.js
const mongoose = require('mongoose');

// অ্যাড্রেস স্কিমা
const addressSchema = new mongoose.Schema({
    type: { type: String, default: 'Home' }, // Home, Office, etc.
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true }
});

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    avatar: { type: String, default: "https://placehold.co/150x150/000000/ffffff?text=U" },
    addresses: [addressSchema] // ইউজারের মাল্টিপল অ্যাড্রেস থাকবে
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);