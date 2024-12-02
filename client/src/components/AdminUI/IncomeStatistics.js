import React, { useState } from "react";
import { staff as staffDB } from "../../db/staffUser";
import { useNavigate } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import axios from "axios";
import { useEffect } from "react";
import "chart.js/auto";

const IncomeStatistics = () => {
  const [staffUsers, setStaffUsers] = useState(staffDB);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortOrder, setSortOrder] = useState("asc"); // Default sorting order is ascending
  const navigate = useNavigate();
  const [staffWithOrders, setStaffWithOrders] = useState([]);

  const [purchaseHistory, setPurchaseHistory] = useState([]); // State để lưu lịch sử mua hàng
    // Gọi API để lấy dữ liệu lịch sử mua hàng
    const fetchPurchaseHistory = async (staffId) => {
      try {
        const response = await axios.get(`http://localhost:8000/staff/orders/${staffId}`);
        console.log('API',response.data);
        return response.data.formattedOrders || []; 
        // Lưu dữ liệu vào state
      } catch (error) {
        console.error("Error fetching purchase history:", error);
      }
    };

    const fetchAllPurchaseHistory = async () => {
      const updatedStaffUsers = await Promise.all(
        staffUsers.map(async (member) => {
          const purchaseHistory = await fetchPurchaseHistory(member.id);
          console.log("purchaseHistory for member", member.name, purchaseHistory); 
          // Lọc đơn hàng theo ngày
          const filteredOrders = Array.isArray(purchaseHistory) ? purchaseHistory.filter((order) => {
            const orderDate = new Date(order.order_time.split("-").reverse().join("-"));
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
  
    // Gọi hàm lấy dữ liệu khi ngày bắt đầu và kết thúc thay đổi
    useEffect(() => {
      fetchAllPurchaseHistory();
    }, [startDate, endDate]);
  
    // Sắp xếp nhân viên theo tổng số tiền
    const sortedStaffTotals = staffWithOrders
      .filter((member) => member.total > 0)  // Loại bỏ nhân viên có tổng = 0
      .sort((a, b) => (sortOrder === "asc" ? a.total - b.total : b.total - a.total));
  
    const overallTotal = sortedStaffTotals.reduce((acc, member) => acc + member.total, 0);
  
  // Filter orders by date
 /* const filteredStaffUsers = staffUsers.map((member) => {
    const filteredOrders = fetchPurchaseHistory(member.id).filter((order) => {
      const orderDate = new Date(order.order_time.split("-").reverse().join("-")); // Convert to YYYY-MM-DD format for Date parsing
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      return (!start || orderDate >= start) && (!end || orderDate <= end);
    });

    const total = filteredOrders.reduce(
      (acc, order) => acc + order.final_price,
      0
    );
    return { ...member, orderHistory: filteredOrders, total };
  });

  const sortedStaffTotals = filteredStaffUsers
  .filter((member) => member.total > 0) // Exclude staff with total 0
  .sort((a, b) => (sortOrder === "asc" ? a.total - b.total : b.total - a.total));


  const overallTotal = sortedStaffTotals.reduce(
    (acc, member) => acc + member.total,
    0
  );*/

  const data = {
    labels: sortedStaffTotals.map((member) => member.name),
    datasets: [
      {
        label: "Total Amount per Staff",
        data: sortedStaffTotals.map((member) => member.total),
        backgroundColor: [
          "#ff6384",
          "#36a2eb",
          "#ffce56",
          "#4bc0c0",
          "#9966ff",
        ],
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
    <div className="user-management-page">
      <h2 style={{ textAlign: "center" }}>
        Order History {">"} Show Statistics
      </h2>
      <button
        onClick={() => handleNavigation("/admin/manage-order")}
        className="btn red-btn"
      >
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
