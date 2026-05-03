import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function MyWishlist() {
  const [isWholesale, setIsWholesale] = useState(false);

  // Mock Wishlist Data
  const wishlistItems = Array.from({ length: 8 }).map((_, i) => ({
    id: i + 1,
    name: i % 2 === 0 ? "Premium Wireless Headphones v5.2" : "Industrial Grade Power Drill",
    price: 2500 + (i * 200),
    wholesale: 2100 + (i * 150),
    minQty: 10,
    img: `https://placehold.co/300x300/f8fafc/0f172a?text=Wishlist+${i + 1}`,
    inStock: i !== 5 // One item out of stock for variety
  }));

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* 1. Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">My Wishlist</h1>
            <p className="text-xs md:text-sm text-gray-500 mt-1">Items you've saved for later</p>
          </div>

          {/* Pricing Toggle */}
          <div className="flex items-center bg-gray-100 p-1 rounded-lg">
            <button 
              onClick={() => setIsWholesale(false)}
              className={`px-4 py-1.5 text-[10px] md:text-xs font-bold rounded-md transition ${!isWholesale ? 'bg-white text-[#ff5722] shadow-sm' : 'text-gray-500'}`}
            >
              Retail
            </button>
            <button 
              onClick={() => setIsWholesale(true)}
              className={`px-4 py-1.5 text-[10px] md:text-xs font-bold rounded-md transition ${isWholesale ? 'bg-[#ff5722] text-white shadow-sm' : 'text-gray-500'}`}
            >
              Wholesale
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8 max-w-6xl">
        
        {/* 2. Wishlist Grid (Mobile: 3 Columns) */}
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-4">
          {wishlistItems.map((item, index) => {
            const showAd = index === 6; // In-feed ad after 6 items

            return (
              <div key={item.id} className="contents">
                {/* In-feed Sponsored Card */}
                {showAd && (
                  <div className="bg-blue-50 rounded-lg border border-blue-100 flex flex-col items-center justify-center p-2 text-center group relative overflow-hidden">
                    <img src="https://placehold.co/150x150/eff6ff/1d4ed8?text=Bulk+Deals" className="w-10 h-10 mb-2 opacity-50 group-hover:scale-110 transition" alt="Ad" />
                    <p className="text-[8px] md:text-[10px] font-bold text-blue-800 leading-tight">Similar B2B Deals for You</p>
                    <button className="mt-2 text-[7px] md:text-[9px] bg-blue-600 text-white px-2 py-1 rounded font-bold">Explore</button>
                    <div className="absolute top-0 right-0 bg-white text-[6px] px-1 rounded-bl text-gray-300">Ad</div>
                  </div>
                )}

                {/* Wishlist Product Card */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition flex flex-col group relative">
                  
                  {/* Remove Button */}
                  <button className="absolute top-1 right-1 z-20 bg-white/80 backdrop-blur-sm text-gray-400 hover:text-red-500 w-5 h-5 rounded-full flex items-center justify-center text-[10px] shadow-sm">
                    ✕
                  </button>

                  <Link to={`/product/${item.id}`} className="aspect-square bg-gray-50 overflow-hidden block">
                    <img 
                      src={item.img} 
                      alt={item.name} 
                      className={`w-full h-full object-cover group-hover:scale-110 transition duration-300 ${!item.inStock && 'grayscale opacity-50'}`} 
                    />
                    {!item.inStock && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <span className="bg-white text-gray-800 text-[8px] md:text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">SOLD OUT</span>
                      </div>
                    )}
                  </Link>
                  
                  <div className="p-1.5 md:p-3 flex flex-col flex-grow">
                    <h3 className="text-[9px] md:text-sm font-medium text-gray-800 line-clamp-2 leading-tight mb-1 group-hover:text-[#ff5722]">
                      {item.name}
                    </h3>
                    
                    <div className="mt-auto">
                      {!isWholesale ? (
                        <p className="text-[#ff5722] font-black text-xs md:text-lg leading-none">৳{item.price}</p>
                      ) : (
                        <div className="bg-orange-50 border border-orange-100 rounded p-1">
                          <p className="text-[#ff5722] font-bold text-[9px] md:text-base leading-none">৳{item.wholesale}</p>
                          <p className="text-gray-500 text-[7px] md:text-[9px] mt-0.5">Min: {item.minQty} pcs</p>
                        </div>
                      )}

                      <button 
                        disabled={!item.inStock}
                        className={`w-full mt-2 py-1.5 rounded text-[9px] md:text-xs font-bold transition shadow-sm ${
                          item.inStock 
                            ? 'bg-gray-900 text-white hover:bg-black' 
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {item.inStock ? 'Add to Cart' : 'Notify Me'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 3. Bottom Help Card */}
        <div className="mt-12 bg-white rounded-2xl p-6 md:p-10 border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-lg md:text-xl font-bold text-gray-800">Planning a big purchase?</h2>
            <p className="text-xs md:text-sm text-gray-500 mt-1">Submit a bulk inquiry for your wishlist items and get custom quotes from top manufacturers.</p>
          </div>
          <Link to="/bulk-inquiry" className="bg-[#ff5722] text-white px-8 py-3 rounded-full font-bold text-sm hover:bg-[#e64a19] transition shadow-md whitespace-nowrap">
            Get Bulk Quote
          </Link>
        </div>

      </div>
    </div>
  );
}