import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTrashAlt, FaEdit, FaPlus } from "react-icons/fa";
import "../css/ManageUser.css";
import Notification from "../Notification";

const ManageUser = () => {
  const [staffUsers, setStaffUsers] = useState([]);
  const [studentUsers, setStudentUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "", password: "", username: "" });
  const [editingUser, setEditingUser] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState(null);
  const [confirmationId, setConfirmationId] = useState(null);
  const [confirmationRole, setConfirmationRole] = useState(null);
  const [notification, setNotification] = useState(null);
  const API_URL = "https://joy-and-happiness-be.vercel.app";

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`${API_URL}/user/admin/all`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const staffUsers = response.data.filter(user => user.role === "staff");
      const studentUsers = response.data.filter(user => user.role === "student");

      setStaffUsers(staffUsers);
      setStudentUsers(studentUsers);
    } catch (error) {
      console.error("Error fetching User Profile:", error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingUser) {
      setEditingUser((prev) => ({ ...prev, [name]: value }));
    } else {
      setNewUser((prev) => ({ ...prev, [name]: value }));
    }
  };

  const addUser = async () => {
    try {
      const response = await axios.post(`${API_URL}/user/admin/create`, newUser, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 201) {
        fetchUserProfile();
        setNewUser({ name: "", email: "", role: "", password: "", username: "" });
        setShowAddForm(false);
        setNotification("Add user successfully!");
      }
    } catch (error) {
      console.error("Error adding user:", error);
      alert(error.response.data.message);
    }
    setShowConfirmation(false);
  };

  const updateUserProfile = async (id) => {
    const updatedData = {
      name: editingUser.name,
      email: editingUser.email,
      role: editingUser.role,
    };
    try {
      const response = await axios.put(`${API_URL}/user/update/${id}`,
        updatedData,
        {
          headers: { "Content-Type": "application/json" }
        }
      );
      // Gửi thông tin user mới đến backend
      if (response.status === 200) {
        fetchUserProfile();
        setEditingUser(null);
        setShowEditForm(false);
        setNotification("Update user successfully!");
      }
      // Cập nhật trạng thái user với dữ liệu mới từ backend
    } catch (error) {
      console.error("Error updating user profile:", error);
      alert(error.message);
    }
  };

  const handleRemove = async (id, role) => {
    try {
      const response = await axios.delete(`${API_URL}/user/admin/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        fetchUserProfile();
        if (role === "staff") {
          setStaffUsers((users) => users.filter((user) => user.id !== id));
        } else {
          setStudentUsers((users) => users.filter((user) => user.id !== id));
        }
        setShowConfirmation(false);
        setNotification("Remove user successfully!");
      } else {
        alert(response.data.message || "Failed to remove user.");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert(error.response?.data?.message || "Failed to delete user.");
    }
  };

  const toggleAddForm = () => setShowAddForm(!showAddForm);
  const toggleEditForm = (user) => {
    setEditingUser(user);
    setShowEditForm(true);
  };

  const confirmAction = (action, id, role) => {
    setConfirmationAction(action);
    setShowConfirmation(true);
    setConfirmationId(id);
    setConfirmationRole(role);
  };

  const executeConfirmationAction = () => {
    if (confirmationAction === "add") {
      addUser();
    } else if (confirmationAction === "delete") {
      handleRemove(confirmationId, confirmationRole);
    }
  };

  var index = 0;

  return (
    <div className="user-management-page fade-in">
      <h2 style={{ textAlign: "center" }} className="fade-in">Manage Users</h2>
      <div className="container mt-4">
        {showAddForm ? (
          <></>
        ) : (
          <button onClick={toggleAddForm} className="btn blue-btn slide-in-right">
            Add New User <FaPlus className="ms-2" />
          </button>
        )}
        {/* Add User Form */}
        {showAddForm && (
          <div className="form-group mt-3 slide-in-left">
            <h3>Add User</h3>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              placeholder="Name"
              name="name"
              value={newUser.name}
              onChange={handleInputChange}
              className="form-control mb-2"
            />
            <label htmlFor="username">Username:</label>
            <input
              type="username"
              placeholder="Username"
              name="username"
              value={newUser.username}
              onChange={handleInputChange}
              className="form-control mb-2"
            />
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={newUser.email}
              onChange={handleInputChange}
              className="form-control mb-2"
            />
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={newUser.password}
              onChange={handleInputChange}
              className="form-control mb-2"
            />
            <label htmlFor="role">Role:</label>
            <select
              name="role"
              value={newUser.role}
              onChange={handleInputChange}
              className="form-control mb-2"
            >
              <option value="">Select Role</option>
              <option value="staff">Staff</option>
              <option value="student">Student</option>
            </select>
            <button onClick={() => confirmAction("add")} className="btn blue-btn">
              Add User
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
        {/* Edit User Form */}
        {showEditForm && editingUser && (
          <div className="modal-overlay zoom-in">
            <div className="form-group mt-3">
              <h3>Edit User</h3>
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                placeholder="Name"
                name="name"
                value={editingUser.name}
                onChange={handleInputChange}
                className="form-control mb-2"
              />
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                placeholder="Username"
                name="username"
                value={editingUser.username}
                onChange={handleInputChange}
                className="form-control mb-2"
              />
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                placeholder="Email"
                name="email"
                value={editingUser.email}
                onChange={handleInputChange}
                className="form-control mb-2"
              />
              <button
                onClick={() => setShowEditForm(false)}
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
              <button onClick={() => updateUserProfile(editingUser._id)} className="btn blue-btn">
                Update User
              </button>
            </div>
          </div>
        )}


        <div className="container mt-4 user-section">
          {/* Staff Users Table */}
          <div className="user-table">
            <h3>Staff Users</h3>
            <div className="container mt-4">
              <div className="row">
                {staffUsers.map((user) => (
                  <div
                    key={user.id || `staff-${index++}`}
                    className="col-12 d-flex align-items-center mb-3 user-item fade-in"
                  >
                    <div className="col-4">
                      <h5 className="user-name">
                        <i id="staff-icon" className="fas fa-user-tie"></i>{" "}
                        {user.name}
                      </h5>
                      <p className="user-email">{user.email}</p>
                    </div>
                    <div className="col-6" style={{ display: "flex" }}>
                      <button
                        className="btn red-btn slide-in-left"
                        onClick={() => confirmAction("delete", user._id, "staff")}
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
                        <FaTrashAlt className="me-2" /> Remove
                      </button>
                      <button
                        className="btn blue-btn slide-in-right"
                        onClick={() => toggleEditForm(user)}
                      >
                        <FaEdit className="me-2" /> Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Student Users Table */}
          <div className="user-table">
            <h3>Student Users</h3>
            <div className="container mt-4">
              <div className="row">
                {studentUsers.map((user) => (
                  <div
                    key={user.id}
                    className="col-12 d-flex align-items-center mb-3 user-item fade-in"
                  >
                    <div className="col-4">
                      <h5 className="user-name">
                        <i id="profile" className="fas fa-user"></i>{" "}{user.name}
                      </h5>
                      <p className="user-email">{user.email}</p>
                    </div>
                    <div className="col-6" style={{ display: "flex" }}>
                      <button
                        className="btn red-btn slide-in-left"
                        onClick={() => confirmAction("delete", user._id, "student")}
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
                        <FaTrashAlt className="me-2" /> Remove
                      </button>
                      <button
                        className="btn blue-btn slide-in-right"
                        onClick={() => toggleEditForm(user)}
                      >
                        <FaEdit className="me-2" /> Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {showConfirmation && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h4>
                  {confirmationAction === "add"
                    ? "Are you sure you want to save changes?"
                    : "Are you sure you want to delete this user?"}
                </h4>
                <div className="modal-actions">
                  <button
                    onClick={executeConfirmationAction}
                    className="btn blue-btn">
                    Yes
                  </button>
                  <button
                    onClick={() => setShowConfirmation(false)}
                    className="btn red-btn">
                    No
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Notification */}
      {notification && <Notification message={notification} onClose={() => setNotification(null)} />}
    </div>
  );
};

export default ManageUser;