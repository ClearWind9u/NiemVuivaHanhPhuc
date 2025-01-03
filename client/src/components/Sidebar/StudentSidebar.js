import React from "react";
import { Tooltip } from "react-tooltip";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Sidebar.css";

const StudentSidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate(); // Initialize useNavigate
  const handleNavigation = (path) => {
    navigate(path); // Programmatically navigate to the specified path
  };
  return (
    <nav className="navbar-left">
      <ul className="nav-list">
        <li>
          <button onClick={() => handleNavigation("/menu")}>
            <i id="menu" className="fas fa-book"></i>
          </button>
          <Tooltip anchorSelect="#menu" place="top">
            {" "}
            Menu{" "}
          </Tooltip>
        </li>
        <li>
          <button onClick={() => handleNavigation("/profile")}>
            <i id="profile" className="fas fa-user"></i>
          </button>
          <Tooltip anchorSelect="#profile" place="top">
            {" "}
            Profile{" "}
          </Tooltip>
        </li>
        <li>
          <button onClick={() => handleNavigation("/cart")}>
            <i id="cart" className="fas fa-shopping-cart"></i>
          </button>
          <Tooltip anchorSelect="#cart" place="top">
            {" "}
            Shopping Cart{" "}
          </Tooltip>
        </li>

        <li>
          <button onClick={() => handleNavigation("/wallet")}>
            <i id="wallet" className="fas fa-wallet"></i>
          </button>
          <Tooltip anchorSelect="#wallet" place="top">
            {" "}
            My Wallet{" "}
          </Tooltip>
        </li>
        <li>
          <button
            onClick={() => {
              handleNavigation("/");
              logout();
            }}
          >
            <i id="logout" className="fas fa-sign-out-alt"></i>
          </button>
          <Tooltip anchorSelect="#logout" place="top">
            {" "}
            Log Out{" "}
          </Tooltip>
        </li>
      </ul>
    </nav>
  );
};

export default StudentSidebar;
