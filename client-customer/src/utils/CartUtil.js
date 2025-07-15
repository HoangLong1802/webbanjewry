// Enhanced Cart Utility with better functionality and error handling
export const CartUtil = {
  // Add product to cart
  addToCart: (cart, product, quantity = 1) => {
    if (!product || !product._id) {
      throw new Error('Invalid product');
    }

    if (quantity <= 0) {
      throw new Error('Quantity must be positive');
    }

    const newCart = [...cart];
    const existingItemIndex = newCart.findIndex(
      item => item.product._id === product._id
    );

    if (existingItemIndex >= 0) {
      // Update quantity of existing item
      newCart[existingItemIndex] = {
        ...newCart[existingItemIndex],
        quantity: newCart[existingItemIndex].quantity + quantity
      };
    } else {
      // Add new item to cart
      newCart.push({
        product,
        quantity
      });
    }

    return newCart;
  },

  // Remove product from cart
  removeFromCart: (cart, productId) => {
    if (!productId) {
      throw new Error('Product ID is required');
    }

    return cart.filter(item => item.product._id !== productId);
  },

  // Update item quantity in cart
  updateQuantity: (cart, productId, quantity) => {
    if (!productId) {
      throw new Error('Product ID is required');
    }

    if (quantity <= 0) {
      return CartUtil.removeFromCart(cart, productId);
    }

    return cart.map(item => 
      item.product._id === productId 
        ? { ...item, quantity }
        : item
    );
  },

  // Get cart total amount
  getTotal: (cart) => {
    if (!Array.isArray(cart)) {
      return 0;
    }

    return cart.reduce((total, item) => {
      const price = parseFloat(item.product.price) || 0;
      const quantity = parseInt(item.quantity) || 0;
      return total + (price * quantity);
    }, 0);
  },

  // Get cart total items count
  getTotalItems: (cart) => {
    if (!Array.isArray(cart)) {
      return 0;
    }

    return cart.reduce((total, item) => {
      return total + (parseInt(item.quantity) || 0);
    }, 0);
  },

  // Get specific item from cart
  getCartItem: (cart, productId) => {
    if (!Array.isArray(cart) || !productId) {
      return null;
    }

    return cart.find(item => item.product._id === productId) || null;
  },

  // Check if product is in cart
  isInCart: (cart, productId) => {
    return CartUtil.getCartItem(cart, productId) !== null;
  },

  // Clear entire cart
  clearCart: () => {
    return [];
  },

  // Validate cart items
  validateCart: (cart) => {
    if (!Array.isArray(cart)) {
      return { isValid: false, errors: ['Cart must be an array'] };
    }

    const errors = [];

    cart.forEach((item, index) => {
      if (!item.product || !item.product._id) {
        errors.push(`Item ${index + 1}: Invalid product`);
      }

      if (!item.quantity || item.quantity <= 0) {
        errors.push(`Item ${index + 1}: Invalid quantity`);
      }

      if (!item.product.price || item.product.price <= 0) {
        errors.push(`Item ${index + 1}: Invalid product price`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Format cart for checkout
  formatForCheckout: (cart, customer) => {
    const validation = CartUtil.validateCart(cart);
    if (!validation.isValid) {
      throw new Error(`Cart validation failed: ${validation.errors.join(', ')}`);
    }

    if (!customer || !customer._id) {
      throw new Error('Customer information is required');
    }

    return {
      total: CartUtil.getTotal(cart),
      items: cart.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price
      })),
      customer: customer._id
    };
  },

  // Get cart summary
  getCartSummary: (cart) => {
    const totalItems = CartUtil.getTotalItems(cart);
    const totalAmount = CartUtil.getTotal(cart);
    const uniqueItems = cart.length;

    return {
      totalItems,
      totalAmount,
      uniqueItems,
      isEmpty: totalItems === 0,
      formattedTotal: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(totalAmount)
    };
  },

  // Save cart to localStorage
  saveToStorage: (cart, key = 'shopping_cart') => {
    try {
      const cartData = {
        items: cart,
        timestamp: Date.now()
      };
      localStorage.setItem(key, JSON.stringify(cartData));
      return true;
    } catch (error) {
      console.error('Failed to save cart to storage:', error);
      return false;
    }
  },

  // Load cart from localStorage
  loadFromStorage: (key = 'shopping_cart', maxAge = 24 * 60 * 60 * 1000) => {
    try {
      const cartData = localStorage.getItem(key);
      if (!cartData) {
        return [];
      }

      const parsed = JSON.parse(cartData);
      
      // Check if cart data is expired
      if (parsed.timestamp && (Date.now() - parsed.timestamp) > maxAge) {
        localStorage.removeItem(key);
        return [];
      }

      return Array.isArray(parsed.items) ? parsed.items : [];
    } catch (error) {
      console.error('Failed to load cart from storage:', error);
      return [];
    }
  },

  // Merge carts (useful when user logs in)
  mergeCarts: (localCart, serverCart) => {
    const merged = [...serverCart];

    localCart.forEach(localItem => {
      const existingIndex = merged.findIndex(
        item => item.product._id === localItem.product._id
      );

      if (existingIndex >= 0) {
        // Update quantity (take the higher quantity)
        merged[existingIndex].quantity = Math.max(
          merged[existingIndex].quantity,
          localItem.quantity
        );
      } else {
        // Add item from local cart
        merged.push(localItem);
      }
    });

    return merged;
  }
};

export default CartUtil;