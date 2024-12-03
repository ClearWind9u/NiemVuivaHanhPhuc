import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Notification from "../Notification";
import "../css/Wallet.css";
const Wallet = () => {
    const { userId } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [amount, setAmount] = useState("");
    const [notification, setNotification] = useState(null);
    const [balance, setBalance] = useState(0);
    
    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/user/${userId}`, {
                    headers: {
                        "Content-Type": "application/json",
                      },
                });
                const customer = response.data;
                const balance = customer.balance;
                setBalance(balance);
            } catch (error) {
                console.error("Error fetching balance:", error);
            }
        };
        fetchBalance();
    }, [balance, userId]);

    const handleAddFunds = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setAmount("");
    };

    // Hiển thị thông báo
    const showNotification = (message) => {
        setNotification(message);
        setTimeout(() => setNotification(null), 3000);
    };

    const handleConfirmAddFunds = async () => {
        const newAmount = parseInt(amount);
        if (!isNaN(newAmount) && newAmount > 0) {
            try {
                const response = await axios.post(`http://localhost:8000/wallet/add/${userId}`,
                    {
                        id: userId,
                        money: newAmount
                    },
                    {
                        headers: {
                            "Content-Type": "application/json", // Ensure the data is sent as JSON
                        }
                    }
                )
                if (response.status === 200) {
                    showNotification(`Added ${amount} VNĐ to your wallet`);
                } else {
                    console.error("Failed to accept the users.");
                }
            } catch (error) {
                if (error.response) {
                    // Hiển thị thông báo lỗi từ server
                    alert(error.response.data.message);
                } else {
                    console.error("Error adding fund:", error);
                }
            }
            handleCloseModal();
            setBalance(balance + newAmount);
        }
    };

    {/*Press enter to confirm */ }
    const handleKeyDown = (event) => {
        if (event.key === "Enter") handleConfirmAddFunds();
    };

    return (
        <div className="">
            <h2 style={{ textAlign: 'center' }}>My Wallet</h2>
            <div style={{ textAlign: 'center' }}>Save your credit and debit card details for faster checkout</div>

            {/* Wallet Content */}
            <div className="wallet-content">
                {/* Balance Section */}
                <div className="balance-section d-flex justify-content-between align-items-center">
                    <div className="balance-info">
                        <h4>Your Balance</h4>
                        <p className="balance-amount">{balance} VNĐ</p>
                    </div>
                    <button className="btn btn-secondary blue-btn" onClick={handleAddFunds}>Add Funds</button>
                </div>
                {/* Saved Cards Section */}
                <div className="saved-cards">
                    <h4 style={{ marginLeft: '20px' }}>Saved Cards:</h4>
                    <ul className="card-list">
                        <li className="card-item">
                            <i className="fab fa-cc-visa card-icon"></i>
                            <span>**** **** **** 1234</span>
                            <button className="btn btn-secondary red-btn">Remove</button>
                        </li>
                        <li className="card-item">
                            <i className="fab fa-cc-mastercard card-icon"></i>
                            <span>**** **** **** 5678</span>
                            <button className="btn btn-secondary red-btn">Remove</button>
                        </li>
                        <li className="card-item">
                            <i className="fab fa-cc-amex card-icon"></i>
                            <span>**** **** **** 9012</span>
                            <button className="btn btn-secondary red-btn">Remove</button>
                        </li>
                    </ul>
                    <button className="btn btn-secondary mt-2 blue-btn">Add New Card</button>
                </div>
                {/* Notification */}
                {notification && <Notification message={notification} onClose={() => setNotification(null)} />}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Enter Amount to Add (VNĐ)</h3>
                        <input
                            type="number"
                            className="form-control amount-input"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter amount"
                            min="1000"
                            step="1000"
                            onKeyDown={handleKeyDown}
                        />
                        <div className="modal-buttons">
                            <button className="btn red-btn" onClick={handleCloseModal}>Cancel</button>
                            <button className="btn blue-btn" onClick={handleConfirmAddFunds}>Confirm</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Wallet;