import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../../api/axios'; // ✅ axios er bodole API instance auto-import hobe

export default function MyOrders() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // ব্যাকএন্ড থেকে ডাটা ফেচ করা
  useEffect(() => {
    const fetchOrders = async () => {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      // storedUser theke id mapping fix
      const userId = storedUser?._id || storedUser?.id;

      if (!userId) {
        navigate('/login');
        return;
      }

      try {
        // API instance use kora hoyechhe jate localhost error na hoy
        const res = await API.get(`/orders/user/${userId}`);
        setOrders(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setLoading(false);
      }
    };
    fetchOrders();
  }, [navigate]);

  // স্ট্যাটাস অনুযায়ী ট্যাবগুলো
  const tabs = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  // অ্যাকটিভ ট্যাব অনুযায়ী অর্ডার ফিল্টার করা
  const filteredOrders = activeTab === 'All'
    ? orders
    : orders.filter(order => order.status === activeTab);

  if (loading) return <div className="text-center py-20 font-black uppercase tracking-widest text-gray-400 animate-pulse">Loading Your Orders...</div>;

  return (
    <div className="bg-gray-50 min-h-screen pb-16">

      {/* 1. Header */}
      <div className="bg-white border-b border-gray-100 py-8 md:py-12 shadow-sm">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 uppercase italic tracking-tighter">My Orders</h1>
          <p className="text-xs md:text-sm font-bold text-gray-400 uppercase tracking-widest mt-2">Track & manage your recent purchases</p>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8 max-w-4xl">

        {/* 2. Status Tabs */}
        <div className="flex gap-6 md:gap-8 border-b border-gray-200 mb-8 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-[10px] md:text-xs font-black uppercase tracking-widest transition whitespace-nowrap ${activeTab === tab
                ? 'text-[#ff5722] border-b-4 border-[#ff5722]'
                : 'text-gray-400 hover:text-gray-900'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* 3. Orders List */}
        <div className="space-y-6">
          {filteredOrders.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-[2.5rem] shadow-xl border-4 border-white flex flex-col items-center">
              <div className="text-6xl mb-6 drop-shadow-md">📦</div>
              <h2 className="text-xl md:text-2xl font-black text-gray-900 uppercase italic tracking-tighter mb-2">No orders found</h2>
              <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest mb-8">You haven't placed any orders in this category yet.</p>
              <Link to="/" className="bg-gray-900 text-white px-8 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-[#ff5722] transition-all active:scale-95">
                Start Shopping
              </Link>
            </div>
          ) : (
            filteredOrders.map((order) => {
              // অর্ডারের মোট আইটেম সংখ্যা (Backend products array consistency check)
              const totalItemsCount = order.products?.reduce((sum, item) => sum + item.quantity, 0) || 0;
              
              // অর্ডারের প্রথম প্রোডাক্টের ছবি (Backend populate structure onujayi mapping)
              const displayImage = order.products?.[0]?.product?.images?.[0] || 'https://placehold.co/150';

              return (
                <div key={order._id} className="bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-xl border-4 border-white overflow-hidden hover:shadow-2xl transition-all duration-300">
                  {/* Order Top Bar */}
                  <div className="bg-gray-50 px-5 md:px-8 py-4 border-b border-gray-100 flex flex-wrap justify-between items-center gap-3">
                    <div className="flex items-center gap-3 md:gap-4">
                      <span className="text-[10px] md:text-xs font-black text-gray-900 uppercase tracking-widest bg-white px-3 py-1.5 rounded-lg shadow-sm border border-gray-100">
                        ID: {order.orderID || order._id.substring(order._id.length - 8)}
                      </span>
                      <span className="text-[9px] md:text-[10px] font-bold text-gray-500 uppercase tracking-widest hidden sm:inline">
                        {new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] md:text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-sm border ${order.status === 'Delivered' ? 'bg-green-50 text-green-600 border-green-100' :
                        order.status === 'Shipped' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                          order.status === 'Cancelled' ? 'bg-red-50 text-red-600 border-red-100' :
                            'bg-orange-50 text-[#ff5722] border-orange-100'
                        }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Order Content */}
                  <div className="p-5 md:p-8 flex flex-col md:flex-row gap-5 md:gap-6 items-start md:items-center">
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-50 rounded-2xl overflow-hidden border-2 border-gray-100 shrink-0">
                      <img src={displayImage} alt="Product" className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1 w-full">
                      <p className="text-sm md:text-lg font-black text-gray-900 uppercase italic tracking-tighter mb-1">
                        {totalItemsCount} {totalItemsCount > 1 ? 'Items' : 'Item'} Purchased
                      </p>
                      <p className="text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-widest">
                        Total Amount: <span className="font-black text-[#ff5722] text-sm md:text-base ml-1">৳{order.totalAmount?.toLocaleString()}</span>
                      </p>
                      <div className="mt-3 flex gap-2">
                        <span className="text-[8px] md:text-[9px] bg-gray-100 text-gray-600 px-2 py-1 rounded-md font-black uppercase tracking-widest">
                          {order.totalAmount > 5000 ? 'Wholesale Order' : 'Retail Order'}
                        </span>
                        <span className="text-[8px] md:text-[9px] bg-gray-100 text-gray-600 px-2 py-1 rounded-md font-black uppercase tracking-widest">
                          {order.paymentMethod || 'COD'}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-row md:flex-col gap-3 w-full md:w-auto shrink-0 mt-2 md:mt-0">
                      <Link
                        to={`/track/${order._id}`}
                        className="flex-1 md:flex-none text-center bg-gray-900 text-white px-5 py-3 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest hover:bg-[#ff5722] transition-colors shadow-md"
                      >
                        Details
                      </Link>
                      {order.status === 'Delivered' && (
                        <button className="flex-1 md:flex-none text-center border-2 border-[#ff5722] text-[#ff5722] px-5 py-2.5 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest hover:bg-orange-50 transition-colors">
                          Review
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Sponsored Ad Slot */}
        <div className="mt-12 relative w-full h-24 md:h-32 rounded-[2.5rem] overflow-hidden shadow-xl border-4 border-white group">
          <img
            src="https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&w=1200&q=80"
            className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
            alt="Ad Banner"
          />
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center p-4">
            <h3 className="text-white text-xs md:text-xl font-black uppercase italic tracking-tighter mb-1">Download UDDOM Mobile App</h3>
            <p className="text-[9px] md:text-[10px] font-bold text-gray-200 uppercase tracking-widest text-center">Get ৳50 cashback on your next app order! <button className="underline text-[#ff5722] ml-1">Install Now</button></p>
          </div>
          <div className="absolute top-3 right-4 bg-white/90 text-gray-600 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full shadow-sm">
            Sponsored
          </div>
        </div>

      </div>
    </div>
  );
}