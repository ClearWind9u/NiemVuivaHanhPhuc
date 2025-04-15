import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import axios from "axios";
import { useEffect } from "react";
import "chart.js/auto";

const IncomeStatistics = () => {
  const [staffUsers, setStaffUsers] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortOrder, setSortOrder] = useState("asc"); // Default sorting order is ascending
  const navigate = useNavigate();
  const [staffWithOrders, setStaffWithOrders] = useState([]);
  const API_URL = "https://joy-and-happiness-be.vercel.app";


  // Hàm gọi API lấy danh sách nhân viên có vai trò là 'staff'
  const fetchStaffUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/user/admin/staff`);
      setStaffUsers(response.data.staff);
    } catch (error) {
      console.error("Error fetching staff users:", error);
    }
  };
  useEffect(() => {
    fetchStaffUsers(); // Lấy danh sách nhân viên khi component được mount
  }, []);
    // Gọi API để lấy dữ liệu lịch sử mua hàng
    const fetchPurchaseHistory = async (staffId) => {
      try {
        const response = await axios.get(`${API_URL}/staff/orders/${staffId}`);
        return response.data.formattedOrders || []; 
        // Lưu dữ liệu vào state
      } catch (error) {
        console.error("Error fetching purchase history:", error);
      }
    };

    const fetchAllPurchaseHistory = async () => {
      const updatedStaffUsers = await Promise.all(
        staffUsers.map(async (member) => {
          const purchaseHistory = await fetchPurchaseHistory(member._id);
          // Lọc đơn hàng theo ngày
          const filteredOrders = Array.isArray(purchaseHistory) ? purchaseHistory.filter((order) => {
            const orderDate = new Date(order.order_time);
            const start = startDate ? new Date(startDate) : null;
            const end = endDate ? new Date(endDate) : null;
            return (!start || orderDate >= start) && (!end || orderDate <= end);
          }) : [];  // Nếu không phải mảng, trả về mảng rỗng
          
  
          // Tính tổng số tiền của nhân viên
          const total = filteredOrders.reduce((acc, order) => acc + order.final_price, 0);
  
          return { ...member, orderHistory: filteredOrders, total };
        })
      );
      setStaffWithOrders(updatedStaffUsers);
    };
    useEffect(() => {
      if (staffUsers.length > 0) {
        fetchAllPurchaseHistory();
      }
    }, [startDate, endDate, staffUsers]);
    
    
    // Gọi hàm lấy dữ liệu khi ngày bắt đầu và kết thúc thay đổi
    
    // Sắp xếp nhân viên theo tổng số tiền
    const sortedStaffTotals = staffWithOrders
      .filter((member) => member.total > 0)  // Loại bỏ nhân viên có tổng = 0
      .sort((a, b) => (sortOrder === "asc" ? a.total - b.total : b.total - a.total));
  
    const overallTotal = sortedStaffTotals.reduce((acc, member) => acc + member.total, 0);
  
    const generateRandomColor = () => {
      const letters = "0123456789ABCDEF";
      let color = "#";
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    };
    
    // Tạo mảng màu động cho mỗi nhân viên
    const dynamicColors = sortedStaffTotals.map(() => generateRandomColor());
    
    const data = {
      labels: sortedStaffTotals.map((member) => member.name),
      datasets: [
        {
          label: "Total Amount per Staff",
          data: sortedStaffTotals.map((member) => member.total),
          backgroundColor: dynamicColors,
        },
      ],
    };
    
  const handleNavigation = (path) => {
    navigate(path);
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <div className="user-management-page fade-in">
      <h2 style={{ textAlign: "center" }}>
        Order History {">"} Show Statistics
      </h2>
      <button
        onClick={() => handleNavigation("/admin/manage-order")}
        className="btn red-btn">
        Go Back
      </button>

      {/* Date Filter Section */}
      <div
        className="date-filter"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
          margin: "20px 0",
        }}
      >
        <label>
          Start Date:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
        <label>
          End Date:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>
        <button  className="btn blue-btn" onClick={toggleSortOrder}>
          Sort by Amount ({sortOrder === "asc" ? "Ascending" : "Descending"})
        </button>
      </div>

      <div className="container mt-4">
        {/* Staff Users Table */}
        <div className="container mt-4 user-section">
          <div className="user-table">
            <h3>Staff Users</h3>
            <div className="container mt-4">
              <div className="row">
                {sortedStaffTotals.map((user) => (
                  <div
                    key={user.name}
                    className="col-12 d-flex align-items-center mb-3 user-item"
                  >
                    <div className="col-4">
                      <h5 className="user-name">
                        <i id="staff-icon" className="fas fa-user-tie"></i>{" "}
                        {user.name}
                      </h5>
                      <p className="user-email">{user.email}</p>
                    </div>
                    <div className="col-4">
                      <p style={{ fontWeight: "bold", color: "#333", fontSize: "16px", margin: "0" }}>Total Order Amount: {user.total} VNĐ</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Overall Statistics and Pie Chart */}
          <div className="user-table">
            <div className="overall-section">
              <h2>Total Orders for All Staff: {overallTotal} VNĐ</h2>
              <Pie data={data} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomeStatistics;
