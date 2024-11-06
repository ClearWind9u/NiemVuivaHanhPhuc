import React, { useState } from "react";
import { FaTrashAlt, FaEdit, FaPlus } from "react-icons/fa";
import "../css/ManageUser.css";
import { staff as staffDB } from "../../db/staffUser";
import { students as studentsDB } from "../../db/studentUser";
const ManageUser = () => {
  const [staffUsers, setStaffUsers] = useState(staffDB);

  const [studentUsers, setStudentUsers] = useState(studentsDB);

  const [newUser, setNewUser] = useState({ name: "", email: "", role: "" });
  const [editingUser, setEditingUser] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingUser) {
      setEditingUser((prev) => ({ ...prev, [name]: value }));
    } else {
      setNewUser((prev) => ({ ...prev, [name]: value }));
    }
  };

  const addUser = () => {
    if (!newUser.name || !newUser.email || !newUser.role) {
      alert("Please fill in all fields before adding a user.");
      return;
    }

    const userToAdd = { ...newUser, id: Date.now() };
    if (newUser.role === "Staff") {
      setStaffUsers((prevUsers) => [...prevUsers, userToAdd]);
    } else {
      setStudentUsers((prevUsers) => [...prevUsers, userToAdd]);
    }

    setNewUser({ name: "", email: "", role: "" });
    setShowAddForm(false);
  };

  const updateUser = () => {
    if (editingUser.role === "Staff") {
      setStaffUsers(
        staffUsers.map((user) =>
          user.id === editingUser.id ? editingUser : user
        )
      );
    } else {
      setStudentUsers(
        studentUsers.map((user) =>
          user.id === editingUser.id ? editingUser : user
        )
      );
    }
    setEditingUser(null);
    setShowEditForm(false);
  };

  const handleRemove = (id, role) => {
    if (role === "Staff") {
      setStaffUsers((users) => users.filter((user) => user.id !== id));
    } else {
      setStudentUsers((users) => users.filter((user) => user.id !== id));
    }
  };

  const toggleAddForm = () => setShowAddForm(!showAddForm);
  const toggleEditForm = (user) => {
    setEditingUser(user);
    setShowEditForm(true);
  };

  return (
    <div className="user-management-page">
      <h2 style={{ textAlign: "center" }}>Manage Users</h2>
      <div className="container mt-4">
        {showAddForm ? (
          <></>
        ) : (
          <button onClick={toggleAddForm} className="btn blue-btn">
            Add New User <FaPlus />
          </button>
        )}
        {/* Add User Form */}
        {showAddForm && (
          <div className="form-group mt-3">
            <h3>Add User</h3>
            <input
              type="text"
              placeholder="Name"
              name="name"
              value={newUser.name}
              onChange={handleInputChange}
              className="form-control mb-2"
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={newUser.email}
              onChange={handleInputChange}
              className="form-control mb-2"
            />
            <select
              name="role"
              value={newUser.role}
              onChange={handleInputChange}
              className="form-control mb-2"
            >
              <option value="">Select Role</option>
              <option value="Staff">Staff</option>
              <option value="Student">Student</option>
            </select>
            <button onClick={addUser} className="btn blue-btn">
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
          <div className="modal-overlay">
            <div className="form-group mt-3">
              <h3>Edit User</h3>
              <input
                type="text"
                placeholder="Name"
                name="name"
                value={editingUser.name}
                onChange={handleInputChange}
                className="form-control mb-2"
              />
              <input
                type="email"
                placeholder="Email"
                name="email"
                value={editingUser.email}
                onChange={handleInputChange}
                className="form-control mb-2"
              />
              <select
                name="role"
                value={editingUser.role}
                onChange={handleInputChange}
                className="form-control mb-2"
              >
                <option value="Staff">Staff</option>
                <option value="Student">Student</option>
              </select>
              <button onClick={updateUser} className="btn blue-btn">
                Update User
              </button>
            </div>
          </div>
        )}
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
                      className="col-6 "
                      style={{
                        display: "flex",
                      }}
                    >
                      <button
                        className="btn red-btn"
                        onClick={() => handleRemove(user.id, "Staff")}
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
                        onClick={() => toggleEditForm(user)}
                      >
                        <FaEdit /> Edit
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
                        <i id="profile" className="fas fa-user"></i>{user.name}</h5>
                      <p className="user-email">{user.email}</p>
                    </div>
                    <div
                      className="col-6 "
                      style={{
                        display: "flex",
                      }}
                    >
                      <button
                        className="btn red-btn"
                        onClick={() => handleRemove(user.id, "Student")}
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
                        onClick={() => toggleEditForm(user)}
                      >
                        <FaEdit /> Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageUser;
