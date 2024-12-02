import axios from "axios";
import React, { useState } from "react";
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

    const fetchOldOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/orders_old`);
        console.log("API", response.data);
        setOldOrders(response.data);
        setIsOldOrdersModalOpen(true);
      } catch (error) {
        console.error("Error fetching old orders:", error);
      }
    };
  const handleDelete = async (orderId) => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete this order?");
      if (!confirmDelete) return;
  
      const response = await axios.delete(`http://localhost:8000/orders_old/${orderId}`);
  
      if (response.status === 200) {
        alert("Order deleted successfully!");
        // Cập nhật lại danh sách đơn hàng
        setOldOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("Failed to delete the order. Please try again later.");
    }
  };

  const closeOldOrdersModal = () => setIsOldOrdersModalOpen(false);
  const [selectedOrder, setSelectedOrder] = useState(null); // Chứa thông tin chi tiết hóa đơn
  const [isModalOpen, setIsModalOpen] = useState(false); // Điều khiển modal
  const handleViewDetails = async (orderId) => {
    if (!orderId) {
      console.error("Invalid orderId:", orderId);  // In ra nếu orderId không hợp lệ
      return;
    }
    try {
      const response = await axios.get(
        `http://localhost:8000/orders/${orderId}`
      );
  
      setSelectedOrder(response.data); // Lưu chi tiết hóa đơn vào state
      setIsModalOpen(true); // Mở modal
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  // Hàm để đóng modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };
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
                        <th>Total Amount (VNĐ)</th>
                        <th>Payment Method</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {oldOrders.map((order) => (
                        <tr key={order._id}>
                          <td>{order.staffName}</td>
                          <td>
                            {new Date(order.date).toLocaleDateString("en-GB")}
                          </td>
                          <td>{order.items}</td>
                          <td>{order.totalAmount} VNĐ</td>
                          <td>{order.paymentMethod}</td>
                          <td>
                            <button
                              className="btn red-btn"
                              onClick={() =>
                                handleDelete(order._id)
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
                <th>Total Amount (VNĐ)</th>
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
                  <td>{purchase.final_price} VNĐ</td>
                  <td>{purchase.payment_method}</td>
                  <td>{purchase.status}</td>
                  <td>
                  <button
                 className="button-small"
                 onClick={() => handleViewDetails(purchase._id)}
               >
                View
              </button>
                </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
        {isModalOpen && selectedOrder && (
          <div className="modal-overlay">
            <div className="modal" style={{ height: "90vh", width: "40vw" }}>
              <h3>Order Details</h3>
              <p>
                <strong>Order ID:</strong> {selectedOrder._id}
              </p>
              <p>
                <strong>Student Name:</strong>{" "}
                {selectedOrder.student}
              </p>
              <p>
                <strong>Staff Name:</strong>{" "}
                {selectedOrder.staff || "N/A"}
              </p>
              <p><strong>Order Details (Items)</strong></p>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  margin: "20px 0",
                  fontSize: "16px",
                  textAlign: "left",
                  border: "1px solid #ddd",
                }}
              >
                <thead>
                  <tr
                    style={{
                      backgroundColor: "#f4f4f4",
                      borderBottom: "2px solid #ddd",
                    }}
                  >
                    <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                      Dish Name
                    </th>
                    <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                      Price
                    </th>
                    <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                      Quantity
                    </th>
                    <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.details.map((item, index) => (
                    <tr
                      key={index}
                      style={{
                        backgroundColor:
                          index % 2 === 0 ? "#f9f9f9" : "#ffffff",
                        transition: "background-color 0.3s",
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.backgroundColor = "#e8f5e9")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          index % 2 === 0 ? "#f9f9f9" : "#ffffff")
                      }
                    >
                      <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                        {item.name}
                      </td>
                      <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                        {item.price} VNĐ
                      </td>
                      <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                        {item.quantity}
                      </td>
                      <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                        {item.total_price} VNĐ
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <p>
                <strong>Total Quantity:</strong> {selectedOrder.total_quantity}
              </p>
              <p>
                <strong>Total Price:</strong> {selectedOrder.total_price} VNĐ
              </p>
              <p>
                <strong>Discount:</strong> {selectedOrder.discount} VNĐ
              </p>
              <p>
                <strong>Final Price:</strong> {selectedOrder.final_price} VNĐ
              </p>
              <p>
                <strong>Payment Method:</strong> {selectedOrder.payment_method}
              </p>
              <p>
                <strong>Order Time:</strong>{" "}
                {new Date(selectedOrder.order_time).toLocaleString()}
              </p>
              <p>
                <strong>Status:</strong> {selectedOrder.status}
              </p>

              <button onClick={closeModal}>Close</button>
            </div>
          </div>
        )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageOrder;
