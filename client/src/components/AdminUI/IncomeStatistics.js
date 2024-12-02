import "chart.js/auto";
import React, { useState } from "react";
import { Pie } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import { staff as staffDB } from "../../db/staffUser";

const IncomeStatistics = () => {
  const [staffUsers, setStaffUsers] = useState(staffDB);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortOrder, setSortOrder] = useState("asc"); // Default sorting order is ascending
  const navigate = useNavigate();

  // Filter orders by date
  const filteredStaffUsers = staffUsers.map((member) => {
    const filteredOrders = member.orderHistory.filter((order) => {
      const orderDate = new Date(order.date.split("-").reverse().join("-")); // Convert to YYYY-MM-DD format for Date parsing
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      return (!start || orderDate >= start) && (!end || orderDate <= end);
    });

    const total = filteredOrders.reduce(
      (acc, order) => acc + order.totalAmount,
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
  );

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
