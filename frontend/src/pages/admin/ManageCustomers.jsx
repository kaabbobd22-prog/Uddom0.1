import { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import API from '../../api/axios';

export default function ManageCustomers() {
  const [activeTab, setActiveTab] = useState('All');
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await API.get('/admin/customers');
      setCustomers(res.data);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCustomers(); }, []);

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Blocked' : 'Active';
    if (!confirm(`${newStatus === 'Blocked' ? 'Block' : 'Unblock'} this customer?`)) return;
    try {
      await API.put(`/admin/customers/${id}/status`, { status: newStatus });
      fetchCustomers();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const filtered = customers.filter(c => {
    const matchTab = activeTab === 'All' ? true : activeTab === 'Blocked' ? c.status === 'Blocked' : c.status === 'Active';
    const matchSearch = !search || c.name?.toLowerCase().includes(search.toLowerCase()) || c.email?.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  return (
    <AdminLayout>
      <div className="bg-[#f8fafc] min-h-screen pb-12 font-sans">
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="container mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-xl md:text-3xl font-black text-gray-900 uppercase tracking-tighter">Customer Management</h1>
              <p className="text-[10px] md:text-xs text-gray-400 font-bold tracking-widest uppercase mt-1">Monitor user activity</p>
            </div>
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full md:w-64 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-xs focus:border-[#ff5722] outline-none" />
          </div>
        </div>

        <div className="container mx-auto px-6 mt-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Users', value: customers.length, icon: '👥', color: 'text-blue-600' },
              { label: 'Active', value: customers.filter(c => c.status === 'Active').length, icon: '✅', color: 'text-green-600' },
              { label: 'Blocked', value: customers.filter(c => c.status === 'Blocked').length, icon: '🚫', color: 'text-red-500' },
              { label: 'New (7 days)', value: customers.filter(c => new Date(c.createdAt) > new Date(Date.now() - 7 * 86400000)).length, icon: '✨', color: 'text-[#ff5722]' },
            ].map((stat, idx) => (
              <div key={idx} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
                <div className="text-xl mb-3">{stat.icon}</div>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                <h3 className={`text-xl md:text-2xl font-black mt-1 ${stat.color}`}>{stat.value}</h3>
              </div>
            ))}
          </div>

          <div className="flex gap-6 border-b border-gray-200 mb-6">
            {['All', 'Active', 'Blocked'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`pb-3 text-xs font-black uppercase tracking-widest border-b-2 transition ${activeTab === tab ? 'text-[#ff5722] border-[#ff5722]' : 'text-gray-400 border-transparent'}`}>
                {tab}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-[#ff5722] border-t-transparent rounded-full animate-spin"></div></div>
          ) : (
            <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <tr>
                      <th className="py-5 px-6">Customer</th>
                      <th className="py-5 px-6">Phone</th>
                      <th className="py-5 px-6">Addresses</th>
                      <th className="py-5 px-6">Status</th>
                      <th className="py-5 px-6">Joined</th>
                      <th className="py-5 px-6 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filtered.map(customer => (
                      <tr key={customer._id} className="hover:bg-gray-50/50 transition">
                        <td className="py-5 px-6">
                          <div className="flex items-center gap-3">
                            <img src={customer.avatar} alt={customer.name} className="w-9 h-9 rounded-xl object-cover" onError={e => e.target.src = 'https://placehold.co/40x40/000/fff?text=U'} />
                            <div>
                              <p className="text-xs font-black text-gray-800">{customer.name}</p>
                              <p className="text-[10px] text-gray-400">{customer.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-5 px-6 text-xs text-gray-500">{customer.phone || '—'}</td>
                        <td className="py-5 px-6 text-xs text-gray-500">{customer.addresses?.length || 0} saved</td>
                        <td className="py-5 px-6">
                          <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase ${customer.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                            {customer.status}
                          </span>
                        </td>
                        <td className="py-5 px-6 text-[10px] text-gray-400">{new Date(customer.createdAt).toLocaleDateString()}</td>
                        <td className="py-5 px-6 text-right">
                          <button
                            onClick={() => handleToggleStatus(customer._id, customer.status)}
                            className={`text-[10px] font-bold px-3 py-1.5 rounded-lg transition ${customer.status === 'Active' ? 'bg-red-50 text-red-500 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}>
                            {customer.status === 'Active' ? 'Block' : 'Unblock'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filtered.length === 0 && <div className="py-16 text-center text-gray-400 text-sm font-bold">No customers found.</div>}
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}