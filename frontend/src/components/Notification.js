import React, { useEffect } from "react";

const Notification = ({ message, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => onClose(), 3000); // Auto close in 3 seconds
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            padding: "10px 20px",
            backgroundColor: "white",
            color: "black",
            borderRadius: "4px",
            boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
        }}>
            {message}
        </div>
    );
};

export default Notification;