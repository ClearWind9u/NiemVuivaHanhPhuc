import React from "react";
import "../css/ShippingPolicy.css";

const ShippingPolicy = () => {
  return (
    /* ShippingPolicy Content */
    <div className="edited-content align-items-center">
      <p style={{ fontWeight: 'bold', fontSize: '1.5rem', textAlign: 'center' }}>Shipping Policy</p>
      <ol>
        <li style={{ fontWeight: 'bold', marginBottom: '10px' }}>Shipping and Delivery Conditions:</li>
        <ul style={{ marginBottom: '20px' }}>
          <li>Delivery Method: Direct delivery to customers at the cafeteria on Campus 2 (Di An, Binh Duong) of Hanoi University of Science and Technology.</li>
          <li>Estimated Delivery Time: Monday to Friday, from 8:00 AM to 5:00 PM. JoHap will wait for customers for 10 to 20 minutes during delivery.</li>
        </ul>
        <li style={{ fontWeight: 'bold', marginBottom: '10px' }}>In Case of Delays in Delivery:</li>
        <ul>
          <li>JoHap staff will call to inform the customer;</li>
          <li>Customers can contact JoHap directly to cancel the order in the system if the waiting time is too long.</li>
        </ul>
      </ol>
      <img src="../image/delivery.png" alt="DELIVERY" style={{ width: '70%', height: 'auto', display: 'block', margin: 'auto', marginTop: '30px', marginBottom: '30px' }} />
    </div>
  );
};

export default ShippingPolicy;