import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Cart() {
  // Local storage theke data load kora
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const parsed = JSON.parse(savedCart);
      return parsed.map(item => ({
        id: item.id || item._id, // Backend _id support korar jonno
        seller: item.seller || 'Official UDDOM Seller',
        sellerID: item.sellerID || item.seller_id || "65f...default_id", // Path `seller` is required fix
        name: item.name,
        img: item.image || item.img || 'https://placehold.co/150x150/f8fafc/334155?text=Product',
        basePrice: item.price || item.basePrice || 0,
        tiers: item.tiers || [],
        qty: item.quantity || item.qty || 1
      }));
    }
    return [];
  });

  // Storage update ebong event dispatch
  useEffect(() => {
    const cartToSave = cartItems.map(item => ({
      id: item.id,
      seller: item.seller,
      sellerID: item.sellerID, // Validation error fix korar jonno
      name: item.name,
      image: item.img,
      price: item.basePrice,
      tiers: item.tiers,
      quantity: item.qty
    }));
    localStorage.setItem('cart', JSON.stringify(cartToSave));
    window.dispatchEvent(new Event('cartUpdated')); 
  }, [cartItems]);

  // Dynamic Price Calculator
  const getActivePrice = (item, currentQty) => {
    let price = item.basePrice;
    if (item.tiers && item.tiers.length > 0) {
      const applicableTiers = [...item.tiers].sort((a, b) => b.min - a.min);
      for (let tier of applicableTiers) {
        if (currentQty >= tier.min) {
          price = tier.price;
          break;
        }
      }
    }
    return price;
  };

  const handleQtyChange = (id, type) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        let newQty = type === 'plus' ? item.qty + 1 : item.qty - 1;
        if (newQty < 1) newQty = 1;
        return { ...item, qty: newQty };
      }
      return item;
    }));
  };

  const handleRemove = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  // Grouping by Seller
  const groupedCart = cartItems.reduce((acc, item) => {
    if (!acc[item.seller]) acc[item.seller] = [];
    acc[item.seller].push(item);
    return acc;
  }, {});

  const subtotal = cartItems.reduce((sum, item) => sum + (getActivePrice(item, item.qty) * item.qty), 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const shippingEstimate = cartItems.length > 0 ? 120 : 0; 

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      
      {/* Checkout Progress */}
      <div className="bg-white border-b border-gray-100 py-6 mb-8 md:mb-10 shadow-sm">
        <div className="container mx-auto px-4 flex items-center justify-center">
          <div className="flex items-center gap-2 md:gap-6 text-[9px] md:text-xs font-black uppercase tracking-widest">
            <span className="text-[#ff5722] border-b-2 border-[#ff5722] pb-1">1. Cart</span>
            <span className="text-gray-200">-----</span>
            <span className="text-gray-400">2. Checkout</span>
            <span className="text-gray-200">-----</span>
            <span className="text-gray-400">3. Payment</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-5xl font-black text-gray-900 uppercase italic tracking-tighter mb-8 md:mb-10 text-center md:text-left">
          Shopping Cart <span className="text-[#ff5722]">({totalItems})</span>
        </h1>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">

          <div className="w-full lg:w-2/3 space-y-8">
            {Object.keys(groupedCart).length === 0 ? (
              <div className="bg-white p-12 text-center rounded-[2.5rem] shadow-xl border-4 border-white flex flex-col items-center">
                <div className="text-6xl mb-6 drop-shadow-md">🛒</div>
                <h2 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter mb-2">Your cart is empty</h2>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-8">Looks like you haven't added anything yet.</p>
                <Link to="/" className="bg-gray-900 text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-[#ff5722] transition-all active:scale-95">
                  Start Shopping
                </Link>
              </div>
            ) : (
              Object.entries(groupedCart).map(([sellerName, items]) => (
                <div key={sellerName} className="bg-white rounded-[2.5rem] shadow-xl border-4 border-white overflow-hidden">
                  <div className="bg-gray-50 px-6 py-5 border-b border-gray-100 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-900 text-white rounded-xl flex items-center justify-center font-black italic shadow-md">U</div>
                      <h3 className="text-sm md:text-lg font-black text-gray-900 uppercase tracking-tighter italic">{sellerName}</h3>
                    </div>
                  </div>

                  <div className="p-4 md:p-6 flex flex-col gap-2">
                    {items.map((item) => {
                      const currentPrice = getActivePrice(item, item.qty);
                      const isWholesale = currentPrice < item.basePrice;

                      return (
                        <div key={item.id} className="flex flex-col sm:flex-row gap-5 py-5 border-b border-gray-50 last:border-0 last:pb-0">
                          <div className="w-24 h-24 md:w-32 md:h-32 shrink-0 bg-gray-50 rounded-2xl overflow-hidden border-2 border-gray-100 relative group">
                            <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          </div>

                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <Link to={`/product/${item.id}`} className="text-xs md:text-base font-black text-gray-900 hover:text-[#ff5722] uppercase italic tracking-tighter line-clamp-2 mb-2 transition-colors">
                                {item.name}
                              </Link>
                              {isWholesale ? (
                                <span className="inline-block bg-orange-50 text-[#ff5722] text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md mb-3 shadow-sm border border-orange-100">
                                  ✓ Wholesale Applied
                                </span>
                              ) : (
                                <span className="inline-block text-gray-400 text-[8px] md:text-[9px] font-bold uppercase tracking-widest mb-3">
                                  Retail (Add {item.tiers?.[0]?.min ? item.tiers[0].min - item.qty : 'more'} for Wholesale)
                                </span>
                              )}
                            </div>

                            <div className="flex items-center justify-between mt-auto">
                              <div className="flex items-center bg-gray-50 rounded-xl h-10 w-28 border border-gray-100">
                                <button onClick={() => handleQtyChange(item.id, 'minus')} className="w-8 h-full flex items-center justify-center text-gray-900 font-black hover:bg-white rounded-lg transition">-</button>
                                <input type="text" value={item.qty} readOnly className="w-full h-full text-center text-[10px] font-black text-gray-900 focus:outline-none bg-transparent" />
                                <button onClick={() => handleQtyChange(item.id, 'plus')} className="w-8 h-full flex items-center justify-center text-gray-900 font-black hover:bg-white rounded-lg transition">+</button>
                              </div>
                              <button onClick={() => handleRemove(item.id)} className="text-red-500 hover:text-red-700 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-colors">
                                🗑️ <span className="hidden sm:inline">Remove</span>
                              </button>
                            </div>
                          </div>

                          <div className="sm:w-32 sm:text-right flex flex-row sm:flex-col justify-between sm:justify-start items-center sm:items-end">
                            <div className="text-right">
                              <p className="text-lg md:text-2xl font-black text-[#ff5722] leading-none tracking-tighter">৳{(currentPrice * item.qty).toLocaleString()}</p>
                              <p className="text-[9px] md:text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1.5">৳{currentPrice.toLocaleString()} / pc</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Order Summary Section */}
          {cartItems.length > 0 && (
            <div className="w-full lg:w-1/3">
              <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-2xl border-4 border-white sticky top-32">
                <h2 className="text-lg md:text-xl font-black text-gray-900 uppercase italic tracking-tighter mb-6 border-b border-gray-100 pb-4">Order Summary</h2>

                <div className="space-y-4 text-xs md:text-sm text-gray-600 mb-6 border-b border-gray-100 pb-6">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-500 uppercase tracking-widest text-[10px]">Subtotal ({totalItems} items)</span>
                    <span className="font-black text-gray-900">৳{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-500 uppercase tracking-widest text-[10px]">Shipping Estimate</span>
                    <span className="font-black text-gray-900">৳{shippingEstimate}</span>
                  </div>
                </div>

                <div className="flex justify-between items-end mb-8">
                  <span className="text-sm font-black text-gray-400 uppercase tracking-widest">Total Pay</span>
                  <span className="text-3xl md:text-4xl font-black text-[#ff5722] tracking-tighter leading-none">৳{(subtotal + shippingEstimate).toLocaleString()}</span>
                </div>

                <Link to="/checkout" className="w-full flex items-center justify-center bg-[#ff5722] hover:bg-gray-900 text-white py-4 rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-[0.2em] transition-all duration-300 shadow-xl active:scale-95">
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}