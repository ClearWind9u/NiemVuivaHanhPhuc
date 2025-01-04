import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import Notification from "../Notification";
import axios from "axios";
import "../css/Invoices.css";

const Invoices = () => {
    const { userId } = useAuth();
    const [searchTerm, setSearchTerm] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [userInfo, setUserInfo] = useState(null);
    const [pendingInvoices, setPendingInvoices] = useState([]); // Lưu trữ hóa đơn từ API
    const [notification, setNotification] = useState(null);

    const fetchPendingInvoices = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/staff/pending_invoices`, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (response.status === 200) {
                setPendingInvoices(response.data.orders); // Lưu danh sách hóa đơn vào state
            } else {
                console.error("Failed to fetch pending invoices.");
            }
        } catch (error) {
            console.error("Error fetching pending invoices:", error);
        }
    };
    useEffect(() => {
        fetchPendingInvoices();
    }, []);

    useEffect(() => {
        fetchPendingInvoices();
    }, [pendingInvoices]);

    const getUserInfo = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:8000/user/${userId}`, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            return response.data; // Trả về dữ liệu user
        } catch (error) {
            console.error("Error fetching user data:", error);
            return null; // Xử lý lỗi bằng cách trả về null
        }
    };

    useEffect(() => {
        const fetchUserInfo = async () => {
            const data = await getUserInfo(userId);
            if (data) {
                setUserInfo(data);
            } else {
                console.error("Failed to fetch user info.");
            }
        };
        if (userId) {
            fetchUserInfo();
        }
    }, [userId]);

    // Hiển thị thông báo
    const showNotification = (message) => {
        setNotification(message);
        setTimeout(() => setNotification(null), 3000);
    };

    // Xử lý Accept
    const handleAccept = async (pending) => {
        try {
            const confirmAccept = window.confirm("Are you sure you want to accept this order?");
            if (!confirmAccept) return;
            const response = await axios.put(
                `http://localhost:8000/orders/${pending._id}/assign-staff`,
                { staff_id: userId },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status === 200) {
                showNotification("Order accepted and assigned to you!");
            } else {
                console.error("Failed to accept the order.");
            }
        } catch (error) {
            console.error("Error accepting the order:", error);
            alert("Failed to accept the order. Please try again.");
        }
    };

    // Xử lý Decline
    const handleDecline = async (pending) => {
        try {
            const confirmDecline = window.confirm("Are you sure you want to decline this order?");
            if (!confirmDecline) return;
            // Proceed with deleting the order after refund
            const deleteResponse = await axios.delete(
                `http://localhost:8000/orders/${pending._id}/decline`,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            if (deleteResponse.status === 200) {
                // Refund the student by making a PUT request to update their balance if their payment method = online
                if (pending.payment_method === "online") {
                    const refundResponse = await axios.put(
                        `http://localhost:8000/user/refund/${pending.student_id}`,
                        { amount: pending.final_price }, // Refund the total price
                        {
                            headers: {
                                "Content-Type": "application/json",
                            },
                        }
                    );
                    if (refundResponse.status === 200) {
                        showNotification("Order declined and refunded to the student!");
                    }
                    else {
                        console.error("Failed to refund the student.");
                        alert("Failed to refund the student.");
                    }
                }
                showNotification("Order declined successfully!");
            } else {
                console.error("Failed to delete the order.");
                alert("Failed to decline the order.");
            }
        } catch (error) {
            console.error("Error declining the order:", error);
            alert("Failed to decline the order. Please try again.");
        }
    };

    // Lọc hóa đơn theo điều kiện tìm kiếm và ngày tháng
    const filteredPendings = pendingInvoices.filter((pending) => {
        const purchaseDate = new Date(pending.order_time);
        const matchesSearch = pending.dishes.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStartDate = startDate ? purchaseDate >= new Date(startDate) : true;
        const matchesEndDate = endDate ? purchaseDate <= new Date(endDate) : true;
        return matchesSearch && matchesStartDate && matchesEndDate;
    });

    return (
        <div>
            <h2 style={{ textAlign: "center" }} className="fade-in">Pending Invoices</h2>
            <div className="main-section fade-in">
                <div className="pending-invoices">
                    <input
                        type="text"
                        placeholder="Search by item name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ padding: "8px", marginBottom: "10px", width: "100%" }}
                    />
                    <div className="date-filter">
                        <label htmlFor="start-date">Start Date:</label>
                        <input
                            type="date"
                            id="start-date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                        <label htmlFor="end-date">End Date:</label>
                        <input
                            type="date"
                            id="end-date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                    <table className="list-invoice-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Items</th>
                                <th>Total Amount (VNĐ)</th>
                                <th>Payment Method</th>
                                <th style={{ width: '300px' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPendings.map((pending) => (
                                <tr key={pending._id}>
                                    <td>{new Date(pending.order_time).toLocaleDateString()}</td>
                                    <td>{pending.dishes}</td>
                                    <td>{pending.final_price} VNĐ</td>
                                    <td>{pending.payment_method}</td>
                                    <td>
                                        <button className="btn blue-btn" onClick={() => handleAccept(pending)}>Accept</button>
                                        <button className="btn red-btn" onClick={() => handleDecline(pending)}>Decline</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {/* Notification */}
                    {notification && <Notification message={notification} onClose={() => setNotification(null)} />}
                </div>
            </div>
        </div>
    );
};

export default Invoices;