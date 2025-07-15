const { body, param, query, validationResult } = require('express-validator');

// Validation middleware factory
const createValidationMiddleware = (validations) => {
  return async (req, res, next) => {
    // Run all validations
    await Promise.all(validations.map(validation => validation.run(req)));

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(error => ({
        field: error.param,
        message: error.msg,
        value: error.value
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errorMessages
      });
    }

    next();
  };
};

// Common validation rules
const ValidationRules = {
  // User validations
  userLogin: [
    body('username')
      .trim()
      .notEmpty()
      .withMessage('Username is required')
      .isLength({ min: 3, max: 50 })
      .withMessage('Username must be between 3 and 50 characters'),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters')
  ],

  userSignup: [
    body('username')
      .trim()
      .notEmpty()
      .withMessage('Username is required')
      .isLength({ min: 3, max: 50 })
      .withMessage('Username must be between 3 and 50 characters')
      .matches(/^[a-zA-Z0-9_]+$/)
      .withMessage('Username can only contain letters, numbers, and underscores'),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Name is required')
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be between 2 and 100 characters'),
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Please provide a valid email address')
      .normalizeEmail(),
    body('phone')
      .trim()
      .notEmpty()
      .withMessage('Phone number is required')
      .matches(/^[0-9]{10,11}$/)
      .withMessage('Phone number must be 10-11 digits')
  ],

  // Category validations
  category: [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Category name is required')
      .isLength({ min: 2, max: 100 })
      .withMessage('Category name must be between 2 and 100 characters')
  ],

  // Product validations
  product: [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Product name is required')
      .isLength({ min: 2, max: 200 })
      .withMessage('Product name must be between 2 and 200 characters'),
    body('price')
      .notEmpty()
      .withMessage('Price is required')
      .isFloat({ min: 0.01 })
      .withMessage('Price must be a positive number'),
    body('category')
      .notEmpty()
      .withMessage('Category is required')
      .isMongoId()
      .withMessage('Invalid category ID'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Description cannot exceed 1000 characters')
  ],

  // Order validations
  orderStatus: [
    body('status')
      .notEmpty()
      .withMessage('Status is required')
      .isIn(['PENDING', 'APPROVED', 'CANCELED', 'DELIVERED'])
      .withMessage('Invalid order status')
  ],

  checkout: [
    body('items')
      .isArray({ min: 1 })
      .withMessage('Order must contain at least one item'),
    body('items.*.product')
      .isMongoId()
      .withMessage('Invalid product ID'),
    body('items.*.quantity')
      .isInt({ min: 1 })
      .withMessage('Quantity must be a positive integer'),
    body('total')
      .isFloat({ min: 0.01 })
      .withMessage('Total must be a positive number')
  ],

  // ID parameter validation
  mongoId: [
    param('id')
      .isMongoId()
      .withMessage('Invalid ID format')
  ],

  // Pagination validation
  pagination: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
    query('sort')
      .optional()
      .trim()
      .isLength({ min: 1 })
      .withMessage('Sort field cannot be empty')
  ],

  // Search validation
  search: [
    query('keyword')
      .trim()
      .notEmpty()
      .withMessage('Search keyword is required')
      .isLength({ min: 2, max: 100 })
      .withMessage('Search keyword must be between 2 and 100 characters')
  ]
};

// Validation middleware exports
const Validators = {
  // User validators
  validateUserLogin: createValidationMiddleware(ValidationRules.userLogin),
  validateUserSignup: createValidationMiddleware(ValidationRules.userSignup),

  // Category validators
  validateCategory: createValidationMiddleware(ValidationRules.category),

  // Product validators
  validateProduct: createValidationMiddleware(ValidationRules.product),

  // Order validators
  validateOrderStatus: createValidationMiddleware(ValidationRules.orderStatus),
  validateCheckout: createValidationMiddleware(ValidationRules.checkout),

  // Common validators
  validateMongoId: createValidationMiddleware(ValidationRules.mongoId),
  validatePagination: createValidationMiddleware(ValidationRules.pagination),
  validateSearch: createValidationMiddleware(ValidationRules.search),

  // Custom validation helper
  custom: createValidationMiddleware
};

module.exports = Validators;
