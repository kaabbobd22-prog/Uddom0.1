const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("✅ DB Connected for Bulk Seeding"))
    .catch(err => console.log("❌ DB Error:", err));

const generateProducts = () => {
    const categories = ['Electronics', 'Grocery', 'Fashion', 'Home & Living', 'Health', 'Sports'];
    const sellerId = '69ef0256a4ae8433a2d74b32'; // আপনার ডাটাবেস থেকে পাওয়া Seller ID এখানে বসান
    const productList = [];

    for (let i = 1; i <= 100; i++) {
        const category = categories[Math.floor(Math.random() * categories.length)];
        const price = Math.floor(Math.random() * 5000) + 100;
        const discount = Math.random() > 0.7 ? Math.floor(Math.random() * 40) + 10 : 0; // ৩০% প্রোডাক্টে ডিসকাউন্ট থাকবে

        productList.push({
            name: `${category} Item - ${i}`,
            description: `This is a high-quality product from the ${category} category. Perfect for daily use and highly recommended by UDDOM.`,
            price: price,
            wholesalePrice: Math.floor(price * 0.8), // ২০% কম হোলসেল প্রাইস
            minWholesaleQty: 10,
            category: category,
            stock: Math.floor(Math.random() * 500) + 20,
            images: [`https://picsum.photos/seed/${i + 50}/800/800`], // র‍্যান্ডম ছবির জন্য picsum ব্যবহার করা হয়েছে
            seller: sellerId,
            isFlashSale: i <= 20, // প্রথম ২০টি আইটেম ফ্ল্যাশ সেলে থাকবে
            discount: discount,
            createdAt: new Date()
        });
    }
    return productList;
};

const seedDB = async () => {
    try {
        await Product.deleteMany({}); // সাবধান: আগের সব প্রোডাক্ট মুছে ফেলবে
        const allProducts = generateProducts();
        await Product.insertMany(allProducts);
        console.log(`🚀 Success: 100 Products seeded into UDDOM database!`);
        process.exit();
    } catch (error) {
        console.error("❌ Seeding failed:", error);
        process.exit(1);
    }
};

seedDB();