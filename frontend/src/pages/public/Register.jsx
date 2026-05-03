import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../../api/axios'; // Centralized API instance use korun

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'customer' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Shudhu endpoint path (/auth/register) likhun
      // Purno URL axios.js er baseURL theke auto chole asbe
      await API.post('/auth/register', formData);
      
      alert("Registration Successful! Please Login.");
      navigate('/login');
    } catch (err) {
      // Error message handling
      setError(err.response?.data?.message || "Registration Failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100">
        <h2 className="text-3xl font-black text-gray-900 tracking-tighter mb-2 text-center">
          JOIN UDDOM<span className="text-[#ff5722]">.</span>
        </h2>
        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest text-center mb-8">
          Start your journey with us
        </p>

        {error && <p className="bg-red-50 text-red-500 p-3 rounded-xl text-xs font-bold mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text" placeholder="Full Name" required
            className="w-full px-5 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-[#ff5722]/20 outline-none text-sm font-medium"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <input
            type="email" placeholder="Email Address" required
            className="w-full px-5 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-[#ff5722]/20 outline-none text-sm font-medium"
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <input
            type="password" placeholder="Password" required
            className="w-full px-5 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-[#ff5722]/20 outline-none text-sm font-medium"
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          
          <select
            className="w-full px-5 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-[#ff5722]/20 outline-none text-sm font-bold text-gray-500"
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          >
            <option value="customer">I am a Customer</option>
            <option value="seller">I am a Seller</option>
          </select>

          <button type="submit" className="w-full bg-[#ff5722] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-orange-200 hover:bg-black transition-all active:scale-95">
            Create Account
          </button>
        </form>
        <p className="mt-8 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">
          Already have an account? <Link to="/login" className="text-[#ff5722]">Login</Link>
        </p>
      </div>
    </div>
  );
}