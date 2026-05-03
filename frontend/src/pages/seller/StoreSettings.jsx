import { useState } from 'react';
import sellerAPI from '../../utils/sellerAxios';
import { useNavigate } from 'react-router-dom';
import SellerLayout from '../../layouts/SellerLayout';

export default function StoreSettings() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const sellerData = JSON.parse(localStorage.getItem('sellerData')) || {};

  const [storeInfo, setStoreInfo] = useState({
    ownerName:         sellerData.ownerName         || '',
    email:             sellerData.email             || '',
    storeName:         sellerData.storeName         || '',
    tagline:           sellerData.tagline           || '',
    description:       sellerData.description       || '',
    businessType:      sellerData.businessType      || 'Retailer / Shop Owner',
    address:           sellerData.address           || '',
    phone:             sellerData.phone             || '',
    tradeLicenseOrNID: sellerData.tradeLicenseOrNID || '',
    isApproved:        sellerData.isApproved        || false,
    status:            sellerData.status            || 'Pending'
  });

  const handleChange = (e) => {
    setStoreInfo({ ...storeInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await sellerAPI.put(`/seller/auth/settings/${sellerData.id}`, storeInfo);

      if (res.data.success) {
        const updatedSeller = { ...sellerData, ...res.data.seller };
        localStorage.setItem('sellerData', JSON.stringify(updatedSeller));

        setMessage({ type: 'success', text: 'Store profile updated successfully! Sent for Admin review.' });
        setTimeout(() => navigate('/seller/dashboard'), 3000);
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update settings.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SellerLayout>
      <div className="bg-gray-50 min-h-screen pb-12">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-xl md:text-3xl font-black text-gray-900 uppercase italic tracking-tighter leading-none">Store Settings</h1>
              <p className="text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-widest mt-2">Customize your brand identity and public profile</p>
            </div>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-black text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#ff5722] shadow-xl transition-all disabled:bg-gray-400 active:scale-95"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        <div className="container mx-auto px-4 mt-8 max-w-6xl">

          {message.text && (
            <div className={`mb-6 p-4 rounded-xl border font-black text-xs uppercase tracking-widest ${
              message.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
            }`}>
              {message.text}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Left: Branding & Status */}
            <div className="space-y-6">

              <div className={`rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden ${storeInfo.isApproved ? 'bg-blue-600' : 'bg-orange-600'}`}>
                <div className="relative z-10">
                  <p className="text-[8px] font-black uppercase tracking-[0.2em] mb-4 opacity-80">Account Status</p>
                  <h3 className="text-2xl font-black italic tracking-tighter flex items-center gap-2 uppercase">
                    {storeInfo.isApproved ? 'Verified Seller' : 'Review Pending'}
                    {storeInfo.isApproved
                      ? <span className="bg-white text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-[12px] not-italic">✔</span>
                      : <span className="text-xl not-italic">⏳</span>}
                  </h3>
                  <p className="text-[10px] mt-3 opacity-90 leading-relaxed font-bold uppercase tracking-widest">
                    {storeInfo.isApproved
                      ? "You are eligible to post Wholesale Lots and receive Bulk Inquiries."
                      : "Your store is currently under review by UDDOM Admins. You will gain full access once approved."}
                  </p>
                </div>
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full"></div>
              </div>

              <div className="bg-white p-8 rounded-[2rem] shadow-sm border-2 border-white">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Visual Identity</h3>
                <div className="text-center mb-8">
                  <div className="relative inline-block">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-gray-50 border-4 border-gray-100 shadow-inner overflow-hidden">
                      <img src="https://placehold.co/150x150/000000/ffffff?text=LOGO" alt="Logo" className="w-full h-full object-cover" />
                    </div>
                    <button className="absolute -bottom-2 -right-2 bg-black text-white p-2 rounded-xl shadow-lg hover:bg-[#ff5722] transition">📸</button>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-4 font-bold uppercase tracking-widest">Store Logo</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Cover Banner</p>
                  <div className="relative h-24 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden group cursor-pointer hover:bg-gray-100 transition">
                    <p className="text-[10px] font-bold text-gray-400 uppercase z-10">Upload Banner</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Store Details Form */}
            <div className="lg:col-span-2 space-y-6">
              <form onSubmit={handleSubmit} className="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-sm border-2 border-white">
                <h3 className="text-xs font-black text-gray-900 uppercase italic tracking-widest mb-8 border-b-2 border-gray-50 pb-4">Business Information</h3>
                <div className="space-y-6">

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Owner Full Name</label>
                      <input type="text" name="ownerName" value={storeInfo.ownerName} onChange={handleChange} className="w-full border-2 border-gray-100 bg-gray-50 rounded-xl px-4 py-3.5 text-xs font-bold focus:border-[#ff5722] focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Store / Brand Name</label>
                      <input type="text" name="storeName" value={storeInfo.storeName} onChange={handleChange} className="w-full border-2 border-gray-100 bg-gray-50 rounded-xl px-4 py-3.5 text-xs font-black text-gray-900 focus:border-[#ff5722] focus:outline-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Tagline (Slogan)</label>
                      <input type="text" name="tagline" value={storeInfo.tagline} onChange={handleChange} className="w-full border-2 border-gray-100 bg-gray-50 rounded-xl px-4 py-3.5 text-xs font-bold focus:border-[#ff5722] focus:outline-none" placeholder="e.g. Retail & Wholesale Electronics Hub" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Business Type</label>
                      <select name="businessType" value={storeInfo.businessType} onChange={handleChange} className="w-full border-2 border-gray-100 bg-gray-50 rounded-xl px-4 py-3.5 text-xs font-bold focus:border-[#ff5722] focus:outline-none">
                        <option>Manufacturer / Wholesaler</option>
                        <option>Retailer / Shop Owner</option>
                        <option>Distributor</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Store Description</label>
                    <textarea name="description" rows="4" value={storeInfo.description} onChange={handleChange} className="w-full border-2 border-gray-100 bg-gray-50 rounded-xl px-4 py-3.5 text-xs font-bold focus:border-[#ff5722] focus:outline-none leading-relaxed" placeholder="Tell customers about your products and services..."></textarea>
                  </div>

                  <h3 className="text-xs font-black text-gray-900 uppercase italic tracking-widest mb-6 mt-8 border-b-2 border-gray-50 pb-4">Contact & Legal</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Registered Email</label>
                      <input type="email" name="email" value={storeInfo.email} readOnly className="w-full border-2 border-gray-100 bg-gray-100 text-gray-500 rounded-xl px-4 py-3.5 text-xs font-bold outline-none cursor-not-allowed" />
                      <p className="text-[8px] text-gray-400 font-bold uppercase mt-1">Cannot be changed</p>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Contact Phone</label>
                      <input type="tel" name="phone" value={storeInfo.phone} onChange={handleChange} className="w-full border-2 border-gray-100 bg-gray-50 rounded-xl px-4 py-3.5 text-xs font-bold focus:border-[#ff5722] focus:outline-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Business Address</label>
                      <input type="text" name="address" value={storeInfo.address} onChange={handleChange} className="w-full border-2 border-gray-100 bg-gray-50 rounded-xl px-4 py-3.5 text-xs font-bold focus:border-[#ff5722] focus:outline-none" placeholder="e.g. Tb gate, Mohakhali, Dhaka" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Trade License / BIN</label>
                      <input type="text" name="tradeLicenseOrNID" value={storeInfo.tradeLicenseOrNID} onChange={handleChange} className="w-full border-2 border-gray-100 bg-gray-50 rounded-xl px-4 py-3.5 text-xs font-bold focus:border-[#ff5722] focus:outline-none" />
                    </div>
                  </div>

                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </SellerLayout>
  );
}
