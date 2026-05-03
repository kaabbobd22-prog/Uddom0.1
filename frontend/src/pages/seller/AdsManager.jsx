import { useState } from 'react';
import SellerLayout from '../../layouts/SellerLayout'; // পাথটি আপনার ফোল্ডার স্ট্রাকচার অনুযায়ী চেক করে নিন

export default function AdsManager() {
  const [activeTab, setActiveTab] = useState('Campaigns');

  const stats = [
    { label: 'Total Spent', value: '৳12,450', icon: '💸' },
    { label: 'Impressions', value: '45.2K', icon: '👁️' },
    { label: 'Clicks', value: '3,120', icon: '🖱️' },
    { label: 'ROI (Revenue)', value: '৳85,000', icon: '📈' },
  ];

  const campaigns = [
    { id: 1, name: 'Flash Sale Boost - Headphones', status: 'Active', budget: '৳2,000', spent: '৳850', type: 'Product Boost' },
    { id: 2, name: 'Wholesale Awareness May', status: 'Paused', budget: '৳5,000', spent: '৳1,200', type: 'Banner Ad' },
    { id: 3, name: 'Grocery Essentials Promo', status: 'Completed', budget: '৳1,500', spent: '৳1,500', type: 'Search Ad' },
  ];

  return (
    <SellerLayout>
      <div className="bg-gray-50 min-h-screen pb-12">
        {/* 1. Dashboard Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl md:text-3xl font-black text-gray-900 uppercase italic tracking-tighter leading-none">Ads Manager</h1>
              <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest mt-2">Boost your products and store visibility</p>
            </div>
            <button className="bg-black text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#ff5722] shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2">
              <span className="text-sm">+</span> New Campaign
            </button>
          </div>
        </div>

        <div className="container mx-auto px-4 mt-8 max-w-7xl">

          {/* 2. Quick Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white p-6 rounded-[2rem] border-2 border-white shadow-sm hover:shadow-xl hover:border-[#ff5722]/20 transition-all duration-300">
                <div className="text-3xl mb-4">{stat.icon}</div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                <h3 className="text-xl md:text-2xl font-black text-gray-900 mt-1">{stat.value}</h3>
              </div>
            ))}
          </div>

          {/* 3. Campaign Controls */}
          <div className="bg-white rounded-[2.5rem] shadow-sm border-2 border-white overflow-hidden">
            <div className="flex border-b-2 border-gray-50 overflow-x-auto scrollbar-hide">
              {['Campaigns', 'Ad Creative', 'Analytics'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-8 py-5 text-[10px] md:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                    activeTab === tab 
                      ? 'text-[#ff5722] border-b-4 border-[#ff5722] bg-orange-50/50' 
                      : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="p-6 md:p-8">
              {/* Campaign Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b-2 border-gray-50">
                      <th className="pb-5 px-4">Campaign Info</th>
                      <th className="pb-5 px-4">Status</th>
                      <th className="pb-5 px-4">Type</th>
                      <th className="pb-5 px-4">Budget</th>
                      <th className="pb-5 px-4">Spent</th>
                      <th className="pb-5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {campaigns.map((camp) => (
                      <tr key={camp.id} className="hover:bg-gray-50/80 transition duration-300">
                        <td className="py-5 px-4">
                          <p className="text-xs md:text-sm font-black text-gray-900 uppercase tracking-tight">{camp.name}</p>
                          <p className="text-[9px] text-gray-400 font-bold tracking-widest uppercase mt-1">ID: #CAM-00{camp.id}</p>
                        </td>
                        <td className="py-5 px-4">
                          <span className={`text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${
                            camp.status === 'Active' ? 'bg-green-100 text-green-700' :
                            camp.status === 'Paused' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-500'
                          }`}>
                            {camp.status}
                          </span>
                        </td>
                        <td className="py-5 px-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                          {camp.type}
                        </td>
                        <td className="py-5 px-4 text-xs md:text-sm font-black text-gray-900">{camp.budget}</td>
                        <td className="py-5 px-4 text-xs md:text-sm font-bold text-gray-500">{camp.spent}</td>
                        <td className="py-5 px-4 text-right">
                          <button className="bg-gray-100 w-8 h-8 rounded-lg text-gray-400 hover:bg-black hover:text-white font-bold transition">⋮</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* 4. Help Section for Sellers */}
          <div className="mt-8 bg-black rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden group">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="max-w-xl">
                <span className="bg-[#ff5722] text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-[0.2em] mb-4 inline-block">Pro Tip</span>
                <h2 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter leading-none mb-4">Grow Your Sales with Ads</h2>
                <p className="text-xs text-gray-400 font-medium leading-relaxed">
                  Promoted products receive <strong className="text-white">3x more clicks</strong> and <strong className="text-white">2x more wholesale inquiries</strong>. Set your budget and only pay when customers click.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 shrink-0">
                <button className="bg-white text-black px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#ff5722] hover:text-white transition-all shadow-xl">
                  View Tutorials
                </button>
                <button className="bg-transparent border-2 border-white/20 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-white transition-all">
                  Talk to Expert
                </button>
              </div>
            </div>
            
            {/* Background Graphic */}
            <div className="absolute top-0 right-0 w-64 h-full bg-[#ff5722] opacity-10 skew-x-12 translate-x-10 group-hover:scale-110 transition-transform duration-700"></div>
          </div>
          
        </div>
      </div>
    </SellerLayout>
  );
}