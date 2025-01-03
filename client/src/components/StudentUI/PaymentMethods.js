import React from "react";
import "../css/PaymentMethods.css";

const PaymentMethods = () => {
  return (
    /* PaymentMethods Content */
    <div className="edited-content align-items-center">
      <p style={{ fontWeight: 'bold', fontSize: '1.5rem', textAlign: 'center' }} className="zoom-in">Payment Methods</p>
      <div className="edited-content fade-in">
        <p>JoHap supports flexible and secure payment methods for all customers shopping on the Website in the following forms:</p>
        <div className="row align-items-center">
          <div className="col-md-7">
            <ol>
              <li>Cash on delivery</li>
              <li>Payment by bank transfer (QR code scanning)</li>
            </ol>
            <p>Online payment: Customers pay for purchases through the following account:</p>
            <ul>
              <li>Account Number: 0004106868688006</li>
              <li>Account Holder: TRƯỜNG ĐẠI HỌC BÁCH KHOA</li>
              <li>OCB Bank - Orient Commercial Bank</li>
            </ul>
          </div>
          <div className="col-md-5 zoom-in">
            <img src="../image/logo-OCB.png" alt="OCB BANK" style={{ width: '60%', height: 'auto', display: 'block' }} />
          </div>
        </div>
        <p>You are responsible for ensuring that the bank card used to make online payments to us is still valid at the time you place your order.</p>
        <p>We reserve the right to confirm your payment information before providing the Product. We will stop processing your Order if the information you provide is incorrect.</p>
      </div>
    </div>
  );
};

export default PaymentMethods;