import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/Ingredients.css";

const Ingredients = () => {

  const navigate = useNavigate(); // Initialize useNavigate
  const handleNavigation = (path) => {
    navigate(path); // Programmatically navigate to the specified path
  };

  return (
    /* Ingredients Content */
    <div className="edited-content row align-items-center">
      <div className="col-md-6 mb-4">
        <img
          src="./image/ingredients.png"
          alt="INGREDIENTS"
          style={{ width: '80%', height: 'auto', display: 'block', margin: '20px' }}
          className="zoom-in"
        />
      </div>
      <div className="col-md-6 mb-4 fade-in">
        <p style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>About our ingredients</p>
        <p><strong>Nutrition</strong></p>
        <p>JoHap always provides meals packed with essential nutrients for the body, such as carbohydrates, protein, vitamins, and various other nutrients.</p>
        <hr />
        <p><strong>Healthy</strong></p>
        <p>JoHap's dishes not only provide energy but also support basic body functions, strengthen the immune system and optimize metabolism.</p>
        <hr />
        <p><strong>Non-toxic</strong></p>
        <p>All ingredients are naturally sourced, ensuring they are non-toxic to the environment and consumers.</p>
        <hr />
        <p><strong>Protect</strong></p>
        <p>All ingredients are carefully inspected and stored in suitable conditions to bring the best experience to customers.</p>
        <button type="button" className="btn blue-btn slide-in-right" style={{ marginTop: '60px', marginLeft: '0' }} onClick={() => handleNavigation("/menu")}> Order Now </button>
      </div>
    </div>
  );
};

export default Ingredients;