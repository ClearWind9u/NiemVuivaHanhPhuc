import React, { useEffect, useState } from "react";
import pendingList from "../../db/pendingList";
import purchaseHistory from "../../db/purchaseHistory";
import Notification from "../Notification";
import "../css/Invoices.css";
const Invoices = () => {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
    };

    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
    };
    const [notification, setNotification] = useState(null);
    const showNotification = (message) => {
        setNotification(message);
        setTimeout(() => setNotification(null), 3000);
    };

    const handleAccept = (pending) => {
        purchaseHistory.push(pending);
        const index = pendingList.indexOf(pending);
        if (index > -1) pendingList.splice(index, 1);
        showNotification("Order accepted and moved to purchase history.");
    };

    const handleDecline = (pending) => {
        const index = pendingList.indexOf(pending);
        if (index > -1) pendingList.splice(index, 1);
        showNotification("Order declined and removed from pending list.");
    };

    const filteredPendings = pendingList.filter((pending) => {
        const purchaseDate = new Date(pending.date);
        const matchesSearch = pending.items
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        const matchesStartDate = startDate
            ? purchaseDate >= new Date(startDate)
            : true;
        const matchesEndDate = endDate ? purchaseDate <= new Date(endDate) : true;
        return matchesSearch && matchesStartDate && matchesEndDate;
    });

    return (
        <div>
            <h2 style={{ textAlign: "center" }}>Pending Invoices</h2>
            <div className="main-section">
                <div className="pending-invoices">
                    <input
                        type="text"
                        placeholder="Search by item name"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        style={{ padding: "8px", marginBottom: "10px", width: "100%" }}
                    />
                    <div className="date-filter">
                        <label htmlFor="start-date">Start Date:</label>
                        <input
                            type="date"
                            id="start-date"
                            value={startDate}
                            onChange={handleStartDateChange}
                        />
                        <label htmlFor="end-date">End Date:</label>
                        <input
                            type="date"
                            id="end-date"
                            value={endDate}
                            onChange={handleEndDateChange}
                        />
                    </div>
                    <table className="list-invoice-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Items</th>
                                <th>Total Amount ($)</th>
                                <th>Payment Method</th>
                                <th style={{ width: '300px' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPendings.map((pending) => (
                                <tr key={pending.id}>
                                    <td>{pending.date}</td>
                                    <td>{pending.items}</td>
                                    <td>${pending.totalAmount.toFixed(2)}</td>
                                    <td>{pending.paymentMethod}</td>
                                    <td>
                                        <button className="btn blue-btn" onClick={() => handleAccept(pending)}>Accept</button>
                                        <button className="btn red-btn" onClick={() => handleDecline(pending)}> Decline</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {/* Notification */}
                    {notification && <Notification message={notification} onClose={() => setNotification(null)}/>}
                </div>
            </div>
        </div>
    );
};

export default Invoices;