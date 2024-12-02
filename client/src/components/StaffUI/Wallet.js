import React, { useState, useEffect } from "react";
import axios from "axios";
import Notification from "../Notification";
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

    // Fetch danh sách student từ API
    const fetchWallets = async () => {
        try {
            const response = await axios.get("http://localhost:8000/user/students", {
                headers: {
                    "Content-Type": "application/json",
                  },
            });
            setWallets(response.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching wallets:", err);
            setError("Failed to fetch wallet data.");
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchWallets();
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

    const handleAddFundsClick = (wallet) => {
        setSelectedWallet(wallet);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setAmount("");
        setSelectedWallet(null);
    };

    const handleConfirmAddFunds = async () => {
        const newAmount = parseFloat(amount);
        if (selectedWallet && !isNaN(newAmount) && newAmount > 0) {
            try {
                const response = await axios.post(
                    `http://localhost:8000/wallet/add/${selectedWallet._id}`,
                    { id: selectedWallet._id, money: newAmount }, // Sử dụng 'money' để đồng nhất với định dạng API
                    {
                        headers: {
                            "Content-Type": "application/json", // Đảm bảo gửi dữ liệu dưới dạng JSON
                        },
                    }
                );
                if (response.status === 200) {
                    // Cập nhật số dư trên giao diện
                    setWallets((prevWallets) =>
                        prevWallets.map((wallet) =>
                            wallet.id === selectedWallet.id
                                ? { ...wallet, balance: wallet.balance + newAmount }
                                : wallet)
                    );
                    showNotification(`Added ${newAmount} VNĐ to ${selectedWallet.username}'s wallet`);
                } else {
                    alert("Failed to add funds. Please check and try again.");
                }
                handleCloseModal(); // Đóng modal sau khi hoàn thành
            } catch (error) {
                if (error.response) {
                    // Hiển thị lỗi từ server
                    alert(error.response.data.message);
                } else {
                    console.error("Error adding funds:", error);
                    alert("Failed to add funds due to an unexpected error.");
                }
            }
        } else {
            alert("Please enter a valid amount.");
        }
    };
    

    if (loading) return <p>Loading wallets...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="">
            <h2 style={{ textAlign: "center" }}>Student Wallets</h2>
            <div className="main-section">
                <div className="pending-invoices" style={{ flex: "0 0 70%" }}>
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
                                <th>Name</th>
                                <th>Balance (VNĐ)</th>
                                <th style={{ width: "300px" }}>Add Funds</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredWallets.map((wallet) => (
                                <tr key={wallet.id}>
                                    <td>{wallet.username}</td>
                                    <td>{wallet.balance} VNĐ</td>
                                    <td>
                                        <button
                                            className="btn blue-btn"
                                            onClick={() => handleAddFundsClick(wallet)}>
                                            Add Funds
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Notification */}
                {notification && <Notification message={notification} onClose={() => setNotification(null)} />}
            </div>

            {/* Modal for adding funds */}
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
        </div>
    );
};

export default Wallet;
