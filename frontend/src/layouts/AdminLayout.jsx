import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function AdminLayout({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', icon: '📊', path: '/admin/dashboard' },
    { name: 'Global Reports', icon: '📈', path: '/admin/reports' },
    { name: 'Manage Sellers', icon: '🏪', path: '/admin/sellers' },
    { name: 'Manage Customers', icon: '👥', path: '/admin/customers' },
    { name: 'Order Ledger', icon: '📜', path: '/admin/orders' },
    { name: 'Product Moderator', icon: '📦', path: '/admin/products' },
    { name: 'Category Tree', icon: '📁', path: '/admin/categories' },
    { name: 'Ad Manager', icon: '📢', path: '/admin/ads' },
    { name: 'Logistics & Fleet', icon: '🚚', path: '/admin/logistics' },
    { name: 'Financial Treasury', icon: '💰', path: '/admin/payments' },
    { name: 'Security Logs', icon: '🛡️', path: '/admin/security' },
    { name: 'System Settings', icon: '⚙️', path: '/admin/settings' },
  ];

  const adminData = JSON.parse(localStorage.getItem('adminData') || '{}');

  const handleSignOut = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    navigate('/admin/login');
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <aside className={`bg-gray-900 text-white transition-all duration-300 flex-shrink-0 z-50 ${isSidebarOpen ? 'w-72' : 'w-20'} fixed lg:relative h-full min-h-screen`}>
        <div className="p-6 flex items-center justify-between border-b border-white/5">
          {isSidebarOpen && (
            <Link to="/admin/dashboard" className="text-xl font-black tracking-tighter">
              UDDOM<span className="text-[#ff5722]">.</span>ADMIN
            </Link>
          )}
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="text-xl hover:text-[#ff5722] transition">
            {isSidebarOpen ? '⇠' : '⇢'}
          </button>
        </div>

        <nav className="mt-6 px-3 space-y-1 overflow-y-auto h-[calc(100vh-160px)] scrollbar-hide">
          {menuItems.map((item) => (
            <Link key={item.name} to={item.path}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all group ${location.pathname === item.path ? 'bg-[#ff5722] text-white shadow-lg' : 'hover:bg-white/5 text-gray-400 hover:text-white'}`}>
              <span className="text-xl">{item.icon}</span>
              {isSidebarOpen && <span className="text-[11px] font-black uppercase tracking-widest leading-none">{item.name}</span>}
            </Link>
          ))}
        </nav>

        {isSidebarOpen && (
          <div className="absolute bottom-0 left-0 w-full p-4 bg-black/20 border-t border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-orange-500 rounded-lg flex items-center justify-center font-black">
                {adminData.name?.[0]?.toUpperCase() || 'A'}
              </div>
              <div>
                <p className="text-[10px] font-black text-white leading-none">{adminData.name || 'Admin'}</p>
                <p className="text-[8px] text-gray-500 font-bold uppercase mt-1">Super Admin</p>
              </div>
            </div>
          </div>
        )}
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden" style={{ marginLeft: isSidebarOpen ? '0' : '0' }}>
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="relative w-full max-w-md hidden md:block">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30">🔍</span>
            <input type="text" placeholder="Search anything..." className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:outline-none focus:border-[#ff5722] transition" />
          </div>
          <div className="flex items-center gap-6 ml-auto">
            <button onClick={handleSignOut} className="text-[10px] font-black text-gray-900 uppercase tracking-widest hover:text-[#ff5722] transition">
              Sign Out
            </button>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto scroll-smooth">
          <div className="container mx-auto">
            {children}
          </div>
        </section>
      </main>
    </div>
  );
}