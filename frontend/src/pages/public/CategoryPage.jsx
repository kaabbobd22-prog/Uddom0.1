import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

export default function CategoryPage() {
  const { id } = useParams(); // URL থেকে মেইন ক্যাটাগরি (যেমন: electronics-&-gadgets)
  const [isWholesale, setIsWholesale] = useState(false);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ক্যাটাগরি ও ফিল্টার স্টেট
  const [categoryData, setCategoryData] = useState([]); // এই ক্যাটাগরির সাব/চাইল্ড ডাটা
  const [selectedSub, setSelectedSub] = useState(null);
  const [selectedChild, setSelectedChild] = useState(null);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  // মোবাইল ফিল্টার ড্রয়ার স্টেট
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // ১. সব ক্যাটাগরি এনে এই মেইন ক্যাটাগরির সাব-ক্যাটাগরিগুলো বের করা
        const catRes = await axios.get('[https://uddom0-1.onrender.com](https://uddom0-1.onrender.com)/api/categories');

        // URL এর id (slug) কে নরমাল টেক্সটে কনভার্ট করে ম্যাচ করানো (যেমন: fashion:-men)
        const currentCategoryTitle = id ? id.replace(/-/g, ' ').toLowerCase() : '';
        const specificCategoryObjects = catRes.data.filter(
          c => c.Category.toLowerCase().replace(/-/g, ' ') === currentCategoryTitle
        );
        setCategoryData(specificCategoryObjects);

        // ২. প্রোডাক্ট ফেচ করা (আপাতত সব এনে ফিল্টার করা হচ্ছে)
        const prodRes = await axios.get('[https://uddom0-1.onrender.com](https://uddom0-1.onrender.com)/api/products');

        // রিয়েল প্রজেক্টে প্রোডাক্টের category ফিল্ড দিয়ে ফিল্টার করবেন:
        // const categoryProducts = prodRes.data.filter(p => p.category.toLowerCase() === currentCategoryTitle);
        const categoryProducts = prodRes.data; // মক হিসেবে সব নেওয়া হলো

        setProducts(categoryProducts);
        setFilteredProducts(categoryProducts.slice(0, 12));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // ফিল্টার অ্যাপ্লাই লজিক
  useEffect(() => {
    let result = products;

    // SubCategory Filter
    if (selectedSub) {
      result = result.filter(p => p.subCategory === selectedSub);
    }
    // ChildCategory Filter
    if (selectedChild) {
      result = result.filter(p => p.childCategory === selectedChild);
    }
    // Price Filter
    if (priceRange.min) {
      result = result.filter(p => p.price >= Number(priceRange.min));
    }
    if (priceRange.max) {
      result = result.filter(p => p.price <= Number(priceRange.max));
    }

    setFilteredProducts(result.slice(0, 12));
  }, [selectedSub, selectedChild, priceRange, products]);

  // ডিসপ্লে করার জন্য মেইন নাম
  const displayCategoryName = id ? id.replace(/-/g, ' ').toUpperCase() : "COLLECTION";

  // ফিল্টার কম্পোনেন্ট (যাতে মোবাইল এবং ডেস্কটপ দুই জায়গায় ব্যবহার করা যায়)
  const FilterSidebar = () => (
    <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border-4 border-white">
      <div className="flex justify-between items-center mb-6 border-b border-gray-50 pb-4">
        <h3 className="font-black text-gray-900 text-xs uppercase tracking-[0.2em] italic">Filters</h3>
        <button
          onClick={() => { setSelectedSub(null); setSelectedChild(null); setPriceRange({ min: '', max: '' }); }}
          className="text-[9px] font-bold text-[#ff5722] uppercase tracking-widest hover:underline"
        >
          Clear All
        </button>
      </div>

      {/* Categories Accordion */}
      <div className="mb-8 space-y-4">
        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Sub Categories</h4>
        {categoryData.map((subObj, idx) => (
          <div key={idx} className="border border-gray-100 rounded-2xl overflow-hidden">
            <button
              onClick={() => {
                setSelectedSub(selectedSub === subObj.SubCategory ? null : subObj.SubCategory);
                setSelectedChild(null); // সাব চেঞ্জ হলে চাইল্ড রিসেট হবে
              }}
              className={`w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest flex justify-between items-center transition-colors ${selectedSub === subObj.SubCategory ? 'bg-orange-50 text-[#ff5722]' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
            >
              {subObj.SubCategory}
              <span>{selectedSub === subObj.SubCategory ? '−' : '+'}</span>
            </button>

            {/* Child Categories */}
            {selectedSub === subObj.SubCategory && (
              <div className="bg-white px-4 py-3 space-y-2">
                {subObj.ChildCategory?.map((child, cIdx) => (
                  <label key={cIdx} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedChild === child}
                      onChange={() => setSelectedChild(selectedChild === child ? null : child)}
                      className="w-3.5 h-3.5 accent-[#ff5722] cursor-pointer"
                    />
                    <span className={`text-[10px] font-bold uppercase tracking-tight group-hover:text-[#ff5722] transition-colors ${selectedChild === child ? 'text-[#ff5722]' : 'text-gray-500'}`}>
                      {child}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Price Range */}
      <div className="mb-8">
        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Price Range</h4>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            placeholder="Min"
            value={priceRange.min}
            onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
            className="w-full bg-gray-50 border border-gray-100 p-3 text-[10px] font-black rounded-xl outline-none focus:border-[#ff5722]"
          />
          <span className="text-gray-300 font-bold">-</span>
          <input
            type="number"
            placeholder="Max"
            value={priceRange.max}
            onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
            className="w-full bg-gray-50 border border-gray-100 p-3 text-[10px] font-black rounded-xl outline-none focus:border-[#ff5722]"
          />
        </div>
      </div>
    </div>
  );

  if (loading) return <div className="text-center py-20 font-black uppercase tracking-widest text-gray-400 animate-pulse">Loading Collection...</div>;

  return (
    <div className="bg-gray-50 min-h-screen pb-12 relative">

      {/* Mobile Filter Drawer (Overlay) */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-[100] flex md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileFilterOpen(false)}></div>
          <div className="relative w-4/5 max-w-sm bg-gray-50 h-full shadow-2xl flex flex-col overflow-y-auto animate-fade-in">
            <div className="p-4 bg-gray-900 text-white flex justify-between items-center sticky top-0 z-10">
              <span className="font-black text-xs uppercase tracking-widest italic">Filter Products</span>
              <button onClick={() => setIsMobileFilterOpen(false)} className="text-xl">✕</button>
            </div>
            <div className="p-4">
              <FilterSidebar />
            </div>
            <div className="p-4 bg-white border-t sticky bottom-0">
              <button onClick={() => setIsMobileFilterOpen(false)} className="w-full bg-[#ff5722] text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">View Results</button>
            </div>
          </div>
        </div>
      )}

      {/* 1. Category Top Banner (Sponsored) */}
      <div className="bg-white border-b border-gray-100 mb-8">
        <div className="container mx-auto px-4 py-6">
          {/* Breadcrumb */}
          <div className="text-[9px] md:text-xs font-black text-gray-400 uppercase tracking-widest mb-6">
            <Link to="/" className="hover:text-[#ff5722] transition-colors">Home</Link> <span className="mx-2 text-gray-300">/</span>
            <Link to="/categories" className="hover:text-[#ff5722] transition-colors">Categories</Link> <span className="mx-2 text-gray-300">/</span>
            <span className="text-gray-900">{displayCategoryName}</span>
          </div>

          {/* Top Ad Banner */}
          <div className="relative w-full h-28 md:h-56 rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white group">
            <img
              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80"
              alt="Category Banner"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-transparent flex flex-col justify-center px-8 md:px-16">
              <span className="text-[#ff5722] text-[10px] md:text-xs font-black uppercase tracking-[0.3em] mb-2 drop-shadow-md">Exclusive</span>
              <h1 className="text-white text-2xl md:text-6xl font-black uppercase italic tracking-tighter drop-shadow-2xl">{displayCategoryName}</h1>
            </div>
            <div className="absolute top-5 right-5 bg-white/90 backdrop-blur text-gray-900 text-[8px] md:text-[10px] font-black px-3 py-1 rounded-md uppercase tracking-widest shadow-lg">
              Sponsored
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8">

          {/* 2. Left Sidebar Filters (Desktop Only) */}
          <div className="hidden md:block w-1/4 lg:w-1/5 shrink-0 sticky top-24 h-max">
            <FilterSidebar />
          </div>

          {/* 3. Main Product Listing Area */}
          <div className="w-full md:w-3/4 lg:w-4/5">

            {/* Toolbar */}
            <div className="bg-white p-4 md:p-6 rounded-[2rem] md:rounded-[2.5rem] shadow-xl border-4 border-white mb-8 flex flex-col md:flex-row items-center justify-between gap-5">
              <div className="flex w-full md:w-auto items-center justify-between md:justify-start gap-4">
                {/* Mobile Filter Button */}
                <button
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="md:hidden bg-gray-900 hover:bg-[#ff5722] text-white px-5 py-3 text-[10px] font-black rounded-xl uppercase tracking-widest shadow-md transition-colors"
                >
                  <span className="mr-2">⚙️</span> Filters
                </button>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4 py-2 bg-gray-50 rounded-lg border border-gray-100">
                  {filteredProducts.length} Items
                </span>
              </div>

              <div className="flex w-full md:w-auto items-center justify-between md:justify-end gap-4 overflow-x-auto scrollbar-hide pb-1 md:pb-0">
                {/* Retail/Wholesale Toggle */}
                <div className="flex items-center bg-gray-50 p-1.5 rounded-2xl border border-gray-100 shrink-0">
                  <button
                    onClick={() => setIsWholesale(false)}
                    className={`px-5 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${!isWholesale ? 'bg-white shadow-md text-[#ff5722]' : 'text-gray-400 hover:text-gray-900'}`}
                  >
                    Retail
                  </button>
                  <button
                    onClick={() => setIsWholesale(true)}
                    className={`px-5 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${isWholesale ? 'bg-[#ff5722] text-white shadow-md' : 'text-gray-400 hover:text-gray-900'}`}
                  >
                    Wholesale
                  </button>
                </div>

                <select className="bg-gray-50 border border-gray-100 text-[9px] font-black uppercase tracking-widest rounded-xl p-3 outline-none cursor-pointer focus:border-[#ff5722] shrink-0">
                  <option>Popularity</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Newest Arrivals</option>
                </select>
              </div>
            </div>

            {/* Product Grid */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white p-16 rounded-[2.5rem] shadow-xl border-4 border-white text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-black text-gray-900 uppercase italic tracking-tighter mb-2">No Products Found</h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Try adjusting your filters or search criteria.</p>
                <button onClick={() => { setSelectedSub(null); setSelectedChild(null); setPriceRange({ min: '', max: '' }); }} className="mt-6 bg-[#ff5722] text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">Clear Filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {filteredProducts.map((product, index) => {
                  const renderAd = index === 9; // ৮ নম্বর আইটেমের পর অ্যাড দেখাবে

                  return (
                    <div key={product._id} className="contents">
                      {renderAd && (
                        <div className="col-span-full my-2 md:my-6">
                          <div className="relative w-full h-24 md:h-36 rounded-[2.5rem] overflow-hidden shadow-xl border-4 border-white group">
                            <img
                              src="https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&w=1200&q=80"
                              alt="In-feed Ad"
                              className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-orange-900/80 to-black/40 flex items-center px-6 md:px-12">
                              <div>
                                <span className="bg-white text-[#ff5722] text-[8px] md:text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-widest mb-2 inline-block">Special Offer</span>
                                <h2 className="text-white text-base md:text-3xl font-black uppercase italic tracking-tighter">Big Wholesale Deals on {displayCategoryName}</h2>
                              </div>
                            </div>
                            <div className="absolute top-4 right-5 bg-white/90 text-gray-600 text-[7px] md:text-[9px] font-black px-2.5 py-1 rounded-md uppercase tracking-widest shadow-sm">
                              Ad
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Single Product Card */}
                      <div className="bg-white rounded-[2rem] shadow-sm overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border-4 border-white flex flex-col group relative">
                        <Link to={`/product/${product._id}`} className="relative aspect-square bg-gray-50 block overflow-hidden rounded-[1.5rem] m-2">
                          <img src={product.images[0] || 'https://placehold.co/300'} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                          {product.isFlashSale && (
                            <span className="absolute top-3 left-3 bg-red-600 text-white text-[8px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest shadow-md">HOT</span>
                          )}
                        </Link>

                        <div className="p-4 pt-2 flex flex-col flex-grow">
                          <Link to={`/product/${product._id}`}>
                            <h3 className="text-[10px] md:text-xs font-black text-gray-800 line-clamp-2 mb-3 leading-snug uppercase tracking-tight italic group-hover:text-[#ff5722] transition-colors">
                              {product.name}
                            </h3>
                          </Link>

                          <div className="mt-auto">
                            {!isWholesale ? (
                              <div>
                                <p className="text-gray-400 text-[8px] font-black uppercase tracking-widest mb-0.5">Retail Rate</p>
                                <p className="text-[#ff5722] font-black text-sm md:text-xl leading-none tracking-tighter">৳{product.price}</p>
                              </div>
                            ) : (
                              <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-8 h-8 bg-orange-100 rounded-bl-full -z-0"></div>
                                <p className="text-gray-500 text-[8px] font-black uppercase tracking-widest mb-0.5 relative z-10">Bulk Price</p>
                                <p className="text-[#ff5722] font-black text-sm md:text-xl leading-none tracking-tighter relative z-10">৳{product.wholesalePrice}</p>
                                <p className="text-orange-800 text-[8px] font-black uppercase tracking-widest mt-1.5 relative z-10">Min Qty: {product.minWholesaleQty || 10}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Load More */}
            {filteredProducts.length > 0 && (
              <div className="mt-12 flex justify-center">
                <button className="bg-gray-900 text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-[#ff5722] transition-all active:scale-95">
                  Load More Items
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}