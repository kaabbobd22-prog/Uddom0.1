import { useState, useEffect } from 'react';
import sellerAPI from '../../utils/sellerAxios';
import SellerLayout from '../../layouts/SellerLayout';

export default function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const res = await sellerAPI.get('/seller/inventory');
        setInventory(res.data);
      } catch (err) {
        console.error("Inventory fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInventory();
  }, []);

  const filtered = inventory.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const sellerData = JSON.parse(localStorage.getItem('sellerData')) || {};

  return (
    <SellerLayout>
      <div className="bg-gray-50 min-h-screen pb-12">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-30 mb-8">
          <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-xl md:text-3xl font-black text-gray-900 uppercase italic tracking-tighter leading-none">Inventory</h1>
              <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest mt-2">Track and manage your product stock</p>
            </div>
            {/* Approval badge */}
            <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${
              sellerData.isApproved ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-600'
            }`}>
              {sellerData.isApproved ? '✔ Approved Seller' : '⏳ Pending Approval'}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 max-w-7xl">

          {/* Search Bar */}
          <div className="bg-white rounded-2xl border-2 border-white shadow-sm p-4 mb-6 flex items-center gap-4">
            <span className="text-gray-400 text-lg">🔍</span>
            <input
              type="text"
              placeholder="Search by product name or category..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 outline-none text-xs font-bold text-gray-700 placeholder-gray-300 uppercase tracking-wide"
            />
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{filtered.length} Items</span>
          </div>

          {loading ? (
            <div className="text-center py-20 font-black uppercase text-gray-400 animate-pulse italic tracking-widest text-sm">Loading Inventory...</div>
          ) : (
            <div className="bg-white rounded-[2.5rem] shadow-sm border-2 border-white overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b-2 border-gray-50">
                      <th className="py-6 px-8">Product</th>
                      <th className="py-6 px-8">Category</th>
                      <th className="py-6 px-8">Retail Price</th>
                      <th className="py-6 px-8">Type</th>
                      <th className="py-6 px-8">Added</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filtered.map((product) => (
                      <tr key={product._id} className="hover:bg-gray-50/80 transition-all duration-300">
                        <td className="py-6 px-8">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center">
                              {product.images?.[0]
                                ? <img src={product.images[0]} className="w-full h-full object-cover" alt={product.name} />
                                : <span className="text-lg">📦</span>}
                            </div>
                            <div>
                              <p className="text-xs font-black text-gray-900 uppercase tracking-tight line-clamp-1">{product.name}</p>
                              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">ID: {product._id.slice(-8)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-6 px-8 text-[10px] font-bold text-gray-500 uppercase tracking-widest">{product.category}</td>
                        <td className="py-6 px-8 text-sm font-black text-gray-900">৳{product.price?.toLocaleString()}</td>
                        <td className="py-6 px-8">
                          <span className={`text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${
                            product.isWholesale ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
                          }`}>
                            {product.isWholesale ? 'Wholesale' : 'Retail'}
                          </span>
                        </td>
                        <td className="py-6 px-8 text-[9px] text-gray-400 font-bold uppercase tracking-widest">
                          {new Date(product.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr><td colSpan={5} className="py-20 text-center text-gray-400 font-black uppercase text-xs">No products found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </SellerLayout>
  );
}
