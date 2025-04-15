import React, { useState, useEffect } from "react";
import axios from "axios";
import Notification from "../Notification";
import { QRCodeCanvas } from "qrcode.react";
import "../css/Wallet.css";

const Wallet = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [amount, setAmount] = useState("");
    const [selectedWallet, setSelectedWallet] = useState(null);
    const [wallets, setWallets] = useState([]); // Lưu trữ danh sách từ API
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState(null);
    const [error, setError] = useState(null);
    const [transactionInfo, setTransactionInfo] = useState(null);
    const [showQRModal, setShowQRModal] = useState(false);
    const [user, setUser] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const API_URL = "https://joy-and-happiness-be.vercel.app";

    // Fetch danh sách student từ API
    const fetchUser = async () => {
        try {
            const response = await axios.get(`${API_URL}/user/admin/all`, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            setUser(response.data);
            setLoading(false);
        }
        catch (err) {
            console.error("Error fetching user profiles:", err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    // Hiển thị thông báo
    const showNotification = (message) => {
        setNotification(message);
        setTimeout(() => setNotification(null), 3000);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredWallets = wallets.filter((wallet) => {
        return wallet.username.toLowerCase().includes(searchTerm.toLowerCase());
    });

    // Khi nhấn "Add Funds", chỉ hiển thị QR modal
    const handleAddFundsClick = (user) => {
        setSelectedUser(user);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setAmount("");
        setSelectedUser(null);
    };

    // Khi nhấn "Confirm" trong modal nhập số tiền, chỉ hiển thị QR Modal
    const handleConfirmAddFunds = () => {
        const newAmount = parseFloat(amount);
        if (selectedWallet || !isNaN(newAmount) && newAmount > 0) {
            setTransactionInfo({
                amount: newAmount,
                bankInfo: {
                    accountNumber: "0004106868688006",
                    accountHolder: "TRƯỜNG ĐẠI HỌC BÁCH KHOA",
                    bankName: "OCB Bank - Orient Commercial Bank",
                },
            });
            setShowQRModal(true); // Mở modal QR
        } else {
            alert("Please enter a valid amount.");
        }
    };

    // Xử lý khi nhấn "OK" trong Transaction modal
    const handleConfirmTransaction = async () => {
        if (transactionInfo) {
            try {
                const response = await axios.post(
                    `${API_URL}/wallet`,
                    { id: selectedUser._id, money: transactionInfo.amount },
                    { headers: { "Content-Type": "application/json" } }
                );
                fetchUser();
                if (response.status === 200) {
                    showNotification(
                        `Added ${amount.toLocaleString()} VNĐ to ${selectedUser.username}'s wallet`
                    );
                    setShowQRModal(false); // Đóng modal QR sau khi thêm tiền thành công
                    handleCloseModal(); // Đóng modal nhập tiền
                } else {
                    alert("Failed to add funds. Please check and try again.");
                }
            } catch (error) {
                if (error.response) {
                    alert(error.response.data.message);
                } else {
                    console.error("Error adding funds:", error);
                    alert("Failed to add funds due to an unexpected error.");
                }
            }
        }
    };

    const handleCloseQRModal = () => {
        setShowQRModal(false);
        setTransactionInfo(null);
    };

    if (loading) return <p>Loading wallets...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h2 style={{ textAlign: "center" }} className="zoom-in">Student Wallets</h2>
            <div className="main-section fade-in">
                <div className="pending-invoices zoom-in" style={{ flex: "0 0 70%" }}>
                    <input
                        type="text"
                        placeholder="Search by user name"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        style={{ padding: "8px", marginBottom: "10px", width: "100%" }}
                    />
                    <table className="list-invoice-table">
                        <thead>
                            <tr>
                                <th>User Name</th>
                                <th>Balance (VNĐ)</th>
                                <th style={{ width: "300px" }}>Add Funds</th>
                            </tr>
                        </thead>
                        <tbody>
                            {user.filter((us) => us.role !== "admin" && us.role !== "staff").map((us) => (
                                <tr key={us.id}>
                                    <td>{us.username}</td>
                                    {/* <td>{us.role.charAt(0).toUpperCase() + us.role.slice(1)}</td> */}
                                    <td>${us.balance || 0}</td>
                                    <td>
                                        <button className="btn blue-btn" onClick={() => handleAddFundsClick(us)}>Add Funds</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {notification && <Notification message={notification} onClose={() => setNotification(null)} />}
            </div>

            {/* Modal nhập số tiền */}
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
                        />
                        <div className="modal-buttons">
                            <button className="btn red-btn" onClick={handleCloseModal}>
                                Cancel
                            </button>
                            <button className="btn blue-btn" onClick={handleConfirmAddFunds}>
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* QR Modal */}
            {showQRModal && transactionInfo && (
                <div className="modal-overlay zoom-in">
                    <div className="modal-content">
                        <h3>Transaction QR Code</h3>
                        <div className="row">
                            <div className="col-md-6">
                                <QRCodeCanvas
                                    value={JSON.stringify(transactionInfo)}
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
                            <p>Scan this QR code and transfer the specified amount to the above account to complete the transaction.</p>
                        </div>
                        <div className="modal-buttons">
                            <button className="btn red-btn" onClick={handleCloseQRModal}>
                                Cancel
                            </button>
                            <button className="btn blue-btn" onClick={handleConfirmTransaction}>
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Wallet;
