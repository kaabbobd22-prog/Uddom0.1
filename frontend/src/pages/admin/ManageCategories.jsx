import { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import API from '../../api/axios';

export default function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('categories'); // categories | subcategories | children
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('category'); // category | sub | child
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSub, setSelectedSub] = useState(null);
  const [form, setForm] = useState({ name: '', icon: '📦', type: 'Global' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await API.get('/categories/all');
      setCategories(res.data);
    } catch (err) {
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const openModal = (type, cat = null, sub = null) => {
    setModalType(type);
    setSelectedCategory(cat);
    setSelectedSub(sub);
    setForm({ name: '', icon: '📦', type: 'Global' });
    setError('');
    setShowModal(true);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (modalType === 'category') {
        await API.post('/categories', form);
        setSuccess('Category created!');
      } else if (modalType === 'sub') {
        await API.post(`/categories/${selectedCategory._id}/subcategory`, { name: form.name });
        setSuccess('Sub-category created!');
      } else if (modalType === 'child') {
        await API.post(`/categories/${selectedCategory._id}/subcategory/${selectedSub._id}/child`, { name: form.name });
        setSuccess('Child category created!');
      }
      setShowModal(false);
      fetchCategories();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (catId) => {
    if (!confirm('Delete this category?')) return;
    try {
      await API.delete(`/categories/${catId}`);
      fetchCategories();
      setSuccess('Deleted!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete');
    }
  };

  const handleDeleteSub = async (catId, subId) => {
    if (!confirm('Delete this sub-category?')) return;
    try {
      await API.delete(`/categories/${catId}/subcategory/${subId}`);
      fetchCategories();
    } catch (err) {
      setError('Failed to delete sub-category');
    }
  };

  const toggleStatus = async (cat) => {
    try {
      await API.put(`/categories/${cat._id}`, { ...cat, status: cat.status === 'Active' ? 'Disabled' : 'Active' });
      fetchCategories();
    } catch (err) {
      setError('Failed to update status');
    }
  };

  const totalSubCats = categories.reduce((sum, c) => sum + (c.subCategories?.length || 0), 0);
  const totalChildren = categories.reduce((sum, c) => sum + (c.subCategories?.reduce((s, sub) => s + (sub.childCategories?.length || 0), 0) || 0), 0);

  return (
    <AdminLayout>
      <div className="bg-[#f8fafc] min-h-screen pb-12 font-sans">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="container mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-xl md:text-3xl font-black text-gray-900 uppercase tracking-tighter">Category Architecture</h1>
              <p className="text-[10px] md:text-xs text-gray-400 font-bold tracking-widest uppercase mt-1">Organize Market Segments</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => openModal('category')} className="bg-gray-900 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-black transition">+ Category</button>
              <button onClick={() => { if (!categories.length) return alert('Create a category first'); openModal('sub', categories[0]); }} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition">+ Sub-Category</button>
              <button onClick={() => { if (!categories.length) return alert('Create a category first'); openModal('child', categories[0], categories[0]?.subCategories?.[0]); }} className="bg-green-600 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-green-700 transition">+ Child</button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 mt-8">
          {success && <div className="mb-4 bg-green-50 border border-green-200 text-green-700 text-xs p-3 rounded-xl font-bold">{success}</div>}
          {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-xs p-3 rounded-xl font-bold">{error}</div>}

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Categories', value: categories.length, icon: '📁' },
              { label: 'Sub-Categories', value: totalSubCats, icon: '🌿' },
              { label: 'Child Categories', value: totalChildren, icon: '🔖' },
              { label: 'Disabled', value: categories.filter(c => c.status === 'Disabled').length, icon: '⚠️' },
            ].map((stat, idx) => (
              <div key={idx} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center text-xl">{stat.icon}</div>
                <div>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                  <h3 className="text-lg font-black text-gray-800">{stat.value}</h3>
                </div>
              </div>
            ))}
          </div>

          {/* Category Tree Table */}
          {loading ? (
            <div className="bg-white rounded-3xl p-12 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-[#ff5722] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {categories.map((cat) => (
                <div key={cat._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  {/* Category Row */}
                  <div className="flex items-center justify-between p-5 border-b border-gray-50 hover:bg-gray-50/50 transition">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-xl">{cat.icon}</div>
                      <div>
                        <p className="text-sm font-black text-gray-800">{cat.name}</p>
                        <p className="text-[10px] text-gray-400">/{cat.slug} • {cat.type} • {cat.subCategories?.length || 0} subcategories</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase ${cat.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${cat.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                        {cat.status}
                      </div>
                      <button onClick={() => openModal('sub', cat)} className="text-[10px] font-bold text-blue-600 hover:underline">+ Sub</button>
                      <button onClick={() => toggleStatus(cat)} className="text-[10px] font-bold text-orange-500 hover:underline">{cat.status === 'Active' ? 'Disable' : 'Enable'}</button>
                      <button onClick={() => handleDelete(cat._id)} className="text-[10px] font-bold text-red-500 hover:underline">Delete</button>
                    </div>
                  </div>

                  {/* Sub-Categories */}
                  {cat.subCategories?.map(sub => (
                    <div key={sub._id} className="ml-8 border-b border-gray-50 last:border-0">
                      <div className="flex items-center justify-between p-4 hover:bg-blue-50/30 transition">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                          <div>
                            <p className="text-xs font-bold text-gray-700">{sub.name}</p>
                            <p className="text-[10px] text-gray-400">{sub.childCategories?.length || 0} child categories: {sub.childCategories?.join(', ') || 'None'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <button onClick={() => openModal('child', cat, sub)} className="text-[10px] font-bold text-green-600 hover:underline">+ Child</button>
                          <button onClick={() => handleDeleteSub(cat._id, sub._id)} className="text-[10px] font-bold text-red-400 hover:underline">Delete</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}

              {categories.length === 0 && (
                <div className="bg-white rounded-3xl p-12 text-center">
                  <p className="text-4xl mb-4">📁</p>
                  <p className="text-gray-400 font-bold">No categories yet. Create your first category!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-black text-gray-900 mb-6 uppercase">
              {modalType === 'category' ? '+ New Category' : modalType === 'sub' ? '+ New Sub-Category' : '+ New Child Category'}
            </h3>
            {error && <p className="text-red-500 text-xs mb-4 font-bold">{error}</p>}
            <form onSubmit={handleCreate} className="space-y-4">
              {/* Category selector for sub/child */}
              {(modalType === 'sub' || modalType === 'child') && (
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Select Category</label>
                  <select
                    value={selectedCategory?._id || ''}
                    onChange={e => {
                      const cat = categories.find(c => c._id === e.target.value);
                      setSelectedCategory(cat);
                      if (modalType === 'child') setSelectedSub(cat?.subCategories?.[0] || null);
                    }}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#ff5722]"
                    required
                  >
                    <option value="">-- Select Category --</option>
                    {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
              )}

              {/* Sub selector for child */}
              {modalType === 'child' && selectedCategory && (
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Select Sub-Category</label>
                  <select
                    value={selectedSub?._id || ''}
                    onChange={e => {
                      const sub = selectedCategory.subCategories.find(s => s._id === e.target.value);
                      setSelectedSub(sub);
                    }}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#ff5722]"
                    required
                  >
                    <option value="">-- Select Sub-Category --</option>
                    {selectedCategory?.subCategories?.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#ff5722]"
                  placeholder={modalType === 'category' ? 'e.g. Electronics' : modalType === 'sub' ? 'e.g. Smartphones' : 'e.g. Android'}
                />
              </div>

              {modalType === 'category' && (
                <>
                  <div>
                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Icon (emoji)</label>
                    <input
                      type="text"
                      value={form.icon}
                      onChange={e => setForm({ ...form, icon: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#ff5722]"
                      placeholder="📦"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Type</label>
                    <select
                      value={form.type}
                      onChange={e => setForm({ ...form, type: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#ff5722]"
                    >
                      <option value="Global">Global</option>
                      <option value="B2B Exclusive">B2B Exclusive</option>
                      <option value="Retail">Retail</option>
                    </select>
                  </div>
                </>
              )}

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-bold text-xs uppercase">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 bg-gray-900 text-white py-3 rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-60">
                  {saving ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}