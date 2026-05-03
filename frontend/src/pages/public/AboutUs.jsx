import { Link } from 'react-router-dom';

export default function AboutUs() {
  const stats = [
    { id: 1, label: 'Active Sellers', value: '50K+' },
    { id: 2, label: 'Products Listed', value: '2M+' },
    { id: 3, label: 'Monthly Visitors', value: '5M+' },
    { id: 4, label: 'Cities Covered', value: '64' },
  ];

  const features = [
    { id: 1, icon: '🤝', title: 'Empowering Businesses', desc: 'We connect local wholesalers and manufacturers directly with retailers and consumers.' },
    { id: 2, icon: '🛡️', title: 'Secure Transactions', desc: '100% payment protection and verified sellers ensure a safe trading environment.' },
    { id: 3, icon: '📦', title: 'Nationwide Logistics', desc: 'Fast, reliable, and trackable delivery across all 64 districts of Bangladesh.' },
    { id: 4, icon: '💡', title: 'Tech-Driven', desc: 'Smart algorithms for B2B pricing, RFQs, and seamless multi-vendor cart management.' },
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-16">

      {/* 1. Hero Section */}
      <div className="bg-gray-900 text-white pt-16 pb-24 md:pt-24 md:pb-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://placehold.co/1920x600/000000/ffffff?text=UDDOM+Network')] bg-cover bg-center"></div>
        <div className="container mx-auto text-center relative z-10 max-w-3xl">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6">Empowering Commerce Across Bangladesh</h1>
          <p className="text-sm md:text-lg text-gray-300 leading-relaxed">
            UDDOM is the nation's premier multi-vendor marketplace, bridging the gap between B2B wholesale and everyday retail shopping. We bring the entire supply chain to your fingertips.
          </p>
        </div>
      </div>

      {/* 2. Stats Section (Overlapping the hero) */}
      <div className="container mx-auto px-4 -mt-10 md:-mt-16 relative z-20 mb-12 md:mb-20">
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 md:p-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x-0 md:divide-x divide-gray-100">
          {stats.map(stat => (
            <div key={stat.id} className="flex flex-col">
              <span className="text-2xl md:text-4xl font-bold text-[#ff5722] mb-1">{stat.value}</span>
              <span className="text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Our Story & Mission */}
      <div className="container mx-auto px-4 mb-16 md:mb-24 max-w-6xl">
        <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-center">
          <div className="w-full md:w-1/2">
            <div className="relative aspect-video md:aspect-square rounded-2xl overflow-hidden shadow-lg">
              <img
                src="https://placehold.co/800x800/f8fafc/334155?text=UDDOM+Team+&+Warehouse"
                alt="UDDOM Warehouse"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur p-4 rounded-xl shadow-sm border border-gray-100">
                <p className="text-sm font-bold text-gray-800">Founded in 2024</p>
                <p className="text-xs text-gray-600 mt-1">Headquartered in Dhaka, Bangladesh</p>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <h2 className="text-[#ff5722] font-bold text-sm md:text-base uppercase tracking-wider mb-2">Our Story</h2>
            <h3 className="text-2xl md:text-4xl font-bold text-gray-800 mb-6 leading-tight">We are building the digital infrastructure for commerce.</h3>
            <div className="space-y-4 text-sm md:text-base text-gray-600 leading-relaxed">
              <p>
                What started as an idea to simplify wholesale sourcing has grown into a massive ecosystem. UDDOM was created to solve a fundamental problem: local manufacturers and large wholesalers lacked a unified, tech-driven platform to reach both massive B2B buyers and individual retail consumers efficiently.
              </p>
              <p>
                Today, UDDOM allows anyone to buy a single unit for their home or 10,000 units for their business—all from the same seamless interface. Our tiered pricing engine ensures that the more you buy, the more you save.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Why Choose UDDOM */}
      <div className="bg-white border-y border-gray-200 py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-4">Why UDDOM?</h2>
            <p className="text-sm md:text-base text-gray-500 max-w-2xl mx-auto">
              Whether you are a seller looking to scale your business or a buyer hunting for the best deals, we provide the ultimate ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {features.map(feature => (
              <div key={feature.id} className="bg-gray-50 rounded-xl p-6 md:p-8 text-center hover:shadow-md transition border border-transparent hover:border-gray-200">
                <div className="text-4xl md:text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-base md:text-lg font-bold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-xs md:text-sm text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Call to Action */}
      <div className="container mx-auto px-4 mt-16 md:mt-24">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl overflow-hidden shadow-lg p-8 md:p-12 text-center text-white max-w-4xl mx-auto border border-gray-700">
          <h2 className="text-2xl md:text-4xl font-bold mb-4">Join the UDDOM Network Today</h2>
          <p className="text-sm md:text-base text-gray-300 mb-8 max-w-xl mx-auto">
            Experience a new era of e-commerce. Start shopping or open your digital storefront to reach millions of customers nationwide.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/seller/register" className="bg-[#ff5722] hover:bg-[#e64a19] text-white px-8 py-3 rounded-full font-bold text-sm md:text-base transition shadow-sm">
              Become a Seller
            </Link>
            <Link to="/categories" className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-3 rounded-full font-bold text-sm md:text-base transition shadow-sm">
              Start Shopping
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}