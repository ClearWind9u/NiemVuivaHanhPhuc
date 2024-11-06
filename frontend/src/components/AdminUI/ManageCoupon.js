import React, { useState } from "react";
import { FaTrashAlt, FaEdit, FaPlus } from "react-icons/fa";
import { coupons as couponDB } from "../../db/coupons";
import "../css/ManageCoupon.css";
const ManageCoupon = () => {
  const [coupons, setCoupons] = useState(couponDB);

  const [newCoupon, setNewCoupon] = useState({
    code: "",
    startDay: "",
    endDay: "",
    description: "",
    icon: "",
  });
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingCoupon) {
      setEditingCoupon((prev) => ({ ...prev, [name]: value }));
    } else {
      setNewCoupon((prev) => ({ ...prev, [name]: value }));
    }
  };

  const addCoupon = () => {
    if (
      !newCoupon.code ||
      !newCoupon.startDay ||
      !newCoupon.endDay ||
      !newCoupon.description ||
      !newCoupon.icon
    ) {
      alert("Please fill in all fields before adding a coupon.");
      return;
    }

    const couponToAdd = { ...newCoupon, id: Date.now() };
    setCoupons((prevCoupons) => [...prevCoupons, couponToAdd]);

    setNewCoupon({
      code: "",
      startDay: "",
      endDay: "",
      description: "",
      icon: "",
    });
    setShowAddForm(false);
  };

  const updateCoupon = () => {
    setCoupons(
      coupons.map((coupon) =>
        coupon.id === editingCoupon.id ? editingCoupon : coupon
      )
    );
    setEditingCoupon(null);
    setShowEditForm(false);
  };

  const handleRemove = (id) => {
    setCoupons((coupons) => coupons.filter((coupon) => coupon.id !== id));
  };

  const toggleAddForm = () => setShowAddForm(!showAddForm);
  const toggleEditModal = (coupon) => {
    setEditingCoupon(coupon);
    setShowEditForm(true);
  };

  return (
        <div className="coupon-management-page">
          <h2 style={{ textAlign: "center" }}>Manage Coupons</h2>
          <div className="container mt-4">
            {showAddForm ? (
              <></>
            ) : (
              <button onClick={toggleAddForm} className="btn blue-btn">
                Add New Coupon <FaPlus />
              </button>
            )}
            {/* Add Coupon Form */}
            {showAddForm && (
              <div className="form-group mt-3">
                <h3>Add Coupon</h3>
                <input
                  type="text"
                  placeholder="Code"
                  name="code"
                  value={newCoupon.code}
                  onChange={handleInputChange}
                  className="form-control mb-2"
                />
                <input
                  type="date"
                  placeholder="Start Day"
                  name="startDay"
                  value={newCoupon.startDay}
                  onChange={handleInputChange}
                  className="form-control mb-2"
                />
                <input
                  type="date"
                  placeholder="End Day"
                  name="endDay"
                  value={newCoupon.endDay}
                  onChange={handleInputChange}
                  className="form-control mb-2"
                />
                <input
                  type="text"
                  placeholder="Description"
                  name="description"
                  value={newCoupon.description}
                  onChange={handleInputChange}
                  className="form-control mb-2"
                />
                <input
                  type="text"
                  placeholder="Icon"
                  name="icon"
                  value={newCoupon.icon}
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
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = "#c9302c")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = "#d9534f")
                  }
                >
                  Cancel
                </button>
              </div>
            )}
            {/* Edit Coupon Form */}
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
                  placeholder="Start Day"
                  name="startDay"
                  value={editingCoupon.startDay}
                  onChange={handleInputChange}
                  className="form-control mb-2"
                />
                <input
                  type="date"
                  placeholder="End Day"
                  name="endDay"
                  value={editingCoupon.endDay}
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
                  type="text"
                  placeholder="Icon"
                  name="icon"
                  value={editingCoupon.icon}
                  onChange={handleInputChange}
                  className="form-control mb-2"
                />
                <button onClick={updateCoupon} className="btn blue-btn">
                  Update Coupon
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
                    <div key={coupon.id} className="col-md-4 mb-4">
                      <div className="card shadow-sm h-100">
                        <div className="card-body">
                          <h5 className="coupon-code text-center">
                            <span role="img" aria-label="icon">
                              {coupon.icon}
                            </span>{" "}
                            {coupon.code}
                          </h5>
                          <p className="coupon-dates text-muted text-center">
                            Start: {coupon.startDay}
                          </p>
                          <p className="coupon-dates text-muted text-center">
                            End: {coupon.endDay}
                          </p>
                          <p className="coupon-description text-center">
                            {coupon.description}
                          </p>
                          <div className="d-flex justify-content-center mt-3">
                            <button
                              className="btn red-btn"
                              onClick={() => handleRemove(coupon.id)
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
                              <FaTrashAlt /> Remove
                            </button>
                            <button
                              className="btn blue-btn"
                              onClick={() => toggleEditModal(coupon)}
                            >
                              <FaEdit /> Edit
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
        </div>
  );
};

export default ManageCoupon;
