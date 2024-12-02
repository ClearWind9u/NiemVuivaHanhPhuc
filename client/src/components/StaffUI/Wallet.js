import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/Wallet.css";

const Wallet = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [amount, setAmount] = useState("");
    const [selectedWallet, setSelectedWallet] = useState(null);
    const [wallets, setWallets] = useState([]); // Lưu trữ danh sách từ API
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch danh sách student từ API
    const fetchWallets = async () => {
        try {
            const response = await axios.get("http://localhost:8000/user/students"); // Thay URL phù hợp
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
        if (selectedWallet && amount) {
            try {
                // Gửi request để thêm số dư
                const response = await axios.put(
                    `http://localhost:8000/api/students/${selectedWallet.id}/add-funds`,
                    { amount: parseFloat(amount) }
                );

                if (response.status === 200) {
                    // Cập nhật số dư trên giao diện
                    setWallets((prevWallets) =>
                        prevWallets.map((wallet) =>
                            wallet.id === selectedWallet.id
                                ? { ...wallet, balance: wallet.balance + parseFloat(amount) }
                                : wallet
                        )
                    );
                    alert(`Added ${amount} VNĐ to ${selectedWallet.username}'s wallet.`);
                }
                handleCloseModal(); // Đóng modal sau khi thêm số dư
            } catch (err) {
                console.error("Error adding funds:", err);
                alert("Failed to add funds. Please try again.");
            }
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
