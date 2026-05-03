import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../../api/axios'; 

export default function Checkout() {
  const navigate = useNavigate();
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('COD'); // Match Enum: 'COD'[cite: 1]
  const [isB2B, setIsB2B] = useState(false);

  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser) {
      navigate('/login');
      return;
    }
    setUser(storedUser);

    const userAddresses = storedUser.addresses || [];
    setAddresses(userAddresses);

    if (userAddresses.length > 0) {
      setSelectedAddress(userAddresses[0]._id || userAddresses[0].id);
    }

    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    if (storedCart.length === 0) {
      navigate('/cart');
    } else {
      setCartItems(storedCart);
    }
  }, [navigate]);

  const getQty = (item) => item.qty || item.quantity || 1;
  const getPrice = (item) => item.price || item.basePrice || 0;

  // Grouping logic for UI only - kept as is
  const groupedSellers = cartItems.reduce((acc, item) => {
    const sellerName = item.seller || 'Official UDDOM Seller';
    if (!acc[sellerName]) acc[sellerName] = { items: 0, shipping: 90 }; // Delivery Charge: 90[cite: 1]
    acc[sellerName].items += getQty(item);
    return acc;
  }, {});

  const orderSummary = {
    sellers: Object.keys(groupedSellers).map(name => ({
      name,
      items: groupedSellers[name].items,
      shipping: groupedSellers[name].shipping
    })),
    subtotal: cartItems.reduce((sum, item) => sum + (getPrice(item) * getQty(item)), 0),
  };

  // Fixed Delivery Logic
  const totalShipping = 90; // All over Bangladesh[cite: 1]
  const totalAmount = orderSummary.subtotal + totalShipping;

  const handlePlaceOrder = async () => {
    const deliveryAddress = addresses.find(a => (a._id || a.id) === selectedAddress);

    if (!deliveryAddress) {
      alert("❌ Please add and select a delivery address.");
      return;
    }

    // FINAL DATA MAPPING FOR BACKEND SCHEMA[cite: 1]
    const orderData = {
      orderID: `UDDOM-${Date.now()}`, // Required & Unique[cite: 1]
      customer: user?._id || user?.id, // Required[cite: 1]
      seller: cartItems[0]?.sellerID || "65f8a0e2e3d13f748c242650", // Required[cite: 1]
      products: cartItems.map(item => ({
        product: item.id || item._id, // Ref to Product[cite: 1]
        quantity: getQty(item), // Required[cite: 1]
        priceAtPurchase: getPrice(item), // Required[cite: 1]
        isWholesale: getPrice(item) < (item.basePrice || 100000) 
      })),
      totalAmount: totalAmount, // Required[cite: 1]
      shippingAddress: {
        name: deliveryAddress.name,
        address: deliveryAddress.address,
        phone: deliveryAddress.phone,
        type: deliveryAddress.type || "Home"
      }, // Required Object[cite: 1]
      paymentMethod: paymentMethod, // Enum: ['COD', 'Card', 'Bkash'][cite: 1]
      status: "Pending" // Default
    };

    try {
      const res = await API.post('/orders', orderData);

      if (res.data.success) {
        alert(`✅ Order Placed Successfully!`);
        localStorage.removeItem('cart');
        window.dispatchEvent(new Event('cartUpdated'));
        navigate(`/account/orders`);
      }
    } catch (error) {
      console.error("Order error:", error.response?.data || error.message);
      alert(`❌ Failed: ${error.response?.data?.message || "Check Backend Validation"}`);
    }
  };

  if (cartItems.length === 0 || !user) return null;

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Progress Header - Unchanged */}
      <div className="bg-white border-b border-gray-100 py-6 mb-8 md:mb-12 shadow-sm">
        <div className="container mx-auto px-4 flex items-center justify-center">
          <div className="flex items-center gap-2 md:gap-6 text-[9px] md:text-xs font-black uppercase tracking-widest">
            <Link to="/cart" className="text-gray-400 hover:text-[#ff5722] transition-colors">1. Cart</Link>
            <span className="text-gray-200">-----</span>
            <span className="text-[#ff5722] border-b-2 border-[#ff5722] pb-1">2. Checkout</span>
            <span className="text-gray-200">-----</span>
            <span className="text-gray-400">3. Payment</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-5xl font-black text-gray-900 uppercase italic tracking-tighter mb-8 md:mb-10 text-center md:text-left">
          Secure Checkout
        </h1>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
          <div className="w-full lg:w-2/3 space-y-8">
            {/* Contact Info */}
            <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-xl border-4 border-white">
              <div className="flex justify-between items-center mb-6 border-b border-gray-50 pb-4">
                <h2 className="text-lg md:text-2xl font-black text-gray-900 uppercase italic tracking-tighter flex items-center gap-3">
                  <span className="bg-[#ff5722] text-white w-8 h-8 rounded-xl flex items-center justify-center text-xs not-italic shadow-md">1</span>
                  Contact Info
                </h2>
                <span className="text-[10px] bg-green-50 text-green-600 font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">✓ Logged in</span>
              </div>
              <div className="pl-0 md:pl-11 text-xs md:text-sm text-gray-600 space-y-2 font-medium">
                <p><span className="font-black text-gray-900 uppercase tracking-wider mr-2">Name:</span> {user?.name}</p>
                <p><span className="font-black text-gray-900 uppercase tracking-wider mr-2">Email:</span> {user?.email}</p>
                <p><span className="font-black text-gray-900 uppercase tracking-wider mr-2">Phone:</span> {user?.phone || "Not provided"}</p>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-xl border-4 border-white">
              <h2 className="text-lg md:text-2xl font-black text-gray-900 uppercase italic tracking-tighter flex items-center gap-3 mb-6 border-b border-gray-50 pb-4">
                <span className="bg-[#ff5722] text-white w-8 h-8 rounded-xl flex items-center justify-center text-xs not-italic shadow-md">2</span>
                Shipping Address
              </h2>
              <div className="pl-0 md:pl-11 grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.length === 0 ? (
                  <div className="col-span-full bg-red-50 text-red-600 p-4 rounded-xl text-xs font-bold border border-red-100">
                    No addresses found. Please add one in your profile.
                  </div>
                ) : (
                  addresses.map((addr) => {
                    const addrId = addr._id || addr.id;
                    return (
                      <div
                        key={addrId}
                        onClick={() => setSelectedAddress(addrId)}
                        className={`border-2 rounded-[1.5rem] p-5 cursor-pointer transition-all duration-300 relative group ${selectedAddress === addrId ? 'border-[#ff5722] bg-orange-50 shadow-md' : 'border-gray-100 hover:border-orange-200 hover:bg-gray-50'}`}
                      >
                        {selectedAddress === addrId && (
                          <div className="absolute top-4 right-4 bg-[#ff5722] text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full shadow-md">✓</div>
                        )}
                        <div className="flex items-center gap-2 mb-3">
                          <span className="bg-gray-900 text-white text-[8px] font-black px-2.5 py-1 rounded-md uppercase tracking-widest shadow-sm">{addr.type || 'Home'}</span>
                        </div>
                        <p className="font-black text-sm text-gray-900 uppercase tracking-tight">{addr.name || user?.name}</p>
                        <p className="text-xs text-gray-600 mt-1.5 leading-relaxed font-medium">{addr.address}</p>
                        <p className="text-xs text-gray-500 mt-2 font-bold">{addr.phone || user?.phone}</p>
                      </div>
                    );
                  })
                )}
                <Link to="/account/profile" className="border-2 border-dashed border-gray-200 rounded-[1.5rem] p-5 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-[#ff5722] text-gray-400 group">
                  <span className="text-3xl mb-2">+</span>
                  <span className="text-[10px] font-black uppercase tracking-widest">Manage Addresses</span>
                </Link>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-xl border-4 border-white">
              <h2 className="text-lg md:text-2xl font-black text-gray-900 uppercase italic tracking-tighter flex items-center gap-3 mb-6 border-b border-gray-50 pb-4">
                <span className="bg-[#ff5722] text-white w-8 h-8 rounded-xl flex items-center justify-center text-xs not-italic shadow-md">3</span>
                Payment Method
              </h2>
              <div className="pl-0 md:pl-11 space-y-4">
                <label className={`flex items-center gap-4 p-5 border-2 rounded-[1.5rem] cursor-pointer ${paymentMethod === 'COD' ? 'border-[#ff5722] bg-orange-50 shadow-md' : 'border-gray-100'}`}>
                  <input type="radio" value="COD" checked={paymentMethod === 'COD'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-5 h-5 accent-[#ff5722]" />
                  <div className="flex-1">
                    <span className="font-black text-sm text-gray-900 uppercase tracking-tight">Cash on Delivery (COD)</span>
                    <p className="text-[10px] md:text-xs text-gray-500 font-medium">Pay with cash upon delivery.</p>
                  </div>
                  <div className="text-3xl">💵</div>
                </label>
                <label className={`flex items-center gap-4 p-5 border-2 rounded-[1.5rem] cursor-pointer ${paymentMethod === 'Bkash' ? 'border-[#ff5722] bg-orange-50 shadow-md' : 'border-gray-100'}`}>
                  <input type="radio" value="Bkash" checked={paymentMethod === 'Bkash'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-5 h-5 accent-[#ff5722]" />
                  <div className="flex-1">
                    <span className="font-black text-sm text-gray-900 uppercase tracking-tight">bKash / Nagad / Upay</span>
                    <p className="text-[10px] md:text-xs text-gray-500 font-medium">Fast and secure mobile payment.</p>
                  </div>
                  <div className="flex gap-1.5">
                    <div className="w-10 h-6 bg-pink-500 rounded-md text-white text-[8px] font-black uppercase flex items-center justify-center">bKash</div>
                    <div className="w-10 h-6 bg-orange-500 rounded-md text-white text-[8px] font-black uppercase flex items-center justify-center">Nagad</div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Summary */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-2xl border-4 border-white sticky top-32">
              <h2 className="text-lg md:text-xl font-black text-gray-900 uppercase italic tracking-tighter mb-6 border-b border-gray-100 pb-4">Review Order</h2>
              
              <div className="border-t border-gray-100 pt-6 mb-6 space-y-4 text-xs md:text-sm">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-500 uppercase tracking-widest text-[10px]">Subtotal</span>
                  <span className="font-black text-gray-900">৳{orderSummary.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-500 uppercase tracking-widest text-[10px]">Delivery Charge</span>
                  <span className="font-black text-gray-900">৳90</span>
                </div>
              </div>
              <div className="border-t-2 border-dashed border-gray-200 pt-6 flex justify-between items-end mb-8">
                <span className="text-sm font-black text-gray-400 uppercase tracking-widest">Total Pay</span>
                <span className="text-3xl md:text-4xl font-black text-[#ff5722] leading-none">৳{totalAmount.toLocaleString()}</span>
              </div>
              <button onClick={handlePlaceOrder} className="w-full bg-gray-900 hover:bg-[#ff5722] text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all">
                {paymentMethod === 'COD' ? 'Confirm Order (COD)' : 'Proceed to Pay'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}