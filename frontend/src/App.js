import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Navbar from './components/Navbar';
import ProductGrid from './components/ProductGrid';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import OrderHistory from './components/OrderHistory';
import Login from './components/Login';
import Register from './components/Register';
import './App.css';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

function App() {
  return (
    <Elements stripe={stripePromise}>
      <AuthProvider>
        <CartProvider>
          <Router>
            <div className="App">
              <Navbar />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<ProductGrid />} />
                  <Route path="/products/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/orders" element={<OrderHistory />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                </Routes>
              </main>
            </div>
          </Router>
        </CartProvider>
      </AuthProvider>
    </Elements>
  );
}

export default App;