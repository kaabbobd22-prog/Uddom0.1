import { Link } from 'react-router-dom';

export default function BrowseAisle() {
  const mainCategories = [
    { id: 1, name: 'Grocery & Staples', active: true },
    { id: 2, name: 'Electronics & Gadgets', active: false },
    { id: 3, name: 'Men\'s Fashion', active: false },
    { id: 4, name: 'Women\'s Fashion', active: false },
    { id: 5, name: 'Home & Kitchen', active: false },
    { id: 6, name: 'Health & Beauty', active: false },
    { id: 7, name: 'Industrial & B2B', active: false },
  ];

  const subCategories = [
    { id: 101, name: 'Rice & Grains', img: 'https://placehold.co/150x150/fdf4ff/86198f?text=Rice' },
    { id: 102, name: 'Cooking Oil', img: 'https://placehold.co/150x150/fdf4ff/86198f?text=Oil' },
    { id: 103, name: 'Spices', img: 'https://placehold.co/150x150/fdf4ff/86198f?text=Spices' },
    { id: 104, name: 'Snacks & Biscuits', img: 'https://placehold.co/150x150/fdf4ff/86198f?text=Snacks' },
    { id: 105, name: 'Beverages', img: 'https://placehold.co/150x150/fdf4ff/86198f?text=Drinks' },
    { id: 106, name: 'Fresh Fruits', img: 'https://placehold.co/150x150/fdf4ff/86198f?text=Fruits' },
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      
      {/* Page Header Banner */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 md:py-6">
          <h1 className="text-xl md:text-3xl font-bold text-gray-800">Browse Aisle</h1>
          <p className="text-xs md:text-sm text-gray-500 mt-1">Discover millions of products across all categories</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          
          {/* Left Sidebar: Main Categories (Horizontal scroll on mobile, Vertical on desktop) */}
          <div className="w-full md:w-1/4 lg:w-1/5 shrink-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden sticky top-32">
              <h3 className="font-bold text-gray-800 p-4 border-b border-gray-100 hidden md:block">Categories</h3>
              <ul className="flex md:flex-col overflow-x-auto md:overflow-visible scrollbar-hide">
                {mainCategories.map((cat) => (
                  <li key={cat.id} className="shrink-0 md:shrink">
                    <button 
                      className={`w-full text-left px-4 py-3 text-xs md:text-sm font-medium transition border-b border-gray-50 md:border-none ${
                        cat.active 
                          ? 'bg-orange-50 text-[#ff5722] border-b-2 md:border-b-0 md:border-l-4 md:border-[#ff5722]' 
                          : 'text-gray-600 hover:bg-gray-50 hover:text-[#ff5722]'
                      }`}
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Content Area: Subcategories & Ads */}
          <div className="w-full md:w-3/4 lg:w-4/5">
            
            {/* Category Banner (Sponsored) */}
            <div className="relative w-full h-24 md:h-40 rounded-xl overflow-hidden shadow-sm mb-6">
              <img 
                src="https://placehold.co/1000x300/ecfdf5/047857?text=Grocery+Mega+Sale+-+Save+Up+to+30%" 
                alt="Category Banner" 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 bg-white/80 backdrop-blur text-gray-600 text-[9px] md:text-xs px-2 py-0.5 rounded shadow-sm border border-gray-200">
                Sponsored
              </div>
            </div>

            <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4">Grocery & Staples</h2>

            {/* Subcategories Grid (3 cols mobile, 4-5 cols desktop) */}
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-5 mb-8">
              {subCategories.map((sub) => (
                <Link to={`/category/${sub.id}`} key={sub.id} className="group">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-2 md:p-3 text-center transition hover:shadow-md hover:border-[#ff5722]">
                    <div className="aspect-square rounded-full overflow-hidden mb-2 md:mb-3 bg-gray-50 mx-auto w-12 h-12 md:w-20 md:h-20">
                      <img src={sub.img} alt={sub.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-300" />
                    </div>
                    <h4 className="text-[10px] md:text-sm font-medium text-gray-700 leading-tight">{sub.name}</h4>
                  </div>
                </Link>
              ))}
            </div>

            {/* In-Feed Promoted Brands Slot */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 relative flex items-center justify-between">
               <div>
                  <h3 className="text-sm md:text-base font-bold text-blue-900 mb-1">Fresh Farm Organics</h3>
                  <p className="text-[10px] md:text-xs text-blue-700">Get 10% off on all wholesale organic products.</p>
               </div>
               <button className="bg-blue-600 text-white text-[10px] md:text-sm px-3 py-1.5 md:px-5 md:py-2 rounded-md font-medium">
                 View Brand
               </button>
               <div className="absolute top-0 right-0 bg-white text-gray-500 text-[8px] px-1 rounded-bl shadow-sm border-l border-b border-gray-200">
                  Ad
               </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}