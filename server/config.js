require('dotenv').config();

module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3000,
  
  // Database
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb+srv://truonghoanglong1802:Phuong3010@webbantrangsuc.p0xrvr4.mongodb.net/webBanTrangSuc',
  
  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
  
  // Email
  EMAIL_HOST: process.env.EMAIL_HOST || 'smtp.gmail.com',
  EMAIL_PORT: process.env.EMAIL_PORT || 587,
  EMAIL_USER: process.env.EMAIL_USER || 'TruongHoangLong1802@gmail.com',
  EMAIL_PASS: process.env.EMAIL_PASS || 'masxiyelndcruhhz',
  EMAIL_FROM: process.env.EMAIL_FROM || 'TruongHoangLong1802@gmail.com',
  
  // Client URLs
  CLIENT_URLS: {
    ADMIN: process.env.ADMIN_URL || 'http://localhost:3001',
    CUSTOMER: process.env.CUSTOMER_URL || 'http://localhost:3002'
  },
  
  // Security
  BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS) || 12,
  
  // Rate limiting
  RATE_LIMIT: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 100 // limit each IP to 100 requests per windowMs
  }
};
