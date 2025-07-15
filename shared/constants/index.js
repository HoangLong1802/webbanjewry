// Shared constants across the application
export const API_ENDPOINTS = {
  // Admin endpoints
  ADMIN: {
    LOGIN: '/api/admin/login',
    CATEGORIES: '/api/admin/categories',
    PRODUCTS: '/api/admin/products',
    ORDERS: '/api/admin/orders',
    CUSTOMERS: '/api/admin/customers',
  },
  // Customer endpoints
  CUSTOMER: {
    LOGIN: '/api/customer/login',
    SIGNUP: '/api/customer/signup',
    ACTIVATE: '/api/customer/active',
    PROFILE: '/api/customer/profile',
    PRODUCTS: '/api/customer/products',
    ORDERS: '/api/customer/orders',
    CHECKOUT: '/api/customer/checkout',
  }
};

export const ORDER_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  CANCELED: 'CANCELED',
  DELIVERED: 'DELIVERED'
};

export const USER_ROLES = {
  ADMIN: 'admin',
  CUSTOMER: 'customer'
};

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100
};

export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 6,
  PHONE_PATTERN: /^[0-9]{10,11}$/,
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
};

export const IMAGE_CONFIG = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
  DEFAULT_DIMENSIONS: {
    THUMBNAIL: { width: 100, height: 100 },
    MEDIUM: { width: 300, height: 300 },
    LARGE: { width: 400, height: 400 }
  }
};

export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PHONE: 'Please enter a valid phone number',
  PASSWORD_TOO_SHORT: `Password must be at least ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} characters`,
  UNAUTHORIZED: 'You are not authorized to perform this action',
  NOT_FOUND: 'The requested resource was not found',
  SERVER_ERROR: 'An internal server error occurred',
  NETWORK_ERROR: 'Network error. Please check your connection.'
};

export const SUCCESS_MESSAGES = {
  CREATED: 'Successfully created',
  UPDATED: 'Successfully updated',
  DELETED: 'Successfully deleted',
  LOGGED_IN: 'Successfully logged in',
  LOGGED_OUT: 'Successfully logged out',
  ORDER_PLACED: 'Order placed successfully',
  ACCOUNT_ACTIVATED: 'Account activated successfully'
};
