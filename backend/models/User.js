// models/User.js
const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    type: { type: String, default: 'Home' }, 
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
    
    // 👇 এই নতুন ফিল্ডটি যোগ করুন
    role: { 
        type: String, 
        enum: ['customer', 'admin', 'seller'], // আপনার প্রোজেক্টে যা যা রোল আছে
        default: 'customer' 
    },
    
    addresses: [addressSchema]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);