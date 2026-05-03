import { useState, useEffect } from 'react';
import API from '../../api/axios'; 
import AdminLayout from '../../layouts/AdminLayout';

export default function ManageSellers() {
  const [activeTab, setActiveTab] = useState('All Sellers');
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  // ১. ডাটাবেস থেকে রিয়েল সেলারদের ফেচ করা
  const fetchSellers = async () => {
    try {
      setLoading(true);
      // ✅ ইন্টারসেপ্টর অটোমেটিক টোকেন বসিয়ে নেবে, তাই ম্যানুয়াল config দরকার নেই
      const res = await API.get('/admin/sellers'); 
      setSellers(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching sellers:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []); // ✅ ডিপেন্ডেন্সি অ্যারে থেকে token সরিয়ে দেওয়া হয়েছে

  // ২. সেলার অ্যাপ্রুভ করার ফাংশন
  const handleApprove = async (sellerId, storeName) => {
    const confirmApprove = window.confirm(`Are you sure you want to approve ${storeName}?`);
    if (!confirmApprove) return;

    try {
      // ✅ কোনো config পাস করার দরকার নেই
      await API.put(`/admin/sellers/approve/${sellerId}`, {});
      alert(`✅ ${storeName} has been verified and approved!`);
      // অ্যাপ্রুভ হওয়ার পর অটোমেটিক লিস্ট রিফ্রেশ করবে
      fetchSellers(); 
    } catch (error) {
      console.error("Approval error:", error);
      alert("Failed to approve seller. Check if you have admin access.");
    }
  };

  // ৩. ট্যাব অনুযায়ী ডাটা ফিল্টার করা
  const filteredSellers = sellers.filter(seller => {
    if (activeTab === 'All Sellers') return true;
    if (activeTab === 'Pending') return !seller.isApproved;
    if (activeTab === 'Verified') return seller.isApproved;
    if (activeTab === 'Manufacturers') return seller.businessType?.includes('Manufacturer');
    if (activeTab === 'Suspended') return seller.status === 'Suspended';
    return true;
  });

  return (
    <AdminLayout>
      <div className="bg-[#f8fafc] min-h-screen pb-12 font-sans">
        {/* Header Section */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
          <div className="container mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-xl md:text-3xl font-black text-gray-900 uppercase tracking-tighter">Merchant Control Center</h1>
              <p className="text-[10px] md:text-xs text-gray-400 font-bold tracking-widest uppercase mt-1">Verify and manage platform sellers & manufacturers</p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <input
                type="text"
                placeholder="Search by store name..."
                className="flex-1 md:w-64 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-xs focus:border-[#ff5722] outline-none"
              />
              <button className="bg-gray-900 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition">Audit Log</button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 mt-8">
          {/* Merchant KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Sellers', value: sellers.length, icon: '🏪', color: 'text-blue-600' },
              { label: 'Pending KYC', value: sellers.filter(s => !s.isApproved).length, icon: '📝', color: 'text-[#ff5722]' },
              { label: 'Verified', value: sellers.filter(s => s.isApproved).length, icon: '🏆', color: 'text-green-600' },
              { label: 'Flagged Stores', value: sellers.filter(s => s.status === 'Suspended').length, icon: '🚩', color: 'text-red-500' },
            ].map((stat, idx) => (
              <div key={idx} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
                <div className="text-xl mb-3">{stat.icon}</div>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                <h3 className={`text-xl md:text-2xl font-black mt-1 ${stat.color}`}>{stat.value}</h3>
              </div>
            ))}
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-6 border-b border-gray-200 mb-6 overflow-x-auto scrollbar-hide">
            {['All Sellers', 'Pending', 'Verified', 'Manufacturers', 'Suspended'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-xs font-black uppercase tracking-widest transition whitespace-nowrap border-b-2 ${activeTab === tab ? 'text-[#ff5722] border-[#ff5722]' : 'text-gray-400 border-transparent'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Table Area */}
          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  <tr>
                    <th className="py-5 px-8">Merchant & Owner</th>
                    <th className="py-5 px-8">Type</th>
                    <th className="py-5 px-8">Contact</th>
                    <th className="py-5 px-8">Joining Date</th>
                    <th className="py-5 px-8">Status</th>
                    <th className="py-5 px-8 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loading ? (
                    <tr><td colSpan="6" className="py-10 text-center text-gray-400 font-bold uppercase text-xs">Loading Sellers...</td></tr>
                  ) : filteredSellers.length === 0 ? (
                    <tr><td colSpan="6" className="py-10 text-center text-gray-400 font-bold uppercase text-xs">No sellers found.</td></tr>
                  ) : filteredSellers.map((seller) => (
                    <tr key={seller._id} className="hover:bg-gray-50/50 transition group">
                      <td className="py-5 px-8">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#ff5722]/10 text-[#ff5722] rounded-xl flex items-center justify-center text-xs font-black uppercase">
                            {/* ডাইনামিক স্টোর নেম */}
                            {(seller.storeName || "U").charAt(0)}
                          </div>
                          <div>
                            <p className="text-xs font-black text-gray-800">{seller.storeName || "Unnamed Store"}</p>
                            <p className="text-[10px] text-gray-400 font-medium">Owner: {seller.ownerName || "N/A"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 px-8">
                        <span className={`text-[9px] font-black px-2 py-1 rounded-md uppercase border ${seller.businessType?.includes('Manufacturer') ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-gray-100 text-gray-600 border-transparent'}`}>
                          {seller.businessType || 'Retailer'}
                        </span>
                      </td>
                      <td className="py-5 px-8 text-[10px] font-bold text-gray-600">
                        {seller.phone || seller.email}
                      </td>
                      <td className="py-5 px-8 text-[10px] font-bold text-gray-400 uppercase">
                        {new Date(seller.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-5 px-8">
                        <span className={`text-[9px] font-black px-2 py-1 rounded-full uppercase ${seller.isApproved ? 'bg-green-100 text-green-700' :
                          seller.status === 'Suspended' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700 animate-pulse'
                          }`}>
                          {seller.isApproved ? 'Verified' : 'Pending'}
                        </span>
                      </td>
                      <td className="py-5 px-8 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {/* Approve Button */}
                          {!seller.isApproved && (
                            <button
                              onClick={() => handleApprove(seller._id, seller.storeName || "this store")}
                              className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-green-700 transition shadow-md"
                            >
                              Approve
                            </button>
                          )}
                          <button className="bg-gray-900 text-white px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-black transition">Review</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}