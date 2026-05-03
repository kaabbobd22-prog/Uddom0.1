import { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import API from '../../api/axios';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get('/admin/stats');
        setStats(res.data);
      } catch (err) {
        console.error('Dashboard stats error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const adminData = JSON.parse(localStorage.getItem('adminData') || '{}');

  const kpis = stats ? [
    { label: 'Platform Revenue', value: `৳${(stats.totalRevenue || 0).toLocaleString()}`, trend: 'Total Paid Orders', icon: '📈' },
    { label: 'Active Sellers', value: stats.totalSellers?.toString() || '0', trend: `${stats.pendingSellers || 0} Pending`, icon: '🏪' },
    { label: 'Total Customers', value: stats.totalCustomers?.toString() || '0', trend: 'Registered Users', icon: '👥' },
    { label: 'Pending Payouts', value: `৳${(stats.pendingPayouts || 0).toLocaleString()}`, trend: 'Needs Distribution', icon: '💳' },
  ] : [];

  return (
    <AdminLayout>
      <div className="bg-[#f8fafc] min-h-screen pb-12 font-sans p-6">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-black text-gray-900">Good day, {adminData.name || 'Admin'} 👋</h1>
          <p className="text-xs text-gray-400 mt-1">Here's your platform overview</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-10 h-10 border-4 border-[#ff5722] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {kpis.map((stat, idx) => (
                <div key={idx} className="bg-white p-6 rounded-3xl shadow-xl shadow-gray-200/50 border border-white flex flex-col justify-between hover:scale-[1.02] transition-transform">
                  <div className="text-2xl mb-4">{stat.icon}</div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                    <h3 className="text-xl md:text-2xl font-black text-gray-900">{stat.value}</h3>
                  </div>
                  <p className={`text-[10px] mt-3 font-bold ${idx === 3 ? 'text-red-500' : 'text-green-500'}`}>
                    {stat.trend}
                  </p>
                </div>
              ))}
            </div>

            {/* Quick Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-orange-50 border border-orange-100 rounded-3xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">⏳</span>
                  <h3 className="font-black text-gray-800">Pending Approvals</h3>
                </div>
                <p className="text-3xl font-black text-[#ff5722]">{stats?.pendingSellers || 0}</p>
                <p className="text-xs text-gray-500 mt-1">Sellers waiting for verification</p>
                <a href="/admin/sellers" className="inline-block mt-3 text-[10px] font-black text-[#ff5722] uppercase tracking-widest hover:underline">Review Now →</a>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-3xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">📦</span>
                  <h3 className="font-black text-gray-800">Product Queue</h3>
                </div>
                <p className="text-3xl font-black text-blue-600">{stats?.pendingProducts || 0}</p>
                <p className="text-xs text-gray-500 mt-1">Products awaiting approval</p>
                <a href="/admin/products" className="inline-block mt-3 text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">Review Now →</a>
              </div>

              <div className="bg-green-50 border border-green-100 rounded-3xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">💰</span>
                  <h3 className="font-black text-gray-800">Payout Queue</h3>
                </div>
                <p className="text-3xl font-black text-green-600">৳{(stats?.pendingPayouts || 0).toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">Ready to distribute to sellers</p>
                <a href="/admin/payments" className="inline-block mt-3 text-[10px] font-black text-green-600 uppercase tracking-widest hover:underline">Pay Now →</a>
              </div>
            </div>

            {/* Platform Flow Info */}
            <div className="bg-gray-900 rounded-3xl p-8 text-white">
              <h3 className="text-sm font-black uppercase tracking-widest mb-6 text-gray-400">Platform Flow</h3>
              <div className="flex flex-wrap gap-4 items-center text-xs">
                {['Seller Registers', '→ Admin Approves Seller', '→ Seller Adds Product', '→ Admin Approves Product', '→ Customer Buys', '→ Admin Receives Payment', '→ Admin Pays Seller'].map((step, i) => (
                  <span key={i} className={`px-3 py-1.5 rounded-lg font-bold ${step.startsWith('→') ? 'text-gray-500 text-[10px]' : 'bg-[#ff5722] text-white'}`}>
                    {step}
                  </span>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}