import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../../api/axios';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState('');
  const [suggestedProducts, setSuggestedProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // ১. প্রোডাক্ট ডাটা ফেচ করা (পপুলেটেড সেলার সহ)
        const res = await API.get(`/products/${id}`);
        const data = res.data;
        setProduct(data);
        setActiveImage(data.images && data.images.length > 0 ? data.images[0] : '');

        // ২. ব্রাউজিং হিস্ট্রি ট্র্যাকিং (সাজেশনের জন্য)
        let history = JSON.parse(localStorage.getItem('view_history')) || [];
        if (data && data.category && !history.includes(data.category)) {
          history.push(data.category);
          if (history.length > 5) history.shift();
          localStorage.setItem('view_history', JSON.stringify(history));
        }

        // ৩. সাজেস্টেড প্রোডাক্ট ফেচ করা
        const prodRes = await API.get('/products');
        const allProducts = Array.isArray(prodRes.data) ? prodRes.data : prodRes.data.products || [];

        let suggested = allProducts
          .filter(p => p && p.category === data.category && p._id !== id)
          .sort(() => 0.5 - Math.random())
          .slice(0, 12);

        if (suggested.length < 12) {
          const others = allProducts
            .filter(p => p && p._id !== id && !suggested.find(s => s._id === p._id))
            .sort(() => 0.5 - Math.random())
            .slice(0, 12 - suggested.length);
          suggested = [...suggested, ...others];
        }
        setSuggestedProducts(suggested);
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
    window.scrollTo(0, 0);
  }, [id]);

  // প্রাইস ক্যালকুলেশন লজিক (হোলসেল চেক সহ)
  let currentPrice = product?.price || 0;
  if (product?.wholesalePrice && product.wholesalePrice > 0) {
    if (quantity >= 5 && quantity <= 19) currentPrice = product.wholesalePrice;
    else if (quantity >= 20) currentPrice = (product.wholesalePrice - 100);
  }

  const handleQtyChange = (type) => {
    if (type === 'minus' && quantity > 1) setQuantity(quantity - 1);
    if (type === 'plus' && quantity < (product?.stock || 100)) setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    if (!product) return;
    const cartItem = {
      id: product._id || id,
      name: product.name,
      price: currentPrice,
      quantity: quantity,
      image: activeImage,
      seller: product.seller?.storeName || product.seller?.name || "Official UDDOM Seller"
    };
    let existingCart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItemIndex = existingCart.findIndex(item => item.id === cartItem.id);
    if (existingItemIndex !== -1) {
      existingCart[existingItemIndex].quantity += quantity;
      existingCart[existingItemIndex].price = currentPrice;
    } else {
      existingCart.push(cartItem);
    }
    localStorage.setItem('cart', JSON.stringify(existingCart));
    window.dispatchEvent(new Event('cartUpdated'));
    alert('✅ Item added to cart successfully!');
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  if (loading) return <div className="text-center py-20 font-black uppercase text-gray-400 animate-pulse">Loading Product...</div>;
  if (!product) return <div className="text-center py-20 font-black text-red-500">Product Not Found!</div>;

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-3 text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-widest">
        <Link to="/" className="hover:text-[#ff5722]">Home</Link> <span className="mx-1">{'>'}</span>
        <Link to="/categories" className="hover:text-[#ff5722]">{product.category}</Link> <span className="mx-1">{'>'}</span>
        <span className="text-gray-800">{product.name}</span>
      </div>

      <div className="container mx-auto px-4">
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-4 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-10">
            
            {/* Image Gallery */}
            <div className="w-full md:w-2/5 shrink-0">
              <div className="aspect-square rounded-3xl border border-gray-100 overflow-hidden mb-4 bg-gray-50 relative shadow-inner">
                <img src={activeImage} alt="Product" className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
              </div>
              <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                {product.images?.map((img, idx) => (
                  <button key={idx} onClick={() => setActiveImage(img)} className={`w-16 h-16 md:w-24 md:h-24 shrink-0 rounded-2xl border-2 overflow-hidden transition-all ${activeImage === img ? 'border-[#ff5722] scale-95' : 'border-transparent opacity-60'}`}>
                    <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="w-full md:w-3/5 flex flex-col">
              <div className="border-b border-gray-50 pb-6 mb-6">
                <h1 className="text-xl md:text-4xl font-black text-gray-900 leading-tight mb-4 uppercase italic tracking-tighter">
                  {product.name}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-[10px] md:text-xs font-black uppercase tracking-widest">
                  <span className="text-yellow-500">★ 4.8 Rating</span>
                  <span className={`px-3 py-1 rounded-full ${product.stock > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                    {product.stock > 0 ? `In Stock (${product.stock} pcs)` : 'Out of Stock'}
                  </span>
                </div>
              </div>

              <div className="mb-8">
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2">Current Price:</p>
                <div className="flex items-end gap-3">
                  <span className="text-4xl md:text-6xl font-black text-[#ff5722] leading-none">৳{currentPrice}</span>
                </div>
              </div>

              {/* Wholesale Tiers (Conditional) */}
              {product.wholesalePrice > 0 && (
                <div className="bg-gray-50 rounded-[2rem] border border-gray-100 p-4 md:p-6 mb-8">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Wholesale Tiers</h3>
                  <div className="grid grid-cols-3 gap-3">
                    <div className={`p-4 rounded-2xl text-center border-2 ${quantity < 5 ? 'bg-white border-[#ff5722]' : 'bg-gray-100'}`}>
                      <p className="text-[9px] font-black uppercase">1-4 pcs</p>
                      <p className="text-sm font-black">৳{product.price}</p>
                    </div>
                    <div className={`p-4 rounded-2xl text-center border-2 ${quantity >= 5 && quantity <= 19 ? 'bg-white border-[#ff5722]' : 'bg-gray-100'}`}>
                      <p className="text-[9px] font-black uppercase">5-19 pcs</p>
                      <p className="text-sm font-black">৳{product.wholesalePrice}</p>
                    </div>
                    <div className={`p-4 rounded-2xl text-center border-2 ${quantity >= 20 ? 'bg-white border-[#ff5722]' : 'bg-gray-100'}`}>
                      <p className="text-[9px] font-black uppercase">20+ pcs</p>
                      <p className="text-sm font-black">৳{product.wholesalePrice - 100}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="flex items-center bg-gray-100 rounded-2xl p-1.5 h-14 w-40">
                  <button onClick={() => handleQtyChange('minus')} className="w-12 h-full font-black">-</button>
                  <input type="number" value={quantity} readOnly className="w-full text-center bg-transparent font-black" />
                  <button onClick={() => handleQtyChange('plus')} className="w-12 h-full font-black">+</button>
                </div>
                <button onClick={handleAddToCart} className="flex-1 bg-[#ff5722] text-white rounded-2xl font-black uppercase tracking-widest shadow-xl">Add to Cart</button>
                <button onClick={handleBuyNow} className="flex-1 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl">Buy Now</button>
              </div>

              {/* Dynamic Seller Info */}
              <div className="mt-auto border-t border-gray-50 pt-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-900 text-white rounded-2xl flex items-center justify-center font-black text-xl">
                    {(product.seller?.storeName || product.seller?.name || "U").charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs md:text-sm font-black text-gray-900 uppercase italic">
                      {product.seller?.storeName || product.seller?.name || "Official UDDOM Seller"}
                    </p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Verified Wholesaler • Dhaka</p>
                  </div>
                </div>
                <Link to={`/store/${product.seller?._id || ''}`} className="text-[#ff5722] text-[10px] font-black uppercase tracking-widest border-2 border-[#ff5722] px-5 py-2.5 rounded-xl">
                  Visit Store
                </Link>
              </div>

            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-6 md:p-10 mb-8">
          <h2 className="text-sm md:text-xl font-black text-gray-900 uppercase italic mb-6 border-b border-gray-50 pb-4">Product Specification</h2>
          <p className="bg-gray-50 p-6 rounded-3xl border-l-4 border-[#ff5722] italic text-gray-600 font-medium leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Suggestions */}
        <section className="py-6">
          <h2 className="text-sm md:text-xl font-black text-gray-900 uppercase italic mb-6">Suggested For You</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
            {suggestedProducts.map((p) => (
              <Link to={`/product/${p?._id}`} key={p?._id} className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 flex flex-col group hover:shadow-md transition-all duration-300">
                <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-50">
                  <img src={p?.images?.[0]} alt={p?.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                </div>
                <div className="p-2 flex flex-col flex-grow">
                  <h3 className="text-[10px] md:text-sm font-bold text-gray-800 line-clamp-1 mb-1">{p?.name}</h3>
                  <p className="text-[#ff5722] font-black text-xs md:text-lg leading-none mt-auto">৳{p?.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}