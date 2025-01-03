// src/StudentApp.js
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import ManageCoupon from './components/AdminUI/ManageCoupon';
import ManageMenu from './components/AdminUI/ManageMenu';
import ManageOrder from './components/AdminUI/ManageOrders';
import ManageUser from './components/AdminUI/ManageUser';
import BrandStory from './components/StaffUI/BrandStory';
import Ingredients from './components/StaffUI/Ingredients';
import MemberList from './components/StudentUI/MemberList';
import PaymentMethods from './components/StudentUI/PaymentMethods';
import PrivacyPolicy from './components/StudentUI/PrivacyPolicy';
import ShippingPolicy from './components/StudentUI/ShippingPolicy';
import AdminSidebar from './components/Sidebar/AdminSidebar';
import AdminFooter from './components/Footer/AdminFooter';
import Header from './components/Header/Header';
import IncomeStatistics from './components/AdminUI/IncomeStatistics';
import "./AdminApp.css";
const AdminApp = () => {
  return (
    <Router>
      <div className="menu-page">
        {/* Left Sidebar Navigation */}
        <AdminSidebar />
        {/* Main Content */}
        <div className="main-content">
          {/* Header */}
          <Header />
          <Routes>
            <Route path="/" element={<ManageMenu />} />
            <Route path="/admin/manage-menu" element={<ManageMenu />} />
            <Route path="/admin/manage-user" element={<ManageUser />} />
            <Route path="/admin/manage-coupon" element={<ManageCoupon />} />
            <Route path="/admin/manage-order" element={<ManageOrder />} />
            <Route path="/admin/wallet" element={<ManageOrder />} />
            <Route path="/admin/statistics" element={<IncomeStatistics />} />
            {/* Add additional routes as needed */}
            <Route path="/admin/member-list" element={<MemberList />} />
            <Route path="/admin/brand-story" element={<BrandStory />} />
            <Route path="/admin/ingredients" element={<Ingredients />} />
            <Route path="/admin/payment-methods" element={<PaymentMethods />} />
            <Route path="/admin/shipping-policy" element={<ShippingPolicy />} />
            <Route path="/admin/privacy-policy" element={<PrivacyPolicy />} />
          </Routes>
          {/* Footer */}
          <AdminFooter />
        </div>
      </div>
    </Router>
  );
};

export default AdminApp;
