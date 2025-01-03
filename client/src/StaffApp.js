// src/Staff.js
import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import BrandStory from './components/StaffUI/BrandStory';
import Ingredients from './components/StaffUI/Ingredients';
import Invoices from './components/StaffUI/Invoices';
import MemberList from './components/StudentUI/MemberList';
import Menu from './components/StaffUI/Menu';
import PaymentMethods from './components/StudentUI/PaymentMethods';
import PrivacyPolicy from './components/StudentUI/PrivacyPolicy';
import ShippingPolicy from './components/StudentUI/ShippingPolicy';
import UserProfile from './components/StaffUI/UserProfile';
import Wallet from './components/StaffUI/Wallet';
import StaffSidebar from './components/Sidebar/StaffSidebar';
import StaffFooter from './components/Footer/StaffFooter';
import Header from './components/Header/Header';
import "./AdminApp.css";

const StaffApp = () => {
    return (
        <Router>
            <div className="main-page">
                {/* Left Sidebar Navigation */}
                <StaffSidebar />
                {/* Main Content */}
                <div className="main-content">
                    {/* Header */}
                    <Header />
                    <Routes>
                        <Route path="/" element={<Menu />} />
                        <Route path="/staff/menu" element={<Menu />} />
                        <Route path="/staff/profile" element={<UserProfile />} />
                        <Route path="/staff/invoices" element={<Invoices />} />
                        <Route path="/staff/wallet" element={<Wallet />} />
                        {/* Add additional routes as needed */}
                        <Route path="/staff/member-list" element={<MemberList />} />
                        <Route path="/staff/brand-story" element={<BrandStory />} />
                        <Route path="/staff/ingredients" element={<Ingredients />} />
                        <Route path="/staff/payment-methods" element={<PaymentMethods />} />
                        <Route path="/staff/shipping-policy" element={<ShippingPolicy />} />
                        <Route path="/staff/privacy-policy" element={<PrivacyPolicy />} />
                    </Routes>
                    {/* Footer */}
                    <StaffFooter />
                </div>
            </div>
        </Router>

    );
};

export default StaffApp;
