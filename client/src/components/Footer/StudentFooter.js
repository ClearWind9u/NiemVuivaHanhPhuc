import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import './Footer.css';

const StudentFooter = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const handleNavigation = (path) => {
    navigate(path); // Programmatically navigate to the specified path
  };

  return (
    <footer className="bg-dark text-white text-center text-lg-start fade-in">
      <div className="container p-4">
        <div className="row">
          <div className="col-lg-3 col-md-6 mb-4 mb-md-0">
            <img src="./image/logo1-dark.png" alt="Logo" style={{ width: '300px', height: '180px' }} />
          </div>

          <div className="col-lg-3 col-md-6 mb-4 mb-md-0 footer-line">
            <h5 className="text-uppercase">JoHap</h5>
            <ul className="list-unstyled">
              <li>Bach Khoa University - Di An Campus</li>
              <li>0113 114 115</li>
              <li>johapsystem@gmail.com</li>
              <li style={{ marginTop: '10px' }}>
                <Link to="https://www.facebook.com/truongdhbachkhoa" className="social-icon text-white me-3">
                  <i id="facebook" className="fab fa-facebook"></i>
                </Link>
                <Tooltip anchorSelect="#facebook" place="bottom">Follow on Facebook</Tooltip>

                <Link to="https://www.instagram.com/truongdaihocbachkhoa.1957/" className="social-icon text-white me-3">
                  <i id="instagram" className="fab fa-instagram"></i>
                </Link>
                <Tooltip anchorSelect="#instagram" place="bottom">Follow on Instagram</Tooltip>

                <Link
                  to="https://mail.google.com/mail/?view=cm&fs=1&to=johapsystem@gmail.com&su=Subject%20Here&body=Body%20content%20here"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon text-white me-3"
                >
                  <i id="envelope" className="fas fa-envelope"></i>
                </Link>
                <Tooltip anchorSelect="#envelope" place="bottom">Email us</Tooltip>
              </li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6 mb-4 mb-md-0 footer-line">
            <h5 className="text-uppercase">About Us</h5>
            <ul className="list-unstyled">
              <li>
                <Link to="/member-list" className="custom-link" onClick={() => handleNavigation("/member-list")}>
                  Member List
                </Link>
              </li>
              <li>
                <Link to="/brand-story" className="custom-link" onClick={() => handleNavigation("/brand-story")}>
                  Brand Story
                </Link>
              </li>
              <li>
                <Link to="/ingredients" className="custom-link" onClick={() => handleNavigation("/ingredients")}>
                  Learn About Ingredients
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6 mb-4 mb-md-0 footer-line">
            <h5 className="text-uppercase">Policy</h5>
            <ul className="list-unstyled">
              <li>
                <Link to="/payment-methods" className="custom-link" onClick={() => handleNavigation("/payment-methods")}>
                  Payment Methods
                </Link>
              </li>
              <li>
                <Link to="/shipping-policy" className="custom-link" onClick={() => handleNavigation("/shipping-policy")}>
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="custom-link" onClick={() => handleNavigation("/privacy-policy")}>
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-between" style={{ opacity: '0.5' }}>
        <p className="mb-0">JoHap - Niềm vui và hạnh phúc, phục vụ bữa ăn mọi lúc</p>
        <p className="mb-0">Copyright © 2024 JoHap</p>
      </div>
    </footer>
  );
};

export default StudentFooter;
