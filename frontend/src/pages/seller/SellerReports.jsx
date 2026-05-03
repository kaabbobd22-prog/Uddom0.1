import { useState, useEffect } from 'react';
import sellerAPI from '../../utils/sellerAxios';
import SellerLayout from '../../layouts/SellerLayout';

export default function SellerReport() {
  const [dateRange, setDateRange] = useState('30D');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const res = await sellerAPI.get(`/seller/reports?range=${dateRange}`);
        setData(res.data);
      } catch (err) {
        console.error("Reports fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [dateRange]);

  const reportStats = data ? [
    { label: 'Net Revenue',      value: `৳${data.netRevenue?.toLocaleString() || 0}`,     growth: '+18.5%', desc: 'After commissions' },
    { label: 'Total Orders',     value: data.totalOrders || '0',                           growth: '+5.2%',  desc: 'Retail & Wholesale' },
    { label: 'Avg. Order Value', value: `৳${data.avgOrderValue?.toLocaleString() || 0}`,  growth: '-2.1%',  desc: 'Per checkout' },
    { label: 'Conversion Rate',  value: data.conversionRate || '3.8%',                    growth: '+1.2%',  desc: 'Visitor to Buyer' },
  ] : [];

  const topProducts = data?.topProducts || [];

  return (
    <SellerLayout>
      <div className="bg-gray-50 min-h-screen pb-12">
        {/* Header & Date Filter */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-xl md:text-3xl font-black text-gray-900 uppercase italic tracking-tighter leading-none">Business Reports</h1>
              <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest mt-2">Deep dive into your store's sales and metrics</p>
            </div>
            <div className="flex gap-2 bg-gray-50 p-1.5 rounded-2xl border-2 border-gray-100">
              {['7D', '30D', '3M', '1Y'].map((range) => (
                <button
                  key={range}
                  onClick={() => setDateRange(range)}
                  className={`px-5 py-2.5 text-[10px] md:text-xs font-black uppercase tracking-widest rounded-xl transition-all ${
                    dateRange === range ? 'bg-black text-white shadow-md' : 'text-gray-400 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 mt-8 max-w-7xl">

          {loading ? (
            <div className="text-center py-20 font-black uppercase text-gray-400 animate-pulse italic tracking-widest text-sm">Crunching Numbers...</div>
          ) : (
            <>
              {/* KPIs */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {reportStats.map((stat, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-[2rem] shadow-sm border-2 border-white hover:shadow-xl hover:border-gray-200 transition-all duration-300">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{stat.label}</p>
                    <h3 className="text-xl md:text-2xl font-black text-gray-900">{stat.value}</h3>
                    <div className="flex items-center gap-2 mt-3">
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${
                        stat.growth.startsWith('+') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                      }`}>
                        {stat.growth}
                      </span>
                      <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{stat.desc}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Main Sales Chart Placeholder */}
                <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border-2 border-white">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-sm md:text-lg font-black text-gray-900 uppercase italic tracking-tight">Revenue Growth</h3>
                    <button className="bg-gray-100 text-gray-900 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all">
                      Export PDF
                    </button>
                  </div>
                  <div className="h-64 md:h-80 bg-gray-50 rounded-[2rem] flex flex-col items-center justify-center border-4 border-dashed border-gray-100 relative overflow-hidden group">
                    <div className="absolute inset-x-10 bottom-0 h-1/2 flex items-end justify-between gap-3 opacity-20 group-hover:opacity-40 transition-opacity">
                      {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="bg-[#ff5722] w-full rounded-t-sm" style={{ height: `${Math.random() * 100}%` }}></div>
                      ))}
                    </div>
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest italic z-10">Sales Analytics Visualization Area</p>
                    <p className="text-[9px] text-gray-300 font-bold uppercase tracking-widest mt-2 z-10 border border-gray-200 px-3 py-1 rounded-full">Chart.js / Recharts Ready</p>
                  </div>
                </div>

                {/* Top Products */}
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border-2 border-white">
                  <h3 className="text-sm font-black text-gray-900 uppercase italic tracking-tight mb-8">Top Products</h3>
                  <div className="space-y-6">
                    {topProducts.length === 0 ? (
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center">No sales data yet.</p>
                    ) : topProducts.map((product, index) => (
                      <div key={index} className="flex items-center justify-between group hover:bg-gray-50 p-3 -mx-3 rounded-2xl transition">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gray-100 text-gray-500 rounded-xl flex items-center justify-center text-[10px] font-black uppercase shadow-inner group-hover:bg-[#ff5722] group-hover:text-white transition-colors">
                            #{index + 1}
                          </div>
                          <div>
                            <p className="text-xs font-black text-gray-900 uppercase tracking-tight line-clamp-1">{product.name}</p>
                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">{product.sales} Units Sold</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-black text-[#ff5722]">৳{product.revenue?.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <hr className="my-8 border-gray-50" />

                  <div className="bg-orange-50 p-6 rounded-3xl border-2 border-orange-100 relative">
                    <span className="absolute -top-3 left-6 bg-[#ff5722] text-white text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Insights</span>
                    <p className="text-[10px] text-orange-800 leading-relaxed font-bold uppercase tracking-tight mt-2">
                      Boost your top products via <strong className="font-black text-[#ff5722]">Ads Manager</strong> for even higher ROI.
                    </p>
                  </div>
                </div>
              </div>

              {/* Upgrade Banner */}
              <div className="mt-8 bg-black rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 group">
                <div className="relative z-10 text-center md:text-left max-w-xl">
                  <h2 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter leading-none mb-3">Ready to Scale? 🚀</h2>
                  <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest leading-relaxed">Get exclusive access to UDDOM's 'Power Seller' insights and a personal business consultant.</p>
                </div>
                <button className="relative z-10 bg-white text-black px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#ff5722] hover:text-white shadow-xl transition-all active:scale-95 whitespace-nowrap">
                  Upgrade to Premium
                </button>
                <div className="absolute top-0 right-0 w-64 h-full bg-[#ff5722] opacity-10 skew-x-12 translate-x-10 group-hover:scale-110 transition-transform duration-700"></div>
              </div>
            </>
          )}
        </div>
      </div>
    </SellerLayout>
  );
}
