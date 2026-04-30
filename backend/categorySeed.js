const mongoose = require('mongoose');
const Category = require('./models/Category'); // আপনার মডেলের সঠিক পাথ দিন
require('dotenv').config();

const categoriesData = [
  // 1. Electronics & Gadgets
  { Category: "Electronics & Gadgets", icon: "📱", SubCategory: "Smartphones", ChildCategory: ["Android", "iPhones", "Feature Phones"] },
  { Category: "Electronics & Gadgets", icon: "📱", SubCategory: "Computers", ChildCategory: ["Laptops", "Gaming PCs", "All-in-One Desktops"] },
  { Category: "Electronics & Gadgets", icon: "📱", SubCategory: "Computer Components", ChildCategory: ["Processors", "RAM", "Graphic Cards", "Motherboards"] },
  { Category: "Electronics & Gadgets", icon: "📱", SubCategory: "Storage", ChildCategory: ["External Hard Drives", "SSDs", "USB Flash Drives", "SD Cards"] },
  { Category: "Electronics & Gadgets", icon: "📱", SubCategory: "Audio", ChildCategory: ["Bluetooth Speakers", "Noise-canceling Headphones", "Earbuds (TWS)"] },
  { Category: "Electronics & Gadgets", icon: "📱", SubCategory: "Cameras", ChildCategory: ["DSLR", "Mirrorless", "Action Cameras (GoPro)", "Security Cameras (CCTV)"] },
  { Category: "Electronics & Gadgets", icon: "📱", SubCategory: "Wearable Tech", ChildCategory: ["Smartwatches", "Fitness Bands", "VR Headsets"] },
  { Category: "Electronics & Gadgets", icon: "📱", SubCategory: "Accessories", ChildCategory: ["Power Banks", "Charging Cables", "Phone Cases", "Screen Protectors"] },

  // 2. Fashion: Men
  { Category: "Fashion: Men", icon: "👔", SubCategory: "Clothing", ChildCategory: ["T-shirts", "Formal Shirts", "Casual Shirts", "Polo Shirts"] },
  { Category: "Fashion: Men", icon: "👔", SubCategory: "Bottoms", ChildCategory: ["Denim/Jeans", "Chinos", "Cargo Pants", "Shorts"] },
  { Category: "Fashion: Men", icon: "👔", SubCategory: "Traditional", ChildCategory: ["Panjabis", "Pajamas", "Suits", "Blazers"] },
  { Category: "Fashion: Men", icon: "👔", SubCategory: "Footwear", ChildCategory: ["Sneakers", "Formal Leather Shoes", "Loafers", "Sandals", "Flip-flops"] },
  { Category: "Fashion: Men", icon: "👔", SubCategory: "Accessories", ChildCategory: ["Watches", "Belts", "Wallets", "Sunglasses", "Ties", "Pocket Squares"] },
  { Category: "Fashion: Men", icon: "👔", SubCategory: "Innerwear", ChildCategory: ["Boxers", "Briefs", "Vests", "Socks"] },

  // 3. Fashion: Women
  { Category: "Fashion: Women", icon: "👗", SubCategory: "Traditional Wear", ChildCategory: ["Sarees", "Salwar Kameez", "Kurtis", "Lehengas"] },
  { Category: "Fashion: Women", icon: "👗", SubCategory: "Western Wear", ChildCategory: ["Tops", "Dresses", "Skirts", "Leggings", "Jeans"] },
  { Category: "Fashion: Women", icon: "👗", SubCategory: "Footwear", ChildCategory: ["Heels", "Flats", "Ballerinas", "Boots", "Sports Shoes"] },
  { Category: "Fashion: Women", icon: "👗", SubCategory: "Bags", ChildCategory: ["Handbags", "Clutches", "Tote Bags", "Backpacks", "Crossbody Bags"] },
  { Category: "Fashion: Women", icon: "👗", SubCategory: "Jewelry", ChildCategory: ["Necklaces", "Earrings", "Bracelets", "Rings", "Gold/Silver Plated Jewelry"] },
  { Category: "Fashion: Women", icon: "👗", SubCategory: "Lingerie & Sleepwear", ChildCategory: ["Bras", "Panties", "Nightgowns", "Robes"] },

  // 4. Home & Kitchen
  { Category: "Home & Kitchen", icon: "🛋️", SubCategory: "Large Appliances", ChildCategory: ["Refrigerators", "Washing Machines", "Air Conditioners"] },
  { Category: "Home & Kitchen", icon: "🛋️", SubCategory: "Small Appliances", ChildCategory: ["Microwaves", "Air Fryers", "Blenders", "Electric Kettles", "Toasters"] },
  { Category: "Home & Kitchen", icon: "🛋️", SubCategory: "Kitchenware", ChildCategory: ["Cookware Sets", "Knife Sets", "Dinnerware", "Storage Containers"] },
  { Category: "Home & Kitchen", icon: "🛋️", SubCategory: "Furniture", ChildCategory: ["Beds", "Sofas", "Dining Tables", "Wardrobes", "Office Chairs"] },
  { Category: "Home & Kitchen", icon: "🛋️", SubCategory: "Home Decor", ChildCategory: ["Wall Art", "Vases", "Mirrors", "Candles", "Clocks"] },
  { Category: "Home & Kitchen", icon: "🛋️", SubCategory: "Bedding", ChildCategory: ["Bedsheets", "Pillows", "Comforters", "Blankets", "Curtains"] },

  // 5. Beauty & Personal Care
  { Category: "Beauty & Personal Care", icon: "💄", SubCategory: "Skincare", ChildCategory: ["Face Wash", "Moisturizers", "Serums", "Sunscreen", "Sheet Masks"] },
  { Category: "Beauty & Personal Care", icon: "💄", SubCategory: "Makeup", ChildCategory: ["Lipstick", "Foundation", "Mascara", "Eyeshadow Palettes"] },
  { Category: "Beauty & Personal Care", icon: "💄", SubCategory: "Haircare", ChildCategory: ["Shampoo", "Conditioner", "Hair Oils", "Hair Colors", "Dryers/Straighteners"] },
  { Category: "Beauty & Personal Care", icon: "💄", SubCategory: "Fragrance", ChildCategory: ["Perfumes", "Body Sprays", "Deodorants", "Attar"] },
  { Category: "Beauty & Personal Care", icon: "💄", SubCategory: "Men’s Grooming", ChildCategory: ["Beard Oils", "Trimmers", "Shaving Creams", "Aftershave"] },
  { Category: "Beauty & Personal Care", icon: "💄", SubCategory: "Personal Hygiene", ChildCategory: ["Body Wash", "Hand Wash", "Sanitary Pads", "Oral Care"] },

  // 6. Baby & Kids
  { Category: "Baby & Kids", icon: "🧸", SubCategory: "Baby Clothing", ChildCategory: ["Onesies", "Rompers", "Sets", "Bibs"] },
  { Category: "Baby & Kids", icon: "🧸", SubCategory: "Baby Care", ChildCategory: ["Diapers", "Baby Wipes", "Lotions", "Baby Shampoo"] },
  { Category: "Baby & Kids", icon: "🧸", SubCategory: "Feeding", ChildCategory: ["Feeding Bottles", "Breast Pumps", "High Chairs", "Formula Milk"] },
  { Category: "Baby & Kids", icon: "🧸", SubCategory: "Toys", ChildCategory: ["Soft Toys", "Action Figures", "Remote Control Cars", "Educational Games", "Puzzles"] },
  { Category: "Baby & Kids", icon: "🧸", SubCategory: "Baby Gear", ChildCategory: ["Strollers", "Car Seats", "Walkers", "Baby Carriers"] },

  // 7. Health & Wellness
  { Category: "Health & Wellness", icon: "🩺", SubCategory: "Supplements", ChildCategory: ["Multivitamins", "Whey Protein", "Fish Oil", "Herbal Supplements"] },
  { Category: "Health & Wellness", icon: "🩺", SubCategory: "Medical Supplies", ChildCategory: ["Thermometers", "Blood Pressure Monitors", "Masks", "First Aid Kits"] },
  { Category: "Health & Wellness", icon: "🩺", SubCategory: "Sexual Wellness", ChildCategory: ["Contraceptives", "Lubricants"] },

  // 8. Sports & Outdoors
  { Category: "Sports & Outdoors", icon: "⚽", SubCategory: "Fitness", ChildCategory: ["Dumbbells", "Yoga Mats", "Treadmills", "Resistance Bands"] },
  { Category: "Sports & Outdoors", icon: "⚽", SubCategory: "Team Sports", ChildCategory: ["Cricket Bats", "Footballs", "Basketballs", "Badminton Rackets"] },
  { Category: "Sports & Outdoors", icon: "⚽", SubCategory: "Outdoor", ChildCategory: ["Tents", "Sleeping Bags", "Camping Stoves", "Trekking Boots"] },
  { Category: "Sports & Outdoors", icon: "⚽", SubCategory: "Cycling", ChildCategory: ["Mountain Bikes", "Road Bikes", "Helmets", "Cycling Jerseys"] },

  // 9. Groceries & Household
  { Category: "Groceries & Household", icon: "🛒", SubCategory: "Pantry Staples", ChildCategory: ["Rice", "Lentils", "Oil", "Flour", "Sugar", "Salt"] },
  { Category: "Groceries & Household", icon: "🛒", SubCategory: "Beverages", ChildCategory: ["Tea", "Coffee", "Fruit Juices", "Soft Drinks"] },
  { Category: "Groceries & Household", icon: "🛒", SubCategory: "Snacks", ChildCategory: ["Chocolates", "Biscuits", "Chips", "Nuts"] },
  { Category: "Groceries & Household", icon: "🛒", SubCategory: "Frozen Food", ChildCategory: ["Nuggets", "Frozen Vegetables", "Ice Cream"] },
  { Category: "Groceries & Household", icon: "🛒", SubCategory: "Laundry & Cleaning", ChildCategory: ["Detergents", "Dish Soap", "Toilet Cleaners", "Mops/Brooms"] },

  // 10. Books & Stationery
  { Category: "Books & Stationery", icon: "📚", SubCategory: "Books", ChildCategory: ["Fiction", "Self-Help", "Textbooks", "Children’s Books", "Religious"] },
  { Category: "Books & Stationery", icon: "📚", SubCategory: "Stationery", ChildCategory: ["Pens", "Notebooks", "Diaries", "Planners"] },
  { Category: "Books & Stationery", icon: "📚", SubCategory: "Art Supplies", ChildCategory: ["Sketchbooks", "Acrylic Paints", "Brushes", "Easels"] },

  // 11. Automotive & Pets
  { Category: "Automotive & Pets", icon: "🚗", SubCategory: "Car/Bike Care", ChildCategory: ["Engine Oils", "Car Polish", "Helmets", "Riding Jackets"] },
  { Category: "Automotive & Pets", icon: "🚗", SubCategory: "Pet Supplies", ChildCategory: ["Cat Food", "Dog Food", "Pet Grooming", "Bird Cages", "Aquariums"] }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ Database Connected For Seeding...");

        // আগের ডাটা ডিলিট করা (ফ্রেশ স্টার্টের জন্য)
        await Category.deleteMany();
        console.log("🗑️ Cleared old categories.");

        // নতুন ডাটা ইনসার্ট করা
        await Category.insertMany(categoriesData);
        console.log("🚀 All Categories Successfully Added with Icons!");

        process.exit();
    } catch (error) {
        console.error("❌ Seeding Error:", error);
        process.exit(1);
    }
};

seedDB();