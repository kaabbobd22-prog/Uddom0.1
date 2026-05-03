import { useState } from 'react';

export default function MyCoupons() {
  const [activeTab, setActiveTab] = useState('active');

  const coupons = [
    { id: 1, code: 'WELCOME100', desc: 'Flat ৳100 Off on your first order', status: 'active', expiry: '30 May 2026', type: 'Retail' },
    { id: 2, code: 'BULKSAVE10', desc: '10% Discount on Bulk Orders over ৳50,000', status: 'active', expiry: '15 June 2026', type: 'Wholesale' },
    { id: 3, code: 'FREESHIP', desc: 'Free Delivery on Grocery items', status: 'active', expiry: '10 May 2026', type: 'Grocery' },
    { id: 4, code: 'UDDOMOLD', desc: 'Used for April Grocery Shopping', status: 'used', expiry: '20 April 2026', type: 'Retail' },
  ];

  const filteredCoupons = coupons.filter(c => c.status === activeTab);

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* 1. Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">My Coupons & Rewards</h1>
          <p className="text-xs md:text-sm text-gray-500 mt-1">Manage and use your exclusive discount codes</p>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-6 max-w-4xl">

        {/* 2. Tab Navigation */}
        <div className="flex gap-4 border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('active')}
            className={`pb-2 text-xs md:text-sm font-bold transition ${activeTab === 'active' ? 'text-[#ff5722] border-b-2 border-[#ff5722]' : 'text-gray-400'}`}
          >
            Available ({coupons.filter(c => c.status === 'active').length})
          </button>
          <button
            onClick={() => setActiveTab('used')}
            className={`pb-2 text-xs md:text-sm font-bold transition ${activeTab === 'used' ? 'text-[#ff5722] border-b-2 border-[#ff5722]' : 'text-gray-400'}`}
          >
            History
          </button>
        </div>

        {/* 3. Coupons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCoupons.length > 0 ? (
            filteredCoupons.map((coupon) => (
              <div key={coupon.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex relative group">
                {/* Decorative Dot Line */}
                <div className="absolute left-[20%] top-0 bottom-0 border-l-2 border-dotted border-gray-200 z-10"></div>

                {/* Left Side: Type Icon */}
                <div className="w-[20%] bg-gray-50 flex items-center justify-center">
                  <span className="text-xl md:text-2xl transform -rotate-90 whitespace-nowrap font-black text-gray-200 tracking-widest uppercase">
                    {coupon.type}
                  </span>
                </div>

                {/* Right Side: Content */}
                <div className="flex-1 p-4 md:p-6 pl-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-sm md:text-base font-bold text-gray-800 leading-tight">{coupon.desc}</h3>
                    {coupon.status === 'active' && (
                      <span className="bg-green-100 text-green-700 text-[8px] md:text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">Active</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="bg-gray-100 px-3 py-1.5 rounded-md border border-dashed border-gray-300">
                      <code className="text-xs md:text-sm font-black text-gray-800 tracking-widest uppercase">{coupon.code}</code>
                    </div>
                    {coupon.status === 'active' && (
                      <button className="text-[#ff5722] text-xs font-bold hover:underline">Copy Code</button>
                    )}
                  </div>

                  <div className="mt-4 flex justify-between items-center border-t border-gray-50 pt-3">
                    <p className="text-[10px] text-gray-400">Expires on: <span className="text-gray-600 font-medium">{coupon.expiry}</span></p>
                    <button className="text-blue-500 text-[10px] font-bold uppercase hover:underline">T&C</button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center bg-white rounded-xl border border-dashed border-gray-200">
              <p className="text-gray-400 text-sm">No coupons found in this section.</p>
            </div>
          )}
        </div>

        {/* 4. Sponsored Reward Banner */}
        <div className="mt-10 relative w-full h-20 md:h-28 rounded-xl overflow-hidden shadow-sm border border-blue-100">
          <img
            src="https://placehold.co/1000x200/eff6ff/1d4ed8?text=Join+UDDOM+Premium:+Get+Exclusive+Monthly+Vouchers"
            alt="Promo Ad"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-1 right-1 bg-white/80 text-[7px] md:text-[9px] px-1 rounded border">Sponsored</div>
        </div>

      </div>
    </div>
  );
}