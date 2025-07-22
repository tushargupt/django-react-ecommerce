# 🛍️ E-commerce Storefront

A full-stack e-commerce application built with **React** (frontend) and **Django REST Framework** (backend). Features a modern, responsive design with secure payment processing, real-time cart management, and comprehensive order tracking.

![E-commerce Demo](https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop)

## ✨ Features

### 🛒 **Shopping Experience**
- **Product Catalog** - Browse products with search, filters, and pagination
- **Product Details** - Detailed product view with high-quality images
- **Smart Cart Management** - Add/remove items with real-time quantity controls
- **Advanced Search** - Search by name, filter by category, price range
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile

### 👤 **User Management**
- **User Registration & Authentication** - Secure JWT-based auth system
- **Profile Management** - Manage personal information
- **Order History** - Complete order tracking with status updates
- **Persistent Cart** - Cart items saved per user session

### 💳 **Payment & Checkout**
- **Stripe Integration** - Secure payment processing
- **Real-time Payment Status** - Clear feedback during payment flow
- **Multiple Payment Methods** - Support for various card types
- **Order Confirmation** - Instant email notifications

### 🔧 **Admin Features**
- **Django Admin Panel** - Manage products, orders, and users
- **Inventory Management** - Real-time stock tracking
- **Order Status Updates** - Track orders from payment to delivery
- **Product Management** - Add, edit, delete products

### 📧 **Notifications**
- **Email Notifications** - Order confirmations via SendGrid
- **Slack Integration** - Real-time order notifications to Slack channels
- **Status Updates** - Order progress notifications

## 🛠️ Technology Stack

### Backend
- **Django 4.2** - Python web framework
- **Django REST Framework** - API development
- **PostgreSQL** - Primary database
- **JWT Authentication** - Secure user authentication
- **Stripe API** - Payment processing
- **SendGrid** - Email service
- **Slack API** - Team notifications

### Frontend
- **React 18** - Modern JavaScript framework
- **React Router** - Client-side routing
- **Context API** - State management
- **Stripe React** - Payment components
- **Axios** - HTTP client
- **CSS3** - Modern styling with animations

## 🚀 Quick Start

### Prerequisites
- **Python 3.8+**
- **Node.js 16+**
- **PostgreSQL**
- **Stripe Account** (for payments)
- **SendGrid Account** (optional, for emails)
- **Slack Workspace** (optional, for notifications)

## 📦 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/ecommerce-storefront.git
cd ecommerce-storefront
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Database Configuration

```bash
# Create PostgreSQL database
createdb ecommerce_db

# Create environment file
cp .env.example .env
```

**Edit `.env` file with your configuration:**
```env
# Django Settings
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database Configuration
DB_NAME=ecommerce_db
DB_USER=your-username
DB_PASSWORD=your-password
DB_HOST=localhost
DB_PORT=5432

# Stripe Configuration (Required)
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key

# Email Configuration (Optional)
SENDGRID_API_KEY=SG.your_sendgrid_api_key
DEFAULT_FROM_EMAIL=noreply@yourdomain.com

# Slack Configuration (Optional)
SLACK_BOT_TOKEN=xoxb-your-slack-bot-token
SLACK_CHANNEL_ID=your-slack-channel-id
```

### 4. Database Migration & Sample Data

```bash
# Create and apply migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser account
python manage.py createsuperuser

# Load sample products (optional)
python manage.py loaddata sample_products.json

# Start Django development server
python manage.py runserver
```

### 5. Frontend Setup

**Open a new terminal window:**
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

