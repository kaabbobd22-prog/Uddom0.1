export default function Contact() {
  const contactInfo = [
    {
      id: 1,
      icon: "📍",
      title: "Corporate Office",
      detail: "TB Gate, Mohakhali, Dhaka-1212, Bangladesh"
    },
    {
      id: 2,
      icon: "📞",
      title: "Phone Support",
      detail: "+880 1234-567890 (Sat-Thu, 9am-6pm)"
    },
    {
      id: 3,
      icon: "✉️",
      title: "Email Us",
      detail: "support@UDDOM.com, sales@UDDOM.com"
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-16">

      {/* 1. Page Header */}
      <div className="bg-gray-900 text-white py-12 md:py-20 px-4 text-center">
        <h1 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">Get in Touch</h1>
        <p className="text-xs md:text-sm text-gray-400 max-w-lg mx-auto">
          Have questions about wholesale orders, technical issues, or partnership opportunities? Our team is here to help.
        </p>
      </div>

      <div className="container mx-auto px-4 -mt-8 md:-mt-12 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* 2. Left Side: Contact Form */}
          <div className="w-full lg:w-2/3 bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-10">
            <h2 className="text-lg md:text-2xl font-bold text-gray-800 mb-6">Send us a Message</h2>

            <form className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="col-span-1">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Full Name</label>
                <input
                  type="text"
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#ff5722] bg-gray-50"
                  placeholder="e.g. Irfanul Islam"
                />
              </div>
              <div className="col-span-1">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Email Address</label>
                <input
                  type="email"
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#ff5722] bg-gray-50"
                  placeholder="e.g. irfan@UDDOM.com"
                />
              </div>
              <div className="col-span-full md:col-span-1">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Subject</label>
                <select className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#ff5722] bg-gray-50">
                  <option>General Inquiry</option>
                  <option>Wholesale/Bulk Order</option>
                  <option>Seller Registration Issue</option>
                  <option>Payment/Refund Support</option>
                  <option>Corporate Partnership</option>
                </select>
              </div>
              <div className="col-span-full md:col-span-1">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Phone Number</label>
                <input
                  type="text"
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#ff5722] bg-gray-50"
                  placeholder="+880 1XXX-XXXXXX"
                />
              </div>
              <div className="col-span-full">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Message</label>
                <textarea
                  rows="5"
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#ff5722] bg-gray-50"
                  placeholder="How can we help you?"
                ></textarea>
              </div>

              <div className="col-span-full text-right mt-2">
                <button
                  type="submit"
                  className="w-full md:w-auto bg-[#ff5722] hover:bg-[#e64a19] text-white px-10 py-3 rounded-lg font-bold transition shadow-sm"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>

          {/* 3. Right Side: Info Cards & Map */}
          <div className="w-full lg:w-1/3 space-y-6">

            {/* Info Cards */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 flex flex-col gap-8">
              {contactInfo.map(info => (
                <div key={info.id} className="flex gap-4">
                  <span className="text-2xl md:text-3xl shrink-0">{info.icon}</span>
                  <div>
                    <h3 className="font-bold text-gray-800 text-sm md:text-base">{info.title}</h3>
                    <p className="text-xs md:text-sm text-gray-500 mt-1 leading-relaxed">{info.detail}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Dummy Map Placeholder */}
            <div className="bg-gray-200 rounded-xl overflow-hidden aspect-video md:aspect-auto md:h-64 relative border border-gray-100 shadow-sm">
              <img
                src="https://placehold.co/600x400/e2e8f0/64748b?text=Map+Location+Placeholder"
                alt="Map Location"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-white/90 backdrop-blur px-4 py-2 rounded-full text-[10px] md:text-xs font-bold text-gray-700 shadow-md">
                  📍 Mohakhali, Dhaka
                </span>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* 4. Bottom Support CTA (Mobile Friendly) */}
      <div className="container mx-auto px-4 mt-12 md:mt-16 text-center">
        <div className="bg-[#ff5722]/5 border border-[#ff5722]/20 rounded-2xl p-6 md:p-10 max-w-4xl mx-auto">
          <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-2">Need Faster Support?</h2>
          <p className="text-xs md:text-sm text-gray-600 mb-6">Talk to our live agents right now for instant assistance with your orders.</p>
          <button className="bg-gray-900 text-white px-8 py-3 rounded-full font-bold text-xs md:text-sm hover:bg-black transition shadow-sm">
            Start Live Chat
          </button>
        </div>
      </div>

    </div>
  );
}