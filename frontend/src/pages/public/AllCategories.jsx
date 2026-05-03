import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios'; // ✅ axios এর বদলে আপনার API instance ইম্পোর্ট করুন

export default function AllCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        // ✅ API instance ব্যবহার করে ডাটা ফেচ
        const res = await API.get('/categories');
        
        // ব্যাকএন্ড থেকে ডাটা সরাসরি অ্যারে না আসলে হ্যান্ডেল করা
        const categoryData = Array.isArray(res.data) ? res.data : res.data.categories || [];
        setCategories(categoryData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // ক্যাটাগরিগুলোকে Main Category অনুযায়ী গ্রুপ করা
  const groupedCategories = categories.reduce((acc, curr) => {
    if (curr && curr.Category) {
      if (!acc[curr.Category]) {
        acc[curr.Category] = [];
      }
      acc[curr.Category].push(curr);
    }
    return acc;
  }, {});

  if (loading) {
    return <div className="text-center py-20 font-black uppercase tracking-widest text-gray-400 animate-pulse">Loading Categories...</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-16">

      {/* Header Area */}
      <div className="bg-white border-b border-gray-100 py-8 md:py-12 shadow-sm mb-10">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 uppercase italic tracking-tighter text-center md:text-left">
            All Categories
          </h1>
          <p className="text-xs md:text-sm font-bold text-gray-400 uppercase tracking-widest mt-2 text-center md:text-left">
            Explore our massive collection of products
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl">
        {Object.keys(groupedCategories).length === 0 ? (
          <div className="text-center text-red-500 font-bold uppercase py-10">No categories found. Please seed the database first.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

            {Object.keys(groupedCategories).map((mainCategoryName, index) => (
              <div key={index} className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-xl border-4 border-white hover:shadow-2xl transition-shadow duration-300">

                {/* Main Category Header */}
                <div className="flex items-center gap-3 mb-6 border-b border-gray-50 pb-4">
                  <div className="w-10 h-10 bg-gray-900 text-white rounded-xl flex items-center justify-center font-black italic shadow-md">
                    {mainCategoryName.charAt(0)}
                  </div>
                  <h2 className="text-lg md:text-xl font-black text-[#ff5722] uppercase italic tracking-tighter">
                    {mainCategoryName}
                  </h2>
                </div>

                {/* Sub Categories & Child Categories */}
                <div className="space-y-6">
                  {groupedCategories[mainCategoryName].map((subCatObj) => (
                    <div key={subCatObj._id}>
                      <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight mb-3 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                        {subCatObj.SubCategory}
                      </h3>

                      <div className="flex flex-wrap gap-2 pl-3">
                        {/* Optional chaining (?) ensures it won't crash if ChildCategory is missing */}
                        {subCatObj.ChildCategory?.map((childItem, childIndex) => (
                          <Link
                            key={childIndex}
                            to={`/category/${mainCategoryName}/${subCatObj.SubCategory}/${childItem}`.replace(/\s+/g, '-').toLowerCase()}
                            className="bg-gray-50 hover:bg-orange-50 text-gray-600 hover:text-[#ff5722] border border-gray-100 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-colors"
                          >
                            {childItem}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            ))}

          </div>
        )}
      </div>
    </div>
  );
}