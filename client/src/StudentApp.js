// src/StudentApp.js
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import BrandStory from './components/StudentUI/BrandStory';
import Cart from './components/StudentUI/Cart';
import Ingredients from './components/StudentUI/Ingredients';
import MemberList from './components/StudentUI/MemberList';
import Menu from './components/StudentUI/Menu';
import Payment from './components/StudentUI/Payment';
import PaymentMethods from './components/StudentUI/PaymentMethods';
import PrivacyPolicy from './components/StudentUI/PrivacyPolicy';
import ShippingPolicy from './components/StudentUI/ShippingPolicy';
import UserProfile from './components/StudentUI/UserProfile';
import Wallet from './components/StudentUI/Wallet';
import StudentFooter from './components/Footer/StudentFooter';
import StudentSidebar from './components/Sidebar/StudentSidebar';
import Header from './components/Header/Header';
import "./StudentApp.css";
const StudentApp = () => {
  return (
    <Router>
      <div className="main-page">
        {/* Left Sidebar Navigation */}
        <StudentSidebar />
        {/* Main Content */}
        <div className="main-content">
          {/* Header */}
          <Header />
          <Routes>
            <Route path="/" element={<Menu />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/wallet" element={<Wallet />} />
            {/* Add additional routes as needed */}
            <Route path="/member-list" element={<MemberList />} />
            <Route path="/brand-story" element={<BrandStory />} />
            <Route path="/ingredients" element={<Ingredients />} />
            <Route path="/payment-methods" element={<PaymentMethods />} />
            <Route path="/shipping-policy" element={<ShippingPolicy />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          </Routes>
          {/* Footer */}
          <StudentFooter />
        </div>
      </div>
    </Router>
  );
};

export default StudentApp;
