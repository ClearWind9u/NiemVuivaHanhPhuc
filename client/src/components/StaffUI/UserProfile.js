import React, { useState , useEffect} from "react";
import axios from "axios";
import "../css/UserProfile.css";
const UserProfile = () => {
  const [user, setUser] = useState({
    _id: "507f191e810c19729de860eb",
    username: "john_doe",
    name: "John Doe",
    dob: "15-05-1995",
    gender: "Male",
    email: "john.doe@example.com",
    phone: "+1234567890",
  });
  const [purchaseHistory, setPurchaseHistory] = useState([]); // State để lưu lịch sử mua hàng
  useEffect(() => {
    // Gọi API để lấy dữ liệu lịch sử mua hàng
    const fetchPurchaseHistory = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/staff/orders/${user._id}`);
        console.log('API',response.data);
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

  return (
    <div className="">
      <h2 style={{ textAlign: "center" }}>User Profile</h2>
      <div className="main-section">
        <div className="user-profile">
          <h3>User Profile</h3>
          <div className="profile-picture">
            <img src="../image/avatar.jpg" alt="User Avatar" />
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
                <th>Total Amount ($)</th>
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
                  <td>${purchase.final_price.toFixed(2)}</td>
                  <td>{purchase.payment_method}</td>
                  <td>{purchase.status}</td>
                  <td><button
                className="button-small">
                View
              </button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
