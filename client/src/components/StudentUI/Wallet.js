import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Notification from "../Notification";
import { QRCodeCanvas } from "qrcode.react";
import "../css/Wallet.css";

const Wallet = () => {
    const { userId } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [amount, setAmount] = useState("");
    const [notification, setNotification] = useState(null);
    const [balance, setBalance] = useState(0);
    const [showQRModal, setShowQRModal] = useState(false);
    const [transactionInfo, setTransactionInfo] = useState(null);

    // Fetch balance for the logged-in user
    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/user/${userId}`, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                const customer = response.data;
                setBalance(customer.balance || 0);
            } catch (error) {
                console.error("Error fetching balance:", error);
            }
        };
        fetchBalance();
    }, [userId]);

    const showNotification = (message) => {
        setNotification(message);
        setTimeout(() => setNotification(null), 3000);
    };

    const handleAddFunds = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setAmount("");
    };

    const handleConfirmAddFunds = () => {
        const newAmount = parseInt(amount);
        if (!isNaN(newAmount) && newAmount > 0) {
            setTransactionInfo({
                userId,
                amount: newAmount,
                transactionId: `TXN-${Date.now()}`,
                bankInfo: {
                    accountNumber: "0004106868688006",
                    accountHolder: "TRƯỜNG ĐẠI HỌC BÁCH KHOA",
                    bankName: "OCB Bank - Orient Commercial Bank",
                },
            });
            setShowQRModal(true);
            handleCloseModal();
        }
    };

    const handleConfirmTransaction = async () => {
        if (transactionInfo) {
            try {
                const response = await axios.post(
                    "http://localhost:8000/wallet",
                    { id: transactionInfo.userId, money: transactionInfo.amount },
                    { headers: { "Content-Type": "application/json" } }
                );
                if (response.status === 200) {
                    setBalance((prevBalance) => prevBalance + transactionInfo.amount);
                    showNotification(`Successfully added ${transactionInfo.amount} VNĐ to your wallet.`);
                }
            } catch (error) {
                if (error.response) {
                    alert(error.response.data.message);
                } else {
                    console.error("Error completing transaction:", error);
                }
            }
            handleCloseQRModal();
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter") handleConfirmAddFunds();
    };

    const handleCloseQRModal = () => {
        setShowQRModal(false);
        setTransactionInfo(null);
    };

    return (
        <div className="wallet fade-in">
            <h2 style={{ textAlign: 'center' }}>My Wallet</h2>
            <div style={{ textAlign: 'center' }}>Save your credit and debit card details for faster checkout</div>

            <div className="wallet-content">
                <div className="balance-section d-flex justify-content-between align-items-center">
                    <div className="balance-info zoom-in">
                        <h4>Your Balance</h4>
                        <p className="balance-amount">{balance} VNĐ</p>
                    </div>
                    <button className="btn btn-secondary blue-btn slide-in-right" onClick={handleAddFunds}>Add Funds</button>
                </div>
                {notification && <Notification message={notification} onClose={() => setNotification(null)} />}
            </div>

            {showModal && (
                <div className="modal-overlay zoom-in">
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

            {showQRModal && transactionInfo && (
                <div className="modal-overlay zoom-in">
                    <div className="modal-content">
                        <h3>Transaction QR Code</h3>
                        <div className="row">
                            <div className="col-md-6 text-center">
                                <QRCodeCanvas
                                    value={JSON.stringify({
                                        transactionId: transactionInfo.transactionId,
                                        amount: transactionInfo.amount,
                                        bankInfo: transactionInfo.bankInfo,
                                    })}
                                    size={200}
                                    includeMargin={true}
                                />
                            </div>
                            <div className="col-md-6 text-start">
                                <p><strong>Account Number:</strong> {transactionInfo.bankInfo.accountNumber}</p>
                                <p><strong>Account Holder:</strong> {transactionInfo.bankInfo.accountHolder}</p>
                                <p><strong>Bank Name:</strong> {transactionInfo.bankInfo.bankName}</p>
                                <p><strong>Amount:</strong> {transactionInfo.amount.toLocaleString()} VNĐ</p>
                            </div>
                        </div>
                        <p className="mt-3">
                            Scan this QR code and transfer the specified amount to the above account to complete the transaction.
                        </p>
                        <div className="modal-buttons text-center">
                            <button className="btn red-btn me-2" onClick={handleCloseQRModal}>Cancel</button>
                            <button className="btn blue-btn" onClick={handleConfirmTransaction}>OK</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Wallet;