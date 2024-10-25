// Sidebar component
import React, { useState, useEffect } from 'react';
import { Collapse } from 'react-bootstrap';
import { FaDollarSign, FaTags, FaGift } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './style.css';
import API_URL from './config';

const Sidebar = ({ onPriceFilterChange, onSizeFilterChange, onOccasionFilterChange, selectedSubcategory }) => { // Add selectedSubcategory prop
  const [activeFilter, setActiveFilter] = useState('all');
  const [open, setOpen] = useState({ price: true, categories: true, occasions: true, sizes: true });
  const [categories, setCategories] = useState([]);
  const [occasions, setOccasions] = useState([]);
  const [occasionCount, setOccasionCount] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedOccasion, setSelectedOccasion] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({ sizes: [] });
  const [categoryCounts, setCategoryCounts] = useState([]); // State to store category counts

  const navigate = useNavigate();

  // Function for handling size selection
  const handleSizeClick = (size) => {
    const updatedFilters = selectedFilters.sizes[0] === size.size ? [] : [size.size]; // Allow only one size to be selected

    setSelectedFilters({ ...selectedFilters, sizes: updatedFilters });
    onSizeFilterChange(updatedFilters); // Pass the selected size or an empty array
  };

  // Fetch categories and occasions when the component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_URL}/products/categories`);
        const data = await response.json();

        // Fetch category counts
        const counts = await Promise.all(data.categories.map(async (category) => {
          const countResponse = await fetch(`${API_URL}/products/count/${category.category_name}`);
          const countData = await countResponse.json();

          return { name: category.category_name, count: countData.count };
        }));

        setCategories(data.categories.map(category => category.category_name));
        setCategoryCounts(counts); // Set the category counts
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    const fetchOccasions = async () => {
      try {
        const response = await fetch(`${API_URL}/products/getOccasions`);
        const data = await response.json();
        const occasionNames = data.occasions.map((occasion) => occasion.name);
        const occasionCount = data.occasions.map((occasion) => parseInt(occasion.productCount, 10));
        setOccasions(occasionNames);
        setOccasionCount(occasionCount);
      } catch (error) {
        console.error('Error fetching occasions:', error);
      }
    };

    fetchCategories();
    fetchOccasions();
  }, []);

  const handlePriceFilterChange = (range) => {
    setActiveFilter(range);
    onPriceFilterChange(range);
  };

  // Fetch sizes based on selected category and subcategory
  const fetchSizesForCategory = async (category, subcategory) => {
    try {
      const response = await fetch(`${API_URL}/products/sizes/${category}/${subcategory || ''}`); // Pass both category and subcategory
      const data = await response.json();
      setSizes(data.sizes || []);
    } catch (error) {
      console.error('Error fetching sizes:', error);
      setSizes([]);
    }
  };

  // Handle category selection
  const handleCategoryClick = async (categoryName) => {
    setActiveFilter(categoryName);
    setSelectedCategory(categoryName);
    fetchSizesForCategory(categoryName, selectedSubcategory); // Pass the selected subcategory
    // Reset selected occasion and size
    setSelectedOccasion(null);
    setSelectedFilters({ sizes: [] });
    onSizeFilterChange([]); // Clear size filter
    onOccasionFilterChange(null); // Clear occasion filter
    navigate(`/jewelry/${categoryName}`); // Navigate to the category page
  };

  // Handle occasion selection
  const handleOccasionClick = (occasion) => {
    setSelectedOccasion(occasion);
    onOccasionFilterChange(occasion); // Pass the selected occasion
    setActiveFilter(occasion);
  };

  // Toggle collapse sections
  const toggleCollapse = (section) => {
    setOpen({ ...open, [section]: !open[section] });
  };

  return (
    <div className="p-3 border rounded" style={{ backgroundColor: '#f8f9fa', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      {/* Price Filter */}
      <h5 className="mt-4 text-uppercase" onClick={() => toggleCollapse('price')} style={{ cursor: 'pointer' }}>
        <FaDollarSign /> Price
      </h5>
      <Collapse in={open.price}>
        <div style={{ paddingLeft: '15px' }}>
          {['all', '0-1000', '1001-9000', '9001-20000', '20001-80000'].map((range) => (
            <div
              key={range}
              onClick={() => handlePriceFilterChange(range)}
              style={{
                cursor: 'pointer',
                padding: '5px 0',
                color: activeFilter === range ? '#007bff' : '#000',
              }}
            >
              {range === 'all' ? 'All Prices' : `$${range.replace('-', ' - $')}`}
            </div>
          ))}
        </div>
      </Collapse>

      {/* Categories Filter */}
      <h5 className="mt-4 text-uppercase" onClick={() => toggleCollapse('categories')} style={{ cursor: 'pointer' }}>
        <FaTags /> Categories
      </h5>
      <Collapse in={open.categories}>
        <div style={{ paddingLeft: '15px' }}>
          {categories.length > 0 ? (
            categories.map((category, index) => {
              const categoryCount = categoryCounts.find(count => count.name === category)?.count || 0;

              return (
                <div
                  key={index}
                  style={{ cursor: 'pointer', padding: '5px 0', color: activeFilter === category ? '#007bff' : '#000' }}
                  onClick={() => handleCategoryClick(category)}
                >
                  {category} ({categoryCount}) {/* Display count here */}
                </div>
              );
            })
          ) : (
            <div>No categories available</div>
          )}
        </div>
      </Collapse>

      {/* Occasions Filter */}
      <h5 className="mt-4 text-uppercase" onClick={() => toggleCollapse('occasions')} style={{ cursor: 'pointer' }}>
        <FaGift /> Occasions
      </h5>
      <Collapse in={open.occasions}>
        <div style={{ paddingLeft: '15px' }}>
          {occasions.length > 0 ? (
            occasions.map((occasion, index) => (
              <div
                key={index}
                style={{ cursor: 'pointer', padding: '5px 0', color: activeFilter === occasion ? '#007bff' : '#000' }}
                onClick={() => handleOccasionClick(occasion)}
              >
                {occasion} ({occasionCount[index]})
              </div>
            ))
          ) : (
            <div>No occasions available</div>
          )}
        </div>
      </Collapse>

      {/* Sizes Filter */}
      <h5 className="mt-4 text-uppercase" onClick={() => toggleCollapse('sizes')} style={{ cursor: 'pointer' }}>
        Sizes
      </h5>
      <Collapse in={open.sizes}>
        <div style={{ paddingLeft: '15px' }}>
          {sizes.length > 0 ? (
            sizes.map((size, index) => (
              <div key={index} style={{ cursor: 'pointer', padding: '5px 0' }}>
                <input
                  type="checkbox"
                  onChange={() => handleSizeClick(size)}
                  checked={selectedFilters.sizes[0] === size.size} // Check if this size is the selected one
                  style={{ marginRight: '10px' }}
                />
                {size.size} ({size.count})
              </div>
            ))
          ) : (
            <div>No sizes available</div>
          )}
        </div>
      </Collapse>
    </div>
  );
};

export default Sidebar;
