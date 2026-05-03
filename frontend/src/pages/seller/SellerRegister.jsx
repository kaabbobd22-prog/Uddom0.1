import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export default function SellerRegister() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    ownerName: '',
    email: '',
    password: '',
    storeName: '',
    businessType: 'Retailer / Shop Owner',
    phone: '',
    tradeLicenseOrNID: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleNextStep = () => {
    if (!formData.ownerName || !formData.email || !formData.password) {
      setError("Please fill all fields including password.");
      return;
    }
    setError('');
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Step 1: Register
      await axios.post(`${BASE_URL}/seller/auth/register`, {
        ownerName: formData.ownerName,
        email:     formData.email,
        password:  formData.password
      });

      // Step 2: Auto-login
      const loginRes = await axios.post(`${BASE_URL}/seller/auth/login`, {
        email:    formData.email,
        password: formData.password
      });

      if (loginRes.data.success) {
        const { token, seller } = loginRes.data;
        localStorage.setItem('sellerToken', token);
        localStorage.setItem('sellerData', JSON.stringify(seller));

        // Step 3: Save store settings
        const updateRes = await axios.put(`${BASE_URL}/seller/auth/settings/${seller.id}`, {
          storeName:         formData.storeName,
          phone:             formData.phone,
          address:           '',
          tradeLicenseOrNID: formData.tradeLicenseOrNID,
          businessType:      formData.businessType
        });

        localStorage.setItem('sellerData', JSON.stringify(updateRes.data.seller));

        alert("Application Submitted! Awaiting Admin Approval.");
        navigate('/seller/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">

        <div className="flex flex-col md:flex-row">
          {/* Left Side: Brand/Info Section */}
          <div className="md:w-1/3 bg-gray-900 p-8 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10">
              <Link to="/" className="text-2xl font-black tracking-tighter">
                UDDOM<span className="text-[#ff5722]">.</span>
              </Link>
              <h2 className="text-xl font-bold mt-10 leading-tight">Grow your business with UDDOM.</h2>
              <p className="text-xs text-gray-400 mt-4 leading-relaxed">
                Join 12,000+ verified wholesalers and retailers across Bangladesh.
              </p>
            </div>
            <div className="relative z-10 mt-10">
              <div className="flex items-center gap-3 mb-4 opacity-80">
                <span className="text-xl">🚀</span>
                <p className="text-[10px] font-bold uppercase tracking-widest">Fast Onboarding</p>
              </div>
              <div className="flex items-center gap-3 opacity-80">
                <span className="text-xl">📦</span>
                <p className="text-[10px] font-bold uppercase tracking-widest">Bulk Sales Support</p>
              </div>
            </div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#ff5722] rounded-full blur-[80px] opacity-20"></div>
          </div>

          {/* Right Side: Form Section */}
          <div className="md:w-2/3 p-8 md:p-10">
            {/* Step Indicator */}
            <div className="flex gap-2 mb-8">
              <div className={`h-1.5 flex-1 rounded-full ${step >= 1 ? 'bg-[#ff5722]' : 'bg-gray-100'}`}></div>
              <div className={`h-1.5 flex-1 rounded-full ${step >= 2 ? 'bg-[#ff5722]' : 'bg-gray-100'}`}></div>
            </div>

            <h2 className="text-2xl font-black text-gray-800 mb-2">
              {step === 1 ? 'Account Setup' : 'Store Setup'}
            </h2>
            <p className="text-xs text-gray-400 font-medium mb-6 uppercase tracking-widest">Step {step} of 2</p>

            {error && (
              <div className="mb-4 bg-red-50 text-red-600 text-[10px] font-black uppercase p-3 rounded-lg border border-red-100">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {step === 1 ? (
                <div className="animate-in fade-in duration-300">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Owner Full Name *</label>
                    <input type="text" required value={formData.ownerName} onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })} className="w-full border-2 border-gray-100 bg-gray-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#ff5722] transition" placeholder="e.g. Mohammed Irfanul Islam" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Email Address *</label>
                    <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full border-2 border-gray-100 bg-gray-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#ff5722] transition" placeholder="biz@example.com" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Create Password *</label>
                    <input type="password" required value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full border-2 border-gray-100 bg-gray-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#ff5722] transition" placeholder="••••••••" />
                  </div>
                  <button type="button" onClick={handleNextStep} className="w-full bg-gray-900 text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-black transition shadow-lg mt-4">
                    Next Step →
                  </button>
                </div>
              ) : (
                <div className="animate-in slide-in-from-right duration-300">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Store / Brand Name *</label>
                    <input type="text" required value={formData.storeName} onChange={(e) => setFormData({ ...formData, storeName: e.target.value })} className="w-full border-2 border-gray-100 bg-gray-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#ff5722] transition" placeholder="e.g. Irfan's Gadget Galaxy" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Phone Number *</label>
                      <input type="tel" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full border-2 border-gray-100 bg-gray-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#ff5722] transition" placeholder="017XXXXXXXX" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Business Type</label>
                      <select value={formData.businessType} onChange={(e) => setFormData({ ...formData, businessType: e.target.value })} className="w-full border-2 border-gray-100 bg-gray-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#ff5722] transition">
                        <option>Manufacturer / Wholesaler</option>
                        <option>Retailer / Shop Owner</option>
                        <option>Distributor</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Trade License / BIN (Optional)</label>
                    <input type="text" value={formData.tradeLicenseOrNID} onChange={(e) => setFormData({ ...formData, tradeLicenseOrNID: e.target.value })} className="w-full border-2 border-gray-100 bg-gray-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#ff5722] transition" placeholder="For B2B Verification" />
                  </div>
                  <div className="flex items-start gap-2 py-2">
                    <input type="checkbox" required className="mt-1 w-4 h-4 accent-[#ff5722]" id="agree" />
                    <label htmlFor="agree" className="text-[10px] text-gray-500 font-medium leading-tight">
                      I agree to UDDOM's <Link to="/policies" className="text-[#ff5722] font-bold hover:underline">Seller Terms & Conditions</Link> regarding commissions and logistics.
                    </label>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button type="button" onClick={() => setStep(1)} className="flex-1 bg-gray-100 text-gray-600 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition">Back</button>
                    <button type="submit" disabled={loading} className="flex-[2] bg-[#ff5722] text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#e64a19] transition shadow-lg shadow-orange-100 disabled:bg-gray-400">
                      {loading ? 'Submitting...' : 'Submit Application'}
                    </button>
                  </div>
                </div>
              )}
            </form>

            <div className="mt-8 text-center">
              <p className="text-[10px] md:text-xs text-gray-400 font-medium">
                Already have a store? <Link to="/seller/login" className="text-[#ff5722] font-black hover:underline uppercase tracking-tighter">Login here</Link>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 px-8 py-3 flex items-center justify-between border-t border-orange-100">
          <p className="text-[9px] text-orange-800 font-bold uppercase italic">Special Offer: 0% Commission for the first 30 days!</p>
          <span className="text-[8px] bg-white px-2 border rounded text-orange-300 font-bold">PARTNER PROMO</span>
        </div>
      </div>
    </div>
  );
}
