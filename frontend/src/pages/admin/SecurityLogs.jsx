import { useState } from 'react';

export default function SecurityLogs() {
  const [activeFilter, setActiveFilter] = useState('Critical');

  const logs = [
    { id: 'LOG-4401', event: 'Brute Force Attempt', user: 'Unknown (103.45.2.1)', severity: 'Critical', time: '2 mins ago', action: 'IP Blocked' },
    { id: 'LOG-4402', event: 'Admin Password Change', user: 'Irfanul Islam', severity: 'Medium', time: '1 hour ago', action: 'Verified 2FA' },
    { id: 'LOG-4403', event: 'Bulk Export: Customer Data', user: 'Moderator_02', severity: 'High', time: '3 hours ago', action: 'Access Logged' },
    { id: 'LOG-4404', event: 'New Login: Unrecognized Device', user: 'Seller_452', severity: 'Medium', time: '5 hours ago', action: 'Email Sent' },
  ];

  return (
    <div className="bg-[#0f172a] min-h-screen pb-12 font-sans text-gray-300">
      {/* 1. Cyber Header */}
      <div className="bg-black/40 border-b border-white/10 sticky top-0 z-40 backdrop-blur-md">
        <div className="container mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-xl md:text-3xl font-black text-white uppercase tracking-tighter italic flex items-center gap-3">
              <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
              Security Infrastructure
            </h1>
            <p className="text-[10px] md:text-xs text-gray-500 font-bold tracking-widest uppercase mt-1">Real-time surveillance & threat mitigation</p>
          </div>
          <div className="flex gap-2">
            <button className="bg-red-600 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition shadow-lg shadow-red-900/20">
              Clear Cache
            </button>
            <button className="bg-white/10 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition border border-white/10">
              Export Audit
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 mt-8">
        
        {/* 2. Security KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Active Threats', value: '02', icon: '🛡️', color: 'text-red-500' },
            { label: 'Login Success', value: '99.8%', icon: '🔑', color: 'text-green-500' },
            { label: 'Blocked IPs', value: '1,420', icon: '🚫', color: 'text-gray-400' },
            { label: 'SSL Status', value: 'Secure', icon: '🔒', color: 'text-blue-400' },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white/5 p-6 rounded-3xl border border-white/10 shadow-sm backdrop-blur-sm">
              <div className="text-xl mb-4">{stat.icon}</div>
              <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{stat.label}</p>
              <h3 className={`text-xl md:text-2xl font-black mt-1 ${stat.color}`}>{stat.value}</h3>
            </div>
          ))}
        </div>

        {/* 3. Log Table */}
        <div className="bg-black/30 rounded-[2.5rem] shadow-2xl border border-white/5 overflow-hidden">
          <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
             <h3 className="text-xs font-black text-white uppercase tracking-widest">Real-time Security Feed</h3>
             <div className="flex gap-4">
                {['Critical', 'High', 'Medium'].map(level => (
                  <button 
                    key={level}
                    onClick={() => setActiveFilter(level)}
                    className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full transition ${activeFilter === level ? 'bg-red-500 text-white' : 'text-gray-500'}`}
                  >
                    {level}
                  </button>
                ))}
             </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white/5 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                <tr>
                  <th className="py-5 px-8">Event ID & Nature</th>
                  <th className="py-5 px-8">Origin / User</th>
                  <th className="py-5 px-8">Timestamp</th>
                  <th className="py-5 px-8">System Action</th>
                  <th className="py-5 px-8 text-right">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/5 transition group">
                    <td className="py-5 px-8">
                       <p className="text-xs font-black text-white">{log.event}</p>
                       <p className="text-[9px] text-gray-500 font-mono">{log.id}</p>
                    </td>
                    <td className="py-5 px-8">
                       <p className="text-xs font-bold text-gray-400">{log.user}</p>
                    </td>
                    <td className="py-5 px-8 text-[10px] font-bold text-gray-500 uppercase">{log.time}</td>
                    <td className="py-5 px-8">
                       <span className={`text-[9px] font-black px-2 py-1 rounded uppercase tracking-tighter ${
                         log.severity === 'Critical' ? 'bg-red-500/20 text-red-500 border border-red-500/20' : 
                         log.severity === 'High' ? 'bg-orange-500/20 text-orange-500 border border-orange-500/20' : 'bg-blue-500/20 text-blue-500 border border-blue-500/20'
                       }`}>
                         {log.action}
                       </span>
                    </td>
                    <td className="py-5 px-8 text-right">
                       <button className="text-[10px] font-black text-gray-500 hover:text-white transition uppercase border border-white/10 px-3 py-1 rounded-lg">Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. Threat Map & Firewall (Bottom) */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="md:col-span-2 bg-gradient-to-br from-gray-900 to-black rounded-[2.5rem] p-8 border border-white/5 relative overflow-hidden">
              <h4 className="text-xs font-black uppercase tracking-widest mb-6 opacity-40">Active Geo-Firewall</h4>
              <div className="h-48 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5">
                 <p className="text-gray-600 text-xs font-black uppercase tracking-[0.3em]">Traffic Heatmap Visualization Area</p>
              </div>
              <div className="flex justify-between mt-6">
                 <div className="text-center">
                    <p className="text-[9px] text-gray-500 uppercase font-black">Top Source</p>
                    <p className="text-sm font-bold text-white">Dhaka, BD</p>
                 </div>
                 <div className="text-center">
                    <p className="text-[9px] text-gray-500 uppercase font-black">Malicious Source</p>
                    <p className="text-sm font-bold text-red-500">Global Proxies</p>
                 </div>
                 <div className="text-center">
                    <p className="text-[9px] text-gray-500 uppercase font-black">Firewall Drop</p>
                    <p className="text-sm font-bold text-green-500">4.2k Hits</p>
                 </div>
              </div>
           </div>

           <div className="bg-[#ff5722] rounded-[2.5rem] p-8 text-white shadow-xl shadow-orange-900/20 flex flex-col justify-between relative overflow-hidden">
              <div className="relative z-10">
                <h4 className="text-sm font-black uppercase tracking-widest mb-2 italic">System Lockout</h4>
                <p className="text-[10px] opacity-80 leading-relaxed font-medium">In case of a detected database breach, use the Master Kill-Switch to take the entire platform offline instantly.</p>
              </div>
              <button className="relative z-10 mt-6 w-full bg-white text-red-600 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition shadow-2xl">
                Activate Kill-Switch
              </button>
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-black/10 rounded-full blur-[50px]"></div>
           </div>
        </div>
      </div>
    </div>
  );
}