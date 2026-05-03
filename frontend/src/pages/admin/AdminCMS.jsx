import { useState } from 'react';

export default function AdminDashboard() {
   const adminStats = [
      { label: 'Platform GMV', value: '৳45.2L', change: '+22%', icon: '📊' },
      { label: 'Active Sellers', value: '1,240', change: '+12 New', icon: '🏪' },
      { label: 'Total Customers', value: '85.4K', change: '+1.5K', icon: '👥' },
      { label: 'Pending Payouts', value: '৳1.8L', change: 'Urgent', icon: '💳' },
   ];

   const pendingSellers = [
      { id: 1, name: 'Dhaka Wholesale Ltd', category: 'Industrial', date: '27 April 2026', status: 'Pending' },
      { id: 2, name: 'Apex Retail Store', category: 'Clothing', date: '26 April 2026', status: 'In Review' },
   ];

   return (
      <div className="bg-gray-100 min-h-screen pb-12">
         {/* 1. Admin Header */}
         <div className="bg-gray-900 text-white shadow-lg">
            <div className="container mx-auto px-6 py-6 flex justify-between items-center">
               <div>
                  <h1 className="text-xl md:text-3xl font-black tracking-tighter">UDDOM ADMIN<span className="text-[#ff5722]">.</span></h1>
                  <p className="text-[10px] uppercase font-bold tracking-[0.3em] opacity-50">Master Control Panel</p>
               </div>
               <div className="flex items-center gap-4">
                  <div className="text-right hidden md:block">
                     <p className="text-xs font-black">Irfanul Islam</p>
                     <p className="text-[10px] opacity-50">Super Admin</p>
                  </div>
                  <div className="w-10 h-10 bg-[#ff5722] rounded-xl flex items-center justify-center font-bold">A</div>
               </div>
            </div>
         </div>

         <div className="container mx-auto px-6 -mt-6">

            {/* 2. Admin Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
               {adminStats.map((stat, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
                     <div className="text-2xl mb-3">{stat.icon}</div>
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">{stat.label}</p>
                     <h3 className="text-xl md:text-2xl font-black text-gray-900 mt-2">{stat.value}</h3>
                     <p className={`text-[10px] mt-2 font-bold ${idx === 3 ? 'text-red-500' : 'text-green-500'}`}>
                        {stat.change}
                     </p>
                  </div>
               ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

               {/* 3. Global Sales Monitor (Large Chart Area) */}
               <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                     <div className="flex justify-between items-center mb-8">
                        <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">Platform Revenue Growth</h3>
                        <div className="flex gap-2">
                           <button className="bg-gray-900 text-white px-4 py-1.5 rounded-lg text-[10px] font-bold">Daily</button>
                           <button className="bg-gray-100 text-gray-500 px-4 py-1.5 rounded-lg text-[10px] font-bold">Monthly</button>
                        </div>
                     </div>
                     <div className="h-72 bg-gray-50 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-200">
                        <p className="text-gray-400 text-xs font-bold italic tracking-wide">Dynamic Admin Analytics View</p>
                     </div>
                  </div>

                  {/* Recent Global Transactions */}
                  <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                     <div className="p-6 border-b border-gray-50 bg-gray-50/50">
                        <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">Global Transactions</h3>
                     </div>
                     <div className="overflow-x-auto">
                        <table className="w-full text-left">
                           <thead className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase">
                              <tr>
                                 <th className="py-4 px-6">Order ID</th>
                                 <th className="py-4 px-6">Seller</th>
                                 <th className="py-4 px-6">Revenue</th>
                                 <th className="py-4 px-6">Comm. (10%)</th>
                                 <th className="py-4 px-6">Status</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-gray-50">
                              {[1, 2, 3, 4].map((i) => (
                                 <tr key={i} className="hover:bg-gray-50/50 transition">
                                    <td className="py-4 px-6 text-xs font-bold">#ORD-550{i}</td>
                                    <td className="py-4 px-6 text-xs text-gray-600">Store Unit {i}</td>
                                    <td className="py-4 px-6 text-xs font-black">৳12,000</td>
                                    <td className="py-4 px-6 text-xs text-green-600 font-bold">৳1,200</td>
                                    <td className="py-4 px-6">
                                       <span className="text-[9px] font-black px-2 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-100">Settled</span>
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  </div>
               </div>

               {/* 4. Sidebar: Seller Approvals & System Health */}
               <div className="space-y-6">
                  {/* Seller Onboarding Queue */}
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                     <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest mb-6">Seller Approval Queue</h3>
                     <div className="space-y-6">
                        {pendingSellers.map((seller) => (
                           <div key={seller.id} className="flex flex-col gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                              <div className="flex justify-between items-start">
                                 <div>
                                    <p className="text-xs font-black text-gray-800">{seller.name}</p>
                                    <p className="text-[9px] text-gray-400 mt-0.5">{seller.category} • {seller.date}</p>
                                 </div>
                                 <span className="text-[8px] bg-orange-100 text-orange-600 px-2 py-0.5 rounded font-black">{seller.status}</span>
                              </div>
                              <div className="flex gap-2 mt-2">
                                 <button className="flex-1 bg-gray-900 text-white py-1.5 rounded-lg text-[10px] font-bold hover:bg-black">Review</button>
                                 <button className="flex-1 bg-white border border-gray-200 text-gray-400 py-1.5 rounded-lg text-[10px] font-bold hover:text-red-500">Reject</button>
                              </div>
                           </div>
                        ))}
                     </div>
                     <button className="w-full mt-6 text-xs font-black text-[#ff5722] hover:underline">View All Requests →</button>
                  </div>

                  {/* System Health */}
                  <div className="bg-gray-900 rounded-3xl p-6 text-white overflow-hidden relative">
                     <h3 className="text-xs font-black opacity-40 uppercase tracking-widest mb-6">System Health</h3>
                     <div className="space-y-4">
                        <div className="flex justify-between items-center text-[11px]">
                           <span>Server Load</span>
                           <span className="text-green-400 font-bold">12% Normal</span>
                        </div>
                        <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                           <div className="bg-green-400 h-full w-[12%]"></div>
                        </div>
                        <div className="flex justify-between items-center text-[11px]">
                           <span>API Latency</span>
                           <span className="text-green-400 font-bold">45ms</span>
                        </div>
                        <hr className="border-white/10" />
                        <p className="text-[10px] text-gray-400 italic">Database backup completed: 4h ago</p>
                     </div>
                     <div className="absolute top-2 right-4 text-[7px] bg-[#ff5722] px-2 py-0.5 rounded font-black">STABLE</div>
                  </div>

                  {/* Admin Custom Message (Internal Ads) */}
                  <div className="bg-orange-50 p-6 rounded-3xl border border-orange-100">
                     <p className="text-[10px] font-black text-orange-800 uppercase mb-2 tracking-widest">Internal Memo 📝</p>
                     <p className="text-[11px] text-orange-700 leading-relaxed font-medium">
                        Campaign 'Eid Wholesale Dhamaka' starts in 48h. Ensure all featured seller banners are approved.
                     </p>
                  </div>
               </div>

            </div>
         </div>
      </div>
   );
}