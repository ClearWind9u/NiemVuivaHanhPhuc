import React from "react";
import "../css/PrivacyPolicy.css";

const PrivacyPolicy = () => {
  return (
    /* PrivacyPolicy Content */
    <div className="edited-content align-items-center fade-in">
      <p style={{ fontWeight: 'bold', fontSize: '1.5rem', textAlign: 'center' }}>Privacy Policy</p>
      <ol>
        <li style={{ fontWeight: 'bold', marginBottom: '10px' }}>Purpose and Scope of Data Collection</li>
        <div style={{ marginBottom: '20px' }}>The main data collected on the website includes: customer's full name, email, and phone number in the contact section. This information is required from members when submitting requests for consultation or product purchases. It allows us to contact and confirm details with customers on the website, ensuring consumer rights.</div>

        <li style={{ fontWeight: 'bold', marginBottom: '10px' }}>Scope of Information Usage</li>
        <div>We use the information provided by members to:</div>
        <ul style={{ marginBottom: '20px' }}>
          <li>Confirm orders and deliver goods when requests are received from members;</li>
          <li>Provide information about products to customers upon request;</li>
          <li>Send notifications regarding website activities;</li>
          <li>Communicate and resolve issues with users in special cases;</li>
          <li>We do not use users' personal information for purposes other than confirmation and contact related to transactions.</li>
        </ul>
        <li style={{ fontWeight: 'bold', marginBottom: '10px' }}>Information Collection and Management Unit</li>
        <div>The address of the unit responsible for collecting and managing information, including contact methods for consumers to inquire about activities involving the collection and processing of their personal data.</div>
      </ol>
      <div style={{ margin: '20px 20px' }}>
        <img src="../image/logo2.png" alt="JoHap" style={{ width: '10%', height: 'auto', display: 'block', marginBottom: '10px'}} className="zoom-in"/>
        <div style={{ marginBottom: '10px', marginLeft: '15px' }}>Address: Bach Khoa University - Di An Campus</div>
        <div style={{ marginBottom: '10px', marginLeft: '15px' }}>Hotline: 0113 114 115</div>
        <div style={{ marginLeft: '15px' }}>Email: johaphcmut@gmail.com</div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;