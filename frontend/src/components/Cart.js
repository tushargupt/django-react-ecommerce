import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import './Cart.css';

const Cart = () => {
  const { cartItems, cartTotal, updateCartItem, removeFromCart, loading } = useCart();
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="cart-container">
        <div className="auth-required">
          <h2>Please log in to view your cart</h2>
          <Link to="/login" className="login-link">Login</Link>
        </div>
      </div>
    );
  }

  if (loading) return <div className="loading">Loading cart...</div>;

  if (cartItems.length === 0) {
    return (
      <div className="cart-container">
        <div className="empty-cart">
          <h2>Your cart is empty</h2>
          <Link to="/" className="continue-shopping">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    await updateCartItem(itemId, newQuantity);
  };

  const handleRemoveItem = async (itemId) => {
    await removeFromCart(itemId);
  };

  return (
    <div className="cart-container">
      <h2>Shopping Cart</h2>
      
      <div className="cart-items">
        {cartItems.map((item) => (
          <div key={item.id} className="cart-item">
            <img
              src={item.product.image_url}
              alt={item.product.name}
              className="cart-item-image"
            />
            
            <div className="cart-item-details">
              <h3 className="cart-item-name">{item.product.name}</h3>
              <p className="cart-item-price">${item.product.price}</p>
            </div>
            
            <div className="cart-item-controls">
              <div className="quantity-controls">
                <button
                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                  className="quantity-button"
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                <span className="quantity-display">{item.quantity}</span>
                <button
                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                  className="quantity-button"
                  disabled={item.quantity >= item.product.inventory_count}
                >
                  +
                </button>
              </div>
              
              <div className="item-total">
                ${item.total_price.toFixed(2)}
              </div>
              
              <button
                onClick={() => handleRemoveItem(item.id)}
                className="remove-button"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="cart-summary">
        <div className="cart-total">
          <h3>Total: ${cartTotal.toFixed(2)}</h3>
        </div>
        
        <div className="cart-actions">
          <Link to="/" className="continue-shopping">
            Continue Shopping
          </Link>
          <Link to="/checkout" className="checkout-button">
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;