import { Link } from 'react-router-dom';

export default function Offers() {
  const coupons = [
    { id: 1, code: 'UDDOM100', desc: 'Flat ৳100 Off on your first order', minOrder: 500, type: 'Retail' },
    { id: 2, code: 'BULKSAVE5', desc: 'Extra 5% Off on wholesale orders over ৳20,000', minOrder: 20000, type: 'Wholesale' },
    { id: 3, code: 'FREESHIP', desc: 'Free Shipping for all Grocery orders above ৳1,000', minOrder: 1000, type: 'Grocery' },
  ];

  const bankOffers = [
    { id: 1, bank: 'City Bank', offer: '10% Cashback', card: 'Amex Credit Cards', img: 'https://placehold.co/100x100/1e293b/ffffff?text=City' },
    { id: 2, bank: 'bKash', offer: '৳50 Instant Cashback', card: 'App Payment Only', img: 'https://placehold.co/100x100/d946ef/ffffff?text=bKash' },
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-16">

      {/* 1. Offers Hero Section */}
      <div className="bg-gradient-to-r from-[#ff5722] to-[#e64a19] text-white py-10 md:py-16 px-4 text-center relative overflow-hidden">
        <div className="container mx-auto relative z-10">
          <h1 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter mb-4">Exclusive Offers 🎁</h1>
          <p className="text-xs md:text-lg opacity-90 max-w-xl mx-auto font-medium">
            Save big on your daily retail needs and bulk business sourcing with our verified coupons and bank deals.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10"></div>
      </div>

      <div className="container mx-auto px-4 -mt-8 relative z-20">

        {/* 2. Featured Coupon Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {coupons.map((cpn) => (
            <div key={cpn.id} className="bg-white border-2 border-dashed border-orange-200 rounded-xl p-6 relative overflow-hidden flex flex-col items-center text-center shadow-sm">
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-50 rounded-full border-r-2 border-orange-200"></div>
              <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-50 rounded-full border-l-2 border-orange-200"></div>

              <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase mb-3 ${cpn.type === 'Wholesale' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-[#ff5722]'
                }`}>
                {cpn.type} Offer
              </span>
              <h3 className="text-sm md:text-base font-bold text-gray-800 mb-2">{cpn.desc}</h3>
              <p className="text-[10px] text-gray-400 mb-4 tracking-wide uppercase">Min. Order: ৳{cpn.minOrder}</p>

              <div className="bg-gray-100 border border-gray-200 rounded-md px-4 py-2 flex items-center gap-3 w-full justify-between">
                <code className="text-sm font-black text-gray-800 tracking-widest">{cpn.code}</code>
                <button className="text-[#ff5722] text-xs font-bold uppercase hover:text-black transition">Copy</button>
              </div>
            </div>
          ))}
        </div>

        {/* 3. Mid-Page Sponsored Banner */}
        <div className="relative w-full h-20 md:h-32 rounded-xl overflow-hidden shadow-sm mb-12 border border-blue-100">
          <img
            src="https://placehold.co/1200x200/eff6ff/1d4ed8?text=UDDOM+Pay+Exclusive:+Extra+৳500+Off+on+Your+First+Corporate+Bulk+Buy"
            alt="Promo Offer"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2 bg-white/80 text-[8px] md:text-[10px] px-2 py-0.5 rounded border text-gray-500">Sponsored</div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">

          {/* 4. Payment & Bank Offers */}
          <div className="w-full lg:w-2/3">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              💳 Bank & Wallet Offers
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bankOffers.map((bank) => (
                <div key={bank.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center gap-4 hover:shadow-md transition">
                  <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden border border-gray-50">
                    <img src={bank.img} alt={bank.bank} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-gray-800">{bank.offer}</h4>
                    <p className="text-xs text-gray-500">{bank.bank} • {bank.card}</p>
                    <button className="text-[#ff5722] text-[10px] font-bold mt-2 uppercase hover:underline">View Details →</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Special Ad / Sidebar Promo */}
          <div className="w-full lg:w-1/3">
            <div className="bg-gray-900 rounded-xl p-6 text-white text-center sticky top-32 overflow-hidden relative">
              <div className="relative z-10">
                <h3 className="text-lg font-bold mb-2">Sell in Bulk?</h3>
                <p className="text-xs text-gray-400 mb-6">Register as a wholesaler today and get exclusive seller-only rebates.</p>
                <Link to="/seller/register" className="block w-full bg-[#ff5722] py-2.5 rounded-lg text-sm font-bold hover:bg-[#e64a19] transition shadow-sm">
                  Become a Seller
                </Link>
              </div>
              {/* Decorative Circle */}
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#ff5722]/10 rounded-full"></div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}