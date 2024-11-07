import React, { useState } from "react";
import { FaTrashAlt, FaEdit, FaPlus } from "react-icons/fa";
import "../css/ManageMenu.css";
const ManageMenu = () => {
  const [menuItems, setMenuItems] = useState([
    {
      id: 1,
      name: "Pasta with Tomato Sauce",
      price: 8.0,
      image: `../image/food1.jpg`,
    },
    { id: 2, name: "Grilled Chicken", price: 10.0, image: `../image/food2.jpg` },
    { id: 3, name: "Caesar Salad", price: 7.5, image: `../image/food3.jpg` },
  ]);
  const [newItem, setNewItem] = useState({ name: "", price: "", image: "" });
  const [editingItem, setEditingItem] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  const handleRemove = (id) => {
    setMenuItems((items) => items.filter((item) => item.id !== id));
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingItem) {
      setEditingItem((prev) => ({ ...prev, [name]: value }));
    } else {
      setNewItem((prev) => ({ ...prev, [name]: value }));
    }
  };
  const addItem = () => {
    // Validate that no fields are empty
    if (!newItem.name || !newItem.price || !newItem.image) {
      alert("Please fill in all fields before adding an item."); // Alert the user
      return; // Exit the function early
    }
    // Proceed with adding the item
    const itemToAdd = {
      ...newItem,
      id: Date.now(), // Example of generating a unique ID
    };
    setMenuItems((prevItems) => [...prevItems, itemToAdd]); // Add the item to the list
    setNewItem({ name: "", price: "", image: "" }); // Reset the form
    setShowAddForm(false); // Optionally close the Add form
  };

  const updateItem = () => {
    setMenuItems(
      menuItems.map((item) => (item.id === editingItem.id ? editingItem : item))
    );
    setEditingItem(null);
  };

  const toggleAddForm = () => setShowAddForm(!showAddForm); // Function to toggle Add Form
  const toggleEditForm = (item) => {
    setEditingItem(item);
    setShowEditForm(true);
  };

  return (
    <div className="">
      <h2 style={{ textAlign: "center" }}>
        Manage Menu <i id="menu" className="fas fa-book"></i>
      </h2>
      <div className="container mt-4">
        {showAddForm ? (
          <></>
        ) : (
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
              placeholder="Image URL"
              name="image"
              value={newItem.image}
              onChange={handleInputChange}
              className="form-control mb-2"
            />
            <button onClick={addItem} className="btn blue-btn">
              Add Item
            </button>
            <button onClick={toggleAddForm} className="btn red-btn"
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
              }>
              Cancel
            </button>
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
                placeholder="Price"
                name="price"
                value={editingItem.price}
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
              className="col-12 d-flex align-items-center mb-3 cart-item"
            >
              <div className="col-2 img-container">
                <img src={item.image} className="food-img" alt={item.name} />
              </div>
              <div className="col-4">
                <h5 className="card-title">{item.name}</h5>
                <p className="price">
                  Price: ${Number(item.price).toFixed(2)}
                </p>
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
