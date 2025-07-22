import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import './OrderHistory.css';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/orders/`);
      setOrders(response.data.results);
      setError('');
    } catch (error) {
      setError('Failed to load orders');
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="orders-container">
        <div className="auth-required">
          <h2>Please log in to view your orders</h2>
        </div>
      </div>
    );
  }

  if (loading) return <div className="loading">Loading orders...</div>;

  if (orders.length === 0) {
    return (
      <div className="orders-container">
        <div className="no-orders">
          <h2>No orders found</h2>
          <p>You haven't placed any orders yet.</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#f39c12';
      case 'processing': return '#3498db';
      case 'shipped': return '#9b59b6';
      case 'delivered': return '#27ae60';
      case 'cancelled': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  return (
    <div className="orders-container">
      <h2>Order History</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="orders-list">
        {orders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <div className="order-info">
                <h3>Order #{order.id}</h3>
                <p className="order-date">
                  {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="order-status">
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(order.status) }}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            </div>
            
            <div className="order-items">
              {order.items && order.items.map((item) => (
                <div key={item.id} className="order-item">
                  <img
                    src={item.product.image_url}
                    alt={item.product.name}
                    className="order-item-image"
                  />
                  <div className="order-item-details">
                    <h4>{item.product.name}</h4>
                    <p>Quantity: {item.quantity}</p>
                    <p>Price: ${item.unit_price}</p>
                  </div>
                  <div className="order-item-total">
                    ${item.total_price.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="order-footer">
              <div className="order-total">
                <strong>Total: ${order.total_amount}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;