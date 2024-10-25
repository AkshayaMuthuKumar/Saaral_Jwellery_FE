import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaShoppingCart } from 'react-icons/fa';
import Sidebar from './sidebar'; // Import the Sidebar component
import API_URL from './config';

const ProductsPage = ({ addToCart, cartCount }) => {
  const { category } = useParams(); // Get the category from the URL
  const [products, setProducts] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null); // State for selected size

  const itemsPerPage = 9;
  const tealColor = '#009688';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let apiUrl = `${API_URL}/category/${category}?page=${currentPage}&limit=${itemsPerPage}&priceRange=${selectedPriceRange}`;

        if (selectedSize) {
          apiUrl += `&size=${selectedSize}`; // Include size filter
        }

        const response = await fetch(apiUrl);
        const data = await response.json();
        setProducts(data.products);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [category, currentPage, selectedPriceRange, selectedSize]);

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const handlePriceFilterChange = (range) => {
    setSelectedPriceRange(range);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleSizeFilterChange = (size) => {
    setSelectedSize(size); // Update selected size
    setCurrentPage(1); // Reset to first page on size filter change
  };

  return (
    <div className="container py-5 m-5">
      <div className="row">
        <div className="col-md-3">
          <Sidebar
            onPriceFilterChange={handlePriceFilterChange}
            category={category} // Pass the category prop
            onSizeFilterChange={handleSizeFilterChange} // Pass size filter function
          />
        </div>
        <div className="col-md-9">
          <h2 className="text-center mb-4" style={{ color: tealColor }}>
            <b>{category.toUpperCase()}</b>
          </h2>
          <div className="row">
            {products.map((product) => (
              <div className="col-md-4 mb-4" key={product.product_id}>
                <div className="card h-200 shadow-sm">
                  <img src={product.image} alt={product.name} className="card-img-top" style={{ height: '300px', objectFit: 'cover' }} />
                  <div className="card-body d-flex justify-content-between align-items-center">
                    <p className="card-text mb-0">${product.price}</p>
                    <div className="d-flex align-items-center">
                      <FaShoppingCart
                        size={24}
                        className="cart-icon"
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleAddToCart(product)}
                      />
                      {cartCount[product.id] > 0 && (
                        <span className="badge bg-info text-white ms-2">{cartCount[product.product_id]}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <nav>
            <ul className="pagination">
              {[...Array(totalPages)].map((_, index) => (
                <li className={`page-item ${index + 1 === currentPage ? 'active' : ''}`} key={index}>
                  <button className="page-link" onClick={() => setCurrentPage(index + 1)}>
                    {index + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
