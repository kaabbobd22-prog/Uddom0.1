import { useState } from 'react';

export default function Policies() {
  const [activeTab, setActiveTab] = useState('privacy');

  const policyContent = {
    privacy: {
      title: "Privacy Policy",
      lastUpdated: "April 2026",
      content: [
        "At UDDOM, we value your privacy. We collect personal information such as name, email, and address to process orders and improve your shopping experience.",
        "Your data is protected with end-to-end encryption. We do not sell your personal information to third parties.",
        "We use cookies to personalize content and ads, and to analyze our traffic."
      ]
    },
    terms: {
      title: "Terms of Service",
      lastUpdated: "January 2026",
      content: [
        "By using UDDOM, you agree to comply with our community guidelines.",
        "Sellers must provide authentic products. Counterfeit goods are strictly prohibited.",
        "UDDOM reserves the right to suspend accounts that violate our B2B or Retail policies."
      ]
    },
    refund: {
      title: "Return & Refund Policy",
      lastUpdated: "March 2026",
      content: [
        "Products can be returned within 7 days of delivery if they are damaged or not as described.",
        "Wholesale/Bulk orders follow a separate inspection-based return process.",
        "Refunds are processed via UDDOM Pay or the original payment method within 5-10 business days."
      ]
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-16">

      {/* 1. Header Section */}
      <div className="bg-gray-900 text-white py-12 md:py-16 px-4 text-center">
        <h1 className="text-2xl md:text-4xl font-bold mb-2">Legal & Policies</h1>
        <p className="text-xs md:text-sm text-gray-400">Everything you need to know about our rules and guidelines.</p>
      </div>

      <div className="container mx-auto px-4 -mt-8 md:-mt-10 max-w-5xl">

        {/* 2. Policy Navigation Tabs (Mobile Scrollable) */}
        <div className="flex overflow-x-auto gap-2 p-1 bg-white rounded-xl shadow-sm border border-gray-100 mb-6 scrollbar-hide">
          {Object.keys(policyContent).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 min-w-[120px] py-3 text-xs md:text-sm font-bold rounded-lg transition uppercase tracking-wider ${activeTab === tab
                  ? 'bg-[#ff5722] text-white shadow-md'
                  : 'text-gray-500 hover:bg-gray-50'
                }`}
            >
              {policyContent[tab].title.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* 3. Content Area */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-2">
            <h2 className="text-xl md:text-3xl font-bold text-gray-800">
              {policyContent[activeTab].title}
            </h2>
            <span className="text-[10px] md:text-xs font-medium text-gray-400 italic">
              Last Updated: {policyContent[activeTab].lastUpdated}
            </span>
          </div>

          <div className="space-y-6">
            {policyContent[activeTab].content.map((text, idx) => (
              <div key={idx} className="flex gap-4">
                <span className="text-[#ff5722] font-bold">{idx + 1}.</span>
                <p className="text-xs md:text-base text-gray-600 leading-relaxed">
                  {text}
                </p>
              </div>
            ))}
          </div>

          {/* 4. Policy Specific Ad / Support Box */}
          <div className="mt-12 bg-gray-50 rounded-xl p-6 border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-sm md:text-base font-bold text-gray-800">Have a specific legal question?</h4>
              <p className="text-xs text-gray-500">Our legal team is available for corporate B2B inquiries.</p>
            </div>
            <button className="bg-gray-900 text-white px-6 py-2 rounded-lg text-xs font-bold hover:bg-black transition whitespace-nowrap">
              Contact Legal Team
            </button>
          </div>
        </div>

        {/* 5. Sponsored Footer Banner */}
        <div className="mt-10 relative w-full h-16 md:h-24 rounded-xl overflow-hidden shadow-sm border border-gray-200 bg-white">
          <img
            src="https://placehold.co/1200x150/f8fafc/64748b?text=Safe+Shopping+Guarantee+-+UDDOM+Verified+Sellers+Only"
            alt="Safety Ad"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-[10px] md:text-sm font-bold text-gray-600">Shop with 100% confidence with UDDOM Protection.</p>
          </div>
          <div className="absolute top-1 right-1 text-[7px] md:text-[9px] text-gray-300">Sponsored</div>
        </div>

      </div>
    </div>
  );
}