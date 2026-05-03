import { useState } from 'react';

export default function Notifications() {
  const [activeTab, setActiveTab] = useState('All');

  const notifications = [
    {
      id: 1,
      type: 'Order',
      title: 'Order Shipped! 🚚',
      message: 'Your order UDY-98210 has been handed over to our courier partner.',
      time: '2 hours ago',
      isUnread: true,
      icon: '📦'
    },
    {
      id: 2,
      type: 'Offer',
      title: 'Exclusive Wholesale Deal! 🔥',
      message: 'New electronic lot available at 15% discount for bulk buyers. Check it now!',
      time: '5 hours ago',
      isUnread: true,
      icon: '🏷️'
    },
    {
      id: 3,
      type: 'System',
      title: 'Security Alert',
      message: 'Your account was logged in from a new device in Dhaka.',
      time: 'Yesterday',
      isUnread: false,
      icon: '🛡️'
    },
    {
      id: 4,
      type: 'Order',
      title: 'Delivery Confirmed',
      message: 'Order UDY-97500 has been successfully delivered. Rate your experience!',
      time: '2 days ago',
      isUnread: false,
      icon: '✅'
    }
  ];

  const tabs = ['All', 'Orders', 'Offers', 'Account'];

  const filteredNotifications = activeTab === 'All'
    ? notifications
    : notifications.filter(n => n.type === activeTab.replace('s', ''));

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* 1. Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="container mx-auto px-4 py-4 md:py-6 flex justify-between items-center">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">Notifications</h1>
            <p className="text-[10px] md:text-sm text-gray-500 mt-0.5">Stay updated with your orders and activities</p>
          </div>
          <button className="text-[#ff5722] text-[10px] md:text-xs font-bold hover:underline">
            Mark all as read
          </button>
        </div>

        {/* 2. Horizontal Tab Navigation */}
        <div className="container mx-auto px-4">
          <div className="flex gap-6 overflow-x-auto scrollbar-hide border-t border-gray-50">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 text-xs md:text-sm font-bold transition whitespace-nowrap border-b-2 ${activeTab === tab ? 'text-[#ff5722] border-[#ff5722]' : 'text-gray-400 border-transparent'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-6 max-w-3xl">

        {/* 3. Notification List */}
        <div className="space-y-3">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-4 rounded-xl border transition cursor-pointer flex gap-4 items-start ${notif.isUnread
                    ? 'bg-white border-orange-100 shadow-sm'
                    : 'bg-gray-50 border-gray-100 opacity-80'
                  }`}
              >
                {/* Icon */}
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-xl shrink-0 ${notif.isUnread ? 'bg-orange-50' : 'bg-gray-200'
                  }`}>
                  {notif.icon}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className={`text-sm md:text-base font-bold ${notif.isUnread ? 'text-gray-800' : 'text-gray-600'}`}>
                      {notif.title}
                    </h3>
                    <span className="text-[9px] md:text-xs text-gray-400 whitespace-nowrap">{notif.time}</span>
                  </div>
                  <p className="text-xs md:text-sm text-gray-500 mt-1 leading-relaxed">
                    {notif.message}
                  </p>
                </div>

                {/* Unread Indicator */}
                {notif.isUnread && (
                  <div className="w-2 h-2 bg-[#ff5722] rounded-full mt-2"></div>
                )}
              </div>
            ))
          ) : (
            <div className="py-20 text-center bg-white rounded-2xl border border-dashed border-gray-200">
              <p className="text-gray-400 text-sm">No notifications found in this category.</p>
            </div>
          )}
        </div>

        {/* 4. Sponsored Ad Banner (Mobile Friendly) */}
        <div className="mt-10 relative w-full h-16 md:h-24 rounded-xl overflow-hidden border border-blue-100 bg-white">
          <img
            src="https://placehold.co/1200x200/eff6ff/1d4ed8?text=Join+UDDOM+VIP+for+Instant+Price+Drop+Alerts"
            className="w-full h-full object-cover opacity-40"
            alt="Ad Banner"
          />
          <div className="absolute inset-0 flex items-center justify-between px-6">
            <p className="text-[10px] md:text-sm font-bold text-blue-900">Get notified before everyone else!</p>
            <button className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-[9px] md:text-xs font-bold shadow-md">Join VIP</button>
          </div>
          <div className="absolute top-1 right-1 text-[7px] md:text-[8px] bg-white px-1 border rounded text-gray-300">Sponsored</div>
        </div>

      </div>
    </div>
  );
}