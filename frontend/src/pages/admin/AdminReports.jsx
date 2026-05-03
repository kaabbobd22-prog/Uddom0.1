import { useState } from 'react';

export default function AdminReport() {
  const [reportType, setReportType] = useState('Revenue');

  const globalStats = [
    { label: 'Total Platform GMV', value: '৳1.2Cr', growth: '+32%', icon: '💎' },
    { label: 'Net Commission', value: '৳12.5L', growth: '+15%', icon: '🏦' },
    { label: 'Active Subscription', value: '৳45K', growth: '+8%', icon: '🚀' },
    { label: 'Refund Rate', value: '1.2%', growth: '-0.5%', icon: '🔄' },
  ];

  const topSellers = [
    { id: 1, name: "Irfan's Tech Solutions", sales: '৳12.4L', commission: '৳1.24L', rating: 4.9 },
    { id: 2, name: "Dhaka Fashion Hub", sales: '৳8.2L', commission: '৳82K', rating: 4.7 },
    { id: 3, name: "Grocery Giant BD", sales: '৳5.5L', commission: '৳55K', rating: 4.5 },
  ];

  return (
    <div className="bg-[#f1f5f9] min-h-screen pb-12 font-sans">
      {/* 1. Admin Header & Global Controls */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-xl md:text-3xl font-black text-gray-900 uppercase tracking-tighter italic">Platform Intelligence</h1>
            <p className="text-[10px] md:text-xs text-gray-400 font-bold tracking-widest uppercase mt-1">Global performance and financial audit</p>
          </div>
          <div className="flex gap-3">
             <button className="bg-gray-900 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition">Download Audit (PDF)</button>
             <button className="bg-white border border-gray-200 text-gray-600 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition">Custom Range</button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 mt-8">
        
        {/* 2. Global KPIs Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {globalStats.map((stat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-[2rem] border border-white shadow-xl shadow-blue-900/5">
              <div className="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center text-xl mb-4">{stat.icon}</div>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-xl md:text-2xl font-black text-gray-900">{stat.value}</h3>
              <div className={`mt-3 text-[10px] font-bold ${stat.growth.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                {stat.growth} <span className="text-gray-300 ml-1">vs prev. cycle</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* 3. Deep Analytics View (Left Column) */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
               <div className="flex justify-between items-center mb-10">
                  <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest">Marketplace Volume Distribution</h3>
                  <div className="flex gap-4">
                     <span className="flex items-center gap-2 text-[10px] font-bold text-gray-400"><span className="w-2 h-2 bg-[#ff5722] rounded-full"></span> Wholesale</span>
                     <span className="flex items-center gap-2 text-[10px] font-bold text-gray-400"><span className="w-2 h-2 bg-blue-500 rounded-full"></span> Retail</span>
                  </div>
               </div>
               
               <div className="h-80 md:h-96 bg-gray-50 rounded-3xl flex items-center justify-center border-2 border-dashed border-gray-200 relative overflow-hidden group">
                  <div className="absolute inset-0 opacity-10 flex items-end justify-between px-10 gap-3">
                     {Array.from({ length: 20 }).map((_, i) => (
                       <div key={i} className="bg-gray-900 w-full rounded-t-lg" style={{ height: `${10 + Math.random() * 90}%` }}></div>
                     ))}
                  </div>
                  <div className="z-10 text-center">
                    <p className="text-gray-400 text-xs font-black uppercase tracking-[0.2em]">Platform Intelligence Visualizer</p>
                    <p className="text-[9px] text-gray-300 mt-2">Aggregate data from 12k+ active nodes</p>
                  </div>
               </div>
            </div>

            {/* Merchant Performance Ranking */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
               <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                  <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest">Top Performing Merchants</h3>
                  <button className="text-[10px] font-bold text-blue-600 hover:underline">Full Leaderboard</button>
               </div>
               <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                       <tr>
                          <th className="py-5 px-8">Merchant Details</th>
                          <th className="py-5 px-8">Gross Sales</th>
                          <th className="py-5 px-8">Comm. Earned</th>
                          <th className="py-5 px-8">Rating</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                       {topSellers.map((seller) => (
                         <tr key={seller.id} className="hover:bg-gray-50/50 transition group">
                            <td className="py-5 px-8">
                               <p className="text-xs font-black text-gray-800 group-hover:text-[#ff5722] transition">{seller.name}</p>
                               <p className="text-[9px] text-gray-400 mt-0.5 uppercase font-bold tracking-tighter">Verified Manufacturer</p>
                            </td>
                            <td className="py-5 px-8 text-xs font-black text-gray-900">{seller.sales}</td>
                            <td className="py-5 px-8 text-xs font-bold text-green-600">{seller.commission}</td>
                            <td className="py-5 px-8">
                               <div className="flex items-center gap-1 text-[10px] font-black text-yellow-500">
                                  ★ <span className="text-gray-800">{seller.rating}</span>
                               </div>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                  </table>
               </div>
            </div>
          </div>

          {/* 4. Actionable Insights (Right Column) */}
          <div className="space-y-8">
             {/* Category Performance */}
             <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white shadow-2xl">
                <h3 className="text-[10px] font-black opacity-40 uppercase tracking-widest mb-8">Category Heatmap</h3>
                <div className="space-y-6">
                   {[
                     { name: 'Electronics', value: 45, color: 'bg-[#ff5722]' },
                     { name: 'Grocery', value: 25, color: 'bg-green-400' },
                     { name: 'Wholesale Garments', value: 20, color: 'bg-blue-400' },
                     { name: 'Others', value: 10, color: 'bg-gray-600' }
                   ].map((cat, i) => (
                     <div key={i}>
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-2">
                           <span>{cat.name}</span>
                           <span>{cat.value}%</span>
                        </div>
                        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                           <div className={`${cat.color} h-full`} style={{ width: `${cat.value}%` }}></div>
                        </div>
                     </div>
                   ))}
                </div>
             </div>

             {/* System Fraud Monitoring */}
             <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-red-100 relative overflow-hidden">
                <div className="relative z-10">
                   <div className="flex items-center gap-2 mb-4 text-red-500">
                      <span className="animate-pulse">🚨</span>
                      <h3 className="text-xs font-black uppercase tracking-widest">Fraud Alert Monitor</h3>
                   </div>
                   <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
                     <span className="text-red-600 font-bold">03</span> flagged transactions detected in the last 24h. Manual review recommended for Wholesale Batch #UDY-BATCH-99.
                   </p>
                   <button className="mt-6 w-full bg-red-50 text-red-600 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-100 transition">Inspect Security Logs</button>
                </div>
             </div>

             {/* Platform Optimization Tip */}
             <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-8 text-white shadow-xl shadow-blue-500/20">
                <p className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-2">Internal Optimization</p>
                <h4 className="text-lg font-bold italic leading-tight">Scale Your B2B Operations 🏭</h4>
                <p className="text-xs mt-3 opacity-80 leading-relaxed font-medium">Wholesale inquiries are up by 40% in Chittagong Division. Consider adjusting regional ad multipliers.</p>
                <button className="mt-6 bg-white text-blue-700 w-full py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-50 transition">Adjust Ad Settings</button>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}