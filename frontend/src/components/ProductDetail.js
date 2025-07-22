import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);

  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/products/${id}/`);
      setProduct(response.data);
      setError('');
    } catch (error) {
      setError('Product not found');
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      setError('Please login to add items to cart');
      return;
    }

    const result = await addToCart(product.id, quantity);
    if (result.success) {
      navigate('/cart');
    } else {
      setError(result.error);
    }
  };

  if (loading) return <div className="loading">Loading product...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!product) return <div className="error-message">Product not found</div>;

  return (
    <div className="product-detail">
      <button onClick={() => navigate(-1)} className="back-button">
        ← Back
      </button>
      
      <div className="product-detail-content">
        <div className="product-image-section">
          <img
            src={product.image_url}
            alt={product.name}
            className="product-detail-image"
          />
        </div>
        
        <div className="product-info-section">
          <h1 className="product-title">{product.name}</h1>
          <p className="product-price">${product.price}</p>
          <p className="product-category">Category: {product.category}</p>
          
          <div className="product-description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>
          
          <div className="product-stock">
            {product.is_in_stock ? (
              <p className="in-stock">✅ {product.inventory_count} in stock</p>
            ) : (
              <p className="out-of-stock">❌ Out of stock</p>
            )}
          </div>
          
          {product.is_in_stock && (
            <div className="add-to-cart-section">
              <div className="quantity-selector">
                <label htmlFor="quantity">Quantity:</label>
                <input
                  type="number"
                  id="quantity"
                  min="1"
                  max={product.inventory_count}
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="quantity-input"
                />
              </div>
              
              <button
                onClick={handleAddToCart}
                className="add-to-cart-button large"
              >
                Add to Cart - ${(product.price * quantity).toFixed(2)}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
