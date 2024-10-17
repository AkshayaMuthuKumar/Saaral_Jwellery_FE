import React from 'react';
import { Container, Row, Col, Button, ListGroup, Card } from 'react-bootstrap';
import API_URL from './config';
//Oct17
export default function Cart({ cartItems, cartCount, removeFromCart }) {
  const totalPrice = cartItems.reduce((total, item) => {
    const price = Number(item.price) || 0;
    return total + price * item.quantity;
  }, 0);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    const isScriptLoaded = await loadRazorpayScript();

    if (!isScriptLoaded) {
      alert('Razorpay SDK failed to load. Are you online?');
      return;
    }

    const res = await fetch('http://localhost:5000/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: totalPrice, currency: 'INR' }),
    });
    const data = await res.json();

    const options = {
      key: 'rzp_test_OK03rE3KWdrU3p',
      amount: data.amount,
      currency: data.currency,
      name: 'Your Store',
      description: 'Test Transaction',
      order_id: data.id,
      handler: function (response) {
        alert('Payment successful!');
      },
      prefill: {
        name: 'Akshaya',
        email: 'akshaya1907@gmail.com',
        contact: '9629907152',
      },
      theme: {
        color: '#3399cc',
      },
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  return (
    <Container className="py-5 m-5">
      <h2 className="text-center mb-4">Shopping Cart</h2>
      <Row>
        <Col md={8}>
          <ListGroup>
            {cartItems.length === 0 ? (
              <ListGroup.Item className="text-center">Your cart is empty</ListGroup.Item>
            ) : (
              cartItems.map((item) => (
                <ListGroup.Item key={item.id} className="mb-3">
                  <Card>
                    <Card.Body>
                      <Row className="align-items-center">
                        <Col xs={12} md={4}>
                          <img src={item.image} alt={item.product_name} style={{ width: '60%', height: '50%' }} />
                        </Col>
                        <Col xs={12} md={4}>
                          <h5>{item.product_name}</h5>
                          <p className="mb-0">Price: ₹{Number(item.price).toFixed(2)}</p>
                          <p className="mb-0">Quantity: {item.quantity}</p>
                        </Col>
                        <Col xs={12} md={4} className="text-end">
                          <Button variant="danger" onClick={() => removeFromCart(item.product_id, item.size)}>
                            Remove
                          </Button>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </ListGroup.Item>
              ))
            )}
          </ListGroup>
        </Col>
        <Col md={4}>
          <div className="border p-3">
            <h4>Total Price</h4>
            <p>₹{totalPrice.toFixed(2)}</p>
            <Button variant="primary" className="w-100" disabled={cartItems.length === 0} onClick={handlePayment}>
              Proceed to Checkout
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
