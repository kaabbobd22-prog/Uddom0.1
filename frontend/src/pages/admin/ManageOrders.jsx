import { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import API from '../../api/axios';

export default function ManageOrders() {
  const [activeTab, setActiveTab] = useState('All');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await API.get('/admin/orders');
      setOrders(res.data);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await API.put(`/admin/orders/${id}/status`, { status });
      fetchOrders();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleMarkPaid = async (id) => {
    try {
      await API.put(`/admin/orders/${id}/payment`, { paymentStatus: 'Paid' });
      fetchOrders();
    } catch (err) {
      alert('Failed to mark as paid');
    }
  };

  const handlePayout = async (id) => {
    if (!confirm('Distribute payment to seller? (5% commission will be deducted)')) return;
    try {
      await API.put(`/admin/orders/${id}/payout`);
      fetchOrders();
      alert('Payment distributed to seller!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to payout');
    }
  };

  const filtered = orders.filter(o => {
    const matchTab = activeTab === 'All' ? true : o.status === activeTab;
    const matchSearch = !search || o.orderID?.toLowerCase().includes(search.toLowerCase()) || o.customer?.name?.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const statusColor = {
    Pending: 'bg-orange-100 text-orange-600',
    Processing: 'bg-blue-100 text-blue-600',
    Shipped: 'bg-purple-100 text-purple-600',
    Delivered: 'bg-green-100 text-green-700',
    Cancelled: 'bg-gray-100 text-gray-500',
  };

  return (
    <AdminLayout>
      <div className="bg-[#f8fafc] min-h-screen pb-12 font-sans">
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
          <div className="container mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-xl md:text-3xl font-black text-gray-900 uppercase tracking-tighter">Global Order Ledger</h1>
              <p className="text-[10px] md:text-xs text-gray-400 font-bold tracking-widest uppercase mt-1">Monitor and manage all transactions</p>
            </div>
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search Order ID or Customer..."
              className="w-full md:w-72 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-xs focus:border-[#ff5722] outline-none" />
          </div>
        </div>

        <div className="container mx-auto px-6 mt-8">
          {/* KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Orders', value: orders.length, icon: '🛒', color: 'text-blue-600' },
              { label: 'Pending', value: orders.filter(o => o.status === 'Pending').length, icon: '⏳', color: 'text-orange-500' },
              { label: 'Unpaid Orders', value: orders.filter(o => o.paymentStatus === 'Unpaid').length, icon: '💳', color: 'text-red-500' },
              { label: 'Unpaid to Sellers', value: orders.filter(o => o.paymentStatus === 'Paid' && !o.sellerPaid).length, icon: '💰', color: 'text-[#ff5722]' },
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
            {['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`pb-3 text-xs font-black uppercase tracking-widest transition whitespace-nowrap border-b-2 ${activeTab === tab ? 'text-[#ff5722] border-[#ff5722]' : 'text-gray-400 border-transparent'}`}>
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
                      <th className="py-5 px-6">Order</th>
                      <th className="py-5 px-6">Customer</th>
                      <th className="py-5 px-6">Seller</th>
                      <th className="py-5 px-6">Amount</th>
                      <th className="py-5 px-6">Payment</th>
                      <th className="py-5 px-6">Status</th>
                      <th className="py-5 px-6">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filtered.map(order => (
                      <tr key={order._id} className="hover:bg-gray-50/50 transition">
                        <td className="py-5 px-6">
                          <p className="text-xs font-black text-gray-800">{order.orderID}</p>
                          <p className="text-[10px] text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </td>
                        <td className="py-5 px-6">
                          <p className="text-xs font-bold text-gray-700">{order.customer?.name || '—'}</p>
                          <p className="text-[10px] text-gray-400">{order.customer?.email}</p>
                        </td>
                        <td className="py-5 px-6">
                          <p className="text-xs text-gray-500">{order.seller?.storeName || '—'}</p>
                        </td>
                        <td className="py-5 px-6">
                          <p className="text-xs font-bold text-gray-800">৳{order.totalAmount?.toLocaleString()}</p>
                        </td>
                        <td className="py-5 px-6">
                          <div className="space-y-1">
                            <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase block w-fit ${order.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                              {order.paymentStatus}
                            </span>
                            {order.paymentStatus === 'Paid' && (
                              <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase block w-fit ${order.sellerPaid ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                                {order.sellerPaid ? 'Seller Paid' : 'Seller Unpaid'}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-5 px-6">
                          <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase ${statusColor[order.status] || 'bg-gray-100 text-gray-500'}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-5 px-6">
                          <div className="flex flex-col gap-1.5">
                            <select
                              value={order.status}
                              onChange={e => handleStatusChange(order._id, e.target.value)}
                              className="text-[10px] border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:border-[#ff5722] bg-white">
                              {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            {order.paymentStatus === 'Unpaid' && (
                              <button onClick={() => handleMarkPaid(order._id)} className="text-[9px] font-black bg-green-500 text-white px-2 py-1 rounded-lg hover:bg-green-600">Mark Paid</button>
                            )}
                            {order.paymentStatus === 'Paid' && !order.sellerPaid && (
                              <button onClick={() => handlePayout(order._id)} className="text-[9px] font-black bg-[#ff5722] text-white px-2 py-1 rounded-lg hover:bg-orange-600">Pay Seller</button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filtered.length === 0 && <div className="py-16 text-center text-gray-400 text-sm font-bold">No orders found.</div>}
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}