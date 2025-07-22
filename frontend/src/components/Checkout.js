import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import './Checkout.css';

const Checkout = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();

  const [shippingAddress, setShippingAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentStatus, setPaymentStatus] = useState(''); // idle, processing, completed, failed
  const [orderCreated, setOrderCreated] = useState(false);

  if (!user) {
    return (
      <div className="checkout-container">
        <div className="auth-required">
          <h2>Please log in to checkout</h2>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="checkout-container">
        <div className="empty-cart">
          <h2>Your cart is empty</h2>
        </div>
      </div>
    );
  }

  // Helper function to get user-friendly error message
  const getUserFriendlyError = (error) => {
    const errorMessage = error.toLowerCase();
    
    if (errorMessage.includes('insufficient funds')) {
      return 'Your card has insufficient funds. Please try a different payment method.';
    }
    if (errorMessage.includes('expired')) {
      return 'Your card has expired. Please use a different card.';
    }
    if (errorMessage.includes('declined')) {
      return 'Your card was declined. Please try a different payment method.';
    }
    if (errorMessage.includes('invalid')) {
      return 'Invalid card information. Please check your card details.';
    }
    if (errorMessage.includes('authentication')) {
      return 'Payment authentication failed. Please try again.';
    }
    if (errorMessage.includes('network')) {
      return 'Network error. Please check your connection and try again.';
    }
    
    // Default fallback
    return 'Payment failed. Please check your card information and try again.';
  };

   const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    if (!shippingAddress.trim()) {
      setError('Please provide a shipping address');
      return;
    }

    setLoading(true);
    setError('');
    setPaymentStatus('processing');

    try {
      // Create payment method first
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
      });

      if (stripeError) {
        setError(getUserFriendlyError(stripeError.message));
        setPaymentStatus('failed');
        setLoading(false);
        return;
      }

      // Now attempt to create order (which processes the payment)

      const response = await axios.post(`${process.env.REACT_APP_API_URL}/orders/create/`, {
        shipping_address: shippingAddress,
        payment_method_id: paymentMethod.id,
      });

      // Only show success if we get here (payment went through)
      setPaymentStatus('completed');
      setOrderCreated(true);
      clearCart();
      
      // Show success message briefly before redirecting
      setTimeout(() => {
        navigate('/orders');
      }, 2000);
      
    } catch (error) {
      // Payment failed during order creation
      const backendError = error.response?.data?.error || error.message || 'Order creation failed';
      setError(getUserFriendlyError(backendError));
      setPaymentStatus('failed');
    } finally {
      setLoading(false);
    }
  };

  const renderPaymentStatus = () => {
    if (paymentStatus === 'processing') {
      return (
        <div className="payment-status processing">
          <div className="spinner"></div>
          <p>Processing payment...</p>
        </div>
      );
    }
    
    if (paymentStatus === 'completed') {
      return (
        <div className="payment-status completed">
          <div className="checkmark">✓</div>
          <p>Payment completed successfully!</p>
        </div>
      );
    }
    
    if (paymentStatus === 'creating_order') {
      return (
        <div className="payment-status creating-order">
          <div className="spinner"></div>
          <p>Creating your order...</p>
        </div>
      );
    }
    
    if (orderCreated) {
      return (
        <div className="payment-status order-created">
          <div className="checkmark">✓</div>
          <p>Order created successfully! Redirecting to your orders...</p>
        </div>
      );
    }
    
    return null;
  };

  const getButtonText = () => {
    if (paymentStatus === 'processing') return 'Processing Payment...';
    if (paymentStatus === 'completed') return 'Payment Complete';
    if (paymentStatus === 'creating_order') return 'Creating Order...';
    if (orderCreated) return 'Order Created!';
    return `Place Order - $${cartTotal.toFixed(2)}`;
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      
      {renderPaymentStatus()}
      
      <div className="checkout-content">
        <div className="order-summary">
          <h3>Order Summary</h3>
          {cartItems.map((item) => (
            <div key={item.id} className="summary-item">
              <span>{item.product.name} x {item.quantity}</span>
              <span>${item.total_price.toFixed(2)}</span>
            </div>
          ))}
          <div className="summary-total">
            <strong>Total: ${cartTotal.toFixed(2)}</strong>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="checkout-form">
          <div className="form-group">
            <label htmlFor="shipping-address">Shipping Address</label>
            <textarea
              id="shipping-address"
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              placeholder="Enter your complete shipping address..."
              required
              rows={4}
              disabled={loading || orderCreated}
            />
          </div>
          
          <div className="form-group">
            <label>Payment Information</label>
            <div className="card-element-container">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#424770',
                      '::placeholder': {
                        color: '#aab7c4',
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
          
          {error && (
            <div className="error-message-detailed">
              <div className="error-icon">⚠️</div>
              <div className="error-content">
                <strong>Payment Failed</strong>
                <p>{error}</p>
                <small>You can try again with a different payment method.</small>
              </div>
            </div>
          )}
          
          <button
            type="submit"
            disabled={!stripe || loading || orderCreated}
            className={`place-order-button ${paymentStatus}`}
          >
            {getButtonText()}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;