import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import './ProductGrid.css';

const ProductGrid = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [addingToCart, setAddingToCart] = useState({});
    const [updatingQuantity, setUpdatingQuantity] = useState({});

    // Debounced values for API calls
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [debouncedMinPrice, setDebouncedMinPrice] = useState('');
    const [debouncedMaxPrice, setDebouncedMaxPrice] = useState('');

    const { addToCart, cartItems, updateCartItem, removeFromCart } = useCart();
    const { user } = useAuth();

    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Debounce min price
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedMinPrice(minPrice);
        }, 500);
        return () => clearTimeout(timer);
    }, [minPrice]);

    // Debounce max price
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedMaxPrice(maxPrice);
        }, 500);
        return () => clearTimeout(timer);
    }, [maxPrice]);

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearchTerm, categoryFilter, debouncedMinPrice, debouncedMaxPrice]);

    // Fetch products when debounced values change
    useEffect(() => {
        fetchProducts();
    }, [debouncedSearchTerm, categoryFilter, debouncedMinPrice, debouncedMaxPrice, currentPage]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: currentPage,
                ...(debouncedSearchTerm && { search: debouncedSearchTerm }),
                ...(categoryFilter && { category: categoryFilter }),
                ...(debouncedMinPrice && { min_price: debouncedMinPrice }),
                ...(debouncedMaxPrice && { max_price: debouncedMaxPrice }),
            });

            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/products/?${params}`
            );

            setProducts(response.data.results);
            setTotalPages(Math.ceil(response.data.count / 12));
            setError('');
        } catch (error) {
            setError('Failed to load products');
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    // Get cart item for a product
    const getCartItem = (productId) => {
        return cartItems.find(item => item.product.id === productId);
    };

    const handleAddToCart = async (productId) => {
        if (!user) {
            setError('Please login to add items to cart');
            return;
        }

        setAddingToCart(prev => ({ ...prev, [productId]: true }));

        const result = await addToCart(productId, 1);
        if (!result.success) {
            setError(result.error);
        }

        setAddingToCart(prev => ({ ...prev, [productId]: false }));
    };

    const handleQuantityChange = async (cartItemId, newQuantity, productId) => {
        setUpdatingQuantity(prev => ({ ...prev, [productId]: true }));

        if (newQuantity <= 0) {
            // Remove item from cart when quantity becomes 0
            const result = await removeFromCart(cartItemId);
            if (!result.success) {
                setError(result.error);
            }
        } else {
            // Update quantity
            const result = await updateCartItem(cartItemId, newQuantity);
            if (!result.success) {
                setError(result.error);
            }
        }

        setUpdatingQuantity(prev => ({ ...prev, [productId]: false }));
    };

    const handleSearch = (e) => {
        e.preventDefault();
        // Trigger immediate search by updating debounced values
        setDebouncedSearchTerm(searchTerm);
        setDebouncedMinPrice(minPrice);
        setDebouncedMaxPrice(maxPrice);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setCategoryFilter('');
        setMinPrice('');
        setMaxPrice('');
        setDebouncedSearchTerm('');
        setDebouncedMinPrice('');
        setDebouncedMaxPrice('');
    };

    // Check if user is typing (debouncing in progress)
    const isSearching = searchTerm !== debouncedSearchTerm ||
        minPrice !== debouncedMinPrice ||
        maxPrice !== debouncedMaxPrice;

    // Render cart controls for products already in cart
    const renderCartControls = (product) => {
        const cartItem = getCartItem(product.id);
        const isAdding = addingToCart[product.id];
        const isUpdating = updatingQuantity[product.id];

        if (isAdding) {
            return (
                <button className="add-to-cart-button adding" disabled>
                    Adding...
                </button>
            );
        }

        if (!cartItem) {
            return (
                <button
                    onClick={() => handleAddToCart(product.id)}
                    disabled={!product.is_in_stock}
                    className="add-to-cart-button"
                >
                    Add to Cart
                </button>
            );
        }

        // Product is in cart - show quantity controls
        return (
            <div className="cart-controls">
                <div className="quantity-controls">
                    <button
                        onClick={() => handleQuantityChange(cartItem.id, cartItem.quantity - 1, product.id)}
                        disabled={isUpdating}
                        className="quantity-btn decrease"
                        title={cartItem.quantity === 1 ? "Remove from cart" : "Decrease quantity"}
                    >
                        {cartItem.quantity === 1 ? '🗑️' : '-'}
                    </button>

                    <span className="quantity-display">
                        {isUpdating ? '...' : cartItem.quantity}
                    </span>

                    <button
                        onClick={() => handleQuantityChange(cartItem.id, cartItem.quantity + 1, product.id)}
                        disabled={isUpdating || cartItem.quantity >= product.inventory_count}
                        className="quantity-btn increase"
                        title="Increase quantity"
                    >
                        +
                    </button>
                </div>

                <div className="cart-info">
                    <span className="in-cart-text">In Cart</span>
                    <span className="cart-total">
                        ${(cartItem.quantity * parseFloat(product.price)).toFixed(2)}
                    </span>
                </div>
            </div>
        );
    };

    if (loading) return <div className="loading">Loading products...</div>;

    return (
        <div className="product-grid-container">
            <div className="filters-section">

                <form onSubmit={handleSearch} className="search-form">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />

                    <button type="submit" className="search-button">Search</button>
                </form>
                <div className="filters">
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="filter-select"
                    >
                        <option value="">All Categories</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Clothing">Clothing</option>
                        <option value="Home">Home</option>
                        <option value="Books">Books</option>
                        <option value="Fitness">Fitness</option>
                    </select>

                    <input
                        type="number"
                        placeholder="Min Price"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="price-input"
                    />

                    <input
                        type="number"
                        placeholder="Max Price"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="price-input"
                    />

                    <button
                        type="button"
                        onClick={clearFilters}
                        className="clear-filters-button"
                    >
                        Clear Filters
                    </button>
                </div>

                {/* Show active filters */}
                {(debouncedSearchTerm || categoryFilter || debouncedMinPrice || debouncedMaxPrice) && (
                    <div className="active-filters">
                        <span className="active-filters-label">Active filters:</span>
                        {debouncedSearchTerm && (
                            <span className="filter-tag">
                                Search: "{debouncedSearchTerm}"
                                <button type="button" onClick={() => { setSearchTerm(''); setDebouncedSearchTerm(''); }}>×</button>
                            </span>
                        )}
                        {categoryFilter && (
                            <span className="filter-tag">
                                Category: {categoryFilter}
                                <button type="button" onClick={() => setCategoryFilter('')}>×</button>
                            </span>
                        )}
                        {debouncedMinPrice && (
                            <span className="filter-tag">
                                Min: ${debouncedMinPrice}
                                <button type="button" onClick={() => { setMinPrice(''); setDebouncedMinPrice(''); }}>×</button>
                            </span>
                        )}
                        {debouncedMaxPrice && (
                            <span className="filter-tag">
                                Max: ${debouncedMaxPrice}
                                <button type="button" onClick={() => { setMaxPrice(''); setDebouncedMaxPrice(''); }}>×</button>
                            </span>
                        )}
                    </div>
                )}
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="products-grid">
                {products.map((product) => {
                    return (
                        <div key={product.id} className="product-card">
                            <Link to={`/products/${product.id}`}>
                                <img
                                    src={product.image_url}
                                    alt={product.name}
                                    className="product-image"
                                />
                            </Link>
                            <div className="product-info">
                                <h3 className="product-name">
                                    <Link to={`/products/${product.id}`}>{product.name}</Link>
                                </h3>
                                <p className="product-price">${product.price}</p>
                                <p className="product-category">{product.category}</p>
                                <p className={`product-stock ${product.is_in_stock ? 'in-stock' : 'out-of-stock'}`}>
                                    {product.is_in_stock ? `${product.inventory_count} in stock` : 'Out of stock'}
                                </p>

                                {renderCartControls(product)}
                            </div>
                        </div>
                    );
                })}
            </div>

            {products.length === 0 && !loading && (
                <div className="no-products">
                    <h3>No products found</h3>
                    <p>Try adjusting your search criteria or filters.</p>
                    <button onClick={clearFilters} className="clear-filters-button">
                        Clear All Filters
                    </button>
                </div>
            )}

            {totalPages > 1 && (
                <div className="pagination">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`pagination-button ${page === currentPage ? 'active' : ''}`}
                        >
                            {page}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductGrid;

