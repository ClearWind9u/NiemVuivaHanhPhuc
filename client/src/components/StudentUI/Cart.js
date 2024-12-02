import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  FaCreditCard,
  FaShoppingCart,
  FaTicketAlt,
  FaTrashAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Notification from "../Notification";
import "../css/Cart.css";

const Cart = () => {
  const { userId } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  const handleNavigation = (path, data) => {
    navigate(path, data);
  };
  const fetchCartItem = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/cart/${userId}`);
      setCartItems(response.data);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  useEffect(() => {
    fetchCartItem();
  }, [cartItems]);

  const [notification, setNotification] = useState(null);
  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleQuantityChange = async (id, delta) => {
    if (delta === 1) {
      try {
        const response = await axios.post("http://localhost:8000/cart/add",
          {
            id: id,
            user_id: userId
          },
          {
            headers: {
              "Content-Type": "application/json", // Ensure the data is sent as JSON
            }
          }
        );
      } catch (error) {
        console.error("Error increasing from cart:", error);
      }
    }
    if (delta === -1) {
      const itemInCart = cartItems.find((it) => {
        return it.id === id && it.user_id === userId;
      })
      if (itemInCart.quantity === 0) {
        handleRemove(itemInCart)
      }
      try {
        const response = await axios.post("http://localhost:8000/cart/minus",
          {
            id: id,
            user_id: userId
          },
          {
            headers: {
              "Content-Type": "application/json", // Ensure the data is sent as JSON
            }
          }
        )
      } catch (error) {
        console.error("Error increasing from cart:", error);
      }
    }
  };

  const handleBuyNowChange = async (id) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/cart/buynow",
        {
          id: id,
          user_id: userId
        },
        {
          headers: {
            "Content-Type": "application/json", // Ensure the data is sent as JSON
          }
        }
      )
      if (response.status === 201) {
        console.log('response: ', response);
      }
      else throw new Error("Failed to buy now food");
    } catch (error) {
      console.error("Failed to buy now food:", error);
    }
  };

  const handleRemove = async (item) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/cart/remove",
        {
          id: item.id,
          user_id: userId
        },
        {
          headers: {
            "Content-Type": "application/json", // Ensure the data is sent as JSON
          }
        }
      )
      if (response.status === 201) {
        const newCart = cartItems.filter((itemsInCart) => {
          return itemsInCart.id !== item.id;
        })
        setCartItems(newCart);
        showNotification(`${item.name} has been deleted to your cart!`);
      }
      else throw new Error("Failed to delete food");
    } catch (error) {
      console.error("Error delete from cart:", error);
    }
  };

  const totalCost = cartItems
    .filter((item) => item.buyNow)
    .reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="">
      <h2 style={{ textAlign: 'center' }}>Your Cart <FaShoppingCart /></h2>
      <div className="container mt-4">
        <div className="row d-flex">
          {cartItems && cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="col-12 d-flex align-items-center mb-3 cart-item"
              >
                <div className="col-2 img-container">
                  <img src={item.image} className="food-img" alt={item.name} />
                </div>
                <div className="col-4">
                  <h5 className="card-title">{item.name}</h5>
                  <p className="price">Price: {item.price} VNĐ</p>
                </div>
                <div className="col-3 d-flex align-items-center">
                  <div className="quantity-controls">
                    <button
                      className="btn blue-btn quantity-decrease"
                      style={{ fontSize: "1rem", justifyContent: "center" }}
                      onClick={() => {
                        cartItems.map((itemInCart) => {
                          if (itemInCart.id === item.id) {
                            itemInCart.quantity -= 1;
                            itemInCart.total -= itemInCart.price;
                          }
                        });
                        handleQuantityChange(item.id, -1);
                      }}
                    >
                      -
                    </button>
                    <p className="form-control mx-2">{item.quantity}</p>
                    <button
                      className="btn blue-btn quantity-increase"
                      style={{ fontSize: "1rem", justifyContent: "center" }}
                      onClick={() => {
                        cartItems.map((itemInCart) => {
                          if (itemInCart.id === item.id) {
                            itemInCart.quantity += 1;
                            itemInCart.total += itemInCart.price;
                          }
                        });
                        handleQuantityChange(item.id, 1);
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="col-2 text-end ms-auto">
                  <p className="total-price">
                    Total: {item.price * item.quantity} VNĐ
                  </p>
                  <div>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={item.buyNow}
                      style={{ fontSize: "1rem" }}
                      onChange={() => handleBuyNowChange(item.id)}
                    />
                    <label className="form-check-label">Buy Now</label>
                  </div>

                  <button
                    className="btn red-btn"
                    style={{ fontSize: "1rem" }}
                    onClick={() => handleRemove(item)}
                  >
                    <FaTrashAlt className="me-1" /> Remove
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center" style={{ margin: '130px 0', }}>
              <p className="text-muted">No items in your cart</p>
            </div>
          )}
          {cartItems && cartItems.length > 0 && (
            <div className="col-12 d-flex align-items-center mb-3">
              <div className="ms-auto me-3 text-end">
                <p className="total-price">Total order: {totalCost} VNĐ</p>
                <button
                  className="btn btn-secondary blue-btn"
                  style={{ fontSize: "1rem" }}
                >
                  <FaTicketAlt style={{ marginRight: "10px" }} /> Voucher
                </button>
                <button
                  className="btn btn-secondary blue-btn"
                  style={{ fontSize: "1rem" }}
                  onClick={() =>
                    handleNavigation("/payment", { state: { cartItems } })
                  }
                >
                  <FaCreditCard style={{ marginRight: "10px" }} /> Purchase
                </button>
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

export default Cart;