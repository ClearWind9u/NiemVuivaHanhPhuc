import React, { useState } from "react";
import { foodList as initialfoodList } from "../../db/foodList";
import "../css/Menu.css";

const Menu = () => {
  const [searchText, setSearchText] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [foodList, setFoodList] = useState(initialfoodList);

  const handleSearch = (e) => {
    setSearchText(e.target.value.toLowerCase());
  };

  const filteredFoodList = foodList.filter((food) =>
    food.name.toLowerCase().includes(searchText)
  );

  const handleShowReviews = (food) => {
    setSelectedFood(food);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedFood(null);
  };

  const handleSendReview = () => {
    if (!selectedFood.buyed) {
      alert("You must purchase this product before leaving a review.");
      setRating(0);
      setHoveredRating(0);
      setReviewText("");
      return;
    }
    // DD-MM-YYYY, HH:MM:SS
    const timestamp = new Date().toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    const newReview = {
      username: "Current User",
      avatar: "../image/avatar.jpg",
      rating,
      review: reviewText,
      timestamp,
    };

    // Add to reviews of selectedFood
    setSelectedFood(prevFood => ({
      ...prevFood,
      reviews: [...(prevFood.reviews || []), newReview],
    }));

    // Reset
    setRating(0);
    setHoveredRating(0);
    setReviewText("");
  };

  const handleStatusChange = (foodId) => {
    setFoodList(prevList =>
      prevList.map(food =>
        food.id === foodId ? { ...food, inStock: !food.inStock } : food
      )
    );
  };

  return (
    <div className="">
      <h2 style={{ textAlign: 'center' }}>Today Menu</h2>

      {/* Search, Filter, and Sort */}
      <div className="search-filter-sort">
        {/* Filter */}
        <div className="dropdown">
          <button type="button" className="icon-btn">
            <i className="fas fa-filter"></i>
          </button>
          <div className="dropdown-content">
            <button>Filter by Price</button>
            <button>Filter by Category</button>
            <button>Filter by Buyed</button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="search-bar">
          <input
            type="text"
            className="form-control"
            placeholder="Search for food..."
            onChange={handleSearch}
            value={searchText}
          />
          <button type="button" className="btn search-btn">
            <i className="fas fa-search"></i>
          </button>
        </div>

        {/* Sort */}
        <div className="dropdown">
          <button type="button" className="icon-btn">
            <i className="fas fa-sort"></i>
          </button>
          <div className="dropdown-content">
            <button>Sort by Popularity</button>
            <button>Sort by Price (Low to High)</button>
            <button>Sort by Price (High to Low)</button>
          </div>
        </div>
      </div>

      {/* Food Cards */}
      <div className="container mt-4">
        <div className="row">
          {filteredFoodList.map((food) => (
            <div key={food.id} className="col-12 col-sm-6 col-md-4">
              <div className="card">
                <img
                  src={food.image}
                  className={`card-img-top food-img ${!food.inStock ? "grayscale" : ""}`}
                  alt={food.name}
                />
                <div className="card-body">
                  <h5 className="card-title">{food.name}</h5>
                  <p className="card-text">{food.description}</p>
                  <button
                    className={`btn ${food.inStock ? "blue-btn" : "red-btn"}`}
                    onClick={() => handleStatusChange(food.id)}
                  >
                    {food.inStock ? "In Stock" : "Out of Stock"}
                  </button>
                  <button className="btn blue-btn" onClick={() => handleShowReviews(food)}>
                    Reviews
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Reviews */}
      {showModal && (
        <div className="modal-review-overlay">
          <div className="modal-review-content">
            <div className="modal-review-header">
              <h3>Reviews for {selectedFood?.name}</h3>
              <button className="red-btn" onClick={handleCloseModal} style={{ position: 'absolute', top: '10px', right: '10px', padding: '0px 10px', fontSize: '20px' }}>&times;</button>
            </div>
            <div className="review-list">
              {selectedFood?.reviews && selectedFood.reviews.length > 0 ? (
                selectedFood.reviews.map((review, index) => (
                  <div key={index} className="review-item row">
                    <div className="user-avatar col-2">
                      <img src={review.avatar || "../image/avatar.jpg"} alt="User Avatar" />
                      <p className="user-name">{review.username}</p>
                      <p className="review-timestamp">{review.timestamp}</p>
                    </div>
                    <div className="col-10 rating-section" style={{ textAlign: 'left' }}>
                      <span className="me-2">Rating:</span>
                      {[...Array(5)].map((_, idx) => (
                        <i
                          key={idx}
                          className={`fas fa-star ${idx < review.rating ? "selected" : ""}`}
                          style={{ margin: '0 5px' }}
                        ></i>
                      ))}
                      <div className="review-content">
                        <p>{review.review}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>No reviews yet. Be the first to review!</p>
              )}
            </div>
            {/* New review */}
            <div className="add-review row">
              <div className="rating-section col-12 d-flex align-items-center">
                <span className="me-2">Rating:</span>
                {[...Array(5)].map((_, index) => (
                  <i
                    key={index}
                    className={`fas fa-star ${index < (hoveredRating || rating) ? "selected" : ""}`}
                    onMouseEnter={() => setHoveredRating(index + 1)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => setRating(index + 1)}
                    style={{ margin: '0 5px' }}
                  ></i>
                ))}
              </div>
              <div className="col-12 d-flex align-items-center">
                <input
                  type="text"
                  className="form-control me-1"
                  placeholder="Write a review..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                />
                <button
                  className="btn blue-btn"
                  disabled={rating === 0 || !reviewText.trim()}
                  onClick={handleSendReview}>
                  Send</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pagination (Optional) */}
      <nav aria-label="Page navigation">
        <ul className="pagination justify-content-center">
          <li className="page-item">
            <button className="page-link">&laquo; Prev</button>
          </li>
          <li className="page-item">
            <button className="page-link">1</button>
          </li>
          <li className="page-item">
            <button className="page-link">2</button>
          </li>
          <li className="page-item">
            <button className="page-link">3</button>
          </li>
          <li className="page-item">
            <button className="page-link">Next &raquo;</button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Menu;