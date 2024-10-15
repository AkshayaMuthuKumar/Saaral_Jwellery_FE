import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaShoppingCart, FaStar } from 'react-icons/fa';
import axios from 'axios';
import API_URL from './config';

const ProductDetailPage = ({ addToCart, cartCount }) => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [reviewName, setReviewName] = useState('');
  const [reviewEmail, setReviewEmail] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [experience, setExperience] = useState('');
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${API_URL}/products/product/${productId}`);
        const data = await response.json();
        console.log("data", data)

        if (data && typeof data.price === 'string') {
          data.price = parseFloat(data.price);
        }

        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
  }, [productId]);

  if (!product) {
    return <div>Loading...</div>;
  }
  console.log("product", product)
  const handleAddToCart = () => {
    if (product.size && product.size.length > 0 && !selectedSize) {
      alert('Please select a size before adding to the cart.');
      return;
    }



    const item = {
      id: product.product_id,
      product_name: product.name,
      price: product.price.toFixed(2),
      quantity: product.quantity,
      image: product.image
    };

    addToCart(item, selectedSize, quantity);
  };


  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    const newReview = {
      productId,
      name: reviewName,
      email: reviewEmail,
      purchaseDate,
      experience,
      rating,
      review: reviewText,
    };

    try {
      const response = await axios.post(`${API_URL}/products/addReview`, newReview);
      if (response.status === 201) {
        setReviewName('');
        setReviewEmail('');
        setPurchaseDate('');
        setExperience('');
        setRating(0);
        setReviewText('');
        alert('Review submitted successfully!');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const handleRating = (rate) => {
    setRating(rate);
  };

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-md-6 mt-5">
          <img
            src={product.image}
            alt={product.name}
            className="img-fluid"
            style={{ height: '400px', objectFit: 'cover' }}
          />
        </div>
        <div className="col-md-6 mt-5">
          <h2 className="text-primary">{product.name}</h2>
          <h4 className="text-danger">Rs.{product.price.toFixed(2)}</h4>
          <div className="stars">{'⭐'.repeat(5)}</div>
          <p className="mt-3">No product description available.</p>
          <h6>Available: <span className={`text-${product.stock > 0 ? 'success' : 'danger'}`}>{product.stock > 0 ? 'In Stock' : 'Out of Stock'}</span></h6>

          <div className="mt-3">
            <h6>Size:</h6>
            {product.size && product.size.length > 0 ? (
              <div>
                {product.sizes && product.sizes.map((size) => (
                  <button
                    key={size}
                    className={`btn btn-outline-secondary ${selectedSize === size ? 'active' : ''}`}
                    onClick={() => setSelectedSize(size)}
                    disabled={product.stock <= 0}
                  >
                    {size}
                  </button>
                ))}
              </div>
            ) : (
              <p>No size available for this product.</p>
            )}
          </div>

          <div className="quantity d-flex align-items-center my-4">
            <button className="btn btn-outline-secondary" onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={product.stock <= 0}>-</button>
            <input type="text" value={quantity} className="form-control w-25 text-center mx-2" readOnly />
            <button className="btn btn-outline-secondary" onClick={() => setQuantity(quantity + 1)} disabled={product.stock <= 0}>+</button>
          </div>

          <div className="mt-3">
            <button className="btn btn-success" onClick={handleAddToCart} disabled={product.stock <= 0}>
              <FaShoppingCart /> Add to Cart
            </button>
          </div>
        </div>
      </div>

      <div className="col-md-12 mt-5">
        <div className="box border p-4">
          <div className="row">
            <div className="col-md-6">
              <div className="mt-5">
                <h4>Add Review</h4>
                <form onSubmit={handleReviewSubmit}>
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Your Name"
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Your Email"
                      value={reviewEmail}
                      onChange={(e) => setReviewEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="date"
                      className="form-control"
                      placeholder="Date of Purchase"
                      value={purchaseDate}
                      onChange={(e) => setPurchaseDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label>Overall Experience:</label>
                    <select
                      className="form-select"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      required
                    >
                      <option value="">Select...</option>
                      <option value="Excellent">Excellent</option>
                      <option value="Good">Good</option>
                      <option value="Average">Average</option>
                      <option value="Poor">Poor</option>
                    </select>
                  </div>

                  {/* Star Rating */}
                  <div className="mb-3">
                    <label>Rating:</label>
                    <div className="star-rating">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          size={24}
                          style={{ cursor: 'pointer', marginRight: 5 }}
                          color={star <= rating ? '#ffc107' : '#e4e5e9'}
                          onClick={() => handleRating(star)}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="mb-3">
                    <textarea
                      className="form-control"
                      placeholder="Write your review here..."
                      rows="4"
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      required
                    ></textarea>
                  </div>

                  <button type="submit" className="btn btn-primary">
                    Submit Review
                  </button>
                </form>
              </div>
            </div>

            {/* Display Reviews Section */}
            <div className="col-md-6">
              <h4>Reviews</h4>
              {reviews.length > 0 ? (
                <div className="review-container">
                  {reviews.map((review, index) => (
                    <div key={index} className="review-box">
                      <strong>{review.name}</strong>
                      <p>{review.experience}</p>
                      <p>{review.review}</p>
                      <small>Rating: {review.rating}/5</small>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No reviews available yet.</p>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
