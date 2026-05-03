import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function SearchResults() {
  const [isWholesale, setIsWholesale] = useState(false);
  const searchQuery = "Wireless Headphones"; // Dummy search query

  // Mock Search Data
  const results = Array.from({ length: 15 }).map((_, i) => ({
    id: i + 1,
    name: i % 3 === 0 ? `Premium ${searchQuery} Model X` : `${searchQuery} for Office & Home`,
    price: 1200 + (i * 150),
    wholesale: 950 + (i * 120),
    minQty: 10,
    img: `https://placehold.co/300x300/f1f5f9/475569?text=Result+${i + 1}`,
    isSponsored: i === 0 || i === 7 // Mocking sponsored listings
  }));

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      
      {/* 1. Search Result Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 md:py-6">
          <p className="text-[10px] md:text-sm text-gray-500 mb-1">Search results for:</p>
          <h1 className="text-xl md:text-3xl font-bold text-gray-800 italic">"{searchQuery}"</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* 2. Sidebar Filters (Desktop Only) */}
          <div className="hidden lg:block w-1/5 shrink-0">
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 sticky top-32">
              <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">Refine Search</h3>
              
              <div className="mb-6">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Categories</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <label className="flex items-center gap-2 cursor-pointer hover:text-[#ff5722]"><input type="checkbox" className="accent-[#ff5722]" /> Electronics</label>
                  <label className="flex items-center gap-2 cursor-pointer hover:text-[#ff5722]"><input type="checkbox" className="accent-[#ff5722]" /> Mobile Gadgets</label>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Price Range</h4>
                <div className="flex gap-2">
                  <input type="number" placeholder="Min" className="w-full border border-gray-200 p-1.5 text-xs rounded" />
                  <input type="number" placeholder="Max" className="w-full border border-gray-200 p-1.5 text-xs rounded" />
                </div>
              </div>

              <button className="w-full bg-gray-900 text-white py-2 rounded-lg text-xs font-bold hover:bg-black transition">
                Apply Filters
              </button>
            </div>
          </div>

          {/* 3. Main Results Grid */}
          <div className="w-full lg:w-4/5">
            
            {/* Toolbar */}
            <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 mb-6 flex items-center justify-between gap-4">
              <span className="text-[10px] md:text-sm text-gray-500">{results.length} items found</span>
              
              <div className="flex items-center gap-3">
                {/* Retail/Wholesale Switcher */}
                <div className="flex items-center bg-gray-100 p-1 rounded-md">
                  <button 
                    onClick={() => setIsWholesale(false)}
                    className={`px-3 py-1 text-[10px] md:text-xs font-bold rounded ${!isWholesale ? 'bg-white shadow-sm text-[#ff5722]' : 'text-gray-500'}`}
                  >
                    Retail
                  </button>
                  <button 
                    onClick={() => setIsWholesale(true)}
                    className={`px-3 py-1 text-[10px] md:text-xs font-bold rounded ${isWholesale ? 'bg-[#ff5722] text-white shadow-sm' : 'text-gray-500'}`}
                  >
                    Wholesale
                  </button>
                </div>

                <select className="border border-gray-200 text-[10px] md:text-sm rounded p-1 md:p-1.5 focus:outline-none bg-white">
                  <option>Newest</option>
                  <option>Price: Low-High</option>
                  <option>Best Match</option>
                </select>
              </div>
            </div>

            {/* Results Grid (Mobile: 3 Columns) */}
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-4">
              {results.map((item, index) => {
                const showBannerAd = index === 10;

                return (
                  <div key={item.id} className="contents">
                    {/* In-feed Search Ad */}
                    {showBannerAd && (
                      <div className="col-span-full my-2">
                        <div className="relative w-full h-16 md:h-24 rounded-lg overflow-hidden border border-blue-100 bg-blue-50 flex items-center justify-center">
                          <img 
                            src="https://placehold.co/1200x200/eff6ff/1d4ed8?text=Looking+for+Bulk+Electronics?+Contact+Verified+Sellers+Directly" 
                            alt="Search Ad" 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-1 right-1 bg-white/80 text-[7px] md:text-[9px] px-1 rounded border">Sponsored</div>
                        </div>
                      </div>
                    )}

                    {/* Product Card */}
                    <div className={`bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition flex flex-col relative group ${item.isSponsored ? 'border-orange-200 ring-1 ring-orange-100' : 'border-gray-100'}`}>
                      
                      {item.isSponsored && (
                        <div className="absolute top-1 right-1 z-10 bg-white/90 text-gray-400 text-[7px] md:text-[9px] px-1 rounded border">
                          Ad
                        </div>
                      )}

                      <Link to={`/product/${item.id}`} className="aspect-square overflow-hidden bg-gray-50">
                        <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-300" />
                      </Link>

                      <div className="p-1.5 md:p-3 flex flex-col flex-grow">
                        <Link to={`/product/${item.id}`}>
                          <h3 className="text-[9px] md:text-sm font-medium text-gray-800 line-clamp-2 leading-tight mb-1 hover:text-[#ff5722]">
                            {item.name}
                          </h3>
                        </Link>
                        
                        <div className="mt-auto">
                          {!isWholesale ? (
                            <p className="text-[#ff5722] font-black text-xs md:text-lg">৳{item.price}</p>
                          ) : (
                            <div className="bg-orange-50 border border-orange-100 rounded p-1 mt-1">
                              <p className="text-[#ff5722] font-bold text-[10px] md:text-base leading-none">৳{item.wholesale}</p>
                              <p className="text-gray-500 text-[7px] md:text-[10px] mt-0.5">Min: {item.minQty} pcs</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Placeholder */}
            <div className="mt-10 flex justify-center">
               <button className="bg-white border border-gray-300 px-8 py-2 rounded-full text-xs md:text-sm font-bold text-gray-600 hover:bg-gray-50 transition">
                 Load More Results
               </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}