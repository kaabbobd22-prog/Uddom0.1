import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import Home from './pages/public/Home';
import AllCategories from './pages/public/AllCategories';
import BrowseAisle from './pages/public/BrowseAisle';
import CategoryPage from './pages/public/CategoryPage';
import SubcategoryPage from './pages/public/SubcategoryPage';
import BrandPage from './pages/public/BrandPage';
import SellerStorePage from './pages/public/SellerStorePage';
import ProductDetailsPage from './pages/public/ProductDetailsPage';
import SearchResults from './pages/public/SearchResults';
import FlashSale from './pages/public/FlashSale';
import WholesaleDeals from './pages/public/WholesaleDeals';
import Grocery from './pages/public/Grocery';
import Offers from './pages/public/Offers';
import Cart from './pages/public/Cart';
import Checkout from './pages/public/Checkout';
import OrderTracking from './pages/public/OrderTracking';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import HelpCenter from './pages/public/HelpCenter';
import AboutUs from './pages/public/AboutUs';
import Contact from './pages/public/Contact';
import Policies from './pages/public/Policies';

// Customer Pages
import MyProfile from './pages/customer/MyProfile';
import MyOrders from './pages/customer/MyOrders';
import MyWishlist from './pages/customer/MyWishlist';
import MyReviews from './pages/customer/MyReviews';
import MyAddresses from './pages/customer/MyAddresses';
import MyWallet from './pages/customer/MyWallet';
import MyCoupons from './pages/customer/MyCoupons';
import BulkInquiry from './pages/customer/BulkInquiry';
import Notifications from './pages/customer/Notifications';

// Seller Pages
import SellerLogin from './pages/seller/SellerLogin';
import SellerRegister from './pages/seller/SellerRegister';
import SellerDashboard from './pages/seller/SellerDashboard';
import ProductManager from './pages/seller/ProductManager';
import OrderManager from './pages/seller/OrderManager';
import Inventory from './pages/seller/Inventory';
import AdsManager from './pages/seller/AdsManager';
import Finance from './pages/seller/Finance';
import SellerReports from './pages/seller/SellerReports';
import StoreSettings from './pages/seller/StoreSettings';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageSellers from './pages/admin/ManageSellers';
import ManageCustomers from './pages/admin/ManageCustomers'; // এখানে 's' চেক করুন
import ManageProducts from './pages/admin/ManageProducts';
import ManageCategories from './pages/admin/ManageCategories'; // এখানে 'ies' চেক করুন
import ManageAds from './pages/admin/ManageAds';
import ManageOrders from './pages/admin/ManageOrders';
import ManagePayments from './pages/admin/ManagePayments'; // এখানে 's' চেক করুন
import ManageLogistics from './pages/admin/ManageLogistics';
import AdminReport from './pages/admin/AdminReports';
import AdminCMS from './pages/admin/AdminCMS';
import AdminSettings from './pages/admin/AdminSettings';
import SecurityLogs from './pages/admin/SecurityLogs';

export default function App() {
  return (
    <Router>
      <div className="font-sans min-h-screen bg-gray-50 text-gray-900">
        <Routes>
          {/* Public Routes with MainLayout */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/categories" element={<AllCategories />} />
            <Route path="/browse" element={<BrowseAisle />} />
            <Route path="/category/:id" element={<CategoryPage />} />
            <Route path="/subcategory/:id" element={<SubcategoryPage />} />
            <Route path="/brand/:id" element={<BrandPage />} />
            <Route path="/store/:id" element={<SellerStorePage />} />
            <Route path="/product/:id" element={<ProductDetailsPage />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/flash-sale" element={<FlashSale />} />
            <Route path="/wholesale" element={<WholesaleDeals />} />
            <Route path="/grocery" element={<Grocery />} />
            <Route path="/offers" element={<Offers />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/track/:id" element={<OrderTracking />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/help" element={<HelpCenter />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/policies" element={<Policies />} />
          </Route>

          {/* Customer Dashboard Routes */}
          <Route path="/account/profile" element={<MyProfile />} />
          <Route path="/account/orders" element={<MyOrders />} />
          <Route path="/account/wishlist" element={<MyWishlist />} />
          <Route path="/account/reviews" element={<MyReviews />} />
          <Route path="/account/addresses" element={<MyAddresses />} />
          <Route path="/account/wallet" element={<MyWallet />} />
          <Route path="/account/coupons" element={<MyCoupons />} />
          <Route path="/account/bulk-inquiry" element={<BulkInquiry />} />
          <Route path="/account/notifications" element={<Notifications />} />

          {/* Seller Routes */}
          <Route path="/seller/login" element={<SellerLogin />} />
          <Route path="/seller/register" element={<SellerRegister />} />
          <Route path="/seller/dashboard" element={<SellerDashboard />} />
          <Route path="/seller/products" element={<ProductManager />} />
          <Route path="/seller/orders" element={<OrderManager />} />
          <Route path="/seller/inventory" element={<Inventory />} />
          <Route path="/seller/ads" element={<AdsManager />} />
          <Route path="/seller/finance" element={<Finance />} />
          <Route path="/seller/reports" element={<SellerReports />} />
          <Route path="/seller/settings" element={<StoreSettings />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />

          <Route
            path="/admin/*"
            element={
            
                <Routes>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="reports" element={<AdminReport />} />
                  <Route path="sellers" element={<ManageSellers />} />
                  <Route path="customers" element={<ManageCustomers />} /> 
                  <Route path="orders" element={<ManageOrders />} />
                  <Route path="products" element={<ManageProducts />} />
                  <Route path="categories" element={<ManageCategories />} /> 
                  <Route path="ads" element={<ManageAds />} />
                  <Route path="logistics" element={<ManageLogistics />} />
                  <Route path="payments" element={<ManagePayments />} /> 
                  <Route path="security" element={<SecurityLogs />} />
                  <Route path="settings" element={<AdminSettings />} />
                  <Route path="cms" element={<AdminCMS />} />
                </Routes>
              
            }
          />
        </Routes>
      </div>
    </Router>
  );
}