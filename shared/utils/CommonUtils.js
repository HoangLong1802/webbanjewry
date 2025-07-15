// Date and time formatting utilities
export const DateUtils = {
  // Format date to locale string
  formatDate: (date, options = {}) => {
    if (!date) return '';
    
    const defaultOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...options
    };
    
    return new Date(date).toLocaleDateString('en-US', defaultOptions);
  },

  // Format date and time
  formatDateTime: (date, options = {}) => {
    if (!date) return '';
    
    const defaultOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      ...options
    };
    
    return new Date(date).toLocaleString('en-US', defaultOptions);
  },

  // Get relative time (e.g., "2 hours ago")
  getRelativeTime: (date) => {
    if (!date) return '';
    
    const now = new Date();
    const then = new Date(date);
    const diffInSeconds = Math.floor((now - then) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else {
      return DateUtils.formatDate(date);
    }
  },

  // Check if date is today
  isToday: (date) => {
    if (!date) return false;
    const today = new Date();
    const checkDate = new Date(date);
    return checkDate.toDateString() === today.toDateString();
  },

  // Get current timestamp
  getCurrentTimestamp: () => {
    return Date.now();
  }
};

// String utilities
export const StringUtils = {
  // Capitalize first letter
  capitalize: (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },

  // Convert to title case
  toTitleCase: (str) => {
    if (!str) return '';
    return str.toLowerCase().split(' ').map(word => 
      StringUtils.capitalize(word)
    ).join(' ');
  },

  // Truncate string
  truncate: (str, length = 50, suffix = '...') => {
    if (!str || str.length <= length) return str;
    return str.substring(0, length) + suffix;
  },

  // Generate random string
  generateRandomString: (length = 8) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  },

  // Slugify string (for URLs)
  slugify: (str) => {
    if (!str) return '';
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
};

// Number utilities
export const NumberUtils = {
  // Format currency
  formatCurrency: (amount, currency = 'USD', locale = 'en-US') => {
    if (amount === null || amount === undefined) return '';
    
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
    }).format(amount);
  },

  // Format number with commas
  formatNumber: (num, decimals = 0) => {
    if (num === null || num === undefined) return '';
    
    return Number(num).toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  },

  // Round to decimals
  roundTo: (num, decimals = 2) => {
    return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
  },

  // Parse safe number
  parseNumber: (value, defaultValue = 0) => {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? defaultValue : parsed;
  }
};

// Array utilities
export const ArrayUtils = {
  // Remove duplicates
  unique: (arr, key = null) => {
    if (!Array.isArray(arr)) return [];
    
    if (key) {
      const seen = new Set();
      return arr.filter(item => {
        const val = item[key];
        if (seen.has(val)) return false;
        seen.add(val);
        return true;
      });
    }
    
    return [...new Set(arr)];
  },

  // Group array by key
  groupBy: (arr, key) => {
    if (!Array.isArray(arr)) return {};
    
    return arr.reduce((groups, item) => {
      const group = item[key];
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(item);
      return groups;
    }, {});
  },

  // Sort array by key
  sortBy: (arr, key, direction = 'asc') => {
    if (!Array.isArray(arr)) return [];
    
    return [...arr].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];
      
      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  },

  // Paginate array
  paginate: (arr, page = 1, pageSize = 10) => {
    if (!Array.isArray(arr)) return { items: [], totalPages: 0, currentPage: 1 };
    
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const items = arr.slice(startIndex, endIndex);
    const totalPages = Math.ceil(arr.length / pageSize);
    
    return {
      items,
      totalPages,
      currentPage: page,
      totalItems: arr.length,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    };
  }
};

// Local storage utilities
export const StorageUtils = {
  // Set item with expiration
  setItem: (key, value, expirationHours = 24) => {
    const expirationTime = Date.now() + (expirationHours * 60 * 60 * 1000);
    const item = {
      value,
      expirationTime
    };
    localStorage.setItem(key, JSON.stringify(item));
  },

  // Get item with expiration check
  getItem: (key) => {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;
    
    try {
      const item = JSON.parse(itemStr);
      
      // Check if item has expiration
      if (item.expirationTime && Date.now() > item.expirationTime) {
        localStorage.removeItem(key);
        return null;
      }
      
      return item.value !== undefined ? item.value : item;
    } catch (error) {
      // If parsing fails, return the raw value
      return itemStr;
    }
  },

  // Remove item
  removeItem: (key) => {
    localStorage.removeItem(key);
  },

  // Clear all items
  clear: () => {
    localStorage.clear();
  }
};

export default {
  DateUtils,
  StringUtils,
  NumberUtils,
  ArrayUtils,
  StorageUtils
};
