import React from "react";
import { Tooltip } from "react-tooltip";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";
import { useAuth } from "../../context/AuthContext";

const AdminSidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate(); // Initialize useNavigate
  const handleNavigation = (path) => {
    navigate(path); // Programmatically navigate to the specified path
  };
  return (
    <nav className="navbar-left" style={{ backgroundColor: "#590017" }}>
      <ul className="nav-list">
        <li>
          <button onClick={() => handleNavigation("/admin/manage-menu")}>
            <i id="ManageMenu" className="fas fa-book"></i>
          </button>
          <Tooltip anchorSelect="#ManageMenu" place="top">
            Manage Menu
          </Tooltip>
        </li>
        <li>
          <button onClick={() => handleNavigation("/admin/manage-user")}>
            <i id="ManageUser" className="fas fa-users"></i>
          </button>
          <Tooltip anchorSelect="#ManageUser" place="top">
            Manage User
          </Tooltip>
        </li>
        <li>
          <button onClick={() => handleNavigation("/admin/manage-coupon")}>
            <i id="ManageCoupon" className="fas fa-ticket-alt"></i>
          </button>
          <Tooltip anchorSelect="#ManageCoupon" place="top">
            Manage Coupon
          </Tooltip>
        </li>
        <li>
          <button onClick={() => handleNavigation("/admin/manage-order")}>
            <i id="ManageOrder" className="fas fa-file-invoice"></i>
          </button>
          <Tooltip anchorSelect="#ManageOrder" place="top">
            Manage Order
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

export default AdminSidebar;