**Edit frontend `.env` file:**
```env
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

```bash
# Start React development server
npm start
```

## 🌐 Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000/api
- **Admin Panel:** http://localhost:8000/admin

## 🔑 Stripe Test Cards

### ✅ Successful Payments
```
Card Number: 4242 4242 4242 4242
Expiry: 12/28 (any future date)
CVC: 123 (any 3 digits)
ZIP: 12345 (any 5 digits)
```

### ❌ Test Payment Failures
```
Generic Decline: 4000 0000 0000 0002
Insufficient Funds: 4000 0000 0000 9995
Lost Card: 4000 0000 0000 9987
Stolen Card: 4000 0000 0000 9979
Expired Card: 4000 0000 0000 0069
Invalid CVC: 4000 0000 0000 0127
```

### 🌍 International Cards
```
Visa (US): 4242 4242 4242 4242
Visa (Debit): 4000 0566 5566 5556
Mastercard: 5555 5555 5555 4444
American Express: 3782 822463 10005
```

### 🔐 3D Secure Authentication
```
Authentication Required: 4000 0027 6000 3184
Authentication Unavailable: 4000 0027 6000 3184
```

## 🧪 Testing the Application

### 1. User Registration & Login
1. Go to http://localhost:3000/register
2. Create a new account with valid email
3. Login with your credentials
4. Verify user profile in navigation

### 2. Product Browsing
1. Browse products on homepage
2. Use search functionality
3. Filter by categories (Electronics, Clothing, etc.)
4. Filter by price range
5. Test pagination

### 3. Shopping Cart
1. Add products to cart
2. Update quantities using +/- buttons
3. Remove items (decrease to 0)
4. Verify cart persistence across page refreshes
5. Check cart total calculations

### 4. Checkout Process
1. Go to cart and click "Proceed to Checkout"
2. Enter shipping address
3. Use test card: 4242 4242 4242 4242
4. Complete successful payment
5. Test declined payment with: 4000 0000 0000 0002
6. Verify order appears in Order History

### 5. Admin Panel
1. Go to http://localhost:8000/admin
2. Login with superuser account
3. Manage products, orders, users
4. Test inventory updates

## 📱 User Interface Features

### 🎨 Modern Design
- **Gradient backgrounds** and smooth animations
- **Card-based layouts** with hover effects
- **Responsive grid system** for all screen sizes
- **Loading states** and progress indicators
- **Error handling** with user-friendly messages

### 🛒 Smart Cart Controls
- **Quantity controls** with +/- buttons
- **Visual feedback** for cart updates
- **Real-time total calculation**
- **Persistent cart state**
- **Stock limit validation**

### 💳 Enhanced Payment Flow
- **Step-by-step payment status**
- **Clear error messages** for payment failures
- **Loading indicators** during processing
- **Success confirmations** with order details

### 📧 Notification System
- **Order confirmation emails**
- **Real-time Slack notifications**
- **Toast notifications** for cart actions
- **Status updates** for orders

## 🚀 Deployment

### Backend Deployment (Heroku)
```bash
# Install Heroku CLI
heroku create your-app-name
heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set SECRET_KEY=your-production-secret
heroku config:set DEBUG=False
heroku config:set STRIPE_SECRET_KEY=sk_live_your_live_key

# Deploy
git push heroku main
heroku run python manage.py migrate
heroku run python manage.py createsuperuser
```

### Frontend Deployment (Netlify)
```bash
# Build for production
npm run build

# Deploy to Netlify
# Upload build folder or connect GitHub repository
# Set environment variables in Netlify dashboard
```

## 🔧 API Endpoints

### Authentication
```
POST /api/token/                 # Login (get JWT tokens)
POST /api/token/refresh/         # Refresh JWT token
POST /api/auth/register/         # Register new user
GET  /api/auth/user/             # Get user profile
```

### Products
```
GET  /api/products/              # List products (paginated)
GET  /api/products/{id}/         # Get product details
```

### Shopping Cart
```
GET    /api/cart/                # Get user's cart items
POST   /api/cart/add/            # Add item to cart
PUT    /api/cart/{id}/           # Update cart item quantity
DELETE /api/cart/{id}/remove/    # Remove item from cart
```

### Orders
```
GET  /api/orders/                # List user's orders
POST /api/orders/create/         # Create new order (with payment)
```

## 🐛 Troubleshooting

### Common Issues

**1. Database Connection Error**
```bash
# Check PostgreSQL is running
brew services start postgresql@14

# Verify database exists
psql -l | grep ecommerce_db
```

**2. Stripe Payment Fails**
- Verify Stripe keys in `.env` files
- Check test card numbers are correct
- Ensure both frontend and backend have matching keys

**3. CORS Issues**
- Verify `CORS_ALLOWED_ORIGINS` in Django settings
- Check frontend URL matches allowed origins

**4. Module Import Errors**
```bash
# Reinstall dependencies
pip install -r requirements.txt
npm install
```

**5. Migration Issues**
```bash
# Reset migrations (development only)
python manage.py migrate --fake-initial
```

## 📚 Project Structure

```
ecommerce-storefront/
├── backend/
│   ├── config/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── store/
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── serializers.py
│   │   └── urls.py
│   ├── orders/
│   │   ├── models.py
│   │   ├── views.py
│   │   └── serializers.py
│   ├── users/
│   │   ├── views.py
│   │   └── urls.py
│   ├── requirements.txt
│   ├── manage.py
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ProductGrid.js
│   │   │   ├── Cart.js
│   │   │   ├── Checkout.js
│   │   │   └── ...
│   │   ├── contexts/
│   │   │   ├── AuthContext.js
│   │   │   └── CartContext.js
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   ├── package.json
│   └── .env.example
└── README.md
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 🙏 Acknowledgments

- **Stripe** for secure payment processing
- **Unsplash** for high-quality product images
- **Django** and **React** communities for excellent documentation
- **Material Design** principles for UI inspiration

## 📞 Support

For support, email support@yourcompany.com or join our Slack channel.

---

**Made with ❤️ using Django REST Framework and React**

🌟 **Star this repo if you found it helpful!**