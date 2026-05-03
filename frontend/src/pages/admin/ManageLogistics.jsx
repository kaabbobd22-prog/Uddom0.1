import { useState } from 'react';

export default function ManageLogistics() {
  const [activeTab, setActiveTab] = useState('Partners');

  const logisticsPartners = [
    { id: 1, name: 'Pathao Courier', coverage: 'Nationwide', type: 'Retail/B2B', status: 'Active', api: 'Connected' },
    { id: 2, name: 'Paperfly', coverage: 'Nationwide', type: 'Retail', status: 'Active', api: 'Connected' },
    { id: 3, name: 'UDDOM Express (Self)', coverage: 'Dhaka Metro', type: 'B2B/Bulk', status: 'Active', api: 'Native' },
    { id: 4, name: 'Sundarban Courier', coverage: 'Divisional', type: 'Manual', status: 'Maintenance', api: 'Disconnected' },
  ];

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-12 font-sans">
      {/* 1. Header Area */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-xl md:text-3xl font-black text-gray-900 uppercase tracking-tighter">Logistics Command</h1>
            <p className="text-[10px] md:text-xs text-gray-400 font-bold tracking-widest uppercase mt-1">Monitor delivery routes and courier partner performance</p>
          </div>
          <button className="bg-gray-900 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-black transition shadow-xl">
            + Connect New Partner
          </button>
        </div>
      </div>

      <div className="container mx-auto px-6 mt-8">

        {/* 2. Global Delivery Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'In-Transit Orders', value: '1,450', icon: '🚚', color: 'text-blue-600' },
            { label: 'Dhaka Metro Hub', value: '852', icon: '📍', color: 'text-[#ff5722]' },
            { label: 'Avg. Delivery Time', value: '2.4 Days', icon: '⏱️', color: 'text-green-600' },
            { label: 'RTO Rate (Returns)', value: '0.8%', icon: '🔄', color: 'text-red-500' },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
              <div className="text-xl mb-3">{stat.icon}</div>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
              <h3 className={`text-xl md:text-2xl font-black mt-1 ${stat.color}`}>{stat.value}</h3>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* 3. Partners Table (Left Column) */}
          <div className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-gray-100 overflow-hidden">
            <div className="p-8 border-b border-gray-50 flex justify-between items-center">
              <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest">Active Shipping Channels</h3>
              <div className="flex gap-2">
                <button onClick={() => setActiveTab('Partners')} className={`px-4 py-1.5 text-[10px] font-black rounded-lg ${activeTab === 'Partners' ? 'bg-gray-900 text-white' : 'text-gray-400'}`}>Partners</button>
                <button onClick={() => setActiveTab('Zones')} className={`px-4 py-1.5 text-[10px] font-black rounded-lg ${activeTab === 'Zones' ? 'bg-gray-900 text-white' : 'text-gray-400'}`}>Zones</button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  <tr>
                    <th className="py-5 px-8">Partner Name</th>
                    <th className="py-5 px-8">Coverage</th>
                    <th className="py-5 px-8">API Status</th>
                    <th className="py-5 px-8">Type</th>
                    <th className="py-5 px-8 text-right">Settings</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {logisticsPartners.map((partner) => (
                    <tr key={partner.id} className="hover:bg-gray-50/50 transition group">
                      <td className="py-5 px-8 text-xs font-black text-gray-800">{partner.name}</td>
                      <td className="py-5 px-8 text-xs text-gray-500 font-bold">{partner.coverage}</td>
                      <td className="py-5 px-8">
                        <span className={`text-[9px] font-black px-2 py-1 rounded-full ${partner.api === 'Connected' || partner.api === 'Native' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {partner.api}
                        </span>
                      </td>
                      <td className="py-5 px-8 text-[10px] font-bold text-gray-400 uppercase">{partner.type}</td>
                      <td className="py-5 px-8 text-right">
                        <button className="text-gray-300 group-hover:text-gray-900 transition text-lg">⚙️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 4. Shipping Rules & Rates (Right Column) */}
          <div className="space-y-8">
            {/* Global Rate Manager */}
            <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
              <h3 className="text-[10px] font-black opacity-40 uppercase tracking-widest mb-8">Shipping Rate Engine</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-[10px] font-bold uppercase mb-2">
                    <span>Dhaka Inside (Retail)</span>
                    <span className="text-[#ff5722]">৳60.00</span>
                  </div>
                  <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                    <div className="bg-[#ff5722] h-full w-[60%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] font-bold uppercase mb-2">
                    <span>Outside Dhaka (Retail)</span>
                    <span className="text-blue-400">৳120.00</span>
                  </div>
                  <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                    <div className="bg-blue-400 h-full w-[80%]"></div>
                  </div>
                </div>
                <hr className="border-white/5" />
                <p className="text-[10px] text-gray-400 font-medium leading-relaxed italic">
                  B2B Wholesale rates are calculated dynamically based on weight and truck size.
                </p>
                <button className="w-full bg-white text-gray-900 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest">Update Rates</button>
              </div>
              {/* Decoration */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#ff5722]/10 rounded-full blur-[60px]"></div>
            </div>

            {/* Live Delivery Pulse */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest">Delivery Pulse</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-[11px] font-bold">
                  <span className="text-gray-400">Dhaka Hub Load</span>
                  <span className="text-gray-800">72% Capacity</span>
                </div>
                <div className="flex justify-between items-center text-[11px] font-bold">
                  <span className="text-gray-400">Chittagong Hub Load</span>
                  <span className="text-orange-500">95% High</span>
                </div>
                <button className="w-full mt-4 text-[10px] font-black text-[#ff5722] uppercase tracking-widest hover:underline">Route Optimization →</button>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Truck/Bulk Booking (B2B Specialized) */}
        <div className="mt-8 bg-gradient-to-r from-[#ff5722] to-orange-600 rounded-[2.5rem] p-8 md:p-12 text-white shadow-xl shadow-orange-500/20 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="relative z-10 text-center md:text-left">
            <h2 className="text-xl md:text-3xl font-black mb-2 uppercase tracking-tighter italic">B2B Heavy Logistics 🏗️</h2>
            <p className="text-xs md:text-sm opacity-80 max-w-md font-medium">Manage truck fleet bookings and industrial shipments for verified manufacturers and wholesalers.</p>
          </div>
          <button className="relative z-10 bg-gray-900 text-white px-10 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-black shadow-2xl transition">
            Manage Bulk Fleet
          </button>
          <div className="absolute top-2 right-4 text-[7px] bg-white/20 px-2 py-0.5 rounded font-black tracking-[0.2em] uppercase">Enterprise Ops</div>
        </div>
      </div>
    </div>
  );
}