import { useState, useEffect } from 'react';
import sellerAPI from '../../utils/sellerAxios';
import SellerLayout from '../../layouts/SellerLayout';

export default function Finance() {
  const [activeTab, setActiveTab] = useState('Payouts');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFinance = async () => {
      try {
        const res = await sellerAPI.get('/seller/finance');
        setData(res.data);
      } catch (err) {
        console.error("Finance fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFinance();
  }, []);

  const stats = data ? [
    { label: 'Total Earnings',         value: `৳${data.totalEarnings?.toLocaleString() || 0}`,         icon: '💰', trend: '+12% this month' },
    { label: 'Pending Balance',        value: `৳${data.pendingBalance?.toLocaleString() || 0}`,         icon: '🕒', trend: 'Processing' },
    { label: 'Available to Withdraw',  value: `৳${data.availableToWithdraw?.toLocaleString() || 0}`,    icon: '🏧', trend: 'Ready' },
    { label: 'Total Withdrawn',        value: `৳${data.totalWithdrawn?.toLocaleString() || 0}`,         icon: '🧾', trend: 'All time' },
  ] : [];

  const transactions = data?.transactions || [];

  const statusColor = (status) => {
    if (status === 'Delivered') return 'bg-green-100 text-green-700';
    if (status === 'Cancelled') return 'bg-red-100 text-red-700';
    return 'bg-orange-100 text-orange-700';
  };

  return (
    <SellerLayout>
      <div className="bg-gray-50 min-h-screen pb-12">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl md:text-3xl font-black text-gray-900 uppercase italic tracking-tighter leading-none">Finance & Payouts</h1>
              <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest mt-2">Manage your earnings, transfers and taxes</p>
            </div>
            <button className="bg-black text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-green-600 transition-all active:scale-95 flex items-center justify-center gap-2 border-b-4 border-green-700 hover:border-green-800">
              <span className="text-sm">🏧</span> Withdraw Funds
            </button>
          </div>
        </div>

        <div className="container mx-auto px-4 mt-8 max-w-7xl">

          {loading ? (
            <div className="text-center py-20 font-black uppercase text-gray-400 animate-pulse italic tracking-widest text-sm">Loading Finance Data...</div>
          ) : (
            <>
              {/* Finance Summary Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((stat, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-[2rem] shadow-sm border-2 border-white hover:shadow-xl hover:border-gray-200 transition-all duration-300">
                    <div className="text-3xl mb-4">{stat.icon}</div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                    <h3 className="text-xl md:text-2xl font-black text-gray-900 mt-1">{stat.value}</h3>
                    <p className={`text-[9px] font-black uppercase tracking-widest mt-3 px-3 py-1 rounded-full inline-block ${
                      idx === 1 ? 'bg-orange-50 text-orange-600' :
                      idx === 0 ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'
                    }`}>
                      {stat.trend}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col lg:flex-row gap-8">

                {/* Transaction History */}
                <div className="w-full lg:w-2/3">
                  <div className="bg-white rounded-[2.5rem] shadow-sm border-2 border-white overflow-hidden">
                    <div className="flex border-b-2 border-gray-50 overflow-x-auto scrollbar-hide">
                      {['Payouts', 'Statements', 'Tax Invoices'].map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={`px-8 py-5 text-[10px] md:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                            activeTab === tab
                              ? 'text-[#ff5722] border-b-4 border-[#ff5722] bg-orange-50/50'
                              : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>

                    <div className="p-6 md:p-8 overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b-2 border-gray-50">
                            <th className="pb-5 px-4">Date</th>
                            <th className="pb-5 px-4">Order ID</th>
                            <th className="pb-5 px-4">Amount</th>
                            <th className="pb-5 px-4 text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {transactions.length === 0 ? (
                            <tr><td colSpan={4} className="py-10 text-center text-gray-400 font-black uppercase text-xs">No transactions found.</td></tr>
                          ) : transactions.map((tx) => (
                            <tr key={tx._id} className="hover:bg-gray-50/80 transition duration-300">
                              <td className="py-5 px-4">
                                <p className="text-xs font-black text-gray-900 uppercase tracking-tight">{new Date(tx.createdAt).toLocaleDateString()}</p>
                              </td>
                              <td className="py-5 px-4">
                                <p className="text-[10px] font-black text-[#ff5722] uppercase tracking-widest">{tx.orderID || tx._id.slice(-8)}</p>
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">{tx.paymentMethod}</p>
                              </td>
                              <td className="py-5 px-4 text-sm md:text-base font-black text-gray-900">৳{tx.totalAmount?.toLocaleString()}</td>
                              <td className="py-5 px-4 text-right">
                                <span className={`text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest inline-block ${statusColor(tx.status)}`}>
                                  {tx.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Bank Account & Support */}
                <div className="w-full lg:w-1/3 space-y-8">
                  <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border-2 border-white">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-sm font-black text-gray-900 uppercase italic tracking-widest">Bank Details</h3>
                      <button className="text-[#ff5722] text-[10px] font-black uppercase hover:underline">Edit</button>
                    </div>
                    <div className="bg-black text-white rounded-3xl p-6 relative overflow-hidden shadow-2xl group cursor-pointer transition-transform hover:scale-[1.02]">
                      <p className="text-[8px] opacity-60 uppercase font-black tracking-[0.2em] mb-4">Primary Payout Method</p>
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <p className="text-lg font-black uppercase tracking-tight italic">Your Name</p>
                          <p className="text-[10px] font-bold opacity-80 mt-1 tracking-widest uppercase">Dutch-Bangla Bank PLC</p>
                        </div>
                        <span className="text-2xl group-hover:rotate-12 transition-transform">🏦</span>
                      </div>
                      <p className="text-sm font-black tracking-widest font-mono bg-white/10 inline-block px-3 py-1 rounded-lg">**** **** 4567</p>
                      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                    </div>
                  </div>

                  <div className="bg-orange-50 rounded-[2.5rem] p-8 border-2 border-orange-100 relative group overflow-hidden">
                    <div className="absolute top-0 right-0 bg-white text-orange-200 text-[8px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-widest">Support</div>
                    <h4 className="text-lg font-black text-orange-900 uppercase italic tracking-tighter">Billing Issue?</h4>
                    <p className="text-[10px] text-orange-700 mt-2 font-bold leading-relaxed uppercase tracking-tight">Facing delays in your payout? Contact our 24/7 Seller Finance team.</p>
                    <button className="mt-6 w-full bg-white text-orange-900 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest border-2 border-orange-200 hover:border-orange-900 hover:bg-orange-900 hover:text-white transition-all shadow-sm">
                      Create Ticket
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </SellerLayout>
  );
}
