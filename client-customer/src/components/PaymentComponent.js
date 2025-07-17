import React, { Component } from "react";
import MyContext from "../contexts/MyContext";
import CartUtil from "../utils/CartUtil";
import axios from "axios";
import withRouter from "../utils/withRouter";

class Payment extends Component {
  static contextType = MyContext;
  
  constructor(props) {
    super(props);
    this.state = {
      // Payment fields
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardholderName: '',
      
      // Shipping address fields
      recipientName: '',
      recipientPhone: '',
      street: '',
      ward: '',
      district: '',
      city: 'Ho Chi Minh City',
      country: 'Vietnam',
      
      // Order details
      orderNotes: '',
      deliveryMethod: 'standard',
      
      // UI states
      isProcessing: false,
      errors: {},
      orderSuccess: false,
      orderId: null
    };
  }

  componentDidMount() {
    // Redirect to cart if no items
    if (!this.context.mycart || this.context.mycart.length === 0) {
      this.props.navigate('/mycart');
      return;
    }
    
    // Pre-fill customer info if logged in
    if (this.context.customer) {
      this.setState({
        recipientName: this.context.customer.name || '',
        recipientPhone: this.context.customer.phone || '',
        cardholderName: this.context.customer.name || ''
      });
    }
  }

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({ 
      [name]: value,
      errors: { ...this.state.errors, [name]: '' }
    });
  }

  validateForm = () => {
    const errors = {};
    const required = ['cardNumber', 'expiryDate', 'cvv', 'cardholderName', 'recipientName', 'recipientPhone', 'street', 'city'];
    
    required.forEach(field => {
      if (!this.state[field] || this.state[field].trim() === '') {
        errors[field] = 'This field is required';
      }
    });

    // Basic card number validation (simplified)
    if (this.state.cardNumber && this.state.cardNumber.length < 13) {
      errors.cardNumber = 'Invalid card number';
    }

    return errors;
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = this.validateForm();
    if (Object.keys(errors).length > 0) {
      this.setState({ errors });
      return;
    }

    this.setState({ isProcessing: true });

    try {
      // Calculate total
      const total = CartUtil.getTotal(this.context.mycart);
      
      // Prepare order data
      const orderData = {
        customer: this.context.customer,
        items: this.context.mycart,
        total: total,
        shippingAddress: {
          name: this.state.recipientName,
          phone: this.state.recipientPhone,
          address: `${this.state.street}, ${this.state.ward}, ${this.state.district}, ${this.state.city}, ${this.state.country}`
        },
        deliveryMethod: this.state.deliveryMethod,
        notes: this.state.orderNotes,
        paymentMethod: 'credit_card'
      };

      // Submit order
      const response = await axios.post('/api/customer/checkout', orderData, {
        headers: { 'x-access-token': this.context.token }
      });

      if (response.data.success) {
        // Clear cart and show success
        this.context.setMycart([]);
        this.setState({ 
          orderSuccess: true, 
          orderId: response.data.orderId,
          isProcessing: false 
        });
      } else {
        throw new Error(response.data.message || 'Order failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      this.setState({ 
        errors: { submit: 'Payment failed. Please try again.' },
        isProcessing: false 
      });
    }
  }

  render() {
    if (this.state.orderSuccess) {
      return (
        <div className="payment-container">
          <div className="payment-success">
            <div className="success-icon">✅</div>
            <h2>Order Placed Successfully!</h2>
            <p>Order ID: #{this.state.orderId}</p>
            <p>Thank you for your purchase. You will receive a confirmation email shortly.</p>
            <button 
              className="btn-primary"
              onClick={() => this.props.navigate('/myorders')}
            >
              View My Orders
            </button>
          </div>
        </div>
      );
    }

    const total = CartUtil.getTotal(this.context.mycart);
    
    return (
      <div className="payment-container">
        <div className="payment-header">
          <h1>Complete Your Order</h1>
          <p>Secure payment with SSL encryption</p>
        </div>

        <form onSubmit={this.handleSubmit} className="payment-form">
          {/* Order Summary */}
          <div className="order-summary">
            <h3>Order Summary</h3>
            {this.context.mycart.map(item => (
              <div key={item.product._id} className="order-item">
                <span>{item.product.name}</span>
                <span>${item.product.price} x {item.quantity}</span>
              </div>
            ))}
            <div className="order-total">
              <strong>Total: ${total.toFixed(2)}</strong>
            </div>
          </div>

          {/* Shipping Information */}
          <div className="form-section">
            <h3>📦 Shipping Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Recipient Name *</label>
                <input
                  type="text"
                  name="recipientName"
                  value={this.state.recipientName}
                  onChange={this.handleInputChange}
                  className={this.state.errors.recipientName ? 'error' : ''}
                />
                {this.state.errors.recipientName && <span className="error-message">{this.state.errors.recipientName}</span>}
              </div>
              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  name="recipientPhone"
                  value={this.state.recipientPhone}
                  onChange={this.handleInputChange}
                  className={this.state.errors.recipientPhone ? 'error' : ''}
                />
                {this.state.errors.recipientPhone && <span className="error-message">{this.state.errors.recipientPhone}</span>}
              </div>
            </div>
            <div className="form-group">
              <label>Street Address *</label>
              <input
                type="text"
                name="street"
                value={this.state.street}
                onChange={this.handleInputChange}
                className={this.state.errors.street ? 'error' : ''}
              />
              {this.state.errors.street && <span className="error-message">{this.state.errors.street}</span>}
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Ward/District</label>
                <input
                  type="text"
                  name="ward"
                  value={this.state.ward}
                  onChange={this.handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>City *</label>
                <input
                  type="text"
                  name="city"
                  value={this.state.city}
                  onChange={this.handleInputChange}
                  className={this.state.errors.city ? 'error' : ''}
                />
                {this.state.errors.city && <span className="error-message">{this.state.errors.city}</span>}
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="form-section">
            <h3>💳 Payment Information</h3>
            <div className="form-group">
              <label>Cardholder Name *</label>
              <input
                type="text"
                name="cardholderName"
                value={this.state.cardholderName}
                onChange={this.handleInputChange}
                className={this.state.errors.cardholderName ? 'error' : ''}
              />
              {this.state.errors.cardholderName && <span className="error-message">{this.state.errors.cardholderName}</span>}
            </div>
            <div className="form-group">
              <label>Card Number *</label>
              <input
                type="text"
                name="cardNumber"
                value={this.state.cardNumber}
                onChange={this.handleInputChange}
                placeholder="1234 5678 9012 3456"
                className={this.state.errors.cardNumber ? 'error' : ''}
              />
              {this.state.errors.cardNumber && <span className="error-message">{this.state.errors.cardNumber}</span>}
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Expiry Date *</label>
                <input
                  type="text"
                  name="expiryDate"
                  value={this.state.expiryDate}
                  onChange={this.handleInputChange}
                  placeholder="MM/YY"
                  className={this.state.errors.expiryDate ? 'error' : ''}
                />
                {this.state.errors.expiryDate && <span className="error-message">{this.state.errors.expiryDate}</span>}
              </div>
              <div className="form-group">
                <label>CVV *</label>
                <input
                  type="text"
                  name="cvv"
                  value={this.state.cvv}
                  onChange={this.handleInputChange}
                  placeholder="123"
                  className={this.state.errors.cvv ? 'error' : ''}
                />
                {this.state.errors.cvv && <span className="error-message">{this.state.errors.cvv}</span>}
              </div>
            </div>
          </div>

          {/* Order Notes */}
          <div className="form-section">
            <h3>📝 Order Notes (Optional)</h3>
            <textarea
              name="orderNotes"
              value={this.state.orderNotes}
              onChange={this.handleInputChange}
              placeholder="Special instructions for your order..."
              rows="3"
            />
          </div>

          {/* Submit Button */}
          <div className="form-actions">
            {this.state.errors.submit && (
              <div className="error-message">{this.state.errors.submit}</div>
            )}
            <button 
              type="submit" 
              className="btn-primary"
              disabled={this.state.isProcessing}
            >
              {this.state.isProcessing ? 'Processing...' : `Place Order - $${total.toFixed(2)}`}
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default withRouter(Payment);
