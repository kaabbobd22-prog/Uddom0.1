import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios'; 

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [flashSaleProducts, setFlashSaleProducts] = useState([]);
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [displayProducts, setDisplayProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [fetchingMore, setFetchingMore] = useState(false);

  const observer = useRef();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [prodRes, catRes] = await Promise.all([
          API.get('/products'),
          API.get('/categories')
        ]);

        const allProducts = Array.isArray(prodRes.data) ? prodRes.data : prodRes.data.products || [];
        const allCategories = Array.isArray(catRes.data) ? catRes.data : catRes.data.categories || [];

        // ✅ সমাধান ১: ক্যাটাগরি ডুপ্লিকেট রিমুভ করা
        const uniqueCategories = Array.from(new Map(allCategories.map(item => [item.Category, item])).values());
        setCategories(uniqueCategories);

        // ✅ সমাধান ২: ফ্ল্যাশ সেল ডাটা ঠিক করা (isFlashSale চেক নিশ্চিত করা)
        const flashSales = allProducts.filter(p => p && (p.isFlashSale === true || p.isFlashSale === 'true')).slice(0, 3);
        setFlashSaleProducts(flashSales);

        const history = JSON.parse(localStorage.getItem('view_history')) || [];
        let suggested = [];
        if (history.length > 0) {
          suggested = allProducts
            .filter(p => p && history.includes(p.category))
            .sort(() => 0.5 - Math.random())
            .slice(0, 12);
        }

        if (suggested.length < 12) {
          const others = allProducts
            .filter(p => p && !suggested.find(s => s._id === p._id))
            .sort(() => 0.5 - Math.random())
            .slice(0, 12 - suggested.length);
          suggested = [...suggested, ...others];
        }
        setSuggestedProducts(suggested);
        setLoading(false);
      } catch (error) {
        console.error("Home data error:", error);
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  const fetchMoreProducts = useCallback(async () => {
    if (fetchingMore || !hasMore) return;
    setFetchingMore(true);
    try {
      const res = await API.get(`/products?page=${page}&limit=12`);
      const newProducts = Array.isArray(res.data) ? res.data : res.data.products || [];
      if (newProducts.length === 0) {
        setHasMore(false);
      } else {
        setDisplayProducts(prev => [...prev, ...newProducts]);
        setPage(prev => prev + 1);
      }
    } catch (err) {
      console.error("Endless scroll error:", err);
    } finally {
      setFetchingMore(false);
    }
  }, [page, hasMore, fetchingMore]);

  const lastProductElementRef = useCallback(node => {
    if (loading || fetchingMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        fetchMoreProducts();
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, fetchingMore, hasMore, fetchMoreProducts]);

  useEffect(() => {
    fetchMoreProducts();
  }, []);

  if (loading) return <div className="text-center py-20 font-black uppercase text-gray-400 animate-pulse">Loading UDDOM...</div>;

  return (
    <div className="bg-gray-50 pb-10">
      
      {/* 1. Hero Banner */}
      <section className="container mx-auto px-4 py-4">
        <div className="relative w-full h-56 md:h-96 rounded-[2.5rem] overflow-hidden shadow-2xl group border-2 border-white">
          <img
            src="https://images.unsplash.com/photo-1522204523234-8729aa6e3d5f?auto=format&fit=crop&w=1200&q=80"
            alt="Hero"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/60 flex flex-col justify-center items-center px-4 text-center text-white">
            <h1 className="text-3xl md:text-6xl font-black mb-3 uppercase italic leading-tight tracking-tighter">UDDOM MEGA SALE</h1>
            <p className="text-xs md:text-2xl font-medium opacity-90">Factory Direct, Premium Quality Goods.</p>
            <div className="mt-6 flex gap-3">
              <Link to="/search" className="bg-[#ff5722] px-6 py-2.5 rounded-full text-[10px] md:text-sm font-black uppercase tracking-widest shadow-xl hover:bg-white hover:text-gray-900 transition-all duration-300">Shop Now</Link>
              <Link to="/wholesale" className="bg-white/10 border border-white/20 backdrop-blur-sm px-6 py-2.5 rounded-full text-[10px] md:text-sm font-black uppercase tracking-widest hover:bg-white/20 transition-all duration-300">Wholesale</Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Categories (Duplicate Resolved) */}
      <section className="container mx-auto px-4 py-6">
        <h2 className="text-sm md:text-xl font-bold mb-4 text-gray-800 uppercase tracking-tight italic">Categories</h2>
        <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide">
          {categories.map((cat, index) => (
            <Link
              key={index}
              to={`/category/${cat.Category?.replace(/\s+/g, '-').toLowerCase()}`}
              className="flex flex-col items-center min-w-[85px] md:min-w-[130px] p-3 md:p-6 bg-white rounded-2xl shadow-sm border border-gray-100 shrink-0 hover:border-[#ff5722] transition group"
            >
              <span className="text-2xl md:text-4xl mb-2 group-hover:scale-110 transition drop-shadow-sm">
                {cat.icon || '🏷️'}
              </span>
              <span className="text-[9.5px] md:text-xs font-black text-gray-900 text-center uppercase tracking-widest line-clamp-2 leading-tight">
                {cat.Category}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Flash Sale (Fixed Visibility) */}
      {flashSaleProducts.length > 0 && (
        <section className="container mx-auto px-4 py-6">
          <div className="bg-white rounded-[2rem] p-5 md:p-8 border border-red-50 shadow-xl relative">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <h2 className="text-sm md:text-2xl font-black text-gray-900 italic uppercase">Flash Sale</h2>
                <div className="bg-red-600 text-white px-2 py-0.5 rounded-md text-[9px] md:text-xs font-black animate-pulse">LIVE</div>
              </div>
              <Link to="/flash-sale" className="text-[#ff5722] text-[10px] md:text-sm font-black uppercase tracking-widest border-b-2 border-[#ff5722]">View All</Link>
            </div>
            <div className="grid grid-cols-3 gap-3 md:gap-6">
              {flashSaleProducts.map((p) => (
                <Link to={`/product/${p?._id}`} key={p?._id} className="group">
                  <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 relative">
                    <img src={p?.images?.[0]} alt={p?.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                    <div className="absolute top-1 left-1 bg-red-600 text-white text-[7px] md:text-[10px] font-black px-1.5 py-0.5 rounded-full">HOT</div>
                  </div>
                  <div className="mt-2 text-center md:text-left">
                    <p className="text-[#ff5722] font-black text-[10px] md:text-xl leading-none">৳{p?.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. Suggested For You */}
      <section className="container mx-auto px-4 py-6">
        <h2 className="text-sm md:text-xl font-black text-gray-900 uppercase italic mb-6">Suggested For You</h2>
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-4">
          {suggestedProducts.map((product) => (
            <Link to={`/product/${product?._id}`} key={product?._id} className="bg-white p-1.5 md:p-2 rounded-2xl shadow-sm border border-gray-100 flex flex-col group hover:shadow-md transition-all duration-300">
              <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-50">
                <img src={product?.images?.[0]} alt={product?.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
              </div>
              <div className="p-1.5 md:p-2 flex flex-col flex-grow">
                <h3 className="text-[9px] md:text-sm font-bold text-gray-800 line-clamp-1 mb-1">{product?.name}</h3>
                <p className="text-[#ff5722] font-black text-[10px] md:text-lg leading-none mt-auto">৳{product?.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. Wholesale Hub Banner */}
      <section className="container mx-auto px-4 py-6">
        <Link to="/wholesale" className="relative block w-full h-32 md:h-56 rounded-[2rem] overflow-hidden group shadow-2xl border-2 border-white">
          <img
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80"
            alt="Wholesale"
            className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-center px-4">
              <h2 className="text-white text-lg md:text-4xl font-black uppercase tracking-tighter italic">Bulk Wholesale Hub</h2>
              <p className="text-white/80 text-[8px] md:text-lg font-bold uppercase tracking-widest mt-1">Direct Factory Pricing • Bangladesh Wide</p>
            </div>
          </div>
        </Link>
      </section>

      {/* 6. Trending Now */}
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-sm md:text-xl font-black text-gray-900 uppercase italic mb-6">Trending Now</h2>
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-4">
          {displayProducts.map((product, index) => {
            const isLastElement = displayProducts.length === index + 1;
            return (
              <Link
                ref={isLastElement ? lastProductElementRef : null}
                to={`/product/${product?._id}`}
                key={`${product?._id}-${index}`}
                className="bg-white p-1.5 md:p-2 rounded-2xl shadow-sm border border-gray-100 flex flex-col group hover:shadow-xl transition-all duration-300"
              >
                <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-50">
                  <img src={product?.images?.[0]} alt={product?.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                  <span className="absolute top-1 right-1 bg-black text-white text-[7px] md:text-[9px] font-black px-1.5 py-0.5 rounded-md shadow-sm">NEW</span>
                </div>
                <div className="p-1.5 md:p-2 flex flex-col flex-grow">
                  <h3 className="text-[9px] md:text-sm font-bold text-gray-800 line-clamp-1 mb-1 leading-tight">{product?.name}</h3>
                  <div className="mt-auto pt-1 border-t border-gray-50">
                    <p className="text-[#ff5722] font-black text-[10px] md:text-lg leading-none">৳{product?.price}</p>
                    <div className="bg-orange-50 rounded-md p-0.5 mt-1 border border-orange-100/50">
                      <p className="text-gray-600 text-[7px] md:text-[9px] font-bold text-center">
                        W: <span className="text-gray-900 font-black">৳{product?.wholesalePrice}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        {fetchingMore && <div className="text-center py-10"><div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-[#ff5722] border-r-transparent"></div></div>}
      </section>

    </div>
  );
}