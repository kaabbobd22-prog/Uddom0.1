import { useState } from 'react';

export default function ManageAds() {
  const [activeFilter, setActiveFilter] = useState('Active');

  const adCampaigns = [
    { id: 'ADS-9920', seller: "Irfan's Tech Solutions", type: 'Homepage Banner', budget: '৳15,000', status: 'Active', clicks: '2.4k' },
    { id: 'ADS-9915', seller: 'Dhaka Wholesale Ltd', type: 'Product Boost', budget: '৳5,000', status: 'Pending Review', clicks: '0' },
    { id: 'ADS-9880', seller: 'Apex Retail', type: 'Search Results', budget: '৳2,500', status: 'Paused', clicks: '850' },
  ];

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-12 font-sans">
      {/* 1. Header & Controls */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-xl md:text-3xl font-black text-gray-900 uppercase tracking-tighter">Global Ad Manager</h1>
            <p className="text-[10px] md:text-xs text-gray-400 font-bold tracking-widest uppercase mt-1">Monitor & approve platform-wide advertising campaigns</p>
          </div>
          <div className="flex gap-2">
            <button className="bg-gray-900 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition shadow-lg">
              + System Banner
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 mt-8">
        
        {/* 2. Ad Performance Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Active Ads', value: '142', icon: '🚀', color: 'text-green-600' },
            { label: 'Pending Approval', value: '08', icon: '⏳', color: 'text-orange-500' },
            { label: 'Total Ad Revenue', value: '৳2.4L', icon: '💰', color: 'text-gray-900' },
            { label: 'Avg. CTR', value: '4.2%', icon: '🖱️', color: 'text-blue-600' },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
              <div className="text-xl mb-3">{stat.icon}</div>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
              <h3 className={`text-xl md:text-2xl font-black mt-1 ${stat.color}`}>{stat.value}</h3>
            </div>
          ))}
        </div>

        {/* 3. Filter Tabs */}
        <div className="flex gap-6 border-b border-gray-200 mb-6 overflow-x-auto scrollbar-hide">
          {['All Campaigns', 'Active', 'Pending Review', 'Paused', 'Rejected'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`pb-3 text-xs font-black uppercase tracking-widest transition whitespace-nowrap border-b-2 ${
                activeFilter === tab ? 'text-[#ff5722] border-[#ff5722]' : 'text-gray-400 border-transparent'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* 4. Campaigns Table */}
        <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/40 border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <tr>
                  <th className="py-5 px-8">Ad ID & Seller</th>
                  <th className="py-5 px-8">Placement Type</th>
                  <th className="py-5 px-8">Budget</th>
                  <th className="py-5 px-8">Clicks/CTR</th>
                  <th className="py-5 px-8">Status</th>
                  <th className="py-5 px-8 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {adCampaigns.map((ad) => (
                  <tr key={ad.id} className="hover:bg-gray-50/50 transition group">
                    <td className="py-5 px-8">
                      <p className="text-xs font-black text-gray-800">{ad.id}</p>
                      <p className="text-[10px] text-[#ff5722] font-bold">{ad.seller}</p>
                    </td>
                    <td className="py-5 px-8">
                      <span className="text-[10px] font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded-md">{ad.type}</span>
                    </td>
                    <td className="py-5 px-8 text-xs font-black text-gray-900">{ad.budget}</td>
                    <td className="py-5 px-8">
                      <p className="text-xs font-bold text-gray-800">{ad.clicks}</p>
                      <p className="text-[9px] text-gray-400">Clicks total</p>
                    </td>
                    <td className="py-5 px-8">
                      <span className={`text-[9px] font-black px-2 py-1 rounded-full uppercase ${
                        ad.status === 'Active' ? 'bg-green-100 text-green-700' : 
                        ad.status === 'Pending Review' ? 'bg-orange-100 text-orange-700 animate-pulse' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {ad.status}
                      </span>
                    </td>
                    <td className="py-5 px-8 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="bg-gray-900 text-white p-2 rounded-lg text-[10px] hover:bg-black transition">Review</button>
                        <button className="bg-white border border-gray-200 text-gray-400 p-2 rounded-lg text-[10px] hover:text-red-500 transition">✕</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 5. Internal Ad Space Manager (Mockup) */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden">
              <h4 className="text-sm font-black uppercase tracking-widest mb-2 opacity-60">Homepage Hero Banner</h4>
              <p className="text-xl font-bold mb-6">Current Slot: <span className="italic">"Eid-ul-Adha Bulk Deals"</span></p>
              <div className="flex gap-3">
                 <button className="bg-white text-blue-700 px-4 py-2 rounded-xl text-[10px] font-black uppercase">Edit Content</button>
                 <button className="bg-white/10 border border-white/20 px-4 py-2 rounded-xl text-[10px] font-black uppercase">Analytics</button>
              </div>
              <div className="absolute top-4 right-4 text-[8px] bg-green-400 text-gray-900 px-2 py-0.5 rounded font-black">LIVE NOW</div>
           </div>

           <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white shadow-xl border border-white/5">
              <h4 className="text-sm font-black uppercase tracking-widest mb-2 opacity-40">Ad Placement Slots</h4>
              <div className="space-y-3 mt-4">
                 <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400">Search Results Top</span>
                    <span className="text-green-400 font-bold">12 Available</span>
                 </div>
                 <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400">Category Sidebar</span>
                    <span className="text-orange-400 font-bold">2 Slots Left</span>
                 </div>
                 <hr className="border-white/5 my-4" />
                 <button className="w-full bg-white/5 hover:bg-white/10 border border-white/10 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition">Manage All Inventory</button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}