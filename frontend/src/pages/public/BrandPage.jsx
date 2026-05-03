import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

export default function BrandPage() {
  const { id } = useParams(); // URL থেকে সেলার/ব্র্যান্ড আইডি নেওয়া
  const [isWholesale, setIsWholesale] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // মক ব্র্যান্ড ডেটা (এগুলো পরে সেলার প্রোফাইল এপিআই থেকে আসবে)
  const brandInfo = {
    name: "SuperAudio Acoustics",
    logo: "https://picsum.photos/seed/brand/150/150",
    cover: "https://images.unsplash.com/photo-1558089687-f282ffcbc126?auto=format&fit=crop&w=1200&q=80",
    followers: "124K",
    rating: "4.9",
    joined: "2024",
    categories: ["Headphones", "Speakers", "Earbuds", "Accessories", "Home Theater"]
  };

  useEffect(() => {
    const fetchBrandProducts = async () => {
      try {
        // এই এপিআই-টি নির্দিষ্ট সেলারের সব প্রোডাক্ট নিয়ে আসবে
        const res = await axios.get(`[https://uddom0-1.onrender.com](https://uddom0-1.onrender.com)/api/products`);

        // সাময়িকভাবে আমরা ফিল্টার করছি (পরবর্তীতে backend-এ query দিয়ে আনব)
        // const filtered = res.data.filter(p => p.seller === id);

        setProducts(res.data.slice(0, 12)); // উদাহরণস্বরূপ ১২টি দেখাচ্ছি
        setLoading(false);
      } catch (error) {
        console.error("Error fetching brand products:", error);
        setLoading(false);
      }
    };
    fetchBrandProducts();
  }, [id]);

  if (loading) return <div className="text-center py-20 font-black uppercase tracking-widest text-gray-400 animate-pulse">Loading Brand Store...</div>;

  return (
    <div className="bg-gray-50 min-h-screen pb-12">

      {/* 1. Brand Hero Section */}
      <div className="bg-white border-b border-gray-100">
        <div className="w-full h-40 md:h-72 relative bg-gray-900 overflow-hidden">
          <img src={brandInfo.cover} alt="Brand Cover" className="w-full h-full object-cover opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        </div>

        <div className="container mx-auto px-4 relative pb-6 md:pb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-16 md:-mt-20">

            {/* Logo & Info */}
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 z-10">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl border-4 border-white bg-white shadow-2xl overflow-hidden shrink-0">
                <img src={brandInfo.logo} alt="Brand Logo" className="w-full h-full object-cover" />
              </div>
              <div className="text-center md:text-left mb-2">
                <h1 className="text-2xl md:text-4xl font-black text-gray-900 flex items-center justify-center md:justify-start gap-2 italic uppercase tracking-tighter">
                  {brandInfo.name} <span className="text-blue-500 text-sm md:text-lg">✔</span>
                </h1>
                <div className="flex items-center justify-center md:justify-start gap-4 text-[10px] md:text-xs font-black text-gray-500 mt-2 uppercase tracking-widest">
                  <span><strong className="text-gray-900">{brandInfo.followers}</strong> Followers</span>
                  <span className="text-gray-200">|</span>
                  <span className="text-yellow-500 font-black">★ {brandInfo.rating}</span>
                  <span className="text-gray-200">|</span>
                  <span>Member Since {brandInfo.joined}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-center md:justify-end gap-3 w-full md:w-auto z-10">
              <div className="relative flex-1 md:w-72">
                <input
                  type="text"
                  placeholder={`Search in store...`}
                  className="w-full border-2 border-gray-100 bg-gray-50 rounded-2xl px-5 py-3 text-xs font-bold focus:outline-none focus:border-[#ff5722] transition-all"
                />
              </div>
              <button className="bg-[#ff5722] text-white px-8 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-orange-200 hover:bg-black transition-all active:scale-95">
                + Follow
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">

        {/* Promoted Banner */}
        <div className="relative w-full h-20 md:h-28 rounded-[2rem] overflow-hidden shadow-xl mb-10 border-4 border-white">
          <img
            src="https://images.unsplash.com/photo-1478737270239-2fccd2508c6a?auto=format&fit=crop&w=1200&q=80"
            alt="Promo"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-blue-900/40 flex items-center px-10">
            <h2 className="text-white text-sm md:text-2xl font-black uppercase italic tracking-tighter">Brand Week: Flat 15% Off on Bulk Inquiries!</h2>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">

          {/* 2. Sidebar Filters */}
          <div className="hidden lg:block w-1/4 shrink-0">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-50 sticky top-32">
              <h3 className="font-black text-gray-900 mb-6 text-xs uppercase tracking-[0.2em] border-b pb-4">Categories</h3>
              <ul className="space-y-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                {brandInfo.categories.map((cat, idx) => (
                  <li key={idx} className="hover:text-[#ff5722] cursor-pointer flex items-center justify-between group">
                    {cat} <span className="opacity-0 group-hover:opacity-100 transition">→</span>
                  </li>
                ))}
              </ul>

              <h3 className="font-black text-gray-900 mt-10 mb-6 text-xs uppercase tracking-[0.2em] border-b pb-4">Price Filter</h3>
              <div className="flex gap-2 items-center">
                <input type="number" placeholder="Min" className="w-full bg-gray-50 border-none p-3 text-[10px] rounded-xl font-bold outline-none focus:ring-1 focus:ring-orange-200" />
                <span className="text-gray-300">-</span>
                <input type="number" placeholder="Max" className="w-full bg-gray-50 border-none p-3 text-[10px] rounded-xl font-bold outline-none focus:ring-1 focus:ring-orange-200" />
              </div>
            </div>
          </div>

          {/* 3. Main Product Grid */}
          <div className="w-full lg:w-3/4">

            {/* Toolbar */}
            <div className="bg-white p-4 md:p-6 rounded-[2rem] shadow-sm border border-gray-50 mb-8 flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Store Inventory: {products.length}</span>

                {/* Retail/Wholesale Toggle */}
                <div className="flex items-center bg-gray-100 p-1.5 rounded-2xl">
                  <button
                    onClick={() => setIsWholesale(false)}
                    className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${!isWholesale ? 'bg-white shadow-lg text-[#ff5722]' : 'text-gray-400'}`}
                  >
                    Retail
                  </button>
                  <button
                    onClick={() => setIsWholesale(true)}
                    className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${isWholesale ? 'bg-[#ff5722] text-white shadow-lg' : 'text-gray-400'}`}
                  >
                    Wholesale
                  </button>
                </div>
              </div>

              <select className="bg-gray-50 border-none text-[10px] font-black uppercase tracking-widest rounded-xl p-3 outline-none cursor-pointer">
                <option>Newest Arrivals</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {products.map((product) => (
                <div key={product._id} className="bg-white rounded-3xl shadow-sm overflow-hidden hover:shadow-2xl hover:shadow-orange-900/5 transition-all duration-500 border border-gray-50 flex flex-col group">
                  <Link to={`/product/${product._id}`} className="relative aspect-square bg-gray-50 block overflow-hidden">
                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                    {product.isFlashSale && (
                      <span className="absolute top-3 left-3 bg-[#ff5722] text-white text-[8px] font-black px-2 py-1 rounded-lg uppercase tracking-tighter italic">Flash Sale</span>
                    )}
                  </Link>

                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="text-[10px] md:text-xs font-black text-gray-800 line-clamp-2 mb-3 leading-tight uppercase tracking-tighter italic hover:text-[#ff5722] transition">
                      {product.name}
                    </h3>

                    <div className="mt-auto">
                      {!isWholesale ? (
                        <p className="text-[#ff5722] font-black text-xs md:text-xl leading-none">৳{product.price}</p>
                      ) : (
                        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-2.5">
                          <p className="text-[#ff5722] font-black text-xs md:text-lg leading-none">৳{product.wholesalePrice}</p>
                          <p className="text-gray-400 text-[8px] font-black uppercase tracking-widest mt-1.5 flex justify-between">
                            <span>Bulk Rate</span>
                            <span>Min: {product.minWholesaleQty}</span>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-12 flex justify-center">
              <button className="bg-gray-900 text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-[#ff5722] transition-all active:scale-95">
                Explore More Items
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}