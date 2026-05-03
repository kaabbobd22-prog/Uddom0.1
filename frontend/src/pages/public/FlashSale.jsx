import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function FlashSale() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ hrs: '00', min: '00', sec: '00' });

  // রিয়েল-টাইম কাউন্টডাউন লজিক
  useEffect(() => {
    const target = new Date();
    target.setHours(target.getHours() + 5); // বর্তমান সময় থেকে ৫ ঘণ্টা পর শেষ হবে

    const timer = setInterval(() => {
      const now = new Date();
      const difference = target - now;

      if (difference <= 0) {
        clearInterval(timer);
      } else {
        const h = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const m = Math.floor((difference / 1000 / 60) % 60);
        const s = Math.floor((difference / 1000) % 60);

        setTimeLeft({
          hrs: h < 10 ? `0${h}` : h,
          min: m < 10 ? `0${m}` : m,
          sec: s < 10 ? `0${s}` : s,
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // ডাটাবেস থেকে ফ্ল্যাশ সেল প্রোডাক্ট লোড করা
  useEffect(() => {
    const fetchFlashDeals = async () => {
      try {
        const res = await axios.get('[https://uddom0-1.onrender.com](https://uddom0-1.onrender.com)/api/products');
        // শুধুমাত্র ফ্ল্যাশ সেল আইটেমগুলো ফিল্টার করা
        const flashDeals = res.data.filter(p => p.isFlashSale === true);
        setProducts(flashDeals);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching flash deals:", error);
        setLoading(false);
      }
    };
    fetchFlashDeals();
  }, []);

  if (loading) return <div className="text-center py-20 font-black uppercase text-gray-400 animate-pulse italic">Loading Flash Deals... ⚡</div>;

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* 1. Flash Sale Hero & Real-time Countdown */}
      <div className="bg-red-600 text-white py-10 md:py-16 px-4 relative overflow-hidden">
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-7xl font-black italic uppercase tracking-tighter mb-4 drop-shadow-2xl">
            Flash Sale ⚡
          </h1>
          <p className="text-[10px] md:text-sm font-black opacity-90 mb-6 uppercase tracking-[0.3em]">
            Limited Time Offers - Ending In:
          </p>

          {/* Countdown Timer */}
          <div className="flex justify-center gap-3 md:gap-6">
            {[
              { v: timeLeft.hrs, l: 'Hrs' },
              { v: timeLeft.min, l: 'Min' },
              { v: timeLeft.sec, l: 'Sec' }
            ].map((time, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="bg-black text-white w-14 h-14 md:w-24 md:h-24 rounded-2xl flex items-center justify-center text-2xl md:text-5xl font-black shadow-2xl border-b-4 border-red-800">
                  {time.v}
                </div>
                <span className="text-[9px] md:text-xs font-black mt-2 uppercase tracking-widest">{time.l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Background Animation Element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/10 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* 2. Promo Banner */}
        <div className="relative w-full h-24 md:h-40 rounded-[2rem] overflow-hidden shadow-xl mb-12 border-4 border-white">
          <img
            src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=80"
            alt="Sponsored"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-red-900/60 to-transparent flex items-center px-8">
            <h2 className="text-white text-sm md:text-2xl font-black uppercase italic leading-tight">
              Extra Discount with <br /> UDDOM Digital Pay
            </h2>
          </div>
          <div className="absolute top-4 right-6 bg-black/50 backdrop-blur-md text-white text-[8px] md:text-[10px] px-3 py-1 rounded-full uppercase font-black">
            Sponsored
          </div>
        </div>

        {/* 3. Product Grid (Full List) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-6">
          {products.map((product, index) => {
            // In-feed Ad Logic: After every 12 products
            const showAd = index !== 0 && index % 12 === 0;

            return (
              <div key={product._id} className="contents">
                {showAd && (
                  <div className="col-span-full my-6">
                    <div className="relative w-full h-20 md:h-32 rounded-[2rem] overflow-hidden border-4 border-white shadow-lg">
                      <img
                        src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80"
                        alt="Promo Ad"
                        className="w-full h-full object-cover opacity-80"
                      />
                      <div className="absolute inset-0 bg-red-900/20 flex items-center justify-center">
                        <p className="text-white font-black uppercase italic text-sm md:text-xl">Premium Partner Deals</p>
                      </div>
                      <div className="absolute bottom-2 right-4 bg-white/80 text-[7px] md:text-[10px] font-black px-2 py-0.5 rounded-full uppercase">Ad</div>
                    </div>
                  </div>
                )}

                {/* Product Card */}
                <Link
                  to={`/product/${product._id}`}
                  className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-red-900/10 transition-all duration-500 group flex flex-col"
                >
                  <div className="relative aspect-square overflow-hidden bg-gray-50">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                    />
                    <div className="absolute top-3 left-3 bg-[#ff5722] text-white text-[9px] md:text-[11px] font-black px-2 py-1 rounded-lg italic shadow-lg">
                      -{product.discount || 25}% OFF
                    </div>
                  </div>

                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="text-[11px] md:text-sm font-black text-gray-800 line-clamp-2 leading-tight mb-3 uppercase italic tracking-tighter">
                      {product.name}
                    </h3>

                    <div className="mt-auto">
                      <div className="flex items-baseline gap-2">
                        <span className="text-[#ff5722] font-black text-sm md:text-xl">৳{product.price}</span>
                        <span className="text-gray-400 text-[10px] md:text-xs line-through font-bold">৳{product.price + 400}</span>
                      </div>

                      {/* Stock Progress Bar */}
                      <div className="mt-4">
                        <div className="flex justify-between text-[9px] font-black uppercase tracking-widest mb-1.5">
                          <span className="text-red-600 animate-pulse">Selling Fast</span>
                          <span className="text-gray-400">{Math.floor(Math.random() * 40) + 50}% Sold</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden shadow-inner">
                          <div
                            className="bg-gradient-to-r from-red-600 to-orange-500 h-full rounded-full transition-all duration-1000"
                            style={{ width: `${Math.floor(Math.random() * 40) + 50}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {products.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-gray-200">
            <p className="text-gray-400 font-black uppercase tracking-[0.2em]">No Flash Deals Available at the moment</p>
          </div>
        )}

      </div>
    </div>
  );
}