import { useState } from 'react';

export default function BulkInquiry() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center border border-green-100">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl text-green-600">✓</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Inquiry Submitted!</h1>
          <p className="text-sm text-gray-600 mb-8">
            Your bulk request has been sent to verified sellers. You will receive quotes in your <strong>Bulk Inquiry</strong> dashboard shortly.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="w-full bg-gray-900 text-white py-3 rounded-lg font-bold hover:bg-black transition"
          >
            Submit Another Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* 1. Header Section */}
      <div className="bg-gray-900 text-white py-12 md:py-16 px-4 text-center">
        <h1 className="text-2xl md:text-4xl font-black mb-3 uppercase tracking-tight">Bulk Sourcing Request</h1>
        <p className="text-xs md:text-sm text-gray-400 max-w-xl mx-auto">
          Can't find the right price? Submit your requirements and let our verified wholesalers compete to give you the best quote.
        </p>
      </div>

      <div className="container mx-auto px-4 -mt-8 md:-mt-12 max-w-4xl">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

          <div className="p-6 md:p-10">
            <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="bg-[#ff5722] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">!</span>
              Product Requirements
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Name */}
              <div className="col-span-full">
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2 tracking-wider">What product are you looking for? *</label>
                <input
                  required
                  type="text"
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#ff5722] bg-gray-50"
                  placeholder="e.g. 100% Cotton Polo T-shirts (GSM 180)"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2 tracking-wider">Category</label>
                <select className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#ff5722] bg-gray-50">
                  <option>Garments & Textiles</option>
                  <option>Electronics & Gadgets</option>
                  <option>Industrial Supplies</option>
                  <option>Grocery & FMCG</option>
                  <option>Packaging Materials</option>
                </select>
              </div>

              {/* Quantity & Unit */}
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-2 tracking-wider">Quantity *</label>
                  <input required type="number" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#ff5722] bg-gray-50" placeholder="e.g. 500" />
                </div>
                <div className="w-24 md:w-32">
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-2 tracking-wider">Unit</label>
                  <select className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#ff5722] bg-gray-50">
                    <option>Pieces</option>
                    <option>Cartons</option>
                    <option>KG</option>
                    <option>Lots</option>
                  </select>
                </div>
              </div>

              {/* Target Price */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2 tracking-wider">Target Price per Unit (Optional)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">৳</span>
                  <input type="number" className="w-full border border-gray-200 rounded-lg pl-8 pr-4 py-3 text-sm focus:outline-none focus:border-[#ff5722] bg-gray-50" placeholder="e.g. 250" />
                </div>
              </div>

              {/* Deadline */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2 tracking-wider">Needed By</label>
                <input type="date" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#ff5722] bg-gray-50" />
              </div>

              {/* Detailed Specs */}
              <div className="col-span-full">
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2 tracking-wider">Detailed Specifications & Requirements</label>
                <textarea
                  rows="4"
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#ff5722] bg-gray-50"
                  placeholder="Mention color preferences, sizes, material quality, packaging needs, etc."
                ></textarea>
              </div>
            </div>

            <hr className="my-8 border-gray-100" />

            <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="bg-[#ff5722] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
              Company Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2 tracking-wider">Company / Store Name</label>
                <input type="text" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#ff5722] bg-gray-50" placeholder="e.g. Irfan Retail Hub" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2 tracking-wider">Business BIN / License (Optional)</label>
                <input type="text" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#ff5722] bg-gray-50" placeholder="For corporate tax invoice" />
              </div>
            </div>

            <div className="mt-10">
              <button
                type="submit"
                className="w-full bg-[#ff5722] hover:bg-[#e64a19] text-white py-4 rounded-xl font-bold text-base md:text-lg transition shadow-lg flex items-center justify-center gap-2"
              >
                🚀 Post Inquiry to Sellers
              </button>
              <p className="text-center text-[10px] md:text-xs text-gray-400 mt-4 italic">
                * By submitting, your request will be visible to UDDOM Verified Wholesalers only.
              </p>
            </div>
          </div>

          {/* Sponsored Bottom Bar */}
          <div className="bg-blue-50 p-4 border-t border-blue-100 flex items-center justify-between">
            <p className="text-[10px] md:text-xs text-blue-700 font-medium">Need professional sourcing help? <button className="underline font-bold">Talk to a Sourcing Agent</button></p>
            <span className="text-[8px] bg-white px-1 border border-blue-200 rounded text-blue-400 font-bold uppercase tracking-widest">Sponsored</span>
          </div>

        </form>
      </div>
    </div>
  );
}