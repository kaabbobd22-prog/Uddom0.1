import { useState } from 'react';

export default function ManagePayment() {
  const [activeTab, setActiveTab] = useState('Withdrawals');

  const payouts = [
    { id: 'PAY-8820', seller: "Irfan's Tech Solutions", amount: '৳45,000', method: 'DBBL Bank', date: '27 April 2026', status: 'Pending' },
    { id: 'PAY-8815', seller: 'Global Garments Ltd', amount: '৳1,20,000', method: 'bKash Business', date: '26 April 2026', status: 'Processing' },
    { id: 'PAY-8810', seller: 'Organic Valley', amount: '৳8,500', method: 'City Bank', date: '26 April 2026', status: 'Completed' },
  ];

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-12 font-sans">
      {/* 1. Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-xl md:text-3xl font-black text-gray-900 uppercase tracking-tighter italic">Financial Treasury</h1>
            <p className="text-[10px] md:text-xs text-gray-400 font-bold tracking-widest uppercase mt-1">Manage gateway settlements and merchant payouts</p>
          </div>
          <div className="flex gap-2">
            <button className="bg-green-600 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-green-700 transition shadow-lg">
              Batch Release
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 mt-8">
        
        {/* 2. Global Cashflow Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Platform Balance', value: '৳85.2L', icon: '🏦', color: 'text-gray-900' },
            { label: 'Pending Payouts', value: '৳4.8L', icon: '🕒', color: 'text-orange-500' },
            { label: 'Gateway Reserves', value: '৳12.4L', icon: '🛡️', color: 'text-blue-600' },
            { label: 'Net Revenue', value: '৳2.1L', icon: '📈', color: 'text-green-600' },
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
          {['Withdrawals', 'Gateway Logs', 'Refunds', 'Tax Records'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-xs font-black uppercase tracking-widest transition whitespace-nowrap border-b-2 ${
                activeTab === tab ? 'text-[#ff5722] border-[#ff5722]' : 'text-gray-400 border-transparent'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* 4. Payout Table */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <tr>
                  <th className="py-5 px-8">Payout ID & Seller</th>
                  <th className="py-5 px-8">Amount</th>
                  <th className="py-5 px-8">Method</th>
                  <th className="py-5 px-8">Request Date</th>
                  <th className="py-5 px-8">Status</th>
                  <th className="py-5 px-8 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {payouts.map((pay) => (
                  <tr key={pay.id} className="hover:bg-gray-50/50 transition group">
                    <td className="py-5 px-8">
                      <p className="text-xs font-black text-gray-800">{pay.id}</p>
                      <p className="text-[10px] text-[#ff5722] font-bold">{pay.seller}</p>
                    </td>
                    <td className="py-5 px-8 text-xs font-black text-gray-900">{pay.amount}</td>
                    <td className="py-5 px-8">
                      <span className="text-[10px] font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded-md">{pay.method}</span>
                    </td>
                    <td className="py-5 px-8 text-[10px] font-bold text-gray-400 uppercase">{pay.date}</td>
                    <td className="py-5 px-8">
                      <span className={`text-[9px] font-black px-2 py-1 rounded-full uppercase ${
                        pay.status === 'Completed' ? 'bg-green-100 text-green-700' : 
                        pay.status === 'Pending' ? 'bg-orange-100 text-orange-700 animate-pulse' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {pay.status}
                      </span>
                    </td>
                    <td className="py-5 px-8 text-right">
                       <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="bg-gray-900 text-white px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-black transition">Approve</button>
                          <button className="bg-white border border-gray-200 text-gray-400 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest hover:text-red-500 transition">Hold</button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 5. Gateway Health & Settings */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-black uppercase tracking-[0.2em] opacity-40 mb-6">Gateway Status</h4>
                <div className="space-y-3">
                   <div className="flex justify-between items-center text-[11px] font-bold">
                      <span className="text-gray-400">bKash Merchant</span>
                      <span className="text-green-400">Online</span>
                   </div>
                   <div className="flex justify-between items-center text-[11px] font-bold">
                      <span className="text-gray-400">Nagad Business</span>
                      <span className="text-green-400">Online</span>
                   </div>
                   <div className="flex justify-between items-center text-[11px] font-bold">
                      <span className="text-gray-400">SSL Commerz</span>
                      <span className="text-orange-400">Latent (240ms)</span>
                   </div>
                </div>
              </div>
              <button className="mt-6 bg-white/5 border border-white/10 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition">Gateway Settings</button>
           </div>

           <div className="md:col-span-2 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
              <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest mb-6">Auto-Settlement Rules</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-4">
                    <div className="flex justify-between items-center">
                       <p className="text-[10px] font-bold text-gray-500 uppercase">Settlement Period</p>
                       <span className="text-xs font-black text-gray-800 italic">T+3 Days</span>
                    </div>
                    <div className="w-full bg-gray-100 h-1 rounded-full">
                       <div className="bg-[#ff5722] h-full w-[70%]"></div>
                    </div>
                    <p className="text-[9px] text-gray-400 leading-relaxed font-medium">Funds are released to sellers 3 days after successful delivery confirmation to handle potential returns.</p>
                 </div>
                 <div className="flex items-center justify-center border-l border-gray-50 pl-8">
                    <div className="text-center">
                       <p className="text-[9px] font-black text-gray-400 uppercase mb-2">Automated Payouts</p>
                       <div className="w-12 h-6 bg-green-500 rounded-full relative p-1 cursor-pointer mx-auto">
                          <div className="w-4 h-4 bg-white rounded-full absolute right-1 shadow-sm"></div>
                       </div>
                       <p className="text-[9px] text-green-600 font-bold mt-2">Enabled for B2B Partners</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}