import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    // Load user from localStorage
    useEffect(() => {
        const loggedInUser = localStorage.getItem('user');
        if (loggedInUser) {
            try {
                setUser(JSON.parse(loggedInUser));
            } catch (e) {
                console.error("Failed to parse user data");
                localStorage.removeItem('user');
            }
        }
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsUserDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Close mobile menu when pressing Escape key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                setIsMenuOpen(false);
                setIsUserDropdownOpen(false);
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setIsUserDropdownOpen(false);
        setIsMenuOpen(false);
        navigate('/login');
        // Small delay before reload to allow navigation
        setTimeout(() => window.location.reload(), 100);
    };

    const navigationLinks = {
        shopping: [
            { name: 'All Categories', path: '/categories' },
            { name: 'Flash Sale ⚡', path: '/flash-sale' },
            { name: 'Grocery Store 🥦', path: '/grocery' },
            { name: 'Wholesale Hub 📦', path: '/wholesale' },
            { name: 'Offers & Coupons', path: '/offers' },
            { name: 'Browse Aisles', path: '/browse' },
        ],
        account: [
            { name: 'My Profile', path: '/account/profile' },
            { name: 'My Orders', path: '/account/orders' },
            { name: 'My Wishlist', path: '/account/wishlist' },
            { name: 'My Wallet', path: '/account/wallet' },
            { name: 'My Coupons', path: '/account/coupons' },
            { name: 'My Reviews', path: '/account/reviews' },
            { name: 'Notifications', path: '/account/notifications' },
            { name: 'Bulk Inquiry (RFQ)', path: '/account/bulk-inquiry' },
        ],
        support: [
            { name: 'Help Centre', path: '/help' },
            { name: 'About UDDOM', path: '/about' },
            { name: 'Contact Us', path: '/contact' },
            { name: 'Policies', path: '/policies' },
        ]
    };

    return (
        <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
            {/* Top Mini Bar */}
            <div className="hidden md:block bg-gray-900 text-white py-2">
                <div className="container mx-auto px-4 flex justify-between items-center text-[10px] font-black uppercase tracking-[0.15em]">
                    <div className="flex gap-6">
                        <span className="flex items-center gap-2 opacity-90">
                            📞 +880 1234-567890
                        </span>
                        <Link to="/help" className="hover:text-[#ff5722] transition">Help Centre</Link>
                    </div>
                    <div className="flex gap-6 items-center">
                        <Link to="/seller/register" className="text-[#ff5722] font-black hover:brightness-110">
                            Become a Seller
                        </Link>
                        <div className="w-[1px] h-3 bg-gray-700"></div>
                        <Link to="/about" className="hover:text-[#ff5722] transition opacity-90">Our Story</Link>
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <div className="container mx-auto px-4 py-3 md:py-4">
                <div className="flex items-center justify-between gap-4">

                    {/* Logo & Mobile Toggle */}
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setIsMenuOpen(true)} 
                            className="md:hidden text-gray-800 text-2xl p-1 active:scale-95"
                        >
                            ☰
                        </button>
                        <Link to="/" className="text-2xl md:text-3xl font-black text-gray-900 tracking-tighter flex items-center group">
                            UDDOM<span className="text-[#ff5722] group-hover:scale-125 transition-transform duration-300">.</span>
                        </Link>
                    </div>

                    {/* Desktop Search */}
                    <div className="hidden md:flex flex-1 max-w-2xl relative">
                        <input
                            type="text"
                            placeholder="Search for electronics, wholesale clothing, groceries..."
                            className="w-full border-2 border-gray-100 bg-gray-50 rounded-2xl px-6 py-2.5 text-sm font-medium focus:outline-none focus:border-[#ff5722] focus:bg-white transition-all shadow-sm"
                        />
                        <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#ff5722] text-white px-6 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-900 transition-all shadow-lg active:scale-95">
                            Search
                        </button>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 md:gap-8">
                        {/* User Account Dropdown */}
                        <div className="hidden md:block relative" ref={dropdownRef}>
                            <button 
                                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                                className="flex items-center gap-2 text-gray-800 hover:text-[#ff5722] font-black text-[11px] uppercase tracking-widest transition group"
                            >
                                <span className="text-xl bg-gray-50 p-2 rounded-full group-hover:bg-orange-50 transition">👤</span>
                                <div className="hidden lg:block text-left leading-none">
                                    <p className="text-[8px] text-gray-400 font-black uppercase mb-1">
                                        {user ? `Hello, ${user.name?.split(' ')[0] || 'User'}` : 'Sign In'}
                                    </p>
                                    <p className="text-[11px] font-black uppercase tracking-widest">Account</p>
                                </div>
                            </button>

                            {/* Dropdown Menu */}
                            {isUserDropdownOpen && (
                                <div className="absolute right-0 mt-4 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                                    {!user ? (
                                        <div className="p-5 bg-gray-50 border-b">
                                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Hello, Sign In</p>
                                            <div className="flex gap-2 mt-3">
                                                <Link 
                                                    to="/login" 
                                                    className="flex-1 bg-[#ff5722] text-white text-center py-2 rounded-lg text-[10px] font-black uppercase hover:shadow-lg transition"
                                                    onClick={() => setIsUserDropdownOpen(false)}
                                                >
                                                    Login
                                                </Link>
                                                <Link 
                                                    to="/register" 
                                                    className="flex-1 border border-gray-200 text-gray-800 text-center py-2 rounded-lg text-[10px] font-black uppercase hover:bg-white transition"
                                                    onClick={() => setIsUserDropdownOpen(false)}
                                                >
                                                    Join
                                                </Link>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-4 bg-orange-50 border-b border-orange-100 text-center">
                                            <p className="text-[10px] font-black text-gray-800 uppercase tracking-widest">
                                                Role: {user.role || 'Customer'}
                                            </p>
                                        </div>
                                    )}

                                    <div className="py-2">
                                        {navigationLinks.account.map((link, idx) => (
                                            <Link 
                                                key={idx} 
                                                to={link.path} 
                                                onClick={() => setIsUserDropdownOpen(false)}
                                                className="block px-5 py-2.5 text-[11px] font-bold text-gray-600 hover:bg-orange-50 hover:text-[#ff5722] uppercase tracking-tight transition"
                                            >
                                                {link.name}
                                            </Link>
                                        ))}

                                        {user && (
                                            <button 
                                                onClick={handleLogout}
                                                className="w-full text-left px-5 py-3 text-[10px] font-black text-red-600 uppercase border-t border-gray-100 hover:bg-red-50 transition tracking-widest"
                                            >
                                                Logout Account →
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Wishlist */}
                        <Link to="/account/wishlist" className="relative p-1 group">
                            <span className="text-2xl group-hover:scale-110 block transition">🤍</span>
                            <span className="absolute -top-1 -right-1 bg-[#ff5722] text-white text-[8px] font-black px-1.5 py-0.5 rounded-full border-2 border-white">0</span>
                        </Link>

                        {/* Cart */}
                        <Link to="/cart" className="flex items-center gap-3 bg-gray-100 md:bg-transparent p-2 md:p-0 rounded-2xl group">
                            <div className="relative">
                                <span className="text-2xl group-hover:scale-110 block transition">🛒</span>
                                <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-[8px] font-black px-1.5 py-0.5 rounded-full border-2 border-white">3</span>
                            </div>
                            <div className="hidden md:block">
                                <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest leading-none">Total</p>
                                <p className="text-xs font-black text-gray-900 mt-1 leading-none">৳1,250</p>
                            </div>
                        </Link>

                        {/* Mobile Account Button */}
                        <Link 
                            to={user ? "/account/profile" : "/login"} 
                            className="md:hidden flex items-center justify-center bg-[#ff5722] text-white w-10 h-10 rounded-full shadow-lg active:scale-95"
                        >
                            👤
                        </Link>
                    </div>
                </div>

                {/* Mobile Search */}
                <div className="mt-3 md:hidden">
                    <input 
                        type="text" 
                        placeholder="Search UDDOM..." 
                        className="w-full border-2 border-gray-100 bg-gray-50 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-[#ff5722]" 
                    />
                </div>
            </div>

            {/* Desktop Bottom Navigation */}
            <nav className="hidden md:block border-t border-gray-100 bg-white">
                <div className="container mx-auto px-4 flex gap-8 py-3.5 overflow-x-auto scrollbar-hide">
                    <Link to="/categories" className="flex items-center gap-2 text-[10px] font-black text-gray-900 hover:text-[#ff5722] uppercase tracking-widest whitespace-nowrap">
                        <span className="text-lg">☰</span> All Categories
                    </Link>
                    <div className="w-[1px] h-4 bg-gray-200"></div>
                    {navigationLinks.shopping.slice(1).map((link, idx) => (
                        <Link 
                            key={idx} 
                            to={link.path} 
                            className="text-[10px] font-black text-gray-500 hover:text-[#ff5722] uppercase tracking-widest whitespace-nowrap transition"
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link 
                        to="/bulk-inquiry" 
                        className="ml-auto text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2 hover:opacity-80"
                    >
                        <span className="animate-pulse text-lg">📢</span> Bulk Inquiry (RFQ)
                    </Link>
                </div>
            </nav>

            {/* Mobile Menu Drawer */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-[100] flex">
                    <div 
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
                        onClick={() => setIsMenuOpen(false)}
                    />
                    <div className="relative w-[85%] max-w-xs bg-white h-full shadow-2xl flex flex-col overflow-y-auto">
                        {/* Mobile Menu Header */}
                        <div className="p-6 bg-gray-900 text-white flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-[#ff5722] rounded-xl flex items-center justify-center font-black text-xl shadow-xl shadow-orange-500/20">U</div>
                                <p className="text-xl font-black uppercase tracking-tighter italic">UDDOM</p>
                            </div>
                            <button onClick={() => setIsMenuOpen(false)} className="text-2xl text-gray-400 hover:text-white">✕</button>
                        </div>

                        {/* Auth Buttons */}
                        <div className="p-5 grid grid-cols-2 gap-3 bg-gray-50 border-b">
                            {!user ? (
                                <>
                                    <Link 
                                        to="/login" 
                                        onClick={() => setIsMenuOpen(false)} 
                                        className="bg-[#ff5722] text-white text-center py-3 rounded-xl font-black text-[10px] uppercase shadow-lg"
                                    >
                                        Login
                                    </Link>
                                    <Link 
                                        to="/register" 
                                        onClick={() => setIsMenuOpen(false)} 
                                        className="bg-white border border-gray-200 text-gray-800 text-center py-3 rounded-xl font-black text-[10px] uppercase shadow-sm"
                                    >
                                        Join
                                    </Link>
                                </>
                            ) : (
                                <button 
                                    onClick={handleLogout}
                                    className="col-span-2 bg-red-500 text-white text-center py-3 rounded-xl font-black text-[10px] uppercase shadow-lg"
                                >
                                    Logout ({user.name?.split(' ')[0]})
                                </button>
                            )}
                        </div>

                        {/* Menu Content */}
                        <div className="p-6 space-y-10 flex-1">
                            <div>
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-5">Shop All</p>
                                <div className="space-y-5">
                                    {navigationLinks.shopping.map((link, idx) => (
                                        <Link 
                                            key={idx} 
                                            to={link.path} 
                                            onClick={() => setIsMenuOpen(false)} 
                                            className="flex items-center justify-between text-xs font-black text-gray-700 uppercase tracking-widest group"
                                        >
                                            {link.name} 
                                            <span className="text-gray-300 group-hover:text-[#ff5722]">→</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-5">My Account</p>
                                <div className="space-y-5">
                                    {navigationLinks.account.map((link, idx) => (
                                        <Link 
                                            key={idx} 
                                            to={link.path} 
                                            onClick={() => setIsMenuOpen(false)} 
                                            className="block text-xs font-black text-gray-500 uppercase tracking-widest hover:text-[#ff5722]"
                                        >
                                            {link.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-5">UDDOM Support</p>
                                <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                                    {navigationLinks.support.map((link, idx) => (
                                        <Link 
                                            key={idx} 
                                            to={link.path} 
                                            onClick={() => setIsMenuOpen(false)} 
                                            className="text-[10px] font-bold text-gray-500 uppercase tracking-widest hover:text-[#ff5722]"
                                        >
                                            {link.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Bottom CTA */}
                        <div className="mt-auto p-6 bg-orange-50 border-t">
                            <Link 
                                to="/seller/register" 
                                onClick={() => setIsMenuOpen(false)} 
                                className="block w-full text-center bg-gray-900 text-white py-4 rounded-2xl font-black text-[10px] uppercase shadow-xl"
                            >
                                Start Selling on UDDOM
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}