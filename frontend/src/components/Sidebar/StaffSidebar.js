import React from 'react';
import { Tooltip } from 'react-tooltip';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';
import { useAuth } from '../../context/AuthContext';

const StaffSidebar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate(); // Initialize useNavigate
    const handleNavigation = (path) => {
        navigate(path); // Programmatically navigate to the specified path
    };
    return (
        <nav className="navbar-left" style={{ backgroundColor: '#1C004D' }}>
            <ul className="nav-list">
                <li>
                    <button onClick={() => handleNavigation("/staff/menu")}>
                        <i id="menu" className="fas fa-book"></i>
                    </button>
                    <Tooltip anchorSelect="#menu" place="top"> Menu </Tooltip>
                </li>
                <li>
                    <button onClick={() => handleNavigation("/staff/profile")}>
                        <i id="profile" className="fas fa-user"></i>
                    </button>
                    <Tooltip anchorSelect="#profile" place="top"> Profile </Tooltip>
                </li>
                <li>
                    <button onClick={() => handleNavigation("/staff/invoices")}>
                        <i id="invoices" className="fas fa-file-invoice"></i>
                    </button>
                    <Tooltip anchorSelect="#invoices" place="top"> Invoices </Tooltip>
                </li>

                <li>
                    <button onClick={() => handleNavigation("/staff/wallet")}>
                        <i id="wallet" className="fas fa-wallet"></i>
                    </button>
                    <Tooltip anchorSelect="#wallet" place="top"> Student Wallets </Tooltip>
                </li>
                <li>
                    <button onClick={() => {
                       handleNavigation("/");
                       logout();
                    }}>
                        <i id="logout" className="fas fa-sign-out-alt"></i>
                    </button>
                    <Tooltip anchorSelect="#logout" place="top"> Log Out </Tooltip>
                </li>
            </ul>
        </nav>

    );
};

export default StaffSidebar;