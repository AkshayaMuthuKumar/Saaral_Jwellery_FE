import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from './sidebar';
import API_URL from './config';

const CategoryPage = ({ addToCart, cartCount }) => {
  const { category, subcategory } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedOccasion, setSelectedOccasion] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 9;
  const tealColor = '#009688';
  const selectedFilterColor = '#FFC107'; // Color for selected filters

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let apiUrl = `${API_URL}/products/category/${category}?page=${currentPage}&limit=${itemsPerPage}&priceRange=${selectedPriceRange}`;
        console.log("subcategory", subcategory)
        if (subcategory) {
          apiUrl = `${API_URL}/products/category/${category}/subcategory/${subcategory}?page=${currentPage}&limit=${itemsPerPage}&priceRange=${selectedPriceRange}`;
        }

        if (selectedSize) {
          apiUrl += `&size=${selectedSize}`;
        }
        if (selectedOccasion) {
          apiUrl += `&occasion=${selectedOccasion}`;
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
  }, [category, subcategory, currentPage, selectedPriceRange, selectedSize, selectedOccasion]);

  const handlePriceFilterChange = (range) => {
    setSelectedPriceRange(range);
    setCurrentPage(1);
  };

  const handleSizeFilterChange = (size) => {
    setSelectedSize(size);
    setCurrentPage(1);
  };

  const handleOccasionFilterChange = (occasion) => {
    setSelectedOccasion(occasion);
    setCurrentPage(1);
  };

  return (
    <div className="container py-5 m-5">
      <div className="row">
        <div className="col-md-3">
          <Sidebar
            onPriceFilterChange={handlePriceFilterChange}
            onSizeFilterChange={handleSizeFilterChange}
            onOccasionFilterChange={handleOccasionFilterChange}
          />
        </div>
        <div className="col-md-9">
          <h2 className="text-center mb-4" style={{ color: tealColor }}>
            <b>{category.toUpperCase()} {subcategory ? ` - ${subcategory.toUpperCase()}` : ''}</b>
          </h2>

          {/* Display selected filters */}
          <div className="mb-3">
            <span style={{ color: selectedFilterColor }}>Selected Filters: </span>
            {selectedSize && <span style={{ color: selectedFilterColor }}>{`Size: ${selectedSize} `}</span>}
            {selectedOccasion && <span style={{ color: selectedFilterColor }}>{`Occasion: ${selectedOccasion} `}</span>}
            {selectedPriceRange !== 'all' && <span style={{ color: selectedFilterColor }}>{`Price: ${selectedPriceRange}`}</span>}
          </div>

          <div className="row">
            {products.length > 0 ? (
              products.map((product) => (
                <div className="col-md-4 mb-4" key={product.product_id}>
                  <div
                    className="card h-200 shadow-sm"
                    onClick={() => navigate(`/product/${product.product_id}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="card-img-top"
                      style={{ height: '300px', objectFit: 'cover' }}
                    />
                    <div className="card-body d-flex justify-content-between align-items-center">
                      <p className="card-text mb-0">{product.name}</p>
                      <p className="card-text mb-0">Rs.{product.price}</p>
                      <p className={`text-${product.stock > 0 ? 'success' : 'danger'}`}>{product.stock > 0 ? 'In Stock' : 'Out of Stock'}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12 text-center">
                <h4>No products available</h4>
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <nav className="mt-4">
              <ul className="pagination">
                {[...Array(totalPages)].map((_, index) => (
                  <li
                    className={`page-item ${index + 1 === currentPage ? 'active' : ''}`}
                    key={index}
                  >
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
