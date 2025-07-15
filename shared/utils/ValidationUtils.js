// Validation utility functions
export const ValidationUtils = {
  // Email validation
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Phone validation
  isValidPhone: (phone) => {
    const phoneRegex = /^[0-9]{10,11}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
  },

  // Password validation
  isValidPassword: (password) => {
    return password && password.length >= 6;
  },

  // Required field validation
  isRequired: (value) => {
    return value !== null && value !== undefined && value.toString().trim() !== '';
  },

  // Numeric validation
  isNumeric: (value) => {
    return !isNaN(value) && !isNaN(parseFloat(value));
  },

  // Price validation
  isValidPrice: (price) => {
    return ValidationUtils.isNumeric(price) && parseFloat(price) > 0;
  },

  // Image file validation
  isValidImageFile: (file) => {
    if (!file) return false;
    
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    return allowedTypes.includes(file.type) && file.size <= maxSize;
  },

  // Form validation helper
  validateForm: (formData, rules) => {
    const errors = {};
    
    Object.keys(rules).forEach(field => {
      const rule = rules[field];
      const value = formData[field];
      
      if (rule.required && !ValidationUtils.isRequired(value)) {
        errors[field] = `${rule.label || field} is required`;
        return;
      }
      
      if (value && rule.type) {
        switch (rule.type) {
          case 'email':
            if (!ValidationUtils.isValidEmail(value)) {
              errors[field] = `Please enter a valid email address`;
            }
            break;
          case 'phone':
            if (!ValidationUtils.isValidPhone(value)) {
              errors[field] = `Please enter a valid phone number`;
            }
            break;
          case 'password':
            if (!ValidationUtils.isValidPassword(value)) {
              errors[field] = `Password must be at least 6 characters`;
            }
            break;
          case 'number':
            if (!ValidationUtils.isNumeric(value)) {
              errors[field] = `${rule.label || field} must be a number`;
            }
            break;
          case 'price':
            if (!ValidationUtils.isValidPrice(value)) {
              errors[field] = `${rule.label || field} must be a valid price`;
            }
            break;
        }
      }
      
      if (value && rule.minLength && value.length < rule.minLength) {
        errors[field] = `${rule.label || field} must be at least ${rule.minLength} characters`;
      }
      
      if (value && rule.maxLength && value.length > rule.maxLength) {
        errors[field] = `${rule.label || field} must not exceed ${rule.maxLength} characters`;
      }
    });
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
};

export default ValidationUtils;
