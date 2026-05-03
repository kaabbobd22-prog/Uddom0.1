import { useState } from 'react';

export default function AdminSettings() {
  const [activeSection, setActiveSection] = useState('General');

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-12 font-sans">
      {/* 1. Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-xl md:text-3xl font-black text-gray-900 uppercase tracking-tighter">System Configuration</h1>
            <p className="text-[10px] md:text-xs text-gray-400 font-bold tracking-widest uppercase mt-1">Global Marketplace Rules & Admin Security</p>
          </div>
          <button className="bg-[#ff5722] text-white px-8 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#e64a19] shadow-lg shadow-orange-200 transition">
            Apply Changes
          </button>
        </div>
      </div>

      <div className="container mx-auto px-6 mt-8 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* 2. Sidebar Navigation */}
          <div className="w-full lg:w-1/4 space-y-2">
            {['General', 'Commission & Fees', 'Payment Gateways', 'Security', 'Maintenance'].map((item) => (
              <button
                key={item}
                onClick={() => setActiveSection(item)}
                className={`w-full text-left px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeSection === item
                    ? 'bg-gray-900 text-white shadow-xl'
                    : 'bg-white text-gray-400 hover:bg-gray-50 border border-gray-100'
                  }`}
              >
                {item}
              </button>
            ))}
          </div>

          {/* 3. Main Settings Content */}
          <div className="flex-1 space-y-6">

            {/* Platform Rules Card */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-8 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                {activeSection} Settings
              </h3>

              {activeSection === 'General' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Marketplace Name</label>
                      <input type="text" defaultValue="UDDOM" className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:border-[#ff5722] outline-none" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Support Hotline</label>
                      <input type="text" defaultValue="+880 1234-567890" className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:border-[#ff5722] outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Platform Currency</label>
                    <select className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none">
                      <option>BDT (৳) - Bangladeshi Taka</option>
                      <option>USD ($) - US Dollar</option>
                    </select>
                  </div>
                </div>
              )}

              {activeSection === 'Commission & Fees' && (
                <div className="space-y-8">
                  <div className="p-6 bg-orange-50 rounded-2xl border border-orange-100">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-sm font-black text-orange-900 uppercase">Retail Commission</h4>
                      <span className="text-xl font-black text-[#ff5722]">10%</span>
                    </div>
                    <input type="range" className="w-full accent-[#ff5722]" />
                    <p className="text-[10px] text-orange-700 mt-2 font-medium italic">Applied to all individual product sales.</p>
                  </div>

                  <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-sm font-black text-blue-900 uppercase">Wholesale / B2B Fee</h4>
                      <span className="text-xl font-black text-blue-600">5%</span>
                    </div>
                    <input type="range" className="w-full accent-blue-600" />
                    <p className="text-[10px] text-blue-700 mt-2 font-medium italic">Applied to bulk orders and factory shipments.</p>
                  </div>
                </div>
              )}

              {activeSection === 'Security' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="text-xs font-black text-gray-800 uppercase">Two-Factor Authentication (2FA)</p>
                      <p className="text-[10px] text-gray-400">Force all admin accounts to use 2FA</p>
                    </div>
                    <div className="w-12 h-6 bg-green-500 rounded-full relative p-1 cursor-pointer">
                      <div className="w-4 h-4 bg-white rounded-full absolute right-1 shadow-sm"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="text-xs font-black text-gray-800 uppercase">Maintenance Mode</p>
                      <p className="text-[10px] text-gray-400">Lock the platform for scheduled updates</p>
                    </div>
                    <div className="w-12 h-6 bg-gray-300 rounded-full relative p-1 cursor-pointer">
                      <div className="w-4 h-4 bg-white rounded-full absolute left-1 shadow-sm"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Admin Profile Quick Access */}
            <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                <div className="w-20 h-20 bg-[#ff5722] rounded-3xl flex items-center justify-center text-3xl font-black shadow-2xl">I</div>
                <div className="text-center md:text-left">
                  <p className="text-[10px] font-black opacity-40 uppercase tracking-widest mb-1">Super Admin Account</p>
                  <h4 className="text-xl font-bold">Mohammed Irfanul Islam</h4>
                  <p className="text-xs text-gray-400 mt-1 italic">Last password change: 15 days ago</p>
                </div>
                <button className="md:ml-auto bg-white/10 border border-white/20 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition">Edit Profile</button>
              </div>
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[#ff5722]/10 rounded-full blur-[50px]"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}