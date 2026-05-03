import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../../api/axios';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // ✅ ফিক্স: form.email এবং form.password পাঠানো হয়েছে
      const res = await API.post('/admin/login', { 
        email: form.email, 
        password: form.password 
      });
      
      localStorage.setItem('adminToken', res.data.token);
      localStorage.setItem('adminData', JSON.stringify(res.data.admin)); // 'user' এর বদলে 'admin' (আপনার ব্যাকএন্ড অনুযায়ী)
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0f172a] min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#ff5722] rounded-full blur-[120px] opacity-10"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600 rounded-full blur-[120px] opacity-10"></div>

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-white tracking-tighter">UDDOM <span className="text-[#ff5722]">ADMIN</span></h1>
          <p className="text-[10px] text-gray-500 uppercase tracking-[0.4em] mt-2 font-bold">Authorized Access Only</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-[2.5rem] shadow-2xl">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white">System Login</h2>
            <p className="text-xs text-gray-400 mt-1">Please enter your administrative credentials.</p>
          </div>

          {error && <div className="mb-4 bg-red-500/20 border border-red-500/30 text-red-300 text-xs p-3 rounded-xl">{error}</div>}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Admin Email</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40">🆔</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm text-white focus:outline-none focus:border-[#ff5722] focus:bg-white/10 transition-all"
                  placeholder="admin@uddom.com"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2 ml-1">
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest">Password</label>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40">🔐</span>
                <input
                  type="password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm text-white focus:outline-none focus:border-[#ff5722] focus:bg-white/10 transition-all"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#ff5722] to-orange-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60"
            >
              {loading ? 'Authenticating...' : 'Initialize Session'}
            </button>
          </form>
        </div>

        <div className="mt-8 text-center">
          <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest leading-loose">
            UDDOM Infrastructure Management System <br />
            Secure Core v2.0.4 • Dhaka Node
          </p>
        </div>
      </div>
    </div>
  );
}