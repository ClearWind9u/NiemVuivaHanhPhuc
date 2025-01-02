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
  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const [coupons, setCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [finalTotalCost, setFinalTotalCost] = useState(null);
  const [voucherError, setVoucherError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  // Fetch cart items for the user
  const fetchCartItems = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/cart/${userId}`);
      setCartItems(response.data);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  // Fetch valid coupons when modal opens
  const fetchCoupons = async () => {
    try {
      const response = await axios.get("http://localhost:8000/coupons/valid");
      setCoupons(response.data);
    } catch (error) {
      console.error("Error fetching valid coupons:", error);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, [cartItems]);

  useEffect(() => {
    if (showModal) fetchCoupons();
  }, [showModal]);

  // Show notification
  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  // Update total cost when voucher discount changes
  const totalCost = cartItems
    .filter((item) => item.buyNow)
    .reduce((total, item) => total + item.price * item.quantity, 0);

  useEffect(() => {
    const updatedTotalCost = totalCost - voucherDiscount;
    setFinalTotalCost(updatedTotalCost < 0 ? 0 : updatedTotalCost); // Nếu nhỏ hơn 0, đặt bằng 0
  }, [totalCost, voucherDiscount]);


  // Validate and apply selected coupon
  const validateVoucher = async () => {
    if (!selectedCoupon) {
      setVoucherError("Please select a voucher to apply.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/coupons/validate", {
        code: selectedCoupon.code,  // Send coupon code
        totalCost: totalCost,       // Send total cost for discount calculation
      });

      const { discountedCost, voucherDiscount, message } = response.data;

      setVoucherDiscount(voucherDiscount);
      setFinalTotalCost(discountedCost);  // Update the total cost with the discount
      setVoucherError(null);
      setShowModal(false);
      showNotification(message || `${voucherDiscount} VNĐ off`);
    } catch (error) {
      console.error("Error validating voucher:", error);
      setVoucherError("Failed to apply voucher. Please try again.");
    }
  };


  const handleQuantityChange = async (id, delta) => {
    if (delta === 1) {
      try {
        const response = await axios.post(
          "http://localhost:8000/cart/add",
          {
            id: id,
            user_id: userId,
          },
          {
            headers: {
              "Content-Type": "application/json", // Ensure the data is sent as JSON
            },
          }
        );
      } catch (error) {
        console.error("Error increasing from cart:", error);
      }
    }
    if (delta === -1) {
      const itemInCart = cartItems.find((it) => {
        return it.id === id && it.user_id === userId;
      });
      if (itemInCart.quantity === 1) {
        handleRemove(itemInCart);
      }
      try {
        const response = await axios.post(
          "http://localhost:8000/cart/minus",
          {
            id: id,
            user_id: userId,
          },
          {
            headers: {
              "Content-Type": "application/json", // Ensure the data is sent as JSON
            },
          }
        );
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
          user_id: userId,
        },
        {
          headers: {
            "Content-Type": "application/json", // Ensure the data is sent as JSON
          },
        }
      );
      if (response.status === 201) {
        console.log("response: ", response);
      } else throw new Error("Failed to buy now food");
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
          user_id: userId,
        },
        {
          headers: {
            "Content-Type": "application/json", // Ensure the data is sent as JSON
          },
        }
      );
      if (response.status === 201) {
        const newCart = cartItems.filter((itemsInCart) => {
          return itemsInCart.id !== item.id;
        });
        setCartItems(newCart);
        showNotification(`${item.name} has been deleted to your cart!`);
      } else throw new Error("Failed to delete food");
    } catch (error) {
      console.error("Error delete from cart:", error);
    }
  };
  return (
    <div className="">
      <h2 style={{ textAlign: "center" }}>
        Your Cart <FaShoppingCart />
      </h2>
      <div className="container mt-4">
        <div className="row d-flex">
          {cartItems && cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="col-12 d-flex align-items-center mb-3 cart-item"
              >
                <div className="col-2 img-container">
                <img
                  src={item.image}
                  className="food-img"
                  alt={item.name}
                  style={{ maxWidth: "100%", height: "auto", objectFit: "cover", borderRadius: "5px", }}
                />
                </div>
                <div className="col-4">
                  <h5 className="card-title">{item.name}</h5>
                  <p className="price">Price: {item.price} VNĐ</p>
                </div>
                <div className="col-3 d-flex align-items-center">
                  <div className="quantity-controls">
                    <button
                      className="btn blue-btn quantity-decrease"
                      onClick={() => handleQuantityChange(item.id, -1)}
                    >
                      -
                    </button>
                    <p className="form-control mx-2">{item.quantity}</p>
                    <button
                      className="btn blue-btn quantity-increase"
                      onClick={() => handleQuantityChange(item.id, 1)}
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
                      onChange={() => handleBuyNowChange(item.id)}
                    />
                    <label className="form-check-label">Buy Now</label>
                  </div>
                  <button
                    className="btn red-btn"
                    onClick={() => handleRemove(item)}
                  >
                    <FaTrashAlt className="me-1" /> Remove
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center">
              <p className="text-muted" style={{ margin: '140px' }}>No items in your cart</p>
            </div>
          )}
          {cartItems && cartItems.length > 0 && (
            <div className="col-12 d-flex align-items-center mb-3">
              <div className="ms-auto me-3 text-end">
                <p className="total-price" style={{ color: "#28a745" }}>Discount: {totalCost - finalTotalCost} VNĐ</p>
                <p className="total-price">Total order: {finalTotalCost} VNĐ</p>
                <button
                  className="btn btn-secondary blue-btn"
                  onClick={() => setShowModal(true)}
                >
                  <FaTicketAlt className="me-2"/> Voucher
                </button>
                <button
                  className="btn btn-secondary blue-btn"
                  onClick={() =>
                    navigate("/payment", {
                      state: { cartItems, finalTotalCost },
                    })
                  }
                >
                  <FaCreditCard className="me-2"/> Purchase
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Voucher Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="coupons-container">
              <div className="coupons-header">
                <h4>Select a Voucher</h4>
              </div>
              <div className="coupons-grid">
                {coupons.length > 0 ? (
                  coupons.map((coupon) => (
                    <div
                      key={coupon.code}
                      className={`coupon-card ${selectedCoupon?.code === coupon.code ? "selected" : ""
                        }`}
                      onClick={() => setSelectedCoupon(coupon)}>
                      <div className="coupon-content">
                        <h5 className="coupon-code">{coupon.code}</h5>
                        <p className="coupon-description">
                          {coupon.description}
                        </p>
                        <div className="coupon-discount">
                          {coupon.percentDiscount > 0 &&
                            `${coupon.percentDiscount}% off`}
                          {coupon.percentDiscount > 0 &&
                            coupon.moneyDiscount > 0 &&
                            `,`}
                          {coupon.moneyDiscount > 0 &&
                            ` ${coupon.moneyDiscount} VNĐ off`}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="no-coupons">No valid coupons available.</p>
                )}
              </div>
              <div className="coupons-footer">
                {voucherError && <p className="error-text">{voucherError}</p>}
                <button className="btn blue-btn" onClick={validateVoucher}>
                  Apply
                </button>
                <button
                  className="btn red-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Notification */}
      {notification && (
        <Notification
          message={notification}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
};

export default Cart;
