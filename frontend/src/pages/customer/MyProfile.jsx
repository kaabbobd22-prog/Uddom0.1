import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../../api/axios'; // Centralized axios instance use korun

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Address Form State
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    type: 'Home',
    name: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const storedUser = JSON.parse(localStorage.getItem('user'));

      // backend 'id' pathachhe, kintu amra safety-r jonno duto-i check korbo
      const userId = storedUser?.id || storedUser?._id;

      if (!userId) {
        console.error("User ID not found in localStorage");
        navigate('/login'); // ID na thakle login-e pathiye dibe
        return;
      }

      try {
        // API instance use kora hoyeche jate domain conflict na hoy
        const res = await API.get(`/users/${userId}`);
        setUser(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Profile load error:", err);
        // Server fail korle local storage data dekhabe fallback hishebe
        setUser(storedUser);
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      // Backend mapping: id/id duto-i kaj korbe
      const userId = user?.id || user?._id;
      const res = await API.post(`/users/${userId}/address`, newAddress);
      
      if (res.data.success) {
        setUser(res.data.user);
        localStorage.setItem('user', JSON.stringify(res.data.user)); // local storage sync
        setShowAddressForm(false);
        setNewAddress({ type: 'Home', name: '', phone: '', address: '' });
      }
    } catch (err) {
      alert("Failed to add address.");
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    try {
      const userId = user?.id || user?._id;
      const res = await API.delete(`/users/${userId}/address/${addressId}`);
      
      if (res.data.success) {
        setUser(res.data.user);
        localStorage.setItem('user', JSON.stringify(res.data.user));
      }
    } catch (err) {
      alert("Failed to delete address.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    navigate('/login'); // Logout hobar por login-e redirect
  };

  if (loading) return <div className="text-center py-20 font-black uppercase tracking-widest text-gray-400 animate-pulse">Loading Profile...</div>;

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <h1 className="text-3xl md:text-5xl font-black text-gray-900 uppercase italic tracking-tighter mb-8 text-center md:text-left">
          My Account
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border-4 border-white text-center">
              <div className="w-32 h-32 mx-auto rounded-[2rem] overflow-hidden border-4 border-gray-100 shadow-lg mb-6">
                <img src={user?.avatar} alt={user?.name} className="w-full h-full object-cover" />
              </div>
              <h2 className="text-xl font-black text-gray-900 uppercase italic tracking-tighter">{user?.name}</h2>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1 mb-6">{user?.email}</p>

              <div className="space-y-3">
                <Link to="/account/orders" className="block w-full bg-gray-50 hover:bg-orange-50 hover:text-[#ff5722] text-gray-700 py-3 rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-[0.2em] transition-colors border border-gray-100 shadow-sm">
                  My Orders
                </Link>
                <button onClick={handleLogout} className="w-full bg-gray-900 hover:bg-red-600 text-white py-3 rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-[0.2em] transition-all shadow-lg active:scale-95">
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* Address Management */}
          <div className="w-full lg:w-2/3">
            <div className="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-xl border-4 border-white">
              <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
                <h3 className="text-lg md:text-2xl font-black text-gray-900 uppercase italic tracking-tighter">Manage Addresses</h3>
                <button
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="bg-[#ff5722] text-white px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-md hover:bg-gray-900 transition-colors"
                >
                  {showAddressForm ? 'Cancel' : '+ Add New'}
                </button>
              </div>

              {showAddressForm && (
                <form onSubmit={handleAddAddress} className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100 mb-8 animate-fade-in-down">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Address Type</label>
                      <select
                        value={newAddress.type}
                        onChange={(e) => setNewAddress({ ...newAddress, type: e.target.value })}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-[#ff5722]"
                      >
                        <option value="Home">Home</option>
                        <option value="Office">Office</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Receiver Name</label>
                      <input
                        required type="text"
                        value={newAddress.name}
                        onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-[#ff5722]"
                        placeholder="e.g. John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Phone Number</label>
                      <input
                        required type="text"
                        value={newAddress.phone}
                        onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-[#ff5722]"
                        placeholder="e.g. +880 1711..."
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Full Address</label>
                      <textarea
                        required rows="2"
                        value={newAddress.address}
                        onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-[#ff5722]"
                        placeholder="e.g. House 12, Road 5, Banani, Dhaka"
                      />
                    </div>
                  </div>
                  <button type="submit" className="bg-gray-900 hover:bg-[#ff5722] text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-colors shadow-lg">
                    Save Address
                  </button>
                </form>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {user?.addresses?.length === 0 ? (
                  <div className="col-span-full text-center py-10 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
                    <p className="text-gray-400 font-black uppercase text-xs tracking-widest italic">No saved addresses found.</p>
                  </div>
                ) : (
                  user?.addresses?.map((addr) => (
                    <div key={addr._id} className="border-2 border-gray-100 rounded-[1.5rem] p-5 hover:border-orange-200 hover:shadow-md transition-all group relative bg-white">
                      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleDeleteAddress(addr._id)} className="bg-red-50 text-red-500 p-2 rounded-lg hover:bg-red-500 hover:text-white transition-colors">
                          🗑️
                        </button>
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        <span className="bg-gray-900 text-white text-[8px] font-black px-2.5 py-1 rounded-md uppercase tracking-widest shadow-sm">{addr.type}</span>
                      </div>
                      <p className="font-black text-sm text-gray-900 uppercase tracking-tight">{addr.name}</p>
                      <p className="text-xs text-gray-600 mt-1.5 leading-relaxed font-medium line-clamp-2">{addr.address}</p>
                      <p className="text-xs text-gray-500 mt-2 font-bold">{addr.phone}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}