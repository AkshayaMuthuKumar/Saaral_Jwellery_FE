import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import JewelryShop from './home';
import CategoryPage from './categoryPage';
import ProductsPage from './productsPage';
import ProductDetailPage from './productDetailPage';
import CustomNavbar from './navbar';
import axios from 'axios';
import Cart from './addcart';
import './style.css'; 
import AddProductForm from './toAdd';
import API_URL from './config';

function App() {
  const [cartItems, setCartItems] = useState([]); 
  const [cartCount, setCartCount] = useState(0);
  const [userName, setUserName] = useState(''); 

  const userId = localStorage.getItem('userId'); 

  useEffect(() => {
    const storedUserName = localStorage.getItem('userName');
    if (storedUserName) {
      setUserName(storedUserName);
    }

    // Load cart items from localStorage on component mount
    const storedCartItems = JSON.parse(localStorage.getItem('cartItems'));
    if (storedCartItems) {
      setCartItems(storedCartItems);
      const totalCount = storedCartItems.reduce((count, item) => count + item.quantity, 0);
      setCartCount(totalCount); // Set cart count based on quantities
    }
  }, [userId]);
  useEffect(() => {
    const fetchUserCartItems = async () => {
      if (!userId) {
        setCartItems([]);
        setCartCount(0);
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/products/cart/${userId}`);
        setCartItems(response.data.items);
        const totalCount = response.data.items.reduce((count, item) => count + item.quantity, 0);
        setCartCount(totalCount); 
      } catch (error) {
        console.error('Error fetching user cart items:', error);
      }
    };

    fetchUserCartItems();
  }, [userId]);

  const addToCart = async (item, selectedSize, quantity = 1) => {
    console.log("item", item)
    if (!userId) {
      alert('Please log in to add items to the cart.');
      return;
    }

    if (!item.id) {
      alert('Product ID and size must be selected.');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/products/cart/add`, {
        userId,
        product: {
          id: item.id,
          product_name: item.product_name,
          size: selectedSize,
          price: item.price,
          quantity: quantity, 
          image: item.image
        }
      });

      if (response.status === 201) {
        setCartItems((prevItems) => {
          const existingItemIndex = prevItems.findIndex(
            (cartItem) => cartItem.id === item.id && cartItem.size === selectedSize
          );

          let updatedItems;
          if (existingItemIndex !== -1) {
            // Item already exists, update the quantity
            updatedItems = [...prevItems];
            updatedItems[existingItemIndex].quantity += quantity;
          } else {
            // Item does not exist, add new item to cart
            updatedItems = [...prevItems, { ...item, size: selectedSize, quantity }];
          }

          // Store the updated cartItems in localStorage
          localStorage.setItem('cartItems', JSON.stringify(updatedItems));

          // Calculate total cart count
          const newTotalCount = updatedItems.reduce((count, item) => count + item.quantity, 0);
          setCartCount(newTotalCount); // Update cartCount state
          localStorage.setItem('cartCount', newTotalCount); // Update localStorage
          alert("Product added to cart");
          window.location.reload();

          return updatedItems;

        });
      } else {
        console.error('Error adding to cart:', response.data.message);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  // Remove from cart
  const removeFromCart = async (itemId, selectedSize) => {
    try {
      const response = await axios.post(`${API_URL}/products/cart/remove`, {
        userId,
        productId: itemId,
        size: selectedSize,
      });

      if (response.status === 200) {
        // Success message
        alert(response.data.message);

        // Remove item from frontend cart state
        setCartItems((prevCartItems) => {
          const updatedCartItems = prevCartItems.filter(
            (item) => !(item.id === itemId && item.size === selectedSize)
          );

          // Update localStorage and cart count
          localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
          const newTotalCount = updatedCartItems.reduce((count, item) => count + item.quantity, 0);
          setCartCount(newTotalCount);
          localStorage.setItem('cartCount', newTotalCount);
          window.location.reload();

          return updatedCartItems;
        });
      } else {
        console.error("Error removing item from cart:", response.data.message);
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };


  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh', padding: '20px' }}>
      <Router>
        <CustomNavbar setCartItems={setCartItems} setCartCount={setCartCount} cartItems={cartItems} cartCount={cartCount} userId={userId} />
        <Routes>
          <Route path="/" element={<JewelryShop />} />
          <Route path="/jewelry/:category/:subcategory?" element={<CategoryPage addToCart={addToCart} cartCount={cartCount} />} />
          <Route path="/category/:category" element={<ProductsPage />} />
          <Route path="/product/:productId" element={<ProductDetailPage userId={userId} addToCart={addToCart} cartCount={cartCount} />} />
          <Route path="/cart" element={<Cart cartItems={cartItems} cartCount={cartCount} removeFromCart={removeFromCart} />} />
          <Route path="/toAdd" element={<AddProductForm />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
