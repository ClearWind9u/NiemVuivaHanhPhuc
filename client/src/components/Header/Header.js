import React from "react";
import { Tooltip } from 'react-tooltip';
import { useAuth } from "../../context/AuthContext";
import './Header.css';

const Header = () => {
    const { avatar } = useAuth();

    return (
        <header className="header-section">
            <div className="logo">
                <img src="../image/logo2.png" alt="JoHap" style={{ width: '150px', height: '90px' }} />
            </div>
            <Tooltip anchorSelect=".logo" place="right"> Joy and Happiness Canteen </Tooltip>
            <div className="avatar">
                <img src={avatar || "../image/avatar.jpg"} // Dùng avatar nếu có, không thì dùng mặc định
                    alt="User Avatar" />
            </div>
        </header>
    );
};

export default Header;