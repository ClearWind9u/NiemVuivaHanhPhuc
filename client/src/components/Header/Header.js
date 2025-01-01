import React, { useState } from "react";
import { Tooltip } from 'react-tooltip';
import { useAuth } from "../../context/AuthContext";
import './Header.css';

const Header = () => {
    const { avatar } = useAuth();
    const [showModal, setShowModal] = useState(false);

    const handleAvatarClick = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <>
            <header className="header-section">
                <div className="logo">
                    <img src="../image/logo2.png" alt="JoHap" style={{ width: '150px', height: '90px' }} />
                </div>
                <Tooltip anchorSelect=".logo" place="right"> Joy and Happiness Canteen </Tooltip>
                <div className="avatar">
                    <img
                        src={avatar || "../image/avatar.jpg"}
                        alt="User Avatar"
                        onClick={handleAvatarClick} // Hiển thị modal khi bấm vào avatar
                    />
                </div>
            </header>
            {showModal && (
                <div className="avatar-modal" onClick={closeModal}>
                    <img
                        src={avatar || "../image/avatar.jpg"}
                        alt="Full-size Avatar"
                    />
                    <button className="close-btn" onClick={closeModal}>
                        Close
                    </button>
                </div>
            )}
        </>
    );
};

export default Header;