import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import axios from 'axios';
import { Button, Spinner } from 'react-bootstrap';
import API_URL from './config';

const CheckoutForm = ({ totalPrice }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);

    const { data: clientSecret } = await axios.post('http://localhost:5000/create-payment-intent', {
      amount: totalPrice,
    });

    // Confirm the payment with the card details
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (result.error) {
      alert(`Payment failed: ${result.error.message}`);
      setLoading(false);
    } else {
      if (result.paymentIntent.status === 'succeeded') {
        alert('Payment successful!');
        setLoading(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement className="form-control mb-3" />
      <Button variant="primary" className="w-100" type="submit" disabled={!stripe || loading}>
        {loading ? <Spinner animation="border" size="sm" /> : 'Pay'}
      </Button>
    </form>
  );
};

export default CheckoutForm;
