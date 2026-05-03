import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../../api/axios'; // Path-ti ekbar check korun

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. API post call (Citations chara)
      const res = await API.post('/auth/login', formData);

      // 2. LocalStorage-e data rakha
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      // 3. Redirect ebong reload
      navigate('/');
      window.location.reload(); 
    } catch (err) {
      setError(err.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100">
        <h2 className="text-3xl font-black text-gray-900 tracking-tighter mb-2 text-center uppercase italic">
          Welcome Back<span className="text-[#ff5722]">.</span>
        </h2>
        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest text-center mb-8">
          Login to your UDDOM account
        </p>

        {error && (
          <p className="bg-red-50 text-red-500 p-3 rounded-xl text-xs font-bold mb-4 text-center">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email Address"
            required
            className="w-full px-5 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-[#ff5722]/20 outline-none text-sm font-medium"
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            required
            className="w-full px-5 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-[#ff5722]/20 outline-none text-sm font-medium"
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          <button 
            type="submit" 
            className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-[#ff5722] transition-all active:scale-95"
          >
            Sign In
          </button>
        </form>

        <p className="mt-8 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">
          New to UDDOM? <Link to="/register" className="text-[#ff5722]">Create Account</Link>
        </p>
      </div>
    </div>
  );
}