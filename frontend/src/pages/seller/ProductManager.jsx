import { useState, useEffect } from 'react';
import sellerAPI from '../../utils/sellerAxios';
import SellerLayout from '../../layouts/SellerLayout';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export default function ProductManagement() {
  const [activeView, setActiveView] = useState('list');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const sellerData = JSON.parse(localStorage.getItem('sellerData')) || {};
  const sellerId = sellerData.id;

  const [formData, setFormData] = useState({
    name: '', price: '', description: '', category: '', subCategory: '', childCategory: '',
    isWholesale: false, minOrder: ''
  });
  const [tiers, setTiers] = useState([{ minQty: '', price: '' }]);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [prodRes, catRes] = await Promise.all([
          sellerAPI.get('/seller/products'),
          sellerAPI.get('/categories')
        ]);
        setProducts(prodRes.data);
        setCategories(catRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeView]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 5) return alert("Max 5 images allowed");
    setImages([...images, ...files]);
    setPreviews([...previews, ...files.map(f => URL.createObjectURL(f))]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const handleTierChange = (index, field, value) => {
    const newTiers = [...tiers];
    newTiers[index][field] = value;
    setTiers(newTiers);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await sellerAPI.delete(`/seller/products/${productId}`);
      setProducts(products.filter(p => p._id !== productId));
    } catch (err) {
      alert("Failed to delete product.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!sellerData.isApproved) {
      alert("Your store is pending approval. You cannot publish products yet.");
      return;
    }
    if (!formData.subCategory || !formData.childCategory) {
      alert("Please select SubCategory and ChildCategory");
      return;
    }

    setSubmitting(true);
    const data = new FormData();
    data.append('sellerId', sellerId);
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    images.forEach(img => data.append('images', img));
    if (formData.isWholesale) data.append('wholesaleTiers', JSON.stringify(tiers));

    try {
      await sellerAPI.post('/products/add', data);
      alert("🚀 Product Published Successfully!");
      setActiveView('list');
      setFormData({ name: '', price: '', description: '', category: '', subCategory: '', childCategory: '', isWholesale: false, minOrder: '' });
      setImages([]);
      setPreviews([]);
      window.scrollTo(0, 0);
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || "Upload Failed"));
    } finally {
      setSubmitting(false);
    }
  };

  const uniqueMainCats = Array.from(new Map(categories.map(c => [c.Category, c])).values());
  const availableSubs = categories.filter(c => c.Category === formData.category);
  const selectedSubObj = availableSubs.find(s => s.SubCategory === formData.subCategory);

  return (
    <SellerLayout>
      <div className="bg-gray-50 min-h-screen pb-12">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-xl md:text-3xl font-black text-gray-900 uppercase italic tracking-tighter leading-none">Product Management</h1>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">Manage and publish your product catalog</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setActiveView(activeView === 'list' ? 'add' : 'list')}
                className="bg-black text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#ff5722] shadow-xl transition-all">
                {activeView === 'list' ? '+ Add Product' : '← Back to List'}
              </button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 mt-8 max-w-7xl">

          {activeView === 'list' ? (
            <>
              {loading ? (
                <div className="text-center py-20 font-black uppercase text-gray-400 animate-pulse italic tracking-widest text-sm">Loading Products...</div>
              ) : (
                <div className="bg-white rounded-[2.5rem] shadow-sm border-2 border-white overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b-2 border-gray-50">
                          <th className="py-6 px-8">Product</th>
                          <th className="py-6 px-8">Category</th>
                          <th className="py-6 px-8">Price</th>
                          <th className="py-6 px-8">Wholesale</th>
                          <th className="py-6 px-8 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {products.map((product) => (
                          <tr key={product._id} className="hover:bg-gray-50/80 transition-all duration-300">
                            <td className="py-6 px-8">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                                  {product.images?.[0]
                                    ? <img src={product.images[0]} className="w-full h-full object-cover" alt={product.name} />
                                    : <span className="w-full h-full flex items-center justify-center text-lg">📦</span>}
                                </div>
                                <div>
                                  <p className="text-xs font-black text-gray-900 uppercase tracking-tight line-clamp-1">{product.name}</p>
                                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">{product._id.slice(-8)}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-6 px-8 text-[10px] font-bold text-gray-500 uppercase tracking-widest">{product.category}</td>
                            <td className="py-6 px-8 text-sm font-black text-gray-900">৳{product.price?.toLocaleString()}</td>
                            <td className="py-6 px-8">
                              <span className={`text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${
                                product.isWholesale ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
                              }`}>
                                {product.isWholesale ? 'Yes' : 'No'}
                              </span>
                            </td>
                            <td className="py-6 px-8 text-right">
                              <button
                                onClick={() => handleDelete(product._id)}
                                className="bg-red-50 px-4 py-2 rounded-xl text-[9px] font-black text-red-500 uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all ml-2"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                        {products.length === 0 && (
                          <tr><td colSpan={5} className="py-20 text-center text-gray-400 font-black uppercase text-xs">No products yet. Add your first product!</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Add Product Form */
            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white p-8 md:p-10 rounded-[2.5rem] border-4 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
              <div className="grid gap-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Product Name *</label>
                  <input required type="text" placeholder="e.g. Sony WH-1000XM5" className="w-full p-4 border-2 border-black rounded-xl font-bold uppercase text-xs outline-none focus:bg-gray-50 transition" onChange={e => setFormData({ ...formData, name: e.target.value })} />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Category Hierarchy *</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <select required className="p-4 border-2 border-black rounded-xl font-black uppercase text-[10px] outline-none cursor-pointer focus:bg-gray-50 transition"
                      onChange={e => setFormData({ ...formData, category: e.target.value, subCategory: '', childCategory: '' })}>
                      <option value="">Main Category</option>
                      {uniqueMainCats.map(c => <option key={c._id} value={c.Category}>{c.Category}</option>)}
                    </select>
                    <select required disabled={!formData.category} className="p-4 border-2 border-black rounded-xl font-black uppercase text-[10px] outline-none disabled:opacity-30 cursor-pointer focus:bg-gray-50 transition"
                      value={formData.subCategory}
                      onChange={e => setFormData({ ...formData, subCategory: e.target.value, childCategory: '' })}>
                      <option value="">Sub Category</option>
                      {availableSubs.map(s => <option key={s._id} value={s.SubCategory}>{s.SubCategory}</option>)}
                    </select>
                    <select required disabled={!formData.subCategory} className="p-4 border-2 border-black rounded-xl font-black uppercase text-[10px] outline-none disabled:opacity-30 cursor-pointer focus:bg-gray-50 transition"
                      value={formData.childCategory}
                      onChange={e => setFormData({ ...formData, childCategory: e.target.value })}>
                      <option value="">Child Category</option>
                      {selectedSubObj?.ChildCategory?.map((child, i) => <option key={i} value={child}>{child}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Retail Price (৳) *</label>
                    <input required type="number" placeholder="0.00" className="w-full p-4 border-2 border-black rounded-xl font-bold text-xs outline-none focus:bg-gray-50 transition" onChange={e => setFormData({ ...formData, price: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Selling Unit</label>
                    <input type="text" placeholder="e.g. Pcs, Lot, Box" className="w-full p-4 border-2 border-black rounded-xl font-bold text-xs outline-none focus:bg-gray-50 transition" onChange={e => setFormData({ ...formData, unit: e.target.value })} />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Product Details *</label>
                  <textarea required placeholder="Write a detailed description..." className="w-full p-4 border-2 border-black rounded-xl font-bold text-xs h-32 outline-none focus:bg-gray-50 transition leading-relaxed" onChange={e => setFormData({ ...formData, description: e.target.value })}></textarea>
                </div>

                {/* Wholesale Section */}
                <div className="border-2 border-black p-6 rounded-2xl bg-gray-50 mt-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="w-5 h-5 accent-black" onChange={e => setFormData({ ...formData, isWholesale: e.target.checked })} />
                    <span className="font-black uppercase text-xs italic">Enable Wholesale Pricing?</span>
                  </label>
                  {formData.isWholesale && (
                    <div className="mt-6 space-y-4">
                      <input required type="number" placeholder="Minimum Order Quantity (MOQ)" className="w-full p-4 border-2 border-black rounded-xl font-bold text-xs outline-none bg-white" onChange={e => setFormData({ ...formData, minOrder: e.target.value })} />
                      <p className="text-[10px] font-black uppercase text-gray-400 mt-4">Pricing Table (Qty vs Price)</p>
                      {tiers.map((tier, index) => (
                        <div key={index} className="flex gap-2">
                          <input required type="number" placeholder="Min Qty" className="w-1/2 p-3 border-2 border-black rounded-lg text-xs font-bold outline-none bg-white" onChange={e => handleTierChange(index, 'minQty', e.target.value)} />
                          <input required type="number" placeholder="Price per Unit" className="w-1/2 p-3 border-2 border-black rounded-lg text-xs font-bold outline-none bg-white" onChange={e => handleTierChange(index, 'price', e.target.value)} />
                        </div>
                      ))}
                      <button type="button" onClick={() => setTiers([...tiers, { minQty: '', price: '' }])} className="text-[10px] font-black uppercase underline hover:text-[#ff5722] transition">+ Add More Tier</button>
                    </div>
                  )}
                </div>

                {/* Image Gallery */}
                <div className="mt-4">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Product Images (Max 5)</label>
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                    {previews.map((src, i) => (
                      <div key={i} className="relative aspect-square border-2 border-black rounded-xl overflow-hidden group">
                        <img src={src} className="w-full h-full object-cover" alt="" />
                        <button type="button" onClick={() => removeImage(i)} className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity font-black uppercase text-[10px] tracking-widest">Remove</button>
                      </div>
                    ))}
                    {images.length < 5 && (
                      <label className="aspect-square border-2 border-dashed border-black rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition">
                        <span className="text-xl mb-1">📸</span>
                        <span className="text-[8px] font-bold uppercase tracking-widest">Add Photo</span>
                        <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageChange} />
                      </label>
                    )}
                  </div>
                </div>

                <button disabled={submitting} className="w-full bg-black text-white mt-8 p-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[#ff5722] transition-all disabled:bg-gray-400 disabled:cursor-not-allowed shadow-xl active:scale-95">
                  {submitting ? "Publishing..." : "🚀 Publish Product"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </SellerLayout>
  );
}
