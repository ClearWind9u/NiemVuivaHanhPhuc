import React, { useState } from "react";
import "../css/Wallet.css";

const Wallet = () => {
    const [showModal, setShowModal] = useState(false);
    const [amount, setAmount] = useState("");
    const [balance, setBalance] = useState(250.00);

    const handleAddFunds = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setAmount("");
    };

    const handleConfirmAddFunds = () => {
        const newAmount = parseFloat(amount);
        if (!isNaN(newAmount) && newAmount > 0) setBalance(balance + newAmount);
        handleCloseModal();
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
                        <p className="balance-amount">${balance.toFixed(2)}</p>
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
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Enter Amount to Add ($)</h3>
                        <input
                            type="number"
                            className="form-control amount-input"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter amount"
                            min="1"
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