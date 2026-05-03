import { Link } from 'react-router-dom';

export default function Grocery() {
  // Mock Data for Grocery Categories
  const groceryCats = [
    { id: 1, name: 'Cooking Essentials', icon: '🧴' },
    { id: 2, name: 'Fresh Vegetables', icon: '🥦' },
    { id: 3, name: 'Rice & Grains', icon: '🌾' },
    { id: 4, name: 'Beverages', icon: '🥤' },
    { id: 5, name: 'Snacks', icon: '🍪' },
    { id: 6, name: 'Dairy & Eggs', icon: '🥚' },
  ];

  const groceryProducts = Array.from({ length: 9 }).map((_, i) => ({
    id: i + 1,
    name: i % 2 === 0 ? 'Fresh Soybean Oil 5L Pet' : 'Premium Miniket Rice 10kg',
    price: i % 2 === 0 ? 890 : 750,
    wholesale: i % 2 === 0 ? 840 : 710,
    img: `https://placehold.co/300x300/f1f5f9/475569?text=Grocery+${i + 1}`,
    weight: i % 2 === 0 ? '5L' : '10kg',
    tag: i % 3 === 0 ? 'Fresh' : 'Organic'
  }));

  return (
    <div className="bg-white min-h-screen pb-12">

      {/* 1. Grocery Header Section */}
      <section className="bg-green-600 text-white py-6 md:py-10 px-4">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-2xl md:text-4xl font-black mb-2 uppercase italic tracking-tighter">
              UDDOM Grocery Store 🥦
            </h1>
            <p className="text-xs md:text-sm font-medium opacity-90 max-w-md">
              Fresh items delivered within 2 hours. Best wholesale prices for your daily pantry needs.
            </p>
          </div>
          <div className="bg-white/20 backdrop-blur-md rounded-lg p-3 border border-white/30 flex items-center gap-3">
            <span className="text-2xl">🚚</span>
            <div>
              <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest">Express Delivery</p>
              <p className="text-[9px] md:text-[11px] opacity-80 italic">Available in Mohakhali, Dhaka</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Horizontal Category Scroll */}
      <section className="container mx-auto px-4 py-6">
        <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide">
          {groceryCats.map((cat) => (
            <button key={cat.id} className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-full shrink-0 hover:border-green-500 hover:bg-green-50 transition group">
              <span className="text-base">{cat.icon}</span>
              <span className="text-xs font-bold text-gray-700 group-hover:text-green-700">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* 3. Grocery Ad Slot (Realistic Banner) */}
      <section className="container mx-auto px-4 py-2">
        <div className="relative w-full h-20 md:h-32 rounded-xl overflow-hidden shadow-sm border border-green-100">
          <img
            src="https://placehold.co/1200x200/f0fdf4/166534?text=Bundle+Offer:+Save+৳200+on+Monthly+Pantry+Pack"
            alt="Grocery Offer"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2 right-2 bg-white/90 text-[8px] md:text-[10px] px-1.5 py-0.5 rounded border text-gray-500">Sponsored</div>
        </div>
      </section>

      {/* 4. Grocery Product Grid (Mobile: 3 Columns) */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-sm md:text-xl font-bold text-gray-800">Essentials You Need</h2>
          <Link to="/browse" className="text-green-600 text-[10px] md:text-sm font-bold hover:underline">See All</Link>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-4">
          {groceryProducts.map((product, index) => {
            const showInFeedAd = index === 6;

            return (
              <div key={product.id} className="contents">
                {showInFeedAd && (
                  <div className="col-span-full my-3">
                    <div className="w-full h-16 md:h-24 bg-orange-50 border border-orange-100 rounded-lg flex items-center justify-between px-4 overflow-hidden relative">
                      <div>
                        <p className="text-[10px] md:text-sm font-bold text-orange-800">Premium Tea Brand Sale</p>
                        <p className="text-[8px] md:text-xs text-orange-600">Buy 2 Get 1 Free Today!</p>
                      </div>
                      <button className="bg-orange-500 text-white text-[8px] md:text-xs px-3 py-1.5 rounded-md font-bold">Shop Now</button>
                      <div className="absolute top-0 right-0 bg-white text-gray-400 text-[7px] px-1 rounded-bl">Ad</div>
                    </div>
                  </div>
                )}

                {/* Grocery Product Card */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition flex flex-col relative group">

                  {/* Fresh/Organic Tag */}
                  <div className="absolute top-1 left-1 z-10 bg-green-500 text-white text-[7px] md:text-[9px] font-bold px-1 py-0.5 rounded shadow-sm uppercase">
                    {product.tag}
                  </div>

                  {/* Image */}
                  <div className="aspect-square bg-gray-50 overflow-hidden">
                    <img src={product.img} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-300" />
                  </div>

                  {/* Details */}
                  <div className="p-1.5 md:p-3 flex flex-col flex-grow">
                    <h3 className="text-[9px] md:text-sm font-bold text-gray-800 line-clamp-2 leading-tight mb-1">{product.name}</h3>
                    <p className="text-[8px] md:text-xs text-gray-500 mb-2 font-medium">{product.weight}</p>

                    <div className="mt-auto">
                      <p className="text-gray-900 font-black text-xs md:text-lg leading-none mb-1">৳{product.price}</p>
                      <div className="bg-green-50 text-green-700 text-[7px] md:text-[10px] px-1 py-0.5 rounded font-bold inline-block border border-green-100">
                        Wholesale: ৳{product.wholesale}
                      </div>

                      <button className="w-full mt-2 bg-gray-900 hover:bg-black text-white text-[9px] md:text-xs py-1.5 rounded font-bold transition">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}