const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const bodyParser = require("body-parser");
const path = require("path");

// Load environment variables first
require('dotenv').config();

// Load configuration
const config = require("./config");

// Initialize express app
const app = express();

// Trust proxy for rate limiting
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());
app.use(cors({
  origin: [config.CLIENT_URLS.ADMIN, config.CLIENT_URLS.CUSTOMER],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.RATE_LIMIT.WINDOW_MS,
  max: config.RATE_LIMIT.MAX_REQUESTS,
  message: 'Too many requests from this IP, please try again later.',
  trustProxy: true
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    environment: config.NODE_ENV
  });
});

// API routes
app.use('/api/admin', require('./api/admin.js'));
app.use('/api/customer', require('./api/customer.js'));

// Static file serving for production
if (config.NODE_ENV === 'production') {
  // Admin panel static files
  app.use('/admin', express.static(path.resolve(__dirname, '../client-admin/build')));
  app.get('/admin/*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client-admin/build', 'index.html'));
  });

  // Customer app static files
  app.use('/', express.static(path.resolve(__dirname, '../client-customer/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client-customer/build', 'index.html'));
  });
} else {
  // Development mode - simple API endpoint
  app.get("/", (req, res) => {
    res.json({ 
      message: "Jewelry Store API Server", 
      environment: config.NODE_ENV,
      endpoints: {
        admin: "/api/admin",
        customer: "/api/customer",
        health: "/health"
      }
    });
  });
}

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: Object.values(err.errors).map(e => e.message)
    });
  }
  
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
  
  res.status(500).json({
    success: false,
    message: config.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
const PORT = config.PORT;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${config.NODE_ENV}`);
  console.log(`🔗 Admin Panel: ${config.CLIENT_URLS.ADMIN}/admin`);
  console.log(`🛒 Customer App: ${config.CLIENT_URLS.CUSTOMER}`);
});