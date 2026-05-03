import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios'; // 👈 এটি ইম্পোর্ট করতে ভুলবেন না

export default function SellerLayout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [sellerData, setSellerData] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    // লোকাল স্টোরেজ এবং ব্যাকএন্ড থেকে ডাটা সিঙ্ক করা
    useEffect(() => {
        const localData = JSON.parse(localStorage.getItem('sellerData'));
        const token = localStorage.getItem('sellerToken');

        if (!localData || !token) {
            navigate('/seller/login');
            return;
        }

        // প্রথমে লোকাল ডাটা সেট করে দেওয়া, যাতে পেজ দ্রুত লোড হয়
        setSellerData(localData);

        // এরপর ব্যাকএন্ড থেকে ফ্রেশ ডাটা এনে নীরবে আপডেট করে দেওয়া
        // SellerLayout.jsx fix
        const syncFreshData = async () => {
            try {
                const res = await axios.get('https://uddom0-1.onrender.com/api/seller/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                // Data format match korano (id vs _id)
                const freshData = {
                    ...res.data,
                    id: res.data._id // backend theke asha _id ke frontend-er 'id' key-te set kora
                };

                localStorage.setItem('sellerData', JSON.stringify(freshData));
                setSellerData(freshData);
            } catch (error) {
                console.error("Failed to sync fresh seller data", error);
            }
        };

        syncFreshData();
    }, [navigate]);

    // সাইডবার মেনু আইটেম
    const menuItems = [
        { name: 'Dashboard', icon: '📊', path: '/seller/dashboard' },
        { name: 'Product Management', icon: '🛍️', path: '/seller/products' },
        { name: 'Order Management', icon: '📦', path: '/seller/orders' },
        { name: 'Inventory', icon: '🏢', path: '/seller/inventory' },
        { name: 'Finance / Payouts', icon: '💰', path: '/seller/finance' },
        { name: 'Ads Manager', icon: '📢', path: '/seller/ads' },
        { name: 'Seller Reports', icon: '📈', path: '/seller/reports' },
        { name: 'Store Settings', icon: '⚙️', path: '/seller/settings' },
    ];

    // লগআউট ফাংশন
    const handleLogout = () => {
        localStorage.removeItem('sellerToken');
        localStorage.removeItem('sellerData');
        navigate('/seller/login');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">

            {/* 1. Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* 2. Sidebar */}
            <aside className={`fixed top-0 left-0 h-full w-72 bg-white border-r border-gray-200 shadow-sm z-50 transform transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:static`}>

                {/* Sidebar Header / Logo */}
                <div className="h-20 flex items-center justify-between px-8 border-b border-gray-50">
                    <Link to="/" className="text-2xl font-black tracking-tighter text-gray-900">
                        UDDOM<span className="text-[#ff5722]">.</span>
                        <span className="text-[8px] font-bold uppercase tracking-widest text-gray-400 ml-2">Seller</span>
                    </Link>
                    <button className="lg:hidden text-gray-500 hover:text-[#ff5722]" onClick={() => setIsSidebarOpen(false)}>
                        ✕
                    </button>
                </div>

                {/* Store Info Banner */}
                {sellerData && (
                    <div className="px-6 py-6 border-b border-gray-50">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center font-black text-xl text-gray-400">
                                {sellerData.storeName ? sellerData.storeName.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div>
                                <p className="text-sm font-black text-gray-900 uppercase tracking-tight line-clamp-1">
                                    {sellerData.storeName || "Store Name Pending"}
                                </p>
                                <div className="flex items-center gap-1 mt-1">
                                    {sellerData.isApproved ? (
                                        <span className="bg-green-100 text-green-700 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded">Verified</span>
                                    ) : (
                                        <span className="bg-orange-100 text-orange-700 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded">Pending</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation Links */}
                <nav className="p-4 space-y-2 h-[calc(100vh-250px)] overflow-y-auto scrollbar-hide">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${isActive
                                    ? 'bg-black text-white shadow-lg'
                                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                                    }`}
                                onClick={() => setIsSidebarOpen(false)}
                            >
                                <span className="text-lg">{item.icon}</span>
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* Sidebar Footer (Logout) */}
                <div className="absolute bottom-0 w-full p-4 border-t border-gray-50 bg-white">
                    <button
                        onClick={handleLogout}
                        className="flex items-center justify-center gap-3 w-full px-4 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 transition"
                    >
                        <span>🚪</span> Secure Logout
                    </button>
                </div>
            </aside>

            {/* 3. Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">

                {/* Top Navbar (Mobile Hamburger & Quick Actions) */}
                <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 z-30 sticky top-0">
                    <div className="flex items-center gap-4">
                        <button
                            className="lg:hidden text-gray-500 hover:text-[#ff5722] p-2"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            ☰
                        </button>

                        {/* Page Title Dynamic based on Route */}
                        <h2 className="hidden md:block text-sm font-black text-gray-900 uppercase italic tracking-widest">
                            {menuItems.find(m => m.path === location.pathname)?.name || "Seller Center"}
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Add Product Button (Quick Access) */}
                        <Link to="/seller/add-product" className="hidden md:flex items-center gap-2 text-[10px] font-black text-[#ff5722] uppercase tracking-widest border-2 border-[#ff5722] px-4 py-2 rounded-lg hover:bg-[#ff5722] hover:text-white transition">
                            + Quick Add
                        </Link>

                        {/* Notification Bell */}
                        <button className="relative p-2 text-gray-400 hover:text-gray-900 transition">
                            🔔
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                        </button>

                        {/* Profile Circle */}
                        <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white font-black text-sm border-2 border-white shadow-md cursor-pointer">
                            {sellerData?.ownerName ? sellerData.ownerName.charAt(0).toUpperCase() : 'S'}
                        </div>
                    </div>
                </header>

                {/* Dynamic Page Content */}
                <div className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 relative">
                    {children}
                </div>

            </main>
        </div>
    );
}