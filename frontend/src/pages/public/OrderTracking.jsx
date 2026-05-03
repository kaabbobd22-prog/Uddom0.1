import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import API from '../../api/axios'; // ✅ axios er bodole API instance auto-import hobe

export default function OrderTracking() {
  const { id } = useParams(); 
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        // API instance use kora hoyechhe jate origin error na hoy
        const res = await API.get(`/orders/${id}`);
        setOrder(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch order:", err);
        setLoading(false);
      }
    };
    if (id) fetchOrder();
  }, [id]);

  // ডাইনামিক টাইমলাইন লজিক
  const getSteps = (currentStatus) => {
    const baseSteps = [
      { id: 1, title: 'Order Placed', desc: 'We have received your order', key: 'Pending' },
      { id: 2, title: 'Processing', desc: 'Seller is packing your items', key: 'Processing' },
      { id: 3, title: 'Shipped', desc: 'Handed over to courier', key: 'Shipped' },
      { id: 4, title: 'Delivered', desc: 'Order delivered to you', key: 'Delivered' }
    ];

    const statusLevels = { 'Pending': 0, 'Processing': 1, 'Shipped': 2, 'Delivered': 3 };
    const currentIndex = statusLevels[currentStatus] !== undefined ? statusLevels[currentStatus] : 0;

    return baseSteps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      current: index === currentIndex && currentStatus !== 'Delivered'
    }));
  };

  if (loading) return <div className="text-center py-20 font-black uppercase tracking-widest text-gray-400 animate-pulse">Loading Tracking Info...</div>;
  if (!order) return <div className="text-center py-20 font-black text-red-500 uppercase tracking-widest text-xl">Order Not Found!</div>;

  const steps = getSteps(order.status);
  const isCancelled = order.status === 'Cancelled';

  return (
    <div className="bg-gray-50 min-h-screen pb-16 pt-8 md:pt-12">
      <div className="container mx-auto px-4 max-w-5xl">

        {/* 1. Success Banner - Design Unchanged */}
        <div className="bg-white rounded-[2.5rem] shadow-xl border-4 border-white p-8 md:p-12 text-center mb-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-[#ff5722]"></div>
          <div className="w-20 h-20 md:w-24 md:h-24 bg-green-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner border border-green-100">
            <span className="text-4xl md:text-5xl text-green-500 drop-shadow-sm">{isCancelled ? '❌' : '✓'}</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-black text-gray-900 uppercase italic tracking-tighter mb-3">
            {isCancelled ? 'Order Cancelled' : 'Thank you for your order!'}
          </h1>
          <p className="text-xs md:text-sm font-bold text-gray-400 uppercase tracking-widest mb-8">
            {isCancelled ? 'This order has been cancelled.' : 'Your order has been placed successfully and is now being tracked.'}
          </p>

          <div className="inline-block bg-gray-50 border-2 border-gray-100 rounded-[1.5rem] px-8 py-4 shadow-sm">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Order Number</p>
            <p className="text-xl md:text-2xl font-black text-[#ff5722] tracking-tighter">{order.orderID || order._id}</p>
          </div>
        </div>

        {/* 2. Order Tracking Timeline - Design Unchanged */}
        {!isCancelled && (
          <div className="bg-white rounded-[2.5rem] shadow-xl border-4 border-white p-8 md:p-10 mb-10">
            <h2 className="text-lg md:text-2xl font-black text-gray-900 uppercase italic tracking-tighter mb-8 border-b border-gray-50 pb-4">Live Tracking Status</h2>

            <div className="relative mt-8 mb-4">
              <div className="hidden md:block absolute top-6 left-12 right-12 h-1.5 bg-gray-100 rounded-full z-0"></div>
              <div className="md:hidden absolute top-6 bottom-6 left-7 w-1.5 bg-gray-100 rounded-full z-0"></div>

              <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-0 relative z-10">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex md:flex-col items-center gap-5 md:gap-4 text-center w-full md:w-1/4 group">
                    <div className={`w-14 h-14 md:w-16 md:h-16 rounded-[1.5rem] flex items-center justify-center font-black text-lg md:text-xl shrink-0 transition-all duration-300 shadow-lg ${step.completed
                      ? 'bg-[#ff5722] border-4 border-orange-100 text-white scale-110'
                      : 'bg-white border-4 border-gray-100 text-gray-300'
                      }`}>
                      {step.completed ? '✓' : index + 1}
                    </div>

                    <div className="text-left md:text-center flex-1">
                      <p className={`font-black text-xs md:text-sm uppercase tracking-tight ${step.completed || step.current ? 'text-gray-900' : 'text-gray-400'}`}>
                        {step.title}
                      </p>
                      <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1.5 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 3. Order Details Summary - Mapping Logic Fix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Items List - Mapping products array instead of items */}
          <div className="bg-white rounded-[2.5rem] shadow-xl border-4 border-white p-8">
            <h2 className="text-lg md:text-xl font-black text-gray-900 uppercase italic tracking-tighter mb-6 border-b border-gray-50 pb-4">Order Items</h2>
            <div className="space-y-6">
              {/* Backend uses 'products' array instead of 'items' */}
              {(order.products || []).map((item, idx) => (
                <div key={idx} className="flex gap-4 items-center group">
                  <div className="w-20 h-20 bg-gray-50 rounded-2xl border-2 border-gray-100 overflow-hidden shrink-0 relative">
                    {/* Accessing nested product images */}
                    <img src={item.product?.images?.[0] || 'https://placehold.co/150'} alt={item.product?.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs md:text-sm font-black text-gray-900 uppercase tracking-tight line-clamp-2">{item.product?.name || 'Product Details'}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1.5">Qty: {item.quantity} <span className="mx-2">|</span> ৳{item.priceAtPurchase}</p>
                    <p className="text-[8px] font-black bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md inline-block mt-2 uppercase">{item.isWholesale ? 'Wholesale' : 'Retail'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Billing Info */}
          <div className="bg-white rounded-[2.5rem] shadow-xl border-4 border-white p-8 flex flex-col justify-between">
            <div>
              <h2 className="text-lg md:text-xl font-black text-gray-900 uppercase italic tracking-tighter mb-6 border-b border-gray-50 pb-4">Order Summary</h2>

              <div className="space-y-4 text-[10px] md:text-xs text-gray-600 mb-6 font-bold uppercase tracking-widest">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Date</span>
                  <span className="text-gray-900">{new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Payment Method</span>
                  <span className="text-gray-900">{order.paymentMethod?.toUpperCase()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Status</span>
                  <span className="text-gray-900">{order.paymentStatus || 'UNPAID'}</span>
                </div>
                <div className="flex justify-between items-center border-t-2 border-dashed border-gray-100 pt-4 mt-4">
                  <span className="text-gray-900 text-xs md:text-sm">Total Amount</span>
                  <span className="font-black text-[#ff5722] text-xl md:text-2xl tracking-tighter">৳{order.totalAmount?.toLocaleString()}</span>
                </div>
              </div>

              <h2 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-3 mt-8">Delivery Address</h2>
              <div className="bg-gray-50 p-5 rounded-[1.5rem] border border-gray-100">
                {/* Accessing nested shippingAddress object[cite: 1] */}
                <p className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest leading-relaxed">
                  <span className="text-gray-900">{order.shippingAddress?.name || order.customer?.name}</span><br />
                  {order.shippingAddress?.address}<br />
                  Phone: {order.shippingAddress?.phone}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <Link to="/account/orders" className="flex-1 text-center bg-gray-100 hover:bg-gray-200 text-gray-900 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.15em] transition-colors shadow-sm">
                All Orders
              </Link>
              <Link to="/" className="flex-1 text-center bg-gray-900 hover:bg-[#ff5722] text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.15em] transition-all shadow-lg active:scale-95">
                Keep Shopping
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}