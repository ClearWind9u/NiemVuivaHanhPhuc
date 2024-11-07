import React, { useState } from "react";
import walletList from "../../db/walletList";
import "../css/Wallet.css";
const Wallet = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [amount, setAmount] = useState("");
    const [selectedWallet, setSelectedWallet] = useState(null);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredWallets = walletList.filter((wallet) => {
        return wallet.username
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
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

    const handleConfirmAddFunds = () => {
        if (selectedWallet && amount) {
            // Here, you would typically update the wallet balance in your state management system
            selectedWallet.balance += parseFloat(amount);
            // Optionally, display a success message
            alert(`Added $${amount} to ${selectedWallet.username}'s wallet.`);
            handleCloseModal(); // Close the modal after confirming
        }
    };

    return (
        <div className="">
            <h2 style={{ textAlign: "center" }}>Student wallets</h2>
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
                                <th>Balance ($)</th>
                                <th style={{ width: '300px' }}>Add Funds</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredWallets.map((wallet) => (
                                <tr key={wallet.id}>
                                    <td>{wallet.username}</td>
                                    <td>${wallet.balance.toFixed(2)}</td>
                                    <td>
                                        <button className="btn blue-btn" onClick={() => handleAddFundsClick(wallet)}>Add Funds</button>
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
                        <h3>Enter Amount to Add ($)</h3>
                        <input
                            type="number"
                            className="form-control amount-input"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter amount"
                            min="1"
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
