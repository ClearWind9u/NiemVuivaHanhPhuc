import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { staff as staffDB } from "../../db/staffUser";
import { students as studentsDB } from "../../db/studentUser";
const ManageOrder = () => {
  const [staffUsers, setStaffUsers] = useState(staffDB);
  const [studentUsers, setStudentUsers] = useState(studentsDB);
  const [showOrderHistory, setShowOrderHistory] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [oldOrders, setOldOrders] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [isOldOrdersModalOpen, setIsOldOrdersModalOpen] = useState(false);
  const navigate = useNavigate();
  const handleNavigation = (path) => {
    navigate(path); // Programmatically navigate to the specified path
  };

  const fetchOrderHistory = async (userId, isStaff) => {
    try {
      const url = isStaff
        ? `http://localhost:8000/staff/orders/${userId}` // API cho nhân viên
        : `http://localhost:8000/student/orders/${userId}`; // API cho sinh viên
      const response = await axios.get(url);
      console.log("Response Data:", response.data);
      setOrderHistory(response.data.formattedOrders);
      setShowOrderHistory(true);
    } catch (error) {
      console.error("Error fetching order history:", error);
    }
    console.log("Fetching for userId:", userId, "isStaff:", isStaff);

  };

  const handleUserClick = (user, isStaff) => {
    console.log("Clicked user:", user); 
    setSelectedUser(user);
    fetchOrderHistory(user.id, isStaff);
  };
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStartDateChange = (e) => {
    const selectedDate = e.target.value;
    if (selectedDate && endDate && new Date(selectedDate) > new Date(endDate)) {
      alert("Start date cannot be later than end date.");
    } else {
      setStartDate(selectedDate);
    }
  };

  const handleEndDateChange = (e) => {
    const selectedDate = e.target.value;
    if (
      selectedDate &&
      startDate &&
      new Date(selectedDate) < new Date(startDate)
    ) {
      alert("End date cannot be earlier than start date.");
    } else {
      setEndDate(selectedDate);
    }
  };

  const toggleOrderHistory = () => {
    setShowOrderHistory((prev) => !prev);
  };
  
    const filteredOrderHistory = orderHistory.filter((purchase) => {
      const matchesSearch = purchase.dishes
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStartDate = startDate
        ? new Date(purchase.date) >= new Date(startDate)
        : true;
      const matchesEndDate = endDate
        ? new Date(purchase.date) <= new Date(endDate)
        : true;
      return matchesSearch && matchesStartDate && matchesEndDate;
    });

  const fetchOldOrders = () => {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const orders = staffUsers.flatMap((staff) =>
      staff.orderHistory
        .filter((order) => new Date(order.date) < sixMonthsAgo)
        .map((order) => ({
          ...order,
          staffId: staff.id,
          staffName: staff.name,
        }))
    );

    setOldOrders(orders);
    setIsOldOrdersModalOpen(true);
  };
  // Delete old order by ID
  const deleteOldOrder = (orderId, staffId) => {
    setStaffUsers((prevUsers) =>
      prevUsers.map((staff) =>
        staff.id === staffId
          ? {
              ...staff,
              orderHistory: staff.orderHistory.filter(
                (order) => order.id !== orderId
              ),
            }
          : staff
      )
    );
    setOldOrders((prevOrders) =>
      prevOrders.filter((order) => order.id !== orderId)
    );
  };
  const closeOldOrdersModal = () => setIsOldOrdersModalOpen(false);
  return (
    <div className="user-management-page">
      <h2 style={{ textAlign: "center" }}>Order History</h2>
      <div
        style={{
          display: "flex",
          marginLeft: "50px",
          marginRight: "50px",
          justifyContent: "space-between",
        }}
      >
        <button onClick={fetchOldOrders} className="btn blue-btn">
          Show Orders Older Than 6 Months
        </button>
        <button
          onClick={() => handleNavigation("/admin/statistics")}
          className="btn blue-btn"
        >
          Show Statistics
        </button>
      </div>
      <div className="container mt-4">
        {/* Staff Users Table */}
        <div className="container mt-4 user-section">
          <div className="user-table">
            <h3>Staff Users</h3>
            <div className="container mt-4">
              <div className="row">
                {staffUsers.map((user) => (
                  <div
                    key={user.id}
                    className="col-12 d-flex align-items-center mb-3 user-item"
                  >
                    <div className="col-4">
                      <h5 className="user-name">
                        <i id="staff-icon" className="fas fa-user-tie"></i>{" "}
                        {user.name}
                      </h5>
                      <p className="user-email">{user.email}</p>
                    </div>
                    <div
                      className="col-4 "
                      style={{
                        display: "flex",
                      }}
                    >
                      <button
                        className="btn blue-btn"
                        onClick={() => handleUserClick(user, true)}
                        
                      >
                        View History
                        
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="user-table">
            <h3>Student Users</h3>
            <div className="container mt-4">
              <div className="row">
                {studentUsers.map((user) => (
                  <div
                    key={user.id}
                    className="col-12 d-flex align-items-center mb-3 user-item"
                  >
                    <div className="col-4">
                      <h5 className="user-name">
                        <i id="staff-icon" className="fas fa-user"></i>{" "}
                        {user.name}
                      </h5>
                      <p className="user-email">{user.email}</p>
                    </div>
                    <div
                      className="col-4 "
                      style={{
                        display: "flex",
                      }}
                    >
                      <button
                        className="btn blue-btn"
                        onClick={() => handleUserClick(user, false)}
                      >
                        View History
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {isOldOrdersModalOpen && oldOrders.length > 0 && (
          <div className="modal-overlay">
            <div
            >
              <div className="user-table mt-4">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <h3 className="header-title">Old Orders</h3>
                  <FaTimes
                    className="close-icon"
                    style={{ cursor: "pointer", color: "red" }}
                    onClick={closeOldOrdersModal}
                  />
                </div>
                <div
                  style={{
                    overflowY: "auto", // Enable vertical scrolling
                    maxHeight: "70vh", // Set max height of the scrollable area
                    marginTop: "10px",
                  }}
                >
                  <table className="purchase-history-table">
                    <thead>
                      <tr>
                        <th>Staff Name</th>
                        <th>Date</th>
                        <th>Items</th>
                        <th>Total Amount ($)</th>
                        <th>Payment Method</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {oldOrders.map((order) => (
                        <tr key={order.id}>
                          <td>{order.staffName}</td>
                          <td>
                            {new Date(order.date).toLocaleDateString("en-GB")}
                          </td>
                          <td>{order.items}</td>
                          <td>${order.totalAmount.toFixed(2)}</td>
                          <td>{order.paymentMethod}</td>
                          <td>
                            <button
                              className="btn red-btn"
                              onClick={() =>
                                deleteOldOrder(order.id, order.staffId)
                              }
                              style={{
                                backgroundColor: "#d9534f",
                                color: "#fff",
                                border: "none",
                              }}
                              onMouseEnter={(e) =>
                                (e.target.style.backgroundColor = "#c9302c")
                              }
                              onMouseLeave={(e) =>
                                (e.target.style.backgroundColor = "#d9534f")
                              }
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {showOrderHistory && selectedUser && (
          <div className="modal-overlay">
            <div style={{ maxWidth: "800px" }}>
              <div className="user-table mt-4">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <h3 className="header-title">
                    Order History for {selectedUser.name}
                  </h3>
                  <FaTimes
                    onClick={toggleOrderHistory}
                    className="close-icon"
                    style={{ cursor: "pointer", color: "red" }}
                  />
                </div>
                <input
                  type="text"
                  placeholder="Search by item name"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  style={{
                    padding: "8px",
                    marginBottom: "10px",
                    width: "100%",
                  }}
                />
                <div className="date-filter">
                  <label htmlFor="start-date">Start Date:</label>
                  <input
                    type="date"
                    id="start-date"
                    value={startDate}
                    onChange={handleStartDateChange}
                  />
                  <label htmlFor="end-date">End Date:</label>
                  <input
                    type="date"
                    id="end-date"
                    value={endDate}
                    onChange={handleEndDateChange}
                  />
                </div>
                <table className="purchase-history-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                <th>Items</th>
                <th>Total Amount ($)</th>
                <th>Payment Method</th>
                <th>Status</th>
                <th>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrderHistory.map((purchase) => (
                      <tr key={purchase.id}>
                       <td>{new Date(purchase.order_time).toLocaleString()}</td>
                  <td>{purchase.dishes}</td>
                  <td>${purchase.final_price.toFixed(2)}</td>
                  <td>{purchase.payment_method}</td>
                  <td>{purchase.status}</td>
                  <td>

                </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageOrder;
