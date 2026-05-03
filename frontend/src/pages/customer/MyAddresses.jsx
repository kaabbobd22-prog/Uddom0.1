import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // navigate missing chilo
import API from '../../api/axios';

export default function MyAddresses() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const storedUser = JSON.parse(localStorage.getItem('user'));

      // 1. Backend onujayi 'id' field check kora
      const userId = storedUser?.id || storedUser?._id;

      if (!userId) {
        console.error("User ID not found in localStorage");
        navigate('/login');
        return;
      }

      try {
        // 2. Sothik userId diye GET request
        const res = await API.get(`/users/${userId}`);
        setUser(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Profile load error:", err);
        setError("Could not load profile. Please login again.");
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  const removeAddress = async (addressId) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;

    try {
      // 3. Backend e id mapping thik rakha
      const userId = user?.id || user?._id;
      const res = await API.delete(`/users/${userId}/address/${addressId}`);

      if (res.data.success) {
        // 4. Update state and sync localStorage[cite: 6]
        setUser(res.data.user);
        localStorage.setItem('user', JSON.stringify(res.data.user));
      }
    } catch (err) {
      alert("Failed to delete address.");
    }
  };

  if (loading) return <div className="text-center py-20 animate-pulse font-black uppercase text-gray-400">Loading...</div>;

  return (
    <div className="bg-gray-50 min-h-screen pb-16 pt-6 md:pt-10">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-xl md:text-3xl font-black text-gray-800 uppercase tracking-tight">My Addresses</h1>
            <p className="text-xs md:text-sm text-gray-500 mt-1 font-medium">Manage your shipping and billing locations</p>
          </div>
          <button className="bg-[#ff5722] hover:bg-[#e64a19] text-white px-6 py-2.5 rounded-lg font-bold text-xs md:text-sm transition shadow-sm flex items-center justify-center gap-2">
            <span>+</span> Add New Address
          </button>
        </div>

        {error && <p className="text-red-500 font-bold mb-4">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {user?.addresses?.map((addr) => (
            // MongoDB er address array-te shob somoy _id thake[cite: 6]
            <div key={addr._id} className="bg-white rounded-xl p-5 border-2 border-gray-100 transition shadow-sm relative overflow-hidden group">
              <div className="flex flex-col h-full">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">{addr.type === 'Home' ? '🏠' : '🏢'}</span>
                  <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{addr.type}</span>
                </div>
                <div className="space-y-1 mb-6">
                  <h3 className="font-bold text-gray-800 text-sm md:text-base">{addr.name}</h3>
                  <p className="text-xs md:text-sm text-gray-600 leading-relaxed">{addr.address}</p>
                  <p className="text-xs md:text-sm text-gray-500 mt-2 font-semibold">📞 {addr.phone}</p>
                </div>
                <div className="mt-auto pt-4 border-t border-gray-50 flex items-center gap-4">
                  <button className="text-xs font-bold text-gray-700 hover:text-[#ff5722] transition">Edit</button>
                  <span className="text-gray-200">|</span>
                  <button
                    onClick={() => removeAddress(addr._id)}
                    className="text-xs font-bold text-gray-400 hover:text-red-500 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-gray-400 hover:border-[#ff5722] hover:text-[#ff5722] transition cursor-pointer bg-white/50 group">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-2xl mb-2 group-hover:bg-orange-50 transition">
              +
            </div>
            <p className="text-xs font-bold uppercase tracking-wider">Add Another Address</p>
          </div>
        </div>
      </div>
    </div>
  );
}