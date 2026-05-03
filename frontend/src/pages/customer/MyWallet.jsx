import { useState } from 'react';

export default function MyWallet() {
  // Mock Wallet Data
  const wallet = {
    balance: 2450.75,
    points: 1250,
    status: 'Verified',
    history: [
      { id: 1, type: 'Refund', amount: 850.00, date: '25 April 2026', status: 'Credit', desc: 'Refund for Order UDY-98105' },
      { id: 2, type: 'Payment', amount: 1200.00, date: '20 April 2026', status: 'Debit', desc: 'Grocery Shopping Payment' },
      { id: 3, type: 'Cashback', amount: 50.00, date: '15 April 2026', status: 'Credit', desc: 'Flash Sale Cashback' },
    ]
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* 1. Wallet Header / Balance Card */}
      <div className="bg-gray-900 text-white pt-10 pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-xl md:text-2xl font-bold">UDDOM Pay Wallet</h1>
            <span className="bg-green-500/20 text-green-400 text-[10px] md:text-xs font-bold px-3 py-1 rounded-full border border-green-500/30 uppercase tracking-widest">
              ● {wallet.status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Primary Balance */}
            <div className="bg-gradient-to-br from-[#ff5722] to-[#e64a19] rounded-2xl p-6 shadow-xl relative overflow-hidden">
              <p className="text-xs md:text-sm font-medium opacity-80 mb-1">Available Balance</p>
              <h2 className="text-3xl md:text-5xl font-black">৳{wallet.balance.toLocaleString()}</h2>
              <div className="mt-6 flex gap-3">
                <button className="bg-white text-gray-900 px-4 py-2 rounded-lg text-xs font-bold shadow-sm hover:bg-gray-100 transition">Add Money</button>
                <button className="bg-black/20 text-white border border-white/30 px-4 py-2 rounded-lg text-xs font-bold hover:bg-black/40 transition">Withdraw</button>
              </div>
              {/* Decorative Element */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-10 -mt-10"></div>
            </div>

            {/* Reward Points */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium opacity-80 mb-1">UDDOM Points 💎</p>
                <h2 className="text-2xl md:text-4xl font-bold">{wallet.points.toLocaleString()}</h2>
              </div>
              <p className="text-[10px] md:text-xs opacity-60 mt-4">100 Points = ৳10. Redeemable on next checkout.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-10 relative z-10 max-w-4xl">

        {/* 2. Fast Actions */}
        <div className="grid grid-cols-3 gap-2 md:gap-4 mb-8">
          {[
            { label: 'Transfer', icon: '📲' },
            { label: 'Bill Pay', icon: '🧾' },
            { label: 'Donation', icon: '❤️' }
          ].map((act, idx) => (
            <button key={idx} className="bg-white p-3 md:p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center gap-2 hover:border-[#ff5722] transition">
              <span className="text-xl md:text-2xl">{act.icon}</span>
              <span className="text-[10px] md:text-xs font-bold text-gray-700 uppercase tracking-tight">{act.label}</span>
            </button>
          ))}
        </div>

        {/* 3. Transaction History */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 md:p-6 border-b border-gray-50 flex justify-between items-center">
            <h3 className="text-sm md:text-lg font-bold text-gray-800 uppercase tracking-tight">Recent Transactions</h3>
            <button className="text-[#ff5722] text-xs font-bold hover:underline">View All</button>
          </div>

          <div className="divide-y divide-gray-50">
            {wallet.history.map((tx) => (
              <div key={tx.id} className="p-4 md:p-6 flex items-center justify-between hover:bg-gray-50 transition">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${tx.status === 'Credit' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                    {tx.status === 'Credit' ? '↓' : '↑'}
                  </div>
                  <div>
                    <p className="text-xs md:text-sm font-bold text-gray-800">{tx.desc}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{tx.date} • {tx.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-xs md:text-sm font-black ${tx.status === 'Credit' ? 'text-green-600' : 'text-gray-800'}`}>
                    {tx.status === 'Credit' ? '+' : '-'} ৳{tx.amount.toLocaleString()}
                  </p>
                  <p className="text-[8px] md:text-[10px] text-gray-400 uppercase font-bold tracking-widest">{tx.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Sponsored Ad Banner */}
        <div className="mt-8 relative w-full h-16 md:h-24 rounded-xl overflow-hidden shadow-sm border border-orange-100 bg-orange-50">
          <img
            src="https://placehold.co/1200x200/fff7ed/ea580c?text=Upgrade+to+UDDOM+Business+Wallet+for+৳50,000+Limit"
            className="w-full h-full object-cover opacity-50"
            alt="Wallet Ad"
          />
          <div className="absolute inset-0 flex items-center justify-between px-6">
            <p className="text-[10px] md:text-sm font-bold text-orange-900">Need higher transaction limits for B2B?</p>
            <button className="bg-[#ea580c] text-white px-4 py-1.5 rounded-lg text-[9px] md:text-xs font-bold shadow-md">Apply Now</button>
          </div>
          <div className="absolute top-1 right-1 text-[7px] md:text-[9px] text-orange-300">Sponsored</div>
        </div>

      </div>
    </div>
  );
}