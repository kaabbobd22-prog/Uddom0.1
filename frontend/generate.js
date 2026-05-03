import fs from 'fs';
import path from 'path';

const pages = {
  public: ['Home', 'AllCategories', 'BrowseAisle', 'CategoryPage', 'SubcategoryPage', 'BrandPage', 'SellerStorePage', 'ProductDetailsPage', 'SearchResults', 'FlashSale', 'WholesaleDeals', 'Grocery', 'Offers', 'Cart', 'Checkout', 'OrderTracking', 'Login', 'Register', 'HelpCenter', 'AboutUs', 'Contact', 'Policies'],
  customer: ['MyProfile', 'MyOrders', 'MyWishlist', 'MyReviews', 'MyAddresses', 'MyWallet', 'MyCoupons', 'BulkInquiry', 'Notifications'],
  seller: ['SellerLogin', 'SellerRegister', 'SellerDashboard', 'ProductManager', 'OrderManager', 'Inventory', 'AdsManager', 'Finance', 'SellerReports', 'StoreSettings'],
  admin: ['AdminLogin', 'AdminDashboard', 'ManageSellers', 'ManageCustomers', 'ManageProducts', 'ManageCategories', 'ManageAds', 'ManageOrders', 'ManagePayments', 'ManageLogistics', 'AdminReports', 'AdminCMS', 'AdminSettings', 'SecurityLogs']
};

const baseDir = path.join(process.cwd(), 'src', 'pages');

Object.entries(pages).forEach(([folder, files]) => {
  const dirPath = path.join(baseDir, folder);
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });

  files.forEach(file => {
    const filePath = path.join(dirPath, `${file}.jsx`);
    const content = `export default function ${file}() {
  return (
    <div className="p-10 text-2xl font-bold text-center border-b border-gray-200">
      ${file} Page
    </div>
  );
}\n`;
    if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, content);
  });
});

console.log('All pages created successfully!');