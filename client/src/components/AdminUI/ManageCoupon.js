import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaEdit, FaPlus, FaTrashAlt } from "react-icons/fa";
import Notification from "../Notification";
import "../css/ManageCoupon.css";

const ManageCoupon = () => {
  const [coupons, setCoupons] = useState([]);
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    startDate: "",
    endDate: "",
    description: "",
    percentDiscount: 0,
    moneyDiscount: 0,
  });
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [deleteCouponId, setDeleteCouponId] = useState(null);
  const [notification, setNotification] = useState(null);
  const API_URL = "https://joy-and-happiness-be.vercel.app/coupons";

  useEffect(() => {
    // Fetch coupons on component mount
    fetchCoupons();
  }, []);

  // Fetch coupons from backend
  const fetchCoupons = async () => {
    try {
      const response = await axios.get(API_URL);
      setCoupons(response.data);
    } catch (error) {
      console.error("Error fetching coupons:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingCoupon) {
      setEditingCoupon((prev) => ({ ...prev, [name]: value }));
    } else {
      setNewCoupon((prev) => ({ ...prev, [name]: value }));
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const addCoupon = async () => {
    if (
      !newCoupon.code ||
      !newCoupon.startDate ||
      !newCoupon.endDate ||
      !newCoupon.description
    ) {
      alert("Please fill in all fields before adding a coupon.");
      return;
    }

    if (new Date(newCoupon.startDate) > new Date(newCoupon.endDate)) {
      alert("Start date cannot be after end date.");
      return;
    }

    if (newCoupon.percentDiscount <= 0 && newCoupon.moneyDiscount <= 0) {
      alert("At least one discount value must be greater than 0.");
      return;
    }

    try {
      const response = await axios.post(API_URL, newCoupon);
      setCoupons((prevCoupons) => [...prevCoupons, response.data]);
      setNewCoupon({
        code: "",
        startDate: "",
        endDate: "",
        description: "",
        percentDiscount: 0,
        moneyDiscount: 0,
      });
      setShowAddForm(false);
      setNotification("Add coupon successfully!");
    } catch (error) {
      console.error("Error adding coupon:", error);
    }
  };

  const updateCoupon = async () => {
    if (new Date(editingCoupon.startDate) > new Date(editingCoupon.endDate)) {
      alert("Start date cannot be after end date.");
      return;
    }

    if (
      editingCoupon.percentDiscount <= 0 &&
      editingCoupon.moneyDiscount <= 0
    ) {
      alert("At least one discount value must be greater than 0.");
      return;
    }

    try {
      const response = await axios.put(
        `${API_URL}/${editingCoupon._id}`,
        editingCoupon
      );
      setCoupons(
        coupons.map((coupon) =>
          coupon._id === editingCoupon._id ? response.data : coupon
        )
      );
      setEditingCoupon(null);
      setShowEditForm(false);
      setNotification("Update coupon successfully!");
    } catch (error) {
      console.error("Error updating coupon:", error);
    }
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${API_URL}/${deleteCouponId}`);
      setCoupons((prevCoupons) =>
        prevCoupons.filter((coupon) => coupon._id !== deleteCouponId)
      );
      setDeleteCouponId(null);
      setNotification("Delete coupon successfully!");
    } catch (error) {
      console.error("Error deleting coupon:", error);
    }
  };

  const toggleAddForm = () => setShowAddForm(!showAddForm);
  const toggleEditModal = (coupon) => {
    setEditingCoupon(coupon);
    setShowEditForm(true);
  };

  return (
    <div className="coupon-management-page">
      <h2 style={{ textAlign: "center" }} className="fade-in">Manage Coupons</h2>
      <div className="container mt-4">
        {showAddForm ? (
          <></>
        ) : (
          <button onClick={toggleAddForm} className="btn blue-btn slide-in-right">
            Add New Coupon <FaPlus className="ms-2"/>
          </button>
        )}
        {/* Add Coupon Form */}
        {showAddForm && (
          <div className="form-group mt-3 slide-in-left">
            <h3>Add Coupon</h3>
            <label htmlFor="code">Code</label>
            <input
              type="text"
              id="code"
              name="code"
              value={newCoupon.code}
              onChange={handleInputChange}
              className="form-control mb-2"
            />
            <label htmlFor="startDate">Start Date</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={newCoupon.startDate}
              onChange={handleInputChange}
              className="form-control mb-2"
            />
            <label htmlFor="endDate">End Date</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={newCoupon.endDate}
              onChange={handleInputChange}
              className="form-control mb-2"
            />
            <label htmlFor="description">Description</label>
            <input
              type="text"
              id="description"
              name="description"
              value={newCoupon.description}
              onChange={handleInputChange}
              className="form-control mb-2"
            />
            <label htmlFor="percentDiscount">Percent Discount</label>
            <input
              type="number"
              id="percentDiscount"
              name="percentDiscount"
              value={newCoupon.percentDiscount}
              onChange={handleInputChange}
              className="form-control mb-2"
            />
            <label htmlFor="moneyDiscount">Money Discount</label>
            <input
              type="number"
              id="moneyDiscount"
              name="moneyDiscount"
              value={newCoupon.moneyDiscount}
              onChange={handleInputChange}
              className="form-control mb-2"
            />
            <button onClick={addCoupon} className="btn blue-btn">
              Add Coupon
            </button>
            <button
              onClick={toggleAddForm}
              className="btn red-btn"
              style={{
                backgroundColor: "#d9534f",
                color: "#fff",
                border: "none",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#c9302c")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#d9534f")}
            >
              Cancel
            </button>
          </div>
        )}
        {/* Edit Coupon Form */}
        {showEditForm && editingCoupon && (
          <div className="modal-overlay zoom-in">
            <div className="form-group mt-3">
              <h3>Edit Coupon</h3>
              <input
                type="text"
                placeholder="Code"
                name="code"
                value={editingCoupon.code}
                onChange={handleInputChange}
                className="form-control mb-2"
              />
              <input
                type="date"
                name="startDate"
                value={editingCoupon.startDate}
                onChange={handleInputChange}
                className="form-control mb-2"
              />
              <input
                type="date"
                name="endDate"
                value={editingCoupon.endDate}
                onChange={handleInputChange}
                className="form-control mb-2"
              />
              <input
                type="text"
                placeholder="Description"
                name="description"
                value={editingCoupon.description}
                onChange={handleInputChange}
                className="form-control mb-2"
              />
              <input
                type="number"
                placeholder="Percent Discount"
                name="percentDiscount"
                value={editingCoupon.percentDiscount}
                onChange={handleInputChange}
                className="form-control mb-2"
              />
              <input
                type="number"
                placeholder="Money Discount"
                name="moneyDiscount"
                value={editingCoupon.moneyDiscount}
                onChange={handleInputChange}
                className="form-control mb-2"
              />
              <button onClick={updateCoupon} className="btn blue-btn">
                Update Coupon
              </button>
            </div>
          </div>
        )}{/* Edit Coupon Form */}
        {showEditForm && editingCoupon && (
          <div className="modal-overlay">
            <div className="form-group mt-3">
              <h3>Edit Coupon</h3>
              <input
                type="text"
                placeholder="Code"
                name="code"
                value={editingCoupon.code}
                onChange={handleInputChange}
                className="form-control mb-2"
              />
              <input
                type="date"
                name="startDate"
                value={editingCoupon.startDate}
                onChange={handleInputChange}
                className="form-control mb-2"
              />
              <input
                type="date"
                name="endDate"
                value={editingCoupon.endDate}
                onChange={handleInputChange}
                className="form-control mb-2"
              />
              <input
                type="text"
                placeholder="Description"
                name="description"
                value={editingCoupon.description}
                onChange={handleInputChange}
                className="form-control mb-2"
              />
              <input
                type="number"
                placeholder="Percent Discount"
                name="percentDiscount"
                value={editingCoupon.percentDiscount}
                onChange={handleInputChange}
                className="form-control mb-2"
              />
              <input
                type="number"
                placeholder="Money Discount"
                name="moneyDiscount"
                value={editingCoupon.moneyDiscount}
                onChange={handleInputChange}
                className="form-control mb-2"
              />
              <div className="d-flex justify-content-center mt-3">
              <button
                  className="btn red-btn ms-2"
                  style={{
                    backgroundColor: "#d9534f",
                    color: "#fff",
                    border: "none",
                  }}
                  onClick={() => setShowEditForm(false)}  // Hủy chỉnh sửa
                  onMouseEnter={(e) => (e.target.style.backgroundColor = "#c9302c")}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = "#d9534f")}
                >
                  Cancel
                </button>
                <button onClick={updateCoupon} className="btn blue-btn">
                  Update Coupon
                </button>
              </div>
            </div>
          </div>
        )}        
        {/* Delete Confirmation Modal */}
        {deleteCouponId && (
          <div className="modal-overlay">
            <div className="modal-content">
              <p>Are you sure you want to delete this coupon?</p>
              <button className="btn red-btn" onClick={confirmDelete}>
                Confirm
              </button>
              <button
                className="btn blue-btn"
                onClick={() => setDeleteCouponId(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        {/* Coupons Table */}
        <div className="container mt-4 coupon-section">
          <div className="coupon-table">
            {coupons.length === 0 ? (
              <h3 style={{ textAlign: "center", marginBottom: "20px" }}>
                No coupons available
              </h3>
            ) : (
              <h3 style={{ textAlign: "center", marginBottom: "20px" }}>
                Coupons
              </h3>
            )}
            <div className="row">
              {coupons.map((coupon) => (
                <div key={coupon._id} className="col-md-4 mb-4">
                  <div className="card shadow-sm h-100">
                    <div className="card-body">
                      <h5 className="coupon-code text-center">
                        <span role="img" aria-label="icon">
                          {coupon.icon}
                        </span>{" "}
                        {coupon.code}
                      </h5>
                      <p className="coupon-dates text-muted text-center">
                        Start: {formatDate(coupon.startDate)}
                      </p>
                      <p className="coupon-dates text-muted text-center">
                        End: {formatDate(coupon.endDate)}
                      </p>
                      <p className="coupon-description text-center">
                        {coupon.description}
                      </p>
                      <p className="coupon-discount text-center">
                        Percent Discount:{" "}
                        <strong>{coupon.percentDiscount}%</strong>
                      </p>
                      <p className="coupon-discount text-center">
                        Money Discount: <strong>{coupon.moneyDiscount} VNĐ</strong>
                      </p>
                      <div className="d-flex justify-content-center mt-3">
                        <button
                          className="btn red-btn slide-in-left"
                          onClick={() => setDeleteCouponId(coupon._id)}
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
                          <FaTrashAlt className="me-2"/> Remove
                        </button>
                        <button
                          className="btn blue-btn slide-in-right"
                          onClick={() => toggleEditModal(coupon)}
                        >
                          <FaEdit className="me-2"/> Edit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Notification */}
      {notification && <Notification message={notification} onClose={() => setNotification(null)} />}
    </div>
  );
};

export default ManageCoupon;
