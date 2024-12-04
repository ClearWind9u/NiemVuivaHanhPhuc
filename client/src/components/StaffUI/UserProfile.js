import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import "../css/UserProfile.css";
const UserProfile = () => {
  const { userId } = useAuth();
  const [user, setUser] = useState([]);

  const getUser = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:8000/user/${userId}`, {
        headers: { "Content-Type": "application/json" }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null; // Xử lý lỗi bằng cách trả về null
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const data = await getUser(userId);
      if (data) {
        setUser(data);
      } else {
        console.error("Failed to fetch user info.");
      }
    };
    if (userId) {
      fetchUser();
    }
  }, [userId]);

  const [purchaseHistory, setPurchaseHistory] = useState([]); // State để lưu lịch sử mua hàng
  useEffect(() => {
    // Gọi API để lấy dữ liệu lịch sử mua hàng
    const fetchPurchaseHistory = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/staff/orders/${user._id}`);
        //console.log('API',response.data);
        setPurchaseHistory(response.data.formattedOrders); // Lưu dữ liệu vào state
      } catch (error) {
        console.error("Error fetching purchase history:", error);
      }
    };

    fetchPurchaseHistory();
  }, [user._id]);

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const filteredPurchases = purchaseHistory.filter((purchase) => {
    const purchaseDate = new Date(purchase.order_time); // Lấy ngày từ API
    const matchesSearch = purchase.dishes
      .toLowerCase()
      .includes(searchTerm.toLowerCase()); // So sánh tên món ăn
    const matchesStartDate = startDate
      ? purchaseDate >= new Date(startDate)
      : true;
    const matchesEndDate = endDate ? purchaseDate <= new Date(endDate) : true;
    return matchesSearch && matchesStartDate && matchesEndDate;
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const toggleEditForm = () => {
    setIsEditing(!isEditing);
  };
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
    <div className="">
      <h2 style={{ textAlign: "center" }}>User Profile</h2>
      <div className="main-section">
        <div className="user-profile">
          <h3>User Profile</h3>
          <div className="profile-picture">
            <img src={user?.avatar || "../image/avatar.jpg"} alt="User Avatar" />
          </div>

          {!isEditing ? (
            <div className="profile-info">
              <p>
                <strong>Username:</strong> {user.username}
              </p>
              <p>
                <strong>Name:</strong> {user.name}
              </p>
              <p>
                <strong>Date of Birth:</strong> {user.dob}
              </p>
              <p>
                <strong>Gender:</strong> {user.gender}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Phone:</strong> {user.phone}
              </p>
              <button
                className="btn btn-secondary blue-btn"
                onClick={toggleEditForm}
              >
                Edit Information
              </button>
            </div>
          ) : (
            <form className="profile-form">
              <div className="form-group">
                <label htmlFor="username">Username:</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={user.username}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter your username"
                />
              </div>
              <div className="form-group">
                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={user.name}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter your name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="dob">Date of Birth:</label>
                <input
                  type="date"
                  id="dob"
                  name="dob"
                  value={user.dob}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label htmlFor="gender">Gender:</label>
                <select
                  id="gender"
                  name="gender"
                  value={user.gender}
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter your email"
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone:</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={user.phone}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter your phone number"
                />
              </div>
              <button
                type="button"
                className="btn btn-secondary blue-btn"
                style={{ backgroundColor: "#007bff" }}
                onClick={toggleEditForm}
              >
                Save
              </button>
            </form>
          )}
        </div>
        <div className="transaction-history">
          <h3>Receipt History</h3>
          <input
            type="text"
            placeholder="Search by item name"
            value={searchTerm}
            onChange={handleSearchChange}
            style={{ padding: "8px", marginBottom: "10px", width: "100%" }}
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
              {filteredPurchases.map((purchase) => (
                <tr key={purchase._id}>
                  <td>{new Date(purchase.order_time).toLocaleString()}</td>
                  <td>{purchase.dishes}</td>
                  <td>{purchase.final_price} VNĐ</td>
                  <td>{purchase.payment_method}</td>
                  <td>{purchase.status}</td>
                  <td><button
                    className="button-small"
                    onClick={() => handleViewDetails(purchase._id)}
                    disabled={purchase.status === "pending"}>
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
  );
};

export default UserProfile;
