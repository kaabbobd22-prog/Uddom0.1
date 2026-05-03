import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import sellerAPI from '../../utils/sellerAxios';
import SellerLayout from '../../layouts/SellerLayout';

export default function SellerDashboard() {
  const [stats, setStats] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const sellerData = JSON.parse(localStorage.getItem('sellerData')) || {};

  useEffect(() => {
    const token = localStorage.getItem('sellerToken');
    if (!token) { navigate('/seller/login'); return; }

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsRes, ordersRes] = await Promise.all([
          sellerAPI.get('/seller/stats'),
          sellerAPI.get('/seller/orders/recent')
        ]);

        setStats([
          { label: 'Total Sales',     value: `৳${statsRes.data.totalSales?.toLocaleString() || 0}`, change: '+12%',            icon: '💰' },
          { label: 'Pending Orders',  value: statsRes.data.pendingOrders || '0',                     change: 'Action Required', icon: '📦' },
          { label: 'Total Products',  value: statsRes.data.totalProducts || '0',                     change: 'Live',            icon: '🛍️' },
          { label: 'Store Rating',    value: statsRes.data.rating || 'N/A',                          change: 'Excellent',       icon: '⭐' },
        ]);

        setRecentOrders(ordersRes.data);
      } catch (error) {
        console.error("Dashboard Data Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  if (loading) return (
    <SellerLayout>
      <div className="flex items-center justify-center h-screen font-black uppercase text-gray-400 animate-pulse">
        Initializing Command Center...
      </div>
    </SellerLayout>
  );

  return (
    <SellerLayout>
      <div className="bg-gray-50 min-h-screen pb-12">

        {/* 1. Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 pt-6 px-4">
          <div>
            <h1 className="text-xl md:text-3xl font-black text-gray-900 uppercase italic tracking-tighter leading-none">
              Seller Command Center
            </h1>
            <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest mt-2">
              Performance Insights for <span className="text-[#ff5722]">{sellerData.storeName || "Your Store"}</span>
            </p>
          </div>
          <div className="flex gap-3">
            <Link to="/seller/products" className="bg-[#ff5722] text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-black transition-all active:scale-95">
              + New Product
            </Link>
          </div>
        </div>

        <div className="container mx-auto px-4">
          {/* 2. Key Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white p-6 rounded-[2rem] border-2 border-white shadow-sm hover:shadow-xl hover:border-[#ff5722]/20 transition-all duration-300">
                <div className="text-3xl mb-4">{stat.icon}</div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                <h3 className="text-xl md:text-2xl font-black text-gray-900 mt-1">{stat.value}</h3>
                <p className={`text-[9px] font-black mt-2 uppercase tracking-tight ${idx === 1 ? 'text-orange-500' : 'text-green-500'}`}>
                  {stat.change}
                </p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* 3. Left Column: Analytics & Orders */}
            <div className="lg:col-span-2 space-y-8">

              {/* Sales Overview Chart (Placeholder) */}
              <div className="bg-white p-8 rounded-[2.5rem] border-2 border-white shadow-sm">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-sm md:text-lg font-black text-gray-900 uppercase italic tracking-tight">Sales Analytics</h3>
                  <select className="text-[10px] font-black border-2 border-gray-100 rounded-xl px-4 py-2 uppercase outline-none focus:border-[#ff5722]">
                    <option>Last 30 Days</option>
                    <option>Yearly View</option>
                  </select>
                </div>
                <div className="h-64 bg-gray-50 rounded-[2rem] flex items-center justify-center border-4 border-dashed border-gray-100">
                  <p className="text-gray-300 text-[10px] font-black uppercase tracking-[0.2em]">Data Visualization Ready</p>
                </div>
              </div>

              {/* Real Order List from API */}
              <div className="bg-white rounded-[2.5rem] border-2 border-white shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                  <h3 className="text-sm md:text-lg font-black text-gray-900 uppercase italic tracking-tight">Recent Orders</h3>
                  <Link to="/seller/orders" className="text-[#ff5722] text-[10px] font-black uppercase tracking-widest border-b-2 border-[#ff5722]">View All</Link>
                </div>
                <div className="divide-y divide-gray-50">
                  {recentOrders.length > 0 ? recentOrders.map((order) => (
                    <div key={order._id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition duration-300">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-xl shadow-inner">📦</div>
                        <div>
                          <p className="text-xs md:text-sm font-black text-gray-900 uppercase tracking-tight">Order #{order.orderID || order._id.slice(-6)}</p>
                          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                            {order.paymentMethod || 'COD'} • {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs md:text-sm font-black text-gray-900">৳{order.totalAmount?.toLocaleString()}</p>
                        <span className={`text-[8px] px-3 py-1 rounded-full font-black uppercase tracking-tighter inline-block mt-1 ${
                          order.status === 'Pending' ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  )) : (
                    <div className="p-10 text-center text-gray-400 font-black uppercase text-xs">No orders found.</div>
                  )}
                </div>
              </div>
            </div>

            {/* 4. Right Column: B2B & Ads */}
            <div className="space-y-8">

              {/* Wholesale Inquiry Alert */}
              <div className="bg-black rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
                <div className="relative z-10">
                  <span className="bg-[#ff5722] text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-[0.2em]">Live B2B Inquiry</span>
                  <h3 className="text-2xl font-black mt-6 italic tracking-tighter uppercase leading-none">Trade In BD Corp.</h3>
                  <p className="text-xs text-gray-400 mt-3 font-medium">Requested quote for <span className="text-white font-black">500 units</span> of Wireless Headphones.</p>
                  <Link to="/seller/inquiry" className="block w-full text-center bg-white text-black mt-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#ff5722] hover:text-white transition-all duration-300">
                    Respond to Quote
                  </Link>
                </div>
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
              </div>

              {/* Ad Performance Sidebar */}
              <div className="bg-white p-8 rounded-[2.5rem] border-2 border-white shadow-sm">
                <h3 className="text-sm font-black text-gray-900 uppercase italic tracking-tight mb-6">Ad Performance</h3>
                <div className="space-y-5">
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Active Ads</p>
                    <p className="text-xs font-black text-gray-900">02</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Wallet</p>
                    <p className="text-xs font-black text-green-600">৳2,400</p>
                  </div>
                  <hr className="border-gray-50" />
                  <Link to="/seller/ads" className="block text-center border-2 border-gray-100 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest text-gray-400 hover:border-black hover:text-black transition-all">
                    Manage Campaigns
                  </Link>
                </div>
              </div>

              {/* Sponsored Support Ad */}
              <div className="bg-orange-50 rounded-[2.5rem] p-8 border-2 border-orange-100 relative group overflow-hidden">
                <div className="absolute top-0 right-0 bg-white text-orange-200 text-[8px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-widest">Partner Ad</div>
                <h4 className="text-lg font-black text-orange-900 uppercase italic tracking-tighter">Boost Visibility!</h4>
                <p className="text-[10px] text-orange-700 mt-2 font-bold leading-relaxed uppercase tracking-tight">Join our "Super Seller" program to get 0% commission on your first 10 wholesale orders.</p>
                <button className="mt-6 text-[#ff5722] text-[10px] font-black uppercase tracking-widest border-b-2 border-[#ff5722] hover:bg-[#ff5722] hover:text-white transition-all">Apply Now →</button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </SellerLayout>
  );
}
