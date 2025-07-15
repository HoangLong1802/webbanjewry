const jwt = require('jsonwebtoken');
const config = require('../config');

const JwtUtil = {
  // Generate JWT token
  genToken(payload, expiresIn = config.JWT_EXPIRES_IN) {
    try {
      const token = jwt.sign(
        payload,
        config.JWT_SECRET,
        { expiresIn }
      );
      return token;
    } catch (error) {
      throw new Error('Failed to generate token');
    }
  },

  // Verify JWT token
  verifyToken(token) {
    try {
      const decoded = jwt.verify(token, config.JWT_SECRET);
      return decoded;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new Error('Token has expired');
      } else if (error.name === 'JsonWebTokenError') {
        throw new Error('Invalid token');
      } else {
        throw new Error('Token verification failed');
      }
    }
  },

  // Middleware to check authentication
  authenticateToken(req, res, next) {
    try {
      const authHeader = req.headers['x-access-token'] || req.headers['authorization'];
      const token = authHeader && authHeader.startsWith('Bearer ') 
        ? authHeader.slice(7) 
        : authHeader;

      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'Access token is required'
        });
      }

      const decoded = JwtUtil.verifyToken(token);
      req.user = decoded;
      next();
    } catch (error) {
      if (error instanceof AuthenticationError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      }
      
      return res.status(401).json({
        success: false,
        message: 'Authentication failed'
      });
    }
  },

  // Middleware to check if user is admin
  requireAdmin(req, res, next) {
    try {
      if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Admin access required'
        });
      }
      next();
    } catch (error) {
      return res.status(403).json({
        success: false,
        message: 'Authorization failed'
      });
    }
  },

  // Generate refresh token
  genRefreshToken(payload) {
    return jwt.sign(
      payload,
      config.JWT_SECRET + '_refresh',
      { expiresIn: '7d' }
    );
  },

  // Verify refresh token
  verifyRefreshToken(token) {
    try {
      return jwt.verify(token, config.JWT_SECRET + '_refresh');
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  },

  // Decode token without verification (for getting payload)
  decodeToken(token) {
    try {
      return jwt.decode(token);
    } catch (error) {
      return null;
    }
  }
};

module.exports = JwtUtil;