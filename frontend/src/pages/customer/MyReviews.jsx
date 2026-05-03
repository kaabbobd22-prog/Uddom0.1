import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function MyReviews() {
  const [activeTab, setActiveTab] = useState('Reviewed');

  const pendingReviews = [
    { id: 101, name: "Premium Wireless Mouse G-Pro", date: "22 April 2026", img: "https://placehold.co/150x150/f8fafc/334155?text=Mouse" },
    { id: 102, name: "Organic Raw Honey (1kg)", date: "20 April 2026", img: "https://placehold.co/150x150/fffbeb/b45309?text=Honey" },
  ];

  const reviewedItems = [
    { id: 201, name: "Noise Cancelling Earbuds Gen-2", rating: 5, comment: "Excellent sound quality and fast delivery. Highly recommended!", date: "15 March 2026", img: "https://placehold.co/150x150/f1f5f9/475569?text=Earbuds" },
    { id: 202, name: "Fresh Soybean Oil 5L", rating: 4, comment: "Good quality, but packaging could be better.", date: "10 March 2026", img: "https://placehold.co/150x150/f0fdf4/166534?text=Oil" },
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* 1. Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">My Product Reviews</h1>
          <p className="text-xs md:text-sm text-gray-500 mt-1">Share your experience to help others shop better</p>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-6 max-w-4xl">

        {/* 2. Tab Navigation */}
        <div className="flex gap-8 border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('Pending')}
            className={`pb-2 text-xs md:text-sm font-bold transition ${activeTab === 'Pending' ? 'text-[#ff5722] border-b-2 border-[#ff5722]' : 'text-gray-400'}`}
          >
            To Review ({pendingReviews.length})
          </button>
          <button
            onClick={() => setActiveTab('Reviewed')}
            className={`pb-2 text-xs md:text-sm font-bold transition ${activeTab === 'Reviewed' ? 'text-[#ff5722] border-b-2 border-[#ff5722]' : 'text-gray-400'}`}
          >
            History ({reviewedItems.length})
          </button>
        </div>

        {/* 3. Content Area */}
        <div className="space-y-4">
          {activeTab === 'Pending' ? (
            pendingReviews.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="w-16 h-16 md:w-20 md:h-20 shrink-0 bg-gray-50 rounded-lg overflow-hidden border">
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xs md:text-sm font-bold text-gray-800 line-clamp-1">{item.name}</h3>
                  <p className="text-[10px] text-gray-400 mt-1">Purchased on: {item.date}</p>
                  <button className="mt-2 bg-[#ff5722] text-white px-4 py-1.5 rounded-md text-[10px] md:text-xs font-bold hover:bg-[#e64a19] transition shadow-sm">
                    Write a Review
                  </button>
                </div>
              </div>
            ))
          ) : (
            reviewedItems.map((item) => (
              <div key={item.id} className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex gap-4 mb-4">
                  <div className="w-12 h-12 md:w-16 md:h-16 shrink-0 bg-gray-50 rounded-lg overflow-hidden border">
                    <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-xs md:text-sm font-bold text-gray-800">{item.name}</h3>
                    <div className="flex text-yellow-400 text-xs mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i}>{i < item.rating ? '★' : '☆'}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <p className="text-xs md:text-sm text-gray-600 italic">"{item.comment}"</p>
                  <p className="text-[9px] text-gray-400 mt-2 text-right">Reviewed on {item.date}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 4. Sponsored Ad Slot */}
        <div className="mt-10 relative w-full h-20 md:h-28 rounded-xl overflow-hidden shadow-sm border border-gray-200">
          <img
            src="https://placehold.co/1200x200/f8fafc/64748b?text=Top+Reviewer+Rewards:+Get+Free+Shipping+on+Your+Next+Order"
            className="w-full h-full object-cover opacity-50"
            alt="Review Promo"
          />
          <div className="absolute inset-0 flex items-center justify-center text-center p-4">
            <p className="text-[10px] md:text-sm font-bold text-gray-700">Write 5-star reviews with photos to win "UDDOM Elite" badges! <button className="underline text-[#ff5722]">Learn More</button></p>
          </div>
          <div className="absolute top-1 right-1 text-[7px] md:text-[9px] text-gray-300">Sponsored</div>
        </div>

      </div>
    </div>
  );
}