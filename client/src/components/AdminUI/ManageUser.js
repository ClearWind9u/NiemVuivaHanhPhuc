import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTrashAlt, FaEdit, FaPlus } from "react-icons/fa";
import "../css/ManageUser.css";
import bcrypt from "bcryptjs";
// import { staff as staffDB } from "../../db/staffUser";
// import { students as studentsDB } from "../../db/studentUser";
const ManageUser = () => {
  const [staffUsers, setStaffUsers] = useState([]);
  const [studentUsers, setStudentUsers] = useState([]);

  const [newUser, setNewUser] = useState({ name: "", email: "", role: "", password: "", username: "" });
  const [editingUser, setEditingUser] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);



  const fetchUserProfile = async () => {
    try {
      const response = await axios.get("http://localhost:8000/user/admin/all", {
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      const staffUsers = response.data.filter(user => user.role === "staff");
      const studentUsers = response.data.filter(user => user.role === "student");

      //setUserlist(response.data);
  
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
    if (!newUser.name || !newUser.email || !newUser.role || !newUser.password) {
      alert("Please fill in all fields before adding a user.");
      return;
    }
    const hashedPa = await bcrypt.hash(newUser.password, 10);

    newUser.password = hashedPa;
    try {
      
      const response = await axios.post("http://localhost:8000/user/admin/create", newUser, {
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (response.status === 201) {
        
        fetchUserProfile();

        //setUserlist((prevUsers) => [...prevUsers, response.data.user]);
  
        setNewUser({ name: "", email: "", role: "", password: "", username: "" });

        //setUserlist(response.data);
  
        setShowAddForm(false);
  
        alert("User added successfully!");
      }
    } catch (error) {
      console.error("Error adding user:", error);
      alert("There was an error adding the user.");
    }
  };

  const updateUserProfile = async (id) => {
    const updatedData = {
      name: editingUser.name,
      password: editingUser.password,
      email: editingUser.email,
      role: editingUser.role,
    };
    const hP = await bcrypt.hash(updatedData.password, 10);
    
    updatedData.password = hP;
    console.log(updatedData.password, " THIS IS NEW P");
    try {
      const response = await axios.put(`http://localhost:8000/user/admin/update/${id}`, 
         updatedData ,
        { 
          headers: { "Content-Type": "application/json" } 
        }
      ); 
      // Gửi thông tin user mới đến backend
      fetchUserProfile();
      console.log("User profile updated:", response.data);
      setEditingUser(null);
      setShowEditForm(false);
      // Cập nhật trạng thái user với dữ liệu mới từ backend
    } catch (error) {
      console.error("Error updating user profile:", error);
    }
  };

  const handleRemove = async (id, role) => {
    try {
      console.log(id);
      // Gọi API trước khi cập nhật state để đảm bảo dữ liệu nhất quán
      const response = await axios.delete(
        `http://localhost:8000/user/admin/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        // Update the corresponding state based on role
        fetchUserProfile();
        if (role === "Staff") {
          setStaffUsers((users) => users.filter((user) => user.id !== id));
        } else {
          setStudentUsers((users) => users.filter((user) => user.id !== id));
        }
  
        alert("User removed successfully!");
      } else {
        alert(response.data.message || "Failed to remove user.");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user.");
    }
  };

  const toggleAddForm = () => setShowAddForm(!showAddForm);
  const toggleEditForm = (user) => {
    setEditingUser(user);
    setShowEditForm(true);
  };

  var index = 0;

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
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            placeholder="Name"
            name="name"
            value={newUser.name}
            onChange={handleInputChange}
            className="form-control mb-2"
          />
          <label htmlFor="username">Userame:</label>
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
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                placeholder="Name"
                name="name"
                value={editingUser.name}
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
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                placeholder="Password"
                name="password"
                value={editingUser.password}
                onChange={handleInputChange}
                className="form-control mb-2"
              />
              <label htmlFor="role">Role:</label>
              <select
                name="role"
                value={editingUser.role}
                onChange={handleInputChange}
                className="form-control mb-2"
              >
                <option value="staff">Staff</option>
                <option value="student">Student</option>
              </select>
              <button onClick={() => updateUserProfile(editingUser._id)} className="btn blue-btn">
                Update User
              </button>
            </div>
          </div>
        )}
        {/* Staff Users Table */}
        <div className="container mt-4 user-section">
          <div className="user-table">
            <h3>Staff Users</h3>
            <div 
              className="container mt-4"
            //  key = {1}
            >
              <div className="row">
                {staffUsers.map((user) => (
                  <div
                    key={user.id || `staff-${index++}`} 
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
                        onClick={() => handleRemove(user._id, "staff")}
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
