# Jewelry Store E-commerce Platform

A modern, full-stack e-commerce platform for jewelry stores with separate admin and customer interfaces.

## 🏗️ Architecture

This project follows a modern, modular architecture with three main components:

### 📁 Project Structure

```
webbanjewry/
├── server/                     # Backend API server
│   ├── api/                   # API route handlers
│   ├── config/                # Configuration files
│   ├── middleware/            # Express middleware
│   ├── models/                # Data access objects (DAOs)
│   ├── utils/                 # Server utilities
│   └── index.js               # Server entry point
├── client-admin/              # Admin panel (React)
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── contexts/          # React contexts
│   │   └── utils/             # Client utilities
│   └── package.json
├── client-customer/           # Customer-facing app (React)
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── contexts/          # React contexts
│   │   └── utils/             # Client utilities
│   └── package.json
└── shared/                    # Shared utilities and constants
    ├── constants/             # Application constants
    ├── services/              # API service layer
    └── utils/                 # Common utilities
```

## 🚀 Features

### Admin Panel Features
- ✅ Admin authentication and authorization
- ✅ Category management (CRUD operations)
- ✅ Product management with image upload
- ✅ Order management and status updates
- ✅ Customer management and communication
- ✅ Dashboard with analytics

### Customer Features
- ✅ User registration and authentication
- ✅ Product browsing and search
- ✅ Shopping cart functionality
- ✅ Order placement and tracking
- ✅ User profile management
- ✅ Category-based product filtering

### Technical Features
- ✅ JWT-based authentication
- ✅ Input validation and sanitization
- ✅ Error handling and logging
- ✅ Rate limiting and security headers
- ✅ Responsive design
- ✅ Image handling and optimization
- ✅ Email notifications

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Nodemailer** - Email service
- **Helmet** - Security middleware
- **Express-validator** - Input validation

### Frontend
- **React 18** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Context API** - State management

### Development Tools
- **Nodemon** - Development server
- **ESLint** - Code linting
- **Prettier** - Code formatting

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd webbanjewry
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install admin panel dependencies
   cd ../client-admin
   npm install

   # Install customer app dependencies
   cd ../client-customer
   npm install
   ```

3. **Environment Configuration**
   ```bash
   # Create environment file
   cd ../server
   cp .env.example .env
   ```

   Edit `.env` file with your configuration:
   ```env
   NODE_ENV=development
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/jewelry_store
   JWT_SECRET=your-super-secret-jwt-key
   EMAIL_HOST=smtp.gmail.com
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

4. **Database Setup**
   - Start MongoDB service
   - The application will create necessary collections automatically

## 🚀 Running the Application

### Development Mode

1. **Start the server**
   ```bash
   cd server
   npm run dev
   ```

2. **Start the admin panel** (new terminal)
   ```bash
   cd client-admin
   npm start
   ```

3. **Start the customer app** (new terminal)
   ```bash
   cd client-customer
   npm start
   ```

### Production Mode

```bash
# Build and start all components
cd server
npm run build
npm start
```

## 🌐 Application URLs

- **Server API**: http://localhost:3000
- **Admin Panel**: http://localhost:3001
- **Customer App**: http://localhost:3002

## 🔑 Default Admin Credentials

Create an admin user in MongoDB:
```javascript
{
  username: "admin",
  password: "admin123", // Will be hashed
  role: "admin"
}
```

## 📚 API Documentation

### Admin Endpoints
```
POST /api/admin/login           # Admin login
GET  /api/admin/categories      # Get categories
POST /api/admin/categories      # Create category
PUT  /api/admin/categories/:id  # Update category
DEL  /api/admin/categories/:id  # Delete category
GET  /api/admin/products        # Get products
POST /api/admin/products        # Create product
PUT  /api/admin/products/:id    # Update product
DEL  /api/admin/products/:id    # Delete product
GET  /api/admin/orders          # Get orders
PUT  /api/admin/orders/:id      # Update order status
GET  /api/admin/customers       # Get customers
```

### Customer Endpoints
```
POST /api/customer/signup       # Customer registration
POST /api/customer/login        # Customer login
GET  /api/customer/products     # Get products
GET  /api/customer/products/:id # Get product details
POST /api/customer/checkout     # Place order
GET  /api/customer/orders       # Get user orders
PUT  /api/customer/profile      # Update profile
```

## 🔒 Security Features

- **Authentication**: JWT-based authentication with refresh tokens
- **Authorization**: Role-based access control
- **Input Validation**: Comprehensive input validation and sanitization
- **Rate Limiting**: API rate limiting to prevent abuse
- **Security Headers**: Helmet.js for security headers
- **Password Hashing**: bcrypt for secure password storage
- **CORS**: Configured CORS for cross-origin requests

## 🧪 Testing

```bash
# Run server tests
cd server
npm test

# Run client tests
cd client-admin
npm test

cd client-customer
npm test
```

## 📈 Performance Optimizations

- **Code Splitting**: React lazy loading for better performance
- **Image Optimization**: Optimized image handling and caching
- **Database Indexing**: Proper MongoDB indexing for faster queries
- **Caching**: Strategic caching for frequently accessed data
- **Compression**: Gzip compression for faster loading

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `3000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/jewelry_store` |
| `JWT_SECRET` | JWT secret key | Required |
| `JWT_EXPIRES_IN` | JWT expiration time | `24h` |
| `EMAIL_HOST` | SMTP host | `smtp.gmail.com` |
| `EMAIL_PORT` | SMTP port | `587` |
| `EMAIL_USER` | SMTP username | Required |
| `EMAIL_PASS` | SMTP password | Required |

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env`

2. **Port Already in Use**
   - Change PORT in environment variables
   - Kill existing processes: `lsof -ti:3000 | xargs kill -9`

3. **JWT Token Issues**
   - Ensure JWT_SECRET is set in environment
   - Check token expiration settings

## 📄 License

This project is licensed under the ISC License.

## 👥 Authors

- **Long** - Initial development and architecture

## 🙏 Acknowledgments

- Express.js community for excellent documentation
- React team for the amazing framework
- MongoDB team for the robust database solution
