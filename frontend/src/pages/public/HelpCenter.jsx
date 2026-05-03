import { Link } from 'react-router-dom';

export default function HelpCenter() {
  const categories = [
    { id: 1, icon: '📦', title: 'Orders & Shipping', desc: 'Tracking, delivery times, and shipping fees' },
    { id: 2, icon: '💰', title: 'Payments & Refunds', desc: 'Methods, refund policy, and UDDOM Pay' },
    { id: 3, icon: '🔄', title: 'Returns & Exchanges', desc: 'How to return items and bulk order returns' },
    { id: 4, icon: '🏬', title: 'Selling on UDDOM', desc: 'Store setup, commissions, and seller growth' },
    { id: 5, icon: '💼', title: 'B2B & Wholesale', desc: 'Tiered pricing, MOQ, and corporate billing' },
    { id: 6, icon: '👤', title: 'Account Settings', desc: 'Security, address book, and notifications' },
  ];

  const faqs = [
    { q: "How do I place a wholesale order?", a: "To place a wholesale order, simply increase the product quantity until it reaches the Minimum Order Quantity (MOQ) displayed on the product page. The wholesale price will be applied automatically." },
    { q: "What is the delivery time for Grocery?", a: "Grocery items are delivered via our Express service within 2-4 hours inside Dhaka city." },
    { q: "Can I pay via bank transfer for bulk orders?", a: "Yes, for B2B and wholesale orders, we support direct bank transfers and corporate invoicing." }
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-16">

      {/* 1. Search Hero Section */}
      <section className="bg-gray-900 py-12 md:py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-6">How can we help you?</h1>
          <div className="max-w-2xl mx-auto relative">
            <input
              type="text"
              placeholder="Search for articles (e.g. tracking, wholesale, refund)..."
              className="w-full bg-white rounded-full py-3 md:py-4 px-6 md:px-10 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#ff5722] shadow-lg"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#ff5722] text-white px-4 md:px-6 py-1.5 md:py-2.5 rounded-full font-bold text-xs md:text-sm">
              Search
            </button>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 -mt-8 md:-mt-12 relative z-10">

        {/* 2. Help Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 mb-12">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-white p-4 md:p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer group flex flex-col items-center text-center">
              <span className="text-3xl md:text-5xl mb-3 md:mb-4 group-hover:scale-110 transition">{cat.icon}</span>
              <h3 className="text-xs md:text-lg font-bold text-gray-800 mb-1 md:mb-2">{cat.title}</h3>
              <p className="text-[9px] md:text-sm text-gray-500 leading-tight md:leading-relaxed">{cat.desc}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* 3. Popular FAQs */}
          <div className="w-full lg:w-2/3">
            <h2 className="text-lg md:text-2xl font-bold text-gray-800 mb-6">Popular Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div key={idx} className="bg-white rounded-lg border border-gray-100 overflow-hidden shadow-sm">
                  <div className="p-4 md:p-5">
                    <h4 className="text-sm md:text-base font-bold text-gray-800 mb-2">Q: {faq.q}</h4>
                    <p className="text-xs md:text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Sponsored Banner in Help Center */}
            <div className="mt-8 relative w-full h-20 md:h-28 rounded-xl overflow-hidden shadow-sm border border-orange-100">
              <img
                src="https://placehold.co/1000x200/fff7ed/ea580c?text=New+to+UDDOM?+Watch+Our+Video+Guide+for+Sellers"
                alt="Help Video Ad"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-1 right-1 bg-white/80 text-[7px] md:text-[9px] px-1 rounded border">Sponsored</div>
            </div>
          </div>

          {/* 4. Quick Support Sidebar */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 sticky top-32">
              <h3 className="text-base md:text-lg font-bold text-gray-800 mb-4 border-b pb-2">Still need help?</h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <span className="text-xl md:text-2xl">💬</span>
                  <div>
                    <h4 className="text-sm md:text-base font-bold text-gray-800">Live Chat</h4>
                    <p className="text-xs text-gray-500 mb-2">Instant support for order issues.</p>
                    <button className="text-[#ff5722] text-xs font-bold hover:underline">Start Chat →</button>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <span className="text-xl md:text-2xl">📧</span>
                  <div>
                    <h4 className="text-sm md:text-base font-bold text-gray-800">Email Support</h4>
                    <p className="text-xs text-gray-500 mb-2">We reply within 24 hours.</p>
                    <a href="mailto:support@UDDOM.com" className="text-[#ff5722] text-xs font-bold hover:underline">Send Email →</a>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <p className="text-[10px] md:text-xs text-gray-400 mb-3 uppercase font-bold tracking-widest">Seller Support</p>
                  <Link to="/seller/login" className="block w-full text-center bg-gray-900 text-white py-2.5 rounded-lg text-xs font-bold hover:bg-black transition">
                    Seller Login
                  </Link>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}