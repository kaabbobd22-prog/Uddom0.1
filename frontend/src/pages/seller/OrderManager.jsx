import { useState, useEffect } from 'react';
import sellerAPI from '../../utils/sellerAxios';
import SellerLayout from '../../layouts/SellerLayout';

export default function OrderManagement() {
    const [activeTab, setActiveTab] = useState('All');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async (status) => {
        try {
            setLoading(true);
            // Backend endpoint check: '/seller/:sellerId' route matching
            // Query parameter 'status' logic remains as per your route handler
            const params = status !== 'All' ? `?status=${status}` : '';
            const res = await sellerAPI.get(`/orders/seller/me${params}`); // Assuming 'me' middleware or dynamic ID
            setOrders(res.data);
        } catch (err) {
            console.error("Error fetching orders:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders(activeTab);
    }, [activeTab]);

    const updateStatus = async (orderId, newStatus) => {
        try {
            // PATCH method and route '/orders/:id/status' sync
            await sellerAPI.patch(`/orders/${orderId}/status`, { status: newStatus });
            setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
        } catch (err) {
            console.error("Status update error:", err);
            alert("Failed to update status. Please try again.");
        }
    };

    return (
        <SellerLayout>
            <div className="bg-gray-50 min-h-screen pb-12">
                {/* Header - Design Unchanged */}
                <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
                    <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div>
                            <h1 className="text-xl md:text-3xl font-black text-gray-900 uppercase italic tracking-tighter leading-none">Order Management</h1>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">Logistics & Fulfillment Dashboard</p>
                        </div>
                        <div className="flex gap-3">
                            <button className="bg-black text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#ff5722] shadow-xl transition-all">
                                Export CSV
                            </button>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 mt-8 max-w-7xl">

                    {/* Status Tabs - Design Unchanged */}
                    <div className="bg-white p-2 rounded-2xl shadow-sm border-2 border-white mb-8 flex overflow-x-auto scrollbar-hide">
                        {['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 min-w-[120px] py-4 text-[10px] md:text-xs font-black uppercase tracking-widest transition-all rounded-xl ${
                                    activeTab === tab ? 'bg-black text-white shadow-md' : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <div className="text-center py-20 bg-white rounded-[2.5rem] border-2 border-white shadow-sm">
                            <p className="font-black uppercase text-gray-400 animate-pulse italic tracking-widest text-sm">Processing Orders... 📦</p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-[2.5rem] shadow-sm border-2 border-white overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b-2 border-gray-50">
                                            <th className="py-6 px-8">Order ID & Date</th>
                                            <th className="py-6 px-8">Customer</th>
                                            <th className="py-6 px-8">Total Amount</th>
                                            <th className="py-6 px-8">Fulfillment Status</th>
                                            <th className="py-6 px-8 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {orders.map((order) => (
                                            <tr key={order._id} className="hover:bg-gray-50/80 transition-all duration-300">
                                                <td className="py-6 px-8">
                                                    <p className="font-black text-gray-900 text-xs uppercase tracking-tight">#{order.orderID || order._id.slice(-8)}</p>
                                                    <p className="text-[9px] text-gray-400 font-bold mt-1 tracking-widest uppercase">{new Date(order.createdAt).toLocaleDateString()}</p>
                                                </td>
                                                <td className="py-6 px-8">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-black text-gray-400">
                                                            {order.customer?.name ? order.customer.name.charAt(0).toUpperCase() : 'C'}
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-black text-gray-700 uppercase">{order.customer?.name || "Retail Client"}</p>
                                                            <p className="text-[8px] text-gray-400 font-bold uppercase">{order.customer?.phone}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-6 px-8">
                                                    <p className="text-sm md:text-base font-black text-[#ff5722]">৳{order.totalAmount?.toLocaleString()}</p>
                                                    <p className="text-[8px] text-gray-400 font-bold mt-1 tracking-widest uppercase">{order.paymentMethod || 'COD'}</p>
                                                </td>
                                                <td className="py-6 px-8">
                                                    <select
                                                        value={order.status}
                                                        onChange={(e) => updateStatus(order._id, e.target.value)}
                                                        className={`text-[9px] font-black uppercase px-4 py-2 rounded-xl border-none outline-none cursor-pointer transition-all ${
                                                            order.status === 'Pending'    ? 'bg-orange-50 text-orange-600' :
                                                            order.status === 'Processing' ? 'bg-blue-50 text-blue-600' :
                                                            order.status === 'Shipped'    ? 'bg-purple-50 text-purple-600' :
                                                            order.status === 'Cancelled'  ? 'bg-red-50 text-red-600' :
                                                                                            'bg-green-50 text-green-600'
                                                        }`}
                                                    >
                                                        <option value="Pending">Pending</option>
                                                        <option value="Processing">Processing</option>
                                                        <option value="Shipped">Shipped</option>
                                                        <option value="Delivered">Delivered</option>
                                                        <option value="Cancelled">Cancelled</option>
                                                    </select>
                                                </td>
                                                <td className="py-6 px-8 text-right">
                                                    <Link to={`/seller/orders/${order._id}`} className="bg-gray-100 px-4 py-2 rounded-xl text-[9px] font-black text-gray-500 uppercase tracking-widest hover:bg-black hover:text-white transition-all inline-block">View Details</Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {!loading && orders.length === 0 && (
                        <div className="text-center py-24 bg-white rounded-[2.5rem] border-2 border-dashed border-gray-100 mt-8">
                            <span className="text-4xl mb-4 block opacity-50">📭</span>
                            <p className="text-gray-400 font-black uppercase text-xs tracking-widest italic">No orders found in this category</p>
                        </div>
                    )}
                </div>
            </div>
        </SellerLayout>
    );
}