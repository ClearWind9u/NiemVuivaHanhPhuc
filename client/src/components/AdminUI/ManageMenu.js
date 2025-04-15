import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaEdit, FaPlus, FaTrashAlt } from "react-icons/fa";
import Notification from "../Notification";
import "../css/ManageMenu.css";

const ManageMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", price: "", image: "", category: "food" });
  const [editingItem, setEditingItem] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState(null);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [notification, setNotification] = useState(null);
  const API_URL = "https://joy-and-happiness-be.vercel.app";

  // Fetch menu items from API
  const fetchMenuItems = async (page = 1, limit = 5) => {
    try {
      const response = await axios.get(`${API_URL}/menu/all`, {
        params: {
          page,
          limit,
        }
      });
      setMenuItems(response.data.dishes);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching menu items:", error);
    }
  };

  useEffect(() => {
    fetchMenuItems(currentPage);
  }, [currentPage]);

  const handleRemove = async () => {
    try {
      await axios.delete(`${API_URL}/menu/delete/${deleteTargetId}`);
      setMenuItems((items) => items.filter((item) => item.id !== deleteTargetId));
      setShowConfirmation(false);
      setNotification("Remove food successfully!");
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingItem) {
      setEditingItem((prev) => ({ ...prev, [name]: value }));
    } else {
      setNewItem((prev) => ({ ...prev, [name]: value }));
    }
  };

  const addItem = async () => {
    if (!newItem.name || !newItem.price || !newItem.image) {  
      alert("Please fill in all fields before adding an item.");
      return;
    }
    const itemExists = menuItems.some((item) => item.name.toLowerCase() === newItem.name.toLowerCase());
    if (itemExists) {
      alert("The item name already exists.");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/menu/add`, {
        name: newItem.name,
        price: newItem.price,
        image: newItem.image,
        description: newItem.description,
        category: newItem.category,
        quantity: 10,
        preparation_time: 10, // default prep time
      });

      setMenuItems((prevItems) => [...prevItems, response.data.dish]);
      setNewItem({ name: "", price: "", image: "", category: "" });
      setShowAddForm(false);
      setNotification("Add food successfully!");
    } catch (error) {
      console.error("Error adding item:", error);
    }
    setShowConfirmation(false);
  };

  const updateItem = async () => {
    try {
      const response = await axios.put(`${API_URL}/menu/update/${editingItem.id}`, {
        name: editingItem.name,
        price: editingItem.price,
        image: editingItem.image,
        description: editingItem.description,
        category: editingItem.category,
        quantity: editingItem.quantity,
        preparation_time: editingItem.preparation_time
      });

      setMenuItems((items) =>
        items.map((item) => (item.id === editingItem.id ? response.data.dish : item))
      );
      setEditingItem(null);
      setShowEditForm(false);
      setNotification("Update food successfully!");
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  const toggleAddForm = () => setShowAddForm(!showAddForm);
  const toggleEditForm = (item) => {
    setEditingItem(item);
    setShowEditForm(!showEditForm);
  };

  const confirmAction = (action, id = null) => {
    setConfirmationAction(action);
    setDeleteTargetId(id);
    setShowConfirmation(true);
  };

  const executeConfirmationAction = () => {
    if (confirmationAction === "add") {
      addItem();
    } else if (confirmationAction === "delete") {
      handleRemove();
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="manage-menu fade-in">
      <h2 style={{ textAlign: "center" }} className="fade-in">
        Manage Menu <i id="menu" className="fas fa-book"></i>
      </h2>
      <div className="container mt-4">
        {!showAddForm && (
          <button onClick={toggleAddForm} className="btn blue-btn slide-in-right">
            Add New Item <FaPlus className="ms-2" />
          </button>
        )}
        {/* Add Form */}
        {showAddForm && (
          <div className="form-group mt-3 slide-in-left">
            <h3>Add Food</h3>
            <input
              type="text"
              placeholder="Name"
              name="name"
              value={newItem.name}
              onChange={handleInputChange}
              className="form-control mb-2"
            />
            <input
              type="text"
              placeholder="Price"
              name="price"
              value={newItem.price}
              onChange={handleInputChange}
              className="form-control mb-2"
            />
            <input
              type="text"
              placeholder="Description"
              name="description"
              value={newItem.description}
              onChange={handleInputChange}
              className="form-control mb-2"
            />
            <input
              type="text"
              placeholder="Image URL"
              name="image"
              value={newItem.image}
              onChange={handleInputChange}
              className="form-control mb-2"
            />
            <select
              name="category"
              value={newItem.category}
              onChange={handleInputChange}
              className="form-control mb-2">
              <option value="food">food</option>
              <option value="drink">drink</option>
              <option value="snack">snack</option>
            </select>
            <button onClick={() => confirmAction("add")} className="btn blue-btn">
              Add Item
            </button>
            <button onClick={toggleAddForm} className="btn red-btn">
              Cancel
            </button>
          </div>
        )}
        {showConfirmation && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h4>
                {confirmationAction === "add"
                  ? "Are you sure you want to save changes?"
                  : "Are you sure you want to delete this item?"}
              </h4>
              <div className="modal-actions">
                <button
                  onClick={executeConfirmationAction}
                  className="btn blue-btn"
                >
                  Yes
                </button>
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="btn red-btn"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Edit Form */}
        {showEditForm && editingItem && (
          <div className="modal-overlay zoom-in">
            <div className="form-group mt-3">
              <h3>Edit Form</h3>
              <label htmlFor="name" className="form-label">Name:</label>
              <input
                type="text"
                id="name"
                placeholder="Name"
                name="name"
                value={editingItem.name}
                onChange={handleInputChange}
                className="form-control mb-2"
              />
              <label htmlFor="quantity" className="form-label">Quantity:</label>
              <input
                type="text"
                id="quantity"
                placeholder="Quantity"
                name="quantity"
                value={editingItem.quantity}
                onChange={handleInputChange}
                className="form-control mb-2"
              />
              <label htmlFor="price" className="form-label">Price:</label>
              <input
                type="text"
                id="price"
                placeholder="Price"
                name="price"
                value={editingItem.price}
                onChange={handleInputChange}
                className="form-control mb-2"
              />
              <label htmlFor="description" className="form-label">Description:</label>
              <input
                type="text"
                id="description"
                placeholder="Description"
                name="description"
                value={editingItem.description}
                onChange={handleInputChange}
                className="form-control mb-2"
              />
              <label htmlFor="preparation_time" className="form-label">Preparation Time (minutes):</label>
              <input
                type="text"
                id="preparation_time"
                placeholder="Preparation Time"
                name="preparation_time"
                value={editingItem.preparation_time}
                onChange={handleInputChange}
                className="form-control mb-2"
              />
              <label htmlFor="image" className="form-label">Image URL:</label>
              <input
                type="text"
                id="image"
                placeholder="Image URL"
                name="image"
                value={editingItem.image}
                onChange={handleInputChange}
                className="form-control mb-2"
              />
              <label htmlFor="category" className="form-label">Category:</label>
              <select
                id="category"
                name="category"
                value={editingItem.category || "food"}
                onChange={handleInputChange}
                className="form-control mb-2"
              >
                <option value="food">food</option>
                <option value="drink">drink</option>
                <option value="snack">snack</option>
              </select>
              <button onClick={toggleEditForm} className="btn red-btn">
                Cancel
              </button>
              <button onClick={updateItem} className="btn blue-btn">
                Update Item
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="container mt-4">
        <div className="row d-flex">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className="col-12 d-flex align-items-center mb-3 cart-item fade-in">
              <div className="col-2 img-container">
                <img
                  src={item.image}
                  className="food-img zoom-in"
                  alt={item.name}
                  style={{ maxWidth: "100%", height: "auto", objectFit: "cover", borderRadius: "5px", }}
                />
              </div>
              <div className="col-4">
                <h5 className="card-title">{item.name}</h5>
                <p className="price" style={{ color: 'red' }}>Price: {Number(item.price)} VNĐ</p>
                <p>Description: {item.description}</p>
                <p>Category: {item.category}</p>
              </div>
              <div className="col-4 text-end ms-auto">
                <button
                  className="btn red-btn slide-in-left"
                  onClick={() => confirmAction("delete", item.id)}
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
                  onClick={() => toggleEditForm(item)}
                >
                  <FaEdit className="me-2" /> Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Pagination (Optional) */}
      <nav aria-label="Page navigation">
        <ul className="pagination justify-content-center">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>&laquo; Prev</button>
          </li>
          {Array.from({ length: totalPages }, (_, index) => (
            <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
              <button className="page-link" onClick={() => handlePageChange(index + 1)}>{index + 1}</button>
            </li>
          ))}
          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>Next &raquo;</button>
          </li>
        </ul>
      </nav>
      {/* Notification */}
      {notification && <Notification message={notification} onClose={() => setNotification(null)} />}
    </div>
  );
};

export default ManageMenu;
