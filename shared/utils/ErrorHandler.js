// Error handling utilities and classes
export class AppError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.timestamp = new Date().toISOString();
    
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message, field = null) {
    super(message, 400);
    this.field = field;
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends AppError {
  constructor(message = 'Access denied') {
    super(message, 403);
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Resource conflict') {
    super(message, 409);
    this.name = 'ConflictError';
  }
}

// Error handler utilities
export const ErrorHandler = {
  // Handle different types of errors
  handleError: (error) => {
    console.error('Error occurred:', {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });

    // Log to external service in production
    if (process.env.NODE_ENV === 'production') {
      // Here you would integrate with error logging service
      // like Sentry, LogRocket, etc.
    }
  },

  // Format error for API response
  formatErrorResponse: (error) => {
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    const response = {
      success: false,
      message: error.message || 'An error occurred',
      timestamp: new Date().toISOString()
    };

    // Add error details in development
    if (isDevelopment) {
      response.stack = error.stack;
      response.details = error;
    }

    // Add validation errors if present
    if (error.name === 'ValidationError' && error.errors) {
      response.validationErrors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
      }));
    }

    return response;
  },

  // Express error middleware
  expressErrorHandler: (err, req, res, next) => {
    ErrorHandler.handleError(err);

    let statusCode = 500;
    let message = 'Internal server error';

    if (err instanceof AppError) {
      statusCode = err.statusCode;
      message = err.message;
    } else if (err.name === 'ValidationError') {
      statusCode = 400;
      message = 'Validation error';
    } else if (err.name === 'JsonWebTokenError') {
      statusCode = 401;
      message = 'Invalid token';
    } else if (err.name === 'TokenExpiredError') {
      statusCode = 401;
      message = 'Token expired';
    } else if (err.code === 11000) {
      statusCode = 409;
      message = 'Duplicate entry';
    }

    const response = ErrorHandler.formatErrorResponse({
      ...err,
      message,
      statusCode
    });

    res.status(statusCode).json(response);
  }
};

// Client-side error handler for React components
export const ClientErrorHandler = {
  // Handle API errors in components
  handleApiError: (error, setError) => {
    let message = 'An error occurred';
    
    if (error.response) {
      message = error.response.data?.message || error.response.statusText;
    } else if (error.request) {
      message = 'Network error. Please check your connection.';
    } else {
      message = error.message;
    }
    
    setError(message);
    console.error('API Error:', error);
  },

  // Create error boundary for React
  createErrorBoundary: (WrappedComponent) => {
    return class ErrorBoundary extends React.Component {
      constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
      }

      static getDerivedStateFromError(error) {
        return { hasError: true, error };
      }

      componentDidCatch(error, errorInfo) {
        console.error('Component Error:', error, errorInfo);
        
        // Log to error reporting service
        if (window.reportError) {
          window.reportError(error, errorInfo);
        }
      }

      render() {
        if (this.state.hasError) {
          return (
            <div className="error-boundary">
              <h2>Something went wrong</h2>
              <p>We're sorry, but something unexpected happened.</p>
              <button onClick={() => window.location.reload()}>
                Reload Page
              </button>
            </div>
          );
        }

        return <WrappedComponent {...this.props} />;
      }
    };
  },

  // Toast notification helper
  showError: (message, duration = 5000) => {
    // This would integrate with your toast/notification system
    console.error('Error:', message);
    
    // Example implementation - you'd replace this with your actual toast library
    if (window.showToast) {
      window.showToast({ type: 'error', message, duration });
    }
  },

  showSuccess: (message, duration = 3000) => {
    console.log('Success:', message);
    
    if (window.showToast) {
      window.showToast({ type: 'success', message, duration });
    }
  }
};

export default {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  ErrorHandler,
  ClientErrorHandler
};
