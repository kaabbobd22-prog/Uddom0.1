import { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import API from '../../api/axios';

export default function ManageProducts() {
  const [activeFilter, setActiveFilter] = useState('All Products');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await API.get('/admin/products');
      setProducts(res.data);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleApprove = async (id, name) => {
    if (!confirm(`Approve "${name}"?`)) return;
    try {
      await API.put(`/admin/products/approve/${id}`);
      fetchProducts();
    } catch (err) {
      alert('Failed to approve product');
    }
  };

  const handleReject = async (id) => {
    if (!confirm('Reject this product?')) return;
    try {
      await API.put(`/admin/products/reject/${id}`);
      fetchProducts();
    } catch (err) {
      alert('Failed to reject');
    }
  };

  const handleFlag = async (id) => {
    try {
      await API.put(`/admin/products/flag/${id}`);
      fetchProducts();
    } catch (err) {
      alert('Failed to flag');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Permanently delete this product?')) return;
    try {
      await API.delete(`/admin/products/${id}`);
      fetchProducts();
    } catch (err) {
      alert('Failed to delete');
    }
  };

  const filtered = products.filter(p => {
    const matchFilter = activeFilter === 'All Products' ? true : p.status === activeFilter;
    const matchSearch = !search || p.name?.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const statusColor = {
    Active: 'bg-green-100 text-green-700',
    Pending: 'bg-orange-100 text-orange-600',
    Flagged: 'bg-red-100 text-red-600',
    Rejected: 'bg-gray-100 text-gray-500',
  };

  return (
    <AdminLayout>
      <div className="bg-[#f8fafc] min-h-screen pb-12 font-sans">
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
          <div className="container mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-xl md:text-3xl font-black text-gray-900 uppercase tracking-tighter">Catalog Moderator</h1>
              <p className="text-[10px] md:text-xs text-gray-400 font-bold tracking-widest uppercase mt-1">Review, Approve and Manage Global Inventory</p>
            </div>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name..."
              className="w-full md:w-64 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-xs focus:border-[#ff5722] outline-none"
            />
          </div>
        </div>

        <div className="container mx-auto px-6 mt-8">
          {/* KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Listings', value: products.length, icon: '📦', color: 'text-blue-600' },
              { label: 'Waiting Approval', value: products.filter(p => p.status === 'Pending').length, icon: '⏳', color: 'text-orange-500' },
              { label: 'Flagged', value: products.filter(p => p.status === 'Flagged').length, icon: '🚩', color: 'text-red-500' },
              { label: 'Active', value: products.filter(p => p.status === 'Active').length, icon: '✅', color: 'text-green-600' },
            ].map((stat, idx) => (
              <div key={idx} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
                <div className="text-xl mb-3">{stat.icon}</div>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                <h3 className={`text-xl md:text-2xl font-black mt-1 ${stat.color}`}>{stat.value}</h3>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-6 border-b border-gray-200 mb-6 overflow-x-auto scrollbar-hide">
            {['All Products', 'Pending', 'Active', 'Flagged', 'Rejected'].map((tab) => (
              <button key={tab} onClick={() => setActiveFilter(tab)}
                className={`pb-3 text-xs font-black uppercase tracking-widest transition whitespace-nowrap border-b-2 ${activeFilter === tab ? 'text-[#ff5722] border-[#ff5722]' : 'text-gray-400 border-transparent'}`}>
                {tab}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-[#ff5722] border-t-transparent rounded-full animate-spin"></div></div>
          ) : (
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <tr>
                      <th className="py-5 px-6">Product</th>
                      <th className="py-5 px-6">Seller</th>
                      <th className="py-5 px-6">Category</th>
                      <th className="py-5 px-6">Price</th>
                      <th className="py-5 px-6">Status</th>
                      <th className="py-5 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filtered.map((product) => (
                      <tr key={product._id} className="hover:bg-gray-50/50 transition group">
                        <td className="py-5 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                              {product.images?.[0] ? <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xl">📦</div>}
                            </div>
                            <div>
                              <p className="text-xs font-black text-gray-800 max-w-[180px] truncate">{product.name}</p>
                              <p className="text-[10px] text-gray-400">Added {new Date(product.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-5 px-6">
                          <p className="text-xs font-bold text-gray-700">{product.seller?.storeName || 'Unknown'}</p>
                        </td>
                        <td className="py-5 px-6">
                          <p className="text-xs text-gray-500">{product.category}</p>
                          {product.subCategory && <p className="text-[10px] text-gray-400">{product.subCategory}</p>}
                        </td>
                        <td className="py-5 px-6">
                          <p className="text-xs font-bold text-gray-800">৳{product.price?.toLocaleString()}</p>
                        </td>
                        <td className="py-5 px-6">
                          <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase ${statusColor[product.status] || 'bg-gray-100 text-gray-500'}`}>
                            {product.status}
                          </span>
                        </td>
                        <td className="py-5 px-6 text-right">
                          <div className="flex justify-end gap-3">
                            {product.status === 'Pending' && (
                              <>
                                <button onClick={() => handleApprove(product._id, product.name)} className="text-[10px] font-black text-white bg-green-500 hover:bg-green-600 px-3 py-1.5 rounded-lg">Approve</button>
                                <button onClick={() => handleReject(product._id)} className="text-[10px] font-bold text-red-500 hover:underline">Reject</button>
                              </>
                            )}
                            {product.status === 'Active' && (
                              <button onClick={() => handleFlag(product._id)} className="text-[10px] font-bold text-orange-500 hover:underline">Flag</button>
                            )}
                            <button onClick={() => handleDelete(product._id)} className="text-[10px] font-bold text-gray-400 hover:text-red-500">Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filtered.length === 0 && <div className="py-16 text-center text-gray-400 text-sm font-bold">No products found.</div>}
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}