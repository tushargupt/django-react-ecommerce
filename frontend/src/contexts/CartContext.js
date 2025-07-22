import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCartItems([]);
      setCartTotal(0);
      setCartCount(0);
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/cart/`);
      setCartItems(response.data.items);
      setCartTotal(response.data.total);
      setCartCount(response.data.count);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/cart/add/`, {
        product_id: productId,
        quantity,
      });
      await fetchCart();
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to add to cart' 
      };
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/cart/${itemId}/`, {
        quantity,
      });
      await fetchCart();
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to update cart item' 
      };
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/cart/${itemId}/remove/`);
      await fetchCart();
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to remove from cart' 
      };
    }
  };

  const clearCart = () => {
    setCartItems([]);
    setCartTotal(0);
    setCartCount(0);
  };

  const value = {
    cartItems,
    cartTotal,
    cartCount,
    loading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    fetchCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};