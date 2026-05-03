import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function WholesaleDeals() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetchingMore, setFetchingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('');

    const observer = useRef();

    // ১. ব্যাকএন্ড থেকে ডাটা আনা (Initial & Category Filter)
    const fetchWholesaleProducts = useCallback(async (pageNum, cat = '') => {
        try {
            if (pageNum === 1) setLoading(true);
            else setFetchingMore(true);

            // API endpoint: category এবং pagination সাপোর্ট করে
            const res = await axios.get(`[https://uddom0-1.onrender.com](https://uddom0-1.onrender.com)/api/wholesale/products`, {
                params: {
                    category: cat,
                    page: pageNum,
                    limit: 12
                }
            });

            const newProducts = res.data;

            if (newProducts.length === 0) {
                setHasMore(false);
            } else {
                setProducts(prev => pageNum === 1 ? newProducts : [...prev, ...newProducts]);
                setHasMore(newProducts.length === 12); // যদি লিমিটের কম ডাটা আসে তারমানে আর নেই
            }
        } catch (err) {
            console.error("Wholesale fetch error:", err);
        } finally {
            setLoading(false);
            setFetchingMore(false);
        }
    }, []);

    // ২. স্ক্রল ডিটেকশন (Infinite Scroll Observer)
    const lastProductRef = useCallback(node => {
        if (loading || fetchingMore) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prev => prev + 1);
            }
        });

        if (node) observer.current.observe(node);
    }, [loading, fetchingMore, hasMore]);

    // পেজ বা ক্যাটাগরি চেঞ্জ হলে ডাটা ফেচ করা
    useEffect(() => {
        fetchWholesaleProducts(page, selectedCategory);
    }, [page, selectedCategory, fetchWholesaleProducts]);

    // ক্যাটাগরি ফিল্টার হ্যান্ডলার
    const handleCategoryClick = (cat) => {
        setSelectedCategory(cat);
        setPage(1); // নতুন ক্যাটাগরি মানে প্রথম পেজ থেকে শুরু
        setProducts([]);
    };

    if (loading && page === 1) {
        return <div className="text-center py-20 font-black uppercase tracking-widest text-gray-400 animate-pulse">Sourcing Bulk Deals... 📦</div>;
    }

    return (
        <div className="bg-gray-50 min-h-screen pb-16">

            {/* 1. Wholesale Header Section */}
            <section className="bg-gray-900 text-white py-12 md:py-20 px-4 relative overflow-hidden">
                <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
                    <div className="max-w-2xl text-center md:text-left">
                        <h1 className="text-4xl md:text-7xl font-black mb-6 uppercase italic tracking-tighter leading-none">
                            B2B Wholesale <span className="text-[#ff5722]">Hub</span>
                        </h1>
                        <p className="text-xs md:text-lg text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
                            Direct factory access. Tiered pricing. <br className="hidden md:block" /> Bulk logistics for Bangladesh.
                        </p>
                    </div>

                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] flex flex-col items-center shadow-2xl">
                        <p className="text-[#ff5722] font-black text-[10px] uppercase tracking-[0.3em] mb-2">Verified Suppliers</p>
                        <p className="text-3xl md:text-5xl font-black mb-6 italic">12,500+</p>
                        <button className="bg-[#ff5722] hover:bg-white hover:text-black text-white px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 shadow-xl active:scale-95">
                            Request Custom Quote
                        </button>
                    </div>
                </div>
                {/* Background Decor */}
                <div className="absolute -top-20 -right-20 w-96 h-96 bg-[#ff5722] rounded-full blur-[150px] opacity-20"></div>
            </section>

            <div className="container mx-auto px-4 py-10">

                {/* 2. B2B Categories (Dynamic Filter) */}
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-12">
                    {['Garments', 'Electronics', 'Industrial', 'Packaging', 'Grocery', 'Construction'].map((cat, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleCategoryClick(cat)}
                            className={`rounded-[2rem] p-4 md:p-8 shadow-sm border transition-all duration-500 group flex flex-col items-center ${selectedCategory === cat ? 'bg-gray-900 border-gray-900' : 'bg-white border-gray-100 hover:border-[#ff5722]'}`}
                        >
                            <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-50 rounded-full mb-3 flex items-center justify-center text-2xl group-hover:scale-110 transition">🏢</div>
                            <span className={`text-[9px] md:text-xs font-black uppercase tracking-widest ${selectedCategory === cat ? 'text-white' : 'text-gray-700'}`}>{cat}</span>
                        </button>
                    ))}
                </div>

                {/* 3. Sponsored Banner */}
                <div className="relative w-full h-24 md:h-40 rounded-[2.5rem] overflow-hidden shadow-2xl mb-12 border-4 border-white">
                    <img
                        src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80"
                        alt="B2B Offer"
                        className="w-full h-full object-cover opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-transparent flex items-center px-10">
                        <h2 className="text-white text-sm md:text-3xl font-black uppercase italic tracking-tighter">Corporate Gifting & Bulk Solutions</h2>
                    </div>
                    <div className="absolute top-4 right-6 bg-blue-600 text-white text-[8px] md:text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest">Sponsored</div>
                </div>

                {/* 4. Wholesale Product Grid (3 Columns Mobile) */}
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-sm md:text-2xl font-black text-gray-900 uppercase italic tracking-tighter">
                        {selectedCategory ? `${selectedCategory} Bulk Deals` : "Global Wholesale Feed"}
                    </h2>
                    <button
                        onClick={() => handleCategoryClick('')}
                        className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#ff5722]"
                    >
                        Reset Filter
                    </button>
                </div>

                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-5">
                    {products.map((product, index) => {
                        const isLastElement = products.length === index + 1;
                        const showAd = index !== 0 && index % 12 === 0;

                        return (
                            <div key={`${product._id}-${index}`} className="contents">
                                {showAd && (
                                    <div className="col-span-full my-6">
                                        <div className="w-full h-20 md:h-32 bg-orange-50 border-4 border-white rounded-[2.5rem] flex items-center justify-between px-10 shadow-xl overflow-hidden relative">
                                            <div className="relative z-10">
                                                <p className="text-sm md:text-2xl font-black text-orange-900 uppercase italic tracking-tighter">Verified Global Wholesaler Program</p>
                                                <p className="text-[10px] md:text-sm text-orange-700 font-bold uppercase tracking-widest">ISO Certified Manufacturers Only</p>
                                            </div>
                                            <button className="bg-orange-500 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-black transition-all">Apply</button>
                                            <div className="absolute top-4 right-6 bg-white/50 text-gray-400 text-[8px] px-2 py-0.5 rounded-full uppercase font-black">Ad</div>
                                        </div>
                                    </div>
                                )}

                                <div
                                    ref={isLastElement ? lastProductRef : null}
                                    className="bg-white rounded-3xl shadow-sm border border-gray-50 overflow-hidden hover:shadow-2xl hover:shadow-orange-900/10 transition-all duration-500 flex flex-col group"
                                >
                                    <Link to={`/product/${product._id}`} className="relative aspect-square bg-gray-50 block overflow-hidden">
                                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                                        <div className="absolute bottom-2 left-2 bg-black/80 text-white text-[7px] md:text-[9px] font-black px-2 py-1 rounded-lg uppercase tracking-widest backdrop-blur-sm">
                                            {product.unit || "Lot"} Only
                                        </div>
                                    </Link>

                                    <div className="p-3 flex flex-col flex-grow">
                                        <h3 className="text-[10px] md:text-sm font-black text-gray-800 line-clamp-2 leading-tight mb-3 uppercase italic tracking-tighter">{product.name}</h3>

                                        <div className="mt-auto">
                                            <div className="flex flex-col mb-3">
                                                <span className="text-[#ff5722] font-black text-xs md:text-xl leading-none">৳{product.wholesalePrice}</span>
                                                <span className="text-gray-300 text-[8px] md:text-[10px] font-black line-through uppercase mt-1">Retail: ৳{product.price}</span>
                                            </div>

                                            <div className="bg-gray-50 rounded-xl p-2 text-center border border-gray-100 group-hover:bg-orange-50 group-hover:border-orange-100 transition-colors">
                                                <p className="text-gray-500 text-[8px] md:text-[10px] font-black uppercase tracking-widest leading-none">
                                                    MOQ: <span className="text-gray-900">{product.minWholesaleQty || 10} Units</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* 5. Infinite Loading Indicator */}
                {fetchingMore && (
                    <div className="text-center py-10">
                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#ff5722] border-r-transparent"></div>
                    </div>
                )}

                {!hasMore && products.length > 0 && (
                    <div className="mt-12 text-center">
                        <p className="text-gray-300 font-black text-[10px] uppercase tracking-[0.4em]">End of B2B Feed</p>
                    </div>
                )}

            </div>
        </div>
    );
}