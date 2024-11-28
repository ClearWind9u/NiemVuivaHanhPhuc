import React, { useState } from "react";
import {
  FaCreditCard,
  FaShoppingCart,
  FaTicketAlt,
  FaTrashAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { cartItems as initialcartItems } from "../../db/cartItems";
import "../css/Cart.css";

const Cart = () => {
  const [cartItems, setCartItems] = useState(initialcartItems);
  const navigate = useNavigate();
  const handleNavigation = (path, data) => {
    navigate(path, data);
  };

  const handleQuantityChange = (id, delta) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id
          ? {
            ...item,
            quantity: Math.max(1, item.quantity + delta),
          }
          : item
      )
    );
  };

  const handleBuyNowChange = (id) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, buyNow: !item.buyNow } : item
      )
    );
  };

  const handleRemove = (id) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const totalCost = cartItems
    .filter((item) => item.buyNow)
    .reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="">
      <h2 style={{ textAlign: 'center' }}>Your Cart <FaShoppingCart /></h2>

      <div className="container mt-4">
        <div className="row d-flex">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="col-12 d-flex align-items-center mb-3 cart-item"
            >
              <div className="col-2 img-container">
                <img src={item.image} className="food-img" alt={item.name} />
              </div>
              <div className="col-4">
                <h5 className="card-title">{item.name}</h5>
                <p className="price">Price: ${item.price.toFixed(2)}</p>
              </div>
              <div className="col-3 d-flex align-items-center">
                <div className="quantity-controls">
                  <button
                    className="btn btn-secondary blue-btn quantity-decrease"
                    style={{ fontSize: '1rem', justifyContent: 'center' }}
                    onClick={() => handleQuantityChange(item.id, -1)}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    className="form-control mx-2"
                    value={item.quantity}
                    min="1"
                    readOnly
                    style={{ width: '3rem', textAlign: 'center' }}
                  />
                  <button
                    className="btn btn-secondary blue-btn quantity-increase"
                    style={{ fontSize: '1rem', justifyContent: 'center' }}
                    onClick={() => handleQuantityChange(item.id, 1)}
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="col-2 text-end ms-auto">
                <p className="total-price">
                  Total: ${(item.price * item.quantity).toFixed(2)}
                </p>
                <div >
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={item.buyNow}
                    style={{ fontSize: '1rem' }}
                    onChange={() => handleBuyNowChange(item.id)}
                  />
                  <label className="form-check-label">Buy Now</label>
                </div>

                <button
                  className="btn red-btn"
                  style={{ fontSize: '1rem' }}
                  onClick={() => handleRemove(item.id)}
                >
                  <FaTrashAlt className="me-1" /> Remove
                </button>
              </div>
            </div>
          ))}

          <div className="col-12 d-flex align-items-center mb-3">
            <div className="ms-auto me-3 text-end">
              <p className="total-price">Total order: ${totalCost.toFixed(2)}</p>
              <button className="btn btn-secondary blue-btn " style={{ fontSize: '1rem' }}>
                <FaTicketAlt style={{ marginRight: '10px' }} /> Voucher
              </button>
              <button className="btn btn-secondary blue-btn " style={{ fontSize: '1rem' }} onClick={() => handleNavigation("/payment", { state: { cartItems } })}>
                <FaCreditCard style={{ marginRight: '10px' }} /> Purchase
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;