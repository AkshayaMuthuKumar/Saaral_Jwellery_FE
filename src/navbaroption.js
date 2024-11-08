import React, { useState, useEffect } from 'react';
import { Navbar, Nav, NavDropdown, Collapse, Row, Col } from 'react-bootstrap';
import { FaDollarSign, FaTags, FaGift } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './style.css';
import API_URL from './config';

const NavbarWithSidebarOptions = ({ categories, selectedSubcategory, onPriceFilterChange }) => {

  const [maincategories, setMainCategories] = useState([]);
  const [occasions, setOccasions] = useState([]);
  const [categoryCounts, setCategoryCounts] = useState([]);
  const [occasionCount, setOccasionCount] = useState([]);
  const tealColor = '#009688';

  const navigate = useNavigate();

  const handleSubcategoryClick = (category, subcategory) => {
    navigate(`/jewelry/${category.toLowerCase()}/${subcategory.toLowerCase()}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryResponse = await fetch(`${API_URL}/products/categories`);
        const categoryData = await categoryResponse.json();
        setMainCategories(categoryData.categories.map(category => category.category_name));

        const occasionResponse = await fetch(`${API_URL}/products/getOccasions`);
        const occasionData = await occasionResponse.json();
        setOccasions(occasionData.occasions.map(occasion => occasion.name));
        setOccasionCount(occasionData.occasions.map(occasion => parseInt(occasion.productCount, 10)));

        
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [selectedSubcategory]);

  const priceRanges = [
    { label: 'All Prices', value: 'all' },
    { label: '$0 - $1000', value: '0-1000' },
    { label: '$1001 - $9000', value: '1001-9000' },
    { label: '$9001 - $20000', value: '9001-20000' },
    { label: '$20001 - $80000', value: '20001-80000' }
  ];

  const handlePriceFilterChange = (range) => {
    if (typeof onPriceFilterChange === 'function') {
      onPriceFilterChange(range);
    } else {
      console.error('onPriceFilterChange is not a function');
    }
  };

  return (
    <Navbar variant="dark" expand="lg" fixed="top" >
        <div className="container mt-1" style={{ marginBottom: "0px" }}>

    <Navbar.Toggle aria-controls="basic-navbar-nav"/>
    <Navbar.Collapse id="basic-navbar-nav" className="nav-align-mobile">
    <Nav className="me-auto mt-2" style={{ marginLeft: '100px' }}>
  

          <NavDropdown 
          
          title={
            <div className="nav-icon-label single-line" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <i className="fas fa-bars" style={{ color: tealColor }}></i>
            <span className="label">Categories</span>
          </div>
        } 
          id="categories-dropdown">
            {maincategories.length > 0 ? (
              maincategories.map((category, index) => (
                <NavDropdown.Item key={category} onClick={() => navigate(`/jewelry/${category}`)}>
                  {category}
                </NavDropdown.Item>
              ))
            ) : (
              <NavDropdown.Item>No categories available</NavDropdown.Item>
            )}
          </NavDropdown>

          <NavDropdown
            title={
              <div className="nav-icon-label single-line" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <i className="fas fa-cubes" style={{ color: tealColor }}></i>
              <span className="label">Our collections</span>
            </div>
          } 
            id="our-collection-dropdown"
            className="me-3"
            
          >
            <div className="container" style={{ width: '500px', minWidth: '500px' }}>
              <Row className="justify-content-start">
                {categories.map(category => (
                  <Col
                    key={category.category_name}
                    style={{ padding: '10px', display: 'flex', flexDirection: 'column' }}
                  >
                    <div style={{ fontWeight: 'bold', textAlign: 'center' }}>
                      {category.category_name}
                    </div>
                    <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
                      {category.subcategories.map(subcategory => (
                        <li
                          key={subcategory}
                          onClick={() => handleSubcategoryClick(category.category_name, subcategory)}
                          style={{ textAlign: 'center', cursor: 'pointer', padding: '5px 0' }}
                        >
                          {subcategory}
                        </li>
                      ))}
                    </ul>
                  </Col>
                ))}
              </Row>
            </div>
          </NavDropdown>


        
        </Nav>
      </Navbar.Collapse>
      </div>
    </Navbar>
  );
};

export default NavbarWithSidebarOptions;
