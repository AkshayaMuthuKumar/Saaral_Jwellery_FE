import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Badge, NavDropdown, Row, Col, Button, Modal, Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../src/style.css';
import axios from 'axios';
import API_URL from './config';

export default function CustomNavbar({ selectedSubcategory, userId, setCartItems, setCartCount, cartItems = [], cartCount }) {
  const tealColor = '#009688';
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ name: '', email: '', password: '' });
  const [userName, setUserName] = useState('');
  const [isAdmin, setIsAdmin] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [maincategories, setMainCategories] = useState([]);
  const [occasions, setOccasions] = useState([]);
  const [categoryCounts, setCategoryCounts] = useState([]);
  const [occasionCount, setOccasionCount] = useState([]);
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/jewelry/${searchQuery.toLowerCase()}`);

      setSearchQuery(''); // Clear search after navigating
    }
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
  const navbarStyle = {
    backgroundColor: 'white',
    padding: '0.5rem 1rem',
  };

  useEffect(() => {
    // Fetch categories and other initial data
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_URL}/products/categories`);
        setCategories(response.data.categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();

    // Retrieve user and isAdmin from local storage
    const storedUserName = localStorage.getItem('userName');
    const storedIsAdmin = Number(localStorage.getItem('isAdmin')); // Convert to number

    if (storedUserName) setUserName(storedUserName);
    if (storedIsAdmin) setIsAdmin(storedIsAdmin);

    const storedCartItems = JSON.parse(localStorage.getItem('cartItems'));
    if (storedCartItems) {
      setCartItems(storedCartItems);
      setCartCount(storedCartItems.reduce((count, item) => count + item.quantity, 0));
    }
  }, [userId, setCartItems, setCartCount]);


  const handleLogin = async () => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, loginData);
      setUserName(response.data.userName);
      setIsAdmin(response.data.isAdmin);
      localStorage.setItem('userName', response.data.userName);
      localStorage.setItem('isAdmin', response.data.isAdmin.toString()); // Store as string
      localStorage.setItem('userId', response.data.userId); 
      setShowLoginModal(false);
      window.location.reload();
    } catch (error) {
      console.error('Login error:', error.response ? error.response.data : error.message);
      alert('Login failed');
    }
  };




  const handleLogout = () => {
    // Save cart items to localStorage before clearing
    localStorage.setItem('cartItems', JSON.stringify(cartItems));

    setUserName('');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('isAdmin'); // Clear admin flag

    // Reset cart and other data
    setCartItems([]); // Clear the cart items in state
    setCartCount(0); // Reset the cart count to 0
    window.location.href = '/Saaral_Jwellery_FE'; // Redirect to home
    alert('Logged out successfully');
  };




  const handleSignup = async () => {
    try {
      const response = await axios.post(`${API_URL}/auth/signup`, signupData);
      alert('Signup successful');
      setShowSignupModal(false);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert('This user has been already registered');
      } else {
        alert('Signup failed');
      }
    }
  };

  const handleSubcategoryClick = (category, subcategory) => {

    navigate(`/jewelry/${category.toLowerCase()}/${subcategory.toLowerCase()}`);
  };

  const aggregatedCartItems = cartItems.reduce((acc, item) => {
    if (!acc[item.id]) {
      acc[item.id] = { ...item, quantity: 0 };
    }
    acc[item.id].quantity += 1;
    return acc;
  }, {});

  // Ensure unique keys when mapping dropdownItems
  const dropdownItems = Object.values(aggregatedCartItems).map((item, index) => (
    <div key={`${item.id}-${index}`} className="d-flex justify-content-between align-items-center p-2">
      <div>
        <img src={item.image} alt={item.product_name} style={{ width: '50px', height: '50px', paddingRight: '10px' }} />
      </div>
      <div className="flex-grow-1">
        <div>{item.product_name}</div>
        <div>${Number(item.price).toFixed(2)} x {item.quantity}</div>
      </div>
    </div>
  ));


  const cartTotal = Object.values(aggregatedCartItems).reduce((acc, item) => acc + item.price * item.quantity, 0);

  const renderTooltip = (props) => (
    <Tooltip id="cart-tooltip" {...props}>
      <div>
        <strong>Cart Items:</strong>
        {dropdownItems.length > 0 ? (
          <div>{dropdownItems}</div>
        ) : (
          <div>No items in cart</div>
        )}
        <div>Total: ${cartTotal.toFixed(2)}</div>
      </div>
    </Tooltip>
  );

  return (
    <>

      <Navbar variant="dark" expand="lg" fixed="top" style={navbarStyle}>
        <div className="container mt-1" style={{ marginBottom: "0px" }}>
          <Navbar.Brand onClick={() => navigate('/Saaral_Jwellery_FE')} className="text-dark" style={{ cursor: 'pointer' }}>
            <img src="images/logo.jpg" alt="loading" style={{ height: '55px', marginRight: '10px', borderRadius: '50%', marginTop: '0px' }} />
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          <Navbar.Collapse id="basic-navbar-nav" className="nav-align-mobile">
            <Nav className="ms-auto mt-2">

              <NavDropdown

                title={
                  <div className="nav-icon-label single-line" >
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
    <div className="nav-icon-label single-line">
      <i className="fas fa-cubes" style={{ color: tealColor }}></i>
      <span className="label">Our collections</span>
    </div>
  }
  id="our-collection-dropdown"
  className="me-3"
>
  <div className="container" style={{ width: '1000px' }}>
    <Row className="justify-content-start">
      {categories.map((category) => (
        <Col
          key={category.category_name}
          xs={12} sm={6} md={4} lg={2} // Responsive grid: adjusts based on screen size
          style={{ padding: '10px', display: 'flex', flexDirection: 'column' }}
        >
          <div style={{ fontWeight: 'bold', textAlign: 'center' }}>
            {category.category_name}
          </div>
          <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
            {category.subcategories.map((subcategory) => (
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


              <Form className="d-none d-md-flex w-50 h-50 mt-3" onSubmit={handleSearch}>
                <Form.Control
                  type="text"
                  placeholder="Search products..."
                  className="me-2"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button variant="outline-secondary" type="submit">
                  <FaSearch />
                </Button>
              </Form>

              <Nav.Link className="text-dark me-3" onClick={() => navigate('/Saaral_Jwellery_FE')} style={{ cursor: 'pointer' }}>
                <div className="nav-icon-label single-line" >
                  <i className="fas fa-home" style={{ color: tealColor }}></i>
                  <div className="label">Home</div>
                </div>
              </Nav.Link>

              <Nav.Link href="#collection" className="text-dark me-3" onClick={() => navigate('#collection')} style={{ cursor: 'pointer' }}>
                <div className="nav-icon-label single-line" >
                  <i className="fas fa-gem" style={{ color: tealColor }}></i>
                  <div className="label">Collection</div>
                </div>
              </Nav.Link>
              <Nav.Link href="#about" className="text-dark me-3" onClick={() => navigate('#about')} style={{ cursor: 'pointer' }}>
                <div className="nav-icon-label single-line" >
                  <i className="fas fa-info-circle" style={{ color: tealColor }}></i>
                  <div className="label">About</div>
                </div>
              </Nav.Link>
              {/* Testimonials icon with label */}
              <Nav.Link href="#testimonials" className="text-dark me-3" onClick={() => navigate('#testimonials')} style={{ cursor: 'pointer' }}>
                <div className="nav-icon-label single-line" >
                  <i className="fas fa-comment" style={{ color: tealColor }}></i>
                  <div className="label">Testimonials</div>
                </div>
              </Nav.Link>
              {/* Cart icon with label */}
              <OverlayTrigger placement="bottom" overlay={renderTooltip}>
                <Nav.Link onClick={() => navigate('/cart')} className="text-dark" style={{ position: 'relative', cursor: 'pointer' }}>
                  <div className="nav-icon-label single-line" >
                    <i className="fas fa-shopping-cart" style={{ color: tealColor }}></i>
                    <div className="label">Cart</div>
                  </div>
                  <Badge pill bg="danger" style={{ position: 'absolute', top: '0px', right: '0px' }}>
                    {cartCount > 0 ? cartCount : 0}
                  </Badge>
                </Nav.Link>
              </OverlayTrigger>
              {/* Conditional admin icon with label */}
              {isAdmin == 1 && (
                <Nav.Link href="#toAdd" className="text-dark me-3" onClick={() => navigate('/toAdd')} style={{ cursor: 'pointer' }}>
                  <div className="nav-icon-label single-line" >
                    <i className="fas fa-add" style={{ color: tealColor }}></i>
                    <div className="label">Add</div>
                  </div>
                </Nav.Link>
              )}
              {/* Login/Logout based on user status */}
              {userName ? (
                <>
                  <Nav.Link className="text-dark me-1" style={{ cursor: 'pointer' }}>
                    Welcome, {userName}!
                  </Nav.Link>
                  <Nav.Link className="text-dark me-3" onClick={handleLogout} style={{ cursor: 'pointer' }}>
                    <div className="nav-icon-label single-line" >
                      <i className="fas fa-sign-out-alt" style={{ color: tealColor }}></i>
                      <div className="label">Logout</div>
                    </div>
                  </Nav.Link>

                </>
              ) : (
                <>
                  <Nav.Link className="text-dark me-3" onClick={() => setShowLoginModal(true)} style={{ cursor: 'pointer' }}>
                    <div className="nav-icon-label">
                      <i className="fas fa-sign-in-alt" style={{ color: tealColor }}></i>
                      <div className="label">Login</div>
                    </div>
                  </Nav.Link>
                  <Nav.Link className="text-dark me-3" onClick={() => setShowSignupModal(true)} style={{ cursor: 'pointer' }}>
                    <div className="nav-icon-label">
                      <i className="fas fa-user-plus" style={{ color: tealColor }}></i>
                      <div className="label">Signup</div>
                    </div>
                  </Nav.Link>
                </>
              )}

            </Nav>
          </Navbar.Collapse>
        </div>


      </Navbar>



      {/* Login Modal */}
      <Modal show={showLoginModal} onHide={() => setShowLoginModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={loginData.email}
                onChange={e => setLoginData({ ...loginData, email: e.target.value })}
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={loginData.password}
                onChange={e => setLoginData({ ...loginData, password: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLoginModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleLogin}>
            Login
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Signup Modal */}
      <Modal show={showSignupModal} onHide={() => setShowSignupModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Sign Up</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formBasicName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={signupData.name}
                onChange={e => setSignupData({ ...signupData, name: e.target.value })}
              />
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={signupData.email}
                onChange={e => setSignupData({ ...signupData, email: e.target.value })}
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={signupData.password}
                onChange={e => setSignupData({ ...signupData, password: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSignupModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSignup}>
            Sign Up
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
