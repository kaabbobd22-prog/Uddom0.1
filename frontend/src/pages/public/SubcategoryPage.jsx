import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

export default function SubcategoryPage() {
  // URL থেকে categoryId এবং subcatName নেওয়া হবে 
  // উদাহরণ: /category/:id/:subcatName
  const { id, subcatName } = useParams();
  const [isWholesale, setIsWholesale] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ব্র্যান্ডগুলোর মক ডাটা (এটিও ডাটাবেস থেকে আনা সম্ভব)
  const brands = ["Sony", "Bose", "JBL", "Sennheiser", "Apple", "Xiaomi"];

  useEffect(() => {
    const fetchSubcatProducts = async () => {
      try {
        setLoading(true);
        // ডাটাবেস থেকে ওই নির্দিষ্ট সাব-ক্যাটাগরির প্রোডাক্ট ফিল্টার করে আনা
        const res = await axios.get(`[https://uddom0-1.onrender.com](https://uddom0-1.onrender.com)/api/products`);

        // ফ্রন্টএন্ড ফিল্টারিং (যদি ব্যাকএন্ডে স্পেসিফিক রুট না থাকে)
        // p.subcategory ফিল্ডটি আপনার প্রোডাক্ট মডেলে থাকতে হবে
        const filtered = res.data.filter(p => p.subcategory === subcatName);

        setProducts(filtered.length > 0 ? filtered : res.data.slice(0, 12));
        setLoading(false);
      } catch (error) {
        console.error("Error loading products:", error);
        setLoading(false);
      }
    };
    fetchSubcatProducts();
  }, [subcatName]);

  if (loading) return <div className="text-center py-20 font-black uppercase text-gray-400 animate-pulse">Loading {subcatName}...</div>;

  return (
    <div className="bg-gray-50 min-h-screen pb-12">

      {/* 1. Header & Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-6">
          <nav className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            <Link to="/" className="hover:text-[#ff5722]">Home</Link>
            <span className="text-gray-300">/</span>
            <Link to="/categories" className="hover:text-[#ff5722]">Categories</Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900 italic">{subcatName}</span>
          </nav>
          <h1 className="text-2xl md:text-4xl font-black text-gray-900 uppercase italic tracking-tighter">
            {subcatName} <span className="text-[#ff5722] not-italic">Collection</span>
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">

        {/* 2. Brand Quick Links */}
        <div className="mb-8">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Popular Brands</h3>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
            {brands.map((brand, idx) => (
              <Link
                key={idx}
                to={`/search?brand=${brand}`}
                className="bg-white border border-gray-100 px-6 py-2 rounded-2xl text-[10px] font-black text-gray-600 uppercase tracking-widest hover:border-[#ff5722] hover:text-[#ff5722] transition shrink-0 shadow-sm"
              >
                {brand}
              </Link>
            ))}
          </div>
        </div>

        {/* 3. Subcategory Top Banner (Ad) */}
        <div className="relative w-full h-24 md:h-44 rounded-[2.5rem] overflow-hidden shadow-2xl mb-10 border-4 border-white">
          <img
            src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80"
            alt="Promotion"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center px-10">
            <h2 className="text-white text-xl md:text-4xl font-black uppercase italic tracking-tighter">Verified {subcatName} Wholesalers</h2>
          </div>
          <div className="absolute top-4 right-6 bg-white/90 text-[8px] md:text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest text-gray-500">Sponsored</div>
        </div>

        {/* 4. Toolbar */}
        <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-[2rem] border border-gray-50 shadow-sm">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{products.length} Products Found</span>

          <div className="flex items-center gap-4">
            {/* Wholesale Toggle */}
            <div className="flex items-center bg-gray-100 p-1.5 rounded-2xl">
              <button
                onClick={() => setIsWholesale(false)}
                className={`px-5 py-2 text-[10px] font-black uppercase rounded-xl transition-all ${!isWholesale ? 'bg-white text-[#ff5722] shadow-lg' : 'text-gray-400'}`}
              >
                Retail
              </button>
              <button
                onClick={() => setIsWholesale(true)}
                className={`px-5 py-2 text-[10px] font-black uppercase rounded-xl transition-all ${isWholesale ? 'bg-[#ff5722] text-white shadow-lg' : 'text-gray-400'}`}
              >
                Wholesale
              </button>
            </div>

            <select className="bg-transparent text-[10px] font-black uppercase tracking-widest text-gray-900 focus:outline-none cursor-pointer hidden md:block">
              <option>Sort: Popular</option>
              <option>Price: Low-High</option>
            </select>
          </div>
        </div>

        {/* 5. Product Grid (3 Columns on Mobile) */}
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-4">
          {products.map((product, index) => {
            const showInFeedAd = index === 6;

            return (
              <div key={product._id} className="contents">
                {showInFeedAd && (
                  <div className="col-span-full my-4">
                    <div className="w-full h-20 md:h-32 bg-gray-900 rounded-[2rem] flex items-center px-10 relative overflow-hidden group border-4 border-white shadow-xl">
                      <img
                        src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80"
                        className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition duration-700"
                        alt="Ad"
                      />
                      <div className="relative z-10">
                        <p className="text-white font-black text-xs md:text-2xl uppercase italic tracking-tighter leading-none">Super Sound Official Store</p>
                        <p className="text-[#ff5722] text-[8px] md:text-sm font-black uppercase tracking-[0.2em] mt-2">Verified UDDOM Partner</p>
                      </div>
                      <div className="absolute top-4 right-6 bg-white/20 backdrop-blur text-white text-[8px] px-3 py-1 rounded-full font-black uppercase">Ad</div>
                    </div>
                  </div>
                )}

                {/* Product Card */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-50 overflow-hidden hover:shadow-2xl hover:shadow-orange-900/5 transition-all duration-500 flex flex-col group">
                  <Link to={`/product/${product._id}`} className="aspect-square bg-gray-50 overflow-hidden relative">
                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                    {product.isFlashSale && (
                      <div className="absolute top-2 left-2 bg-red-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded-md italic">HOT</div>
                    )}
                  </Link>

                  <div className="p-3 flex flex-col flex-grow">
                    <h3 className="text-[10px] md:text-sm font-black text-gray-800 line-clamp-2 leading-tight mb-3 uppercase italic tracking-tighter hover:text-[#ff5722] transition">
                      {product.name}
                    </h3>

                    <div className="mt-auto">
                      {!isWholesale ? (
                        <div>
                          <p className="text-[#ff5722] font-black text-xs md:text-lg">৳{product.price}</p>
                          <p className="text-gray-400 text-[8px] font-black uppercase tracking-widest mt-1">Retail</p>
                        </div>
                      ) : (
                        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-2">
                          <p className="text-[#ff5722] font-black text-[10px] md:text-base leading-none">৳{product.wholesalePrice}</p>
                          <p className="text-gray-400 text-[7px] font-black uppercase mt-1">Min: {product.minWholesaleQty || 10} pcs</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 6. Pagination (Removed "Load More" button to keep it endless or clean as per your requirement) */}
        {products.length > 0 && (
          <div className="mt-12 text-center">
            <p className="text-gray-300 font-black text-[10px] uppercase tracking-[0.3em]">End of Collection</p>
          </div>
        )}

      </div>
    </div>
  );
}