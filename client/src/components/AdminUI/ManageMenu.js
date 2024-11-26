import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTrashAlt, FaEdit, FaPlus } from "react-icons/fa";
import "../css/ManageMenu.css";

const ManageMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", price: "", image: "", category: "" });
  const [editingItem, setEditingItem] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Fetch menu items from API
  const fetchMenuItems = async () => {
    try {
      const response = await axios.get("http://localhost:8000/menu/all");
      setMenuItems(response.data);
    } catch (error) {
      console.error("Error fetching menu items:", error);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const handleRemove = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/menu/delete/${id}`);
      setMenuItems((items) => items.filter((item) => item.id !== id));
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
    if (!newItem.name || !newItem.price || !newItem.image || !newItem.category) {
      alert("Please fill in all fields before adding an item.");
      return;
    }
    const itemExists = menuItems.some((item) => item.name.toLowerCase() === newItem.name.toLowerCase());
  if (itemExists) {
    alert("Tên món ăn đã tồn tại");
    return;
  }

    try {
      const response = await axios.post("http://localhost:8000/menu/add", {
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
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const updateItem = async () => {
    try {
      const response = await axios.put(`http://localhost:8000/menu/update/${editingItem.id}`, {
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
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  const toggleAddForm = () => setShowAddForm(!showAddForm);
  const toggleEditForm = (item) => {
    setEditingItem(item);
    setShowEditForm(!showEditForm);
  };

  return (
    <div className="manage-menu">
      <h2 style={{ textAlign: "center" }}>
        Manage Menu <i id="menu" className="fas fa-book"></i>
      </h2>
      <div className="container mt-4">
        {!showAddForm && (
          <button onClick={toggleAddForm} className="btn blue-btn">
            Add New Item <FaPlus />
          </button>
        )}
        {/* Add Form */}
        {showAddForm && (
          <div className="form-group mt-3">
            <h3>Add Form</h3>
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
            <input
              type="text"
              placeholder="Category"
              name="category"
              value={newItem.category}
              onChange={handleInputChange}
              className="form-control mb-2"
            />
            <button onClick={() => setShowConfirmation(true)} className="btn blue-btn">
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
            <h4>Bạn có chắc muốn lưu thay đổi?</h4>
            <div className="modal-actions">
              <button
                onClick={() => {
                  addItem();
                  setShowConfirmation(false);
                }}
                className="btn blue-btn"
              >
                Có
              </button>
              <button
                onClick={() => setShowConfirmation(false)}
                className="btn red-btn"
              >
                Không
              </button>
            </div>
          </div>
        </div>
      )}
        {/* Edit Form */}
        {showEditForm && editingItem && (
          <div className="modal-overlay">
            <div className="form-group mt-3">
              <h3>Edit Form</h3>
              <input
                type="text"
                placeholder="Name"
                name="name"
                value={editingItem.name}
                onChange={handleInputChange}
                className="form-control mb-2"
              />
              <input
                type="text"
                placeholder="Quantity"
                name="quantity"
                value={editingItem.quantity}
                onChange={handleInputChange}
                className="form-control mb-2"
              />
              <input
                type="text"
                placeholder="Price"
                name="price"
                value={editingItem.price}
                onChange={handleInputChange}
                className="form-control mb-2"
              />
              <input
                type="text"
                placeholder="Description"
                name="description"
                value={editingItem.description}
                onChange={handleInputChange}
                className="form-control mb-2"
              />
              <input
                type="text"
                placeholder="Preparation_time"
                name="preparation_time"
                value={editingItem.preparation_time}
                onChange={handleInputChange}
                className="form-control mb-2"
              />
              <input
                type="text"
                placeholder="Image URL"
                name="image"
                value={editingItem.image}
                onChange={handleInputChange}
                className="form-control mb-2"
              />
              <input
                type="text"
                placeholder="Category"
                name="category"
                value={editingItem.category}
                onChange={handleInputChange}
                className="form-control mb-2"
              />
              <button onClick={updateItem} className="btn blue-btn">
                Update Item
              </button>
              <button onClick={toggleEditForm}className="btn blue-btn">
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="container mt-4">
        <div className="row d-flex">
          {menuItems.map((item) => (
            <div
              key={item._id}
              className="col-12 d-flex align-items-center mb-3 cart-item"
            >
              <div className="col-2 img-container">
                <img src={item.image} className="food-img" alt={item.name} />
              </div>
              <div className="col-4">
                <h5 className="card-title">{item.name}</h5>
                <p className="price">Price: ${Number(item.price).toFixed(2)}</p>
                <p>Description: {item.description}</p>
                <p>Category: {item.category}</p>
              </div>
              <div className="col-4 text-end ms-auto">
                <button
                  className="btn red-btn"
                  onClick={() => handleRemove(item.id)}
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
                  onClick={() => toggleEditForm(item)}
                >
                  <FaEdit /> Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageMenu;
