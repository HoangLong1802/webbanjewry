import React, { Component } from "react";
import MyContext from "../contexts/MyContext";
import CartUtil from "../utils/CartUtil";
import axios from "axios";
import withRouter from "../utils/withRouter";
import { withLanguage } from "../components/LanguageSwitcher";

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

export default withRouter(withLanguage(Payment));
      errors.cardNumber = 'Please enter a valid 16-digit card number';
    }

    // Expiry date validation
    if (!expiryDate || expiryDate.length !== 5) {
      errors.expiryDate = 'Please enter expiry date (MM/YY)';
    } else {
      const [month, year] = expiryDate.split('/');
      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;
      
      if (month < 1 || month > 12) {
        errors.expiryDate = 'Invalid month';
      } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
        errors.expiryDate = 'Card has expired';
      }
    }

    // CVV validation
    if (!cvv || cvv.length < 3) {
      errors.cvv = 'Please enter a valid CVV';
    }

    // Cardholder name validation
    if (!cardholderName.trim()) {
      errors.cardholderName = 'Please enter cardholder name';
    }

    this.setState({ errors });
    return Object.keys(errors).length === 0;
  }

  showSuccessModal = () => {
    this.setState({ showSuccessModal: true });
  }

  showErrorModal = (message) => {
    this.setState({ 
      showErrorModal: true,
      errorMessage: message 
    });
  }

  closeModal = () => {
    this.setState({ 
      showSuccessModal: false,
      showErrorModal: false,
      errorMessage: ''
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    
    if (!this.validateForm()) {
      return;
    }

    this.setState({ isProcessing: true });

    // Simulate payment processing
    setTimeout(() => {
      this.processPayment();
    }, 2000);
  }

  processPayment = () => {
    const total = CartUtil.getTotal(this.context.mycart);
    const items = this.context.mycart;
    const customer = this.context.customer;
    const paymentData = {
      cardNumber: this.state.cardNumber,
      expiryDate: this.state.expiryDate,
      cvv: this.state.cvv,
      cardholderName: this.state.cardholderName,
      isTestMode: this.state.isTestMode
    };

    if (customer) {
      this.apiCheckout(total, items, customer, paymentData);
    } else {
      this.props.navigate("/login");
    }
  }

  handleTestPayment = () => {
    this.setState({
      cardNumber: '4111 1111 1111 1111',
      expiryDate: '12/25',
      cvv: '123',
      cardholderName: 'Test User',
      isTestMode: true
    });
  }

  apiCheckout = (total, items, customer, paymentData) => {
    const body = { 
      total: total, 
      items: items, 
      customer: customer,
      payment: paymentData,
      shippingAddress: this.state.shippingAddress,
      orderNotes: this.state.orderNotes,
      deliveryMethod: this.state.deliveryMethod
    };
    const config = { headers: { "x-access-token": this.context.token } };
    
    axios.post("/api/customer/checkout", body, config).then((res) => {
      const result = res.data;
      this.setState({ isProcessing: false });
      
      if (result) {
        this.showSuccessModal();
        this.context.setMycart([]);
        setTimeout(() => {
          this.props.navigate("/home");
        }, 3000);
      } else {
        this.showErrorModal("Payment processing failed. Please check your payment details and try again.");
      }
    }).catch((error) => {
      this.setState({ isProcessing: false });
      this.showErrorModal("Unable to process payment. Please check your connection and try again.");
      console.error("Payment error:", error);
    });
  }

  handleShippingChange = (field, value) => {
    this.setState({
      shippingAddress: {
        ...this.state.shippingAddress,
        [field]: value
      }
    });
  }

  handleDeliveryMethodChange = (method) => {
    this.setState({ deliveryMethod: method });
  }

  handleOrderNotesChange = (value) => {
    this.setState({ orderNotes: value });
  }

  useCustomerAddressToggle = () => {
    const { useCustomerAddress } = this.state;
    if (!useCustomerAddress && this.context.customer) {
      // Load customer address
      this.setState({
        shippingAddress: {
          recipientName: this.context.customer.name || '',
          recipientPhone: this.context.customer.phone || '',
          street: this.context.customer.address?.street || '',
          ward: this.context.customer.address?.ward || '',
          district: this.context.customer.address?.district || '',
          city: this.context.customer.address?.city || '',
          postalCode: this.context.customer.address?.postalCode || '',
          country: this.context.customer.address?.country || 'Vietnam'
        },
        useCustomerAddress: true
      });
    } else {
      // Clear address
      this.setState({
        shippingAddress: {
          recipientName: '',
          recipientPhone: '',
          street: '',
          ward: '',
          district: '',
          city: '',
          postalCode: '',
          country: 'Vietnam'
        },
        useCustomerAddress: false
      });
    }
  }

  validateShippingAddress = () => {
    const errors = {};
    const { shippingAddress } = this.state;

    if (!shippingAddress.recipientName.trim()) errors.recipientName = 'Recipient name is required';
    if (!shippingAddress.recipientPhone.trim()) errors.recipientPhone = 'Recipient phone is required';
    if (!shippingAddress.street.trim()) errors.street = 'Street address is required';
    if (!shippingAddress.ward.trim()) errors.ward = 'Ward is required';
    if (!shippingAddress.district.trim()) errors.district = 'District is required';
    if (!shippingAddress.city.trim()) errors.city = 'City is required';

    // Phone validation
    const phoneRegex = /^[0-9]{10,11}$/;
    if (shippingAddress.recipientPhone && !phoneRegex.test(shippingAddress.recipientPhone)) {
      errors.recipientPhone = 'Please enter a valid phone number';
    }

    this.setState({ errors });
    return Object.keys(errors).length === 0;
  }

  goToPaymentStep = () => {
    if (this.validateShippingAddress()) {
      this.setState({ activeStep: 2 });
    }
  }

  goToShippingStep = () => {
    this.setState({ activeStep: 1 });
  }

  render() {
    const { t } = this.props;
    const { cardNumber, expiryDate, cvv, cardholderName, isProcessing, errors, isTestMode, activeStep, shippingAddress, deliveryMethod, orderNotes } = this.state;
    const total = CartUtil.getTotal(this.context.mycart);

    // Fallback translations
    const fallbackTranslations = {
      payment: 'Payment',
      home: 'Home',
      cart: 'Cart',
      paymentDetails: 'Payment Details',
      cardNumber: 'Card Number',
      expiryDate: 'Expiry Date',
      cvv: 'CVV',
      cardholderName: 'Cardholder Name',
      orderSummary: 'Order Summary',
      total: 'Total',
      payNow: 'Pay Now',
      processing: 'Processing...',
      backToCart: 'Back to Cart',
      testPayment: 'Test Payment',
      securePayment: 'Secure Payment',
      testMode: 'Test Mode',
      enterCardNumber: 'Enter your card number',
      enterExpiryDate: 'MM/YY',
      enterCvv: 'CVV',
      enterCardholderName: 'Enter cardholder name',
      paymentSuccessful: 'Payment Successful!',
      paymentFailed: 'Payment Failed',
      orderPlaced: 'Your order has been placed successfully. Thank you for your purchase!',
      orderTotal: 'Order Total',
      paymentMethod: 'Payment Method',
      status: 'Status',
      confirmed: 'Confirmed',
      creditCard: 'Credit Card',
      redirectingHome: 'Redirecting to home page...',
      tryAgain: 'Try Again',
      backToCart: 'Back to Cart',
      shippingInfo: 'Shipping Information',
      recipientName: 'Recipient Name',
      recipientPhone: 'Recipient Phone',
      streetAddress: 'Street Address',
      ward: 'Ward',
      district: 'District',
      city: 'City',
      postalCode: 'Postal Code',
      country: 'Country',
      deliveryMethod: 'Delivery Method',
      standard: 'Standard Delivery',
      express: 'Express Delivery',
      orderNotes: 'Order Notes',
      optional: '(Optional)',
      saveAddress: 'Save this address for future orders',
      useCustomerAddress: 'Use my account address',
      edit: 'Edit',
      next: 'Next',
      back: 'Back',
      step: 'Step',
      of: 'of',
      addressSaved: 'Address saved successfully',
      addressSaveFailed: 'Failed to save address',
      paymentDetails: 'Payment Details',
      cardNumber: 'Card Number',
      expiryDate: 'Expiry Date',
      cvv: 'CVV',
      cardholderName: 'Cardholder Name',
      orderSummary: 'Order Summary',
      total: 'Total',
      payNow: 'Pay Now',
      processing: 'Processing...',
      backToCart: 'Back to Cart',
      testPayment: 'Test Payment',
      securePayment: 'Secure Payment',
      testMode: 'Test Mode',
      enterCardNumber: 'Enter your card number',
      enterExpiryDate: 'MM/YY',
      enterCvv: 'CVV',
      enterCardholderName: 'Enter cardholder name',
      paymentSuccessful: 'Payment Successful!',
      paymentFailed: 'Payment Failed',
      orderPlaced: 'Your order has been placed successfully. Thank you for your purchase!',
      orderTotal: 'Order Total',
      paymentMethod: 'Payment Method',
      status: 'Status',
      confirmed: 'Confirmed',
      creditCard: 'Credit Card',
      redirectingHome: 'Redirecting to home page...',
      tryAgain: 'Try Again',
      backToCart: 'Back to Cart'
    };

    const tFunc = t || ((key) => fallbackTranslations[key] || key);

    return (
      <div className="payment-page">
        <div className="container">
          <div className="payment-header">
            <h1 className="page-title">{tFunc('payment')}</h1>
            <p className="payment-breadcrumb">
              <span>{tFunc('home')}</span> / <span>{tFunc('cart')}</span> / <span>{tFunc('payment')}</span>
            </p>
          </div>

          <div className="payment-content">
            <div className="step-indicator">
              <div className="steps">
                <div className={`step ${activeStep === 1 ? 'active' : activeStep > 1 ? 'completed' : ''}`}>
                  <div className="step-number">{activeStep > 1 ? '✓' : '1'}</div>
                  <div className="step-label">{tFunc('shippingInfo')}</div>
                </div>
                <div className="step-connector"></div>
                <div className={`step ${activeStep === 2 ? 'active' : activeStep > 2 ? 'completed' : ''}`}>
                  <div className="step-number">{activeStep > 2 ? '✓' : '2'}</div>
                  <div className="step-label">{tFunc('paymentDetails')}</div>
                </div>
              </div>
            </div>

            <div className="payment-form-section">
              <div className="payment-form-card">
                <div className="card-header">
                  <h2>{tFunc('paymentDetails')}</h2>
                  <div className="security-badge">
                    <i className="fas fa-lock"></i>
                    <span>{tFunc('securePayment')}</span>
                  </div>
                </div>

                {isTestMode && (
                  <div className="test-mode-banner">
                    <i className="fas fa-flask"></i>
                    <span>{tFunc('testMode')}</span>
                  </div>
                )}

                {activeStep === 1 && (
                  <div className="shipping-info-section">
                    <div className="step-header">
                      <h3>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="1" y="3" width="15" height="13"></rect>
                          <path d="M16 8l4-4-4-4"></path>
                          <path d="M21 12v6a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2h6"></path>
                        </svg>
                        {tFunc('shippingInfo')}
                      </h3>
                      <p className="step-description">{tFunc('shippingInfoDesc')}</p>
                    </div>

                    <div className="form-container">
                      <div className="form-section">
                        <h4 className="section-title">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                          </svg>
                          {tFunc('recipientInfo')}
                        </h4>
                        
                        <div className="form-row">
                          <div className="form-group">
                            <label htmlFor="recipientName">{tFunc('recipientName')}</label>
                            <div className="input-wrapper">
                              <input
                                type="text"
                                id="recipientName"
                                name="recipientName"
                                value={shippingAddress.recipientName}
                                onChange={(e) => this.handleShippingChange('recipientName', e.target.value)}
                                placeholder={tFunc('recipientName')}
                                className={errors.recipientName ? 'error' : ''}
                              />
                              <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                              </svg>
                            </div>
                            {errors.recipientName && <span className="error-message">{errors.recipientName}</span>}
                          </div>

                          <div className="form-group">
                            <label htmlFor="recipientPhone">{tFunc('recipientPhone')}</label>
                            <div className="input-wrapper">
                              <input
                                type="text"
                                id="recipientPhone"
                                name="recipientPhone"
                                value={shippingAddress.recipientPhone}
                                onChange={(e) => this.handleShippingChange('recipientPhone', e.target.value)}
                                placeholder={tFunc('recipientPhone')}
                                className={errors.recipientPhone ? 'error' : ''}
                              />
                              <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                              </svg>
                            </div>
                            {errors.recipientPhone && <span className="error-message">{errors.recipientPhone}</span>}
                          </div>
                        </div>
                      </div>

                      <div className="form-section">
                        <h4 className="section-title">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                          </svg>
                          {tFunc('addressDetails')}
                        </h4>

                        <div className="form-group">
                          <label htmlFor="street">{tFunc('streetAddress')}</label>
                          <div className="input-wrapper">
                            <input
                              type="text"
                              id="street"
                              name="street"
                              value={shippingAddress.street}
                              onChange={(e) => this.handleShippingChange('street', e.target.value)}
                              placeholder={tFunc('streetAddress')}
                              className={errors.street ? 'error' : ''}
                            />
                            <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                              <polyline points="9,22 9,12 15,12 15,22"></polyline>
                            </svg>
                          </div>
                          {errors.street && <span className="error-message">{errors.street}</span>}
                        </div>

                        <div className="form-row">
                          <div className="form-group">
                            <label htmlFor="ward">{tFunc('ward')}</label>
                            <input
                              type="text"
                              id="ward"
                              name="ward"
                              value={shippingAddress.ward}
                              onChange={(e) => this.handleShippingChange('ward', e.target.value)}
                              placeholder={tFunc('ward')}
                              className={errors.ward ? 'error' : ''}
                            />
                            {errors.ward && <span className="error-message">{errors.ward}</span>}
                          </div>

                          <div className="form-group">
                            <label htmlFor="district">{tFunc('district')}</label>
                            <input
                              type="text"
                              id="district"
                              name="district"
                              value={shippingAddress.district}
                              onChange={(e) => this.handleShippingChange('district', e.target.value)}
                              placeholder={tFunc('district')}
                              className={errors.district ? 'error' : ''}
                            />
                            {errors.district && <span className="error-message">{errors.district}</span>}
                          </div>
                        </div>

                        <div className="form-row">
                          <div className="form-group">
                            <label htmlFor="city">{tFunc('city')}</label>
                            <input
                              type="text"
                              id="city"
                              name="city"
                              value={shippingAddress.city}
                              onChange={(e) => this.handleShippingChange('city', e.target.value)}
                              placeholder={tFunc('city')}
                              className={errors.city ? 'error' : ''}
                            />
                            {errors.city && <span className="error-message">{errors.city}</span>}
                          </div>

                          <div className="form-group">
                            <label htmlFor="postalCode">{tFunc('postalCode')}</label>
                            <input
                              type="text"
                              id="postalCode"
                              name="postalCode"
                              value={shippingAddress.postalCode}
                              onChange={(e) => this.handleShippingChange('postalCode', e.target.value)}
                              placeholder={tFunc('postalCode')}
                              className={errors.postalCode ? 'error' : ''}
                            />
                            {errors.postalCode && <span className="error-message">{errors.postalCode}</span>}
                          </div>
                        </div>

                        <div className="form-group">
                          <label htmlFor="country">{tFunc('country')}</label>
                          <input
                            type="text"
                            id="country"
                            name="country"
                            value={shippingAddress.country}
                            onChange={(e) => this.handleShippingChange('country', e.target.value)}
                            placeholder={tFunc('country')}
                            className={errors.country ? 'error' : ''}
                          />
                          {errors.country && <span className="error-message">{errors.country}</span>}
                        </div>
                      </div>

                      <div className="form-section">
                        <h4 className="section-title">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                          </svg>
                          {tFunc('deliveryOptions')}
                        </h4>

                        <div className="delivery-methods">
                          <div className="delivery-option">
                            <input
                              type="radio"
                              id="standard"
                              name="deliveryMethod"
                              value="standard"
                              checked={deliveryMethod === 'standard'}
                              onChange={() => this.handleDeliveryMethodChange('standard')}
                            />
                            <label htmlFor="standard" className="delivery-label">
                              <div className="delivery-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <rect x="1" y="3" width="15" height="13"></rect>
                                  <path d="M16 8l4-4-4-4"></path>
                                </svg>
                              </div>
                              <div className="delivery-details">
                                <h5>{tFunc('standard')}</h5>
                                <p>{tFunc('standardDeliveryDesc')}</p>
                              </div>
                            </label>
                          </div>

                          <div className="delivery-option">
                            <input
                              type="radio"
                              id="express"
                              name="deliveryMethod"
                              value="express"
                              checked={deliveryMethod === 'express'}
                              onChange={() => this.handleDeliveryMethodChange('express')}
                            />
                            <label htmlFor="express" className="delivery-label">
                              <div className="delivery-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2"></polygon>
                                </svg>
                              </div>
                              <div className="delivery-details">
                                <h5>{tFunc('express')}</h5>
                                <p>{tFunc('expressDeliveryDesc')}</p>
                              </div>
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="form-section">
                        <h4 className="section-title">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 9V5a3 3 0 0 0-6 0v4"></path>
                            <rect x="2" y="9" width="20" height="12" rx="2" ry="2"></rect>
                          </svg>
                          {tFunc('additionalInfo')}
                        </h4>

                        <div className="form-group">
                          <label htmlFor="orderNotes">{tFunc('orderNotes')} <span className="optional">({tFunc('optional')})</span></label>
                          <textarea
                            id="orderNotes"
                            name="orderNotes"
                            value={orderNotes}
                            onChange={(e) => this.handleOrderNotesChange(e.target.value)}
                            placeholder={tFunc('orderNotesPlaceholder')}
                            className="order-notes"
                          ></textarea>
                        </div>
                      </div>
                    </div>

                    <div className="form-actions">
                      <button
                        type="button"
                        className="next-btn"
                        onClick={this.goToPaymentStep}
                        disabled={!this.validateShippingAddress()}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M9 18l6-6-6-6"></path>
                        </svg>
                        {tFunc('next')}
                      </button>

                      <button
                        type="button"
                        className="use-address-btn"
                        onClick={this.useCustomerAddressToggle}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        {this.state.useCustomerAddress ? tFunc('edit') : tFunc('useCustomerAddress')}
                      </button>
                    </div>
                  </div>
                )}

                {activeStep === 2 && (
                  <div className="payment-info-section">
                    <h3>{tFunc('paymentDetails')}</h3>

                    <div className="form-group">
                      <label htmlFor="cardNumber">{tFunc('cardNumber')}</label>
                      <div className="input-wrapper">
                        <input
                          type="text"
                          id="cardNumber"
                          name="cardNumber"
                          value={cardNumber}
                          onChange={this.handleInputChange}
                          placeholder={tFunc('enterCardNumber')}
                          className={errors.cardNumber ? 'error' : ''}
                        />
                        <div className="card-icons">
                          <i className="fab fa-cc-visa"></i>
                          <i className="fab fa-cc-mastercard"></i>
                          <i className="fab fa-cc-amex"></i>
                        </div>
                      </div>
                      {errors.cardNumber && <span className="error-message">{errors.cardNumber}</span>}
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="expiryDate">{tFunc('expiryDate')}</label>
                        <input
                          type="text"
                          id="expiryDate"
                          name="expiryDate"
                          value={expiryDate}
                          onChange={this.handleInputChange}
                          placeholder={tFunc('enterExpiryDate')}
                          className={errors.expiryDate ? 'error' : ''}
                        />
                        {errors.expiryDate && <span className="error-message">{errors.expiryDate}</span>}
                      </div>

                      <div className="form-group">
                        <label htmlFor="cvv">{tFunc('cvv')}</label>
                        <input
                          type="text"
                          id="cvv"
                          name="cvv"
                          value={cvv}
                          onChange={this.handleInputChange}
                          placeholder={tFunc('enterCvv')}
                          className={errors.cvv ? 'error' : ''}
                        />
                        {errors.cvv && <span className="error-message">{errors.cvv}</span>}
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="cardholderName">{tFunc('cardholderName')}</label>
                      <input
                        type="text"
                        id="cardholderName"
                        name="cardholderName"
                        value={cardholderName}
                        onChange={this.handleInputChange}
                        placeholder={tFunc('enterCardholderName')}
                        className={errors.cardholderName ? 'error' : ''}
                      />
                      {errors.cardholderName && <span className="error-message">{errors.cardholderName}</span>}
                    </div>

                    <div className="form-actions">
                      <button
                        type="submit"
                        className="pay-btn"
                        disabled={isProcessing}
                      >
                        {isProcessing ? (
                          <>
                            <div className="spinner"></div>
                            {tFunc('processing')}
                          </>
                        ) : (
                          `${tFunc('payNow')} - $${total.toFixed(2)}`
                        )}
                      </button>

                      <button
                        type="button"
                        className="test-btn"
                        onClick={this.handleTestPayment}
                      >
                        <i className="fas fa-flask"></i>
                        {tFunc('testPayment')}
                      </button>
                    </div>

                    <div className="step-navigation">
                      <button
                        className="back-step-btn"
                        onClick={this.goToShippingStep}
                      >
                        <i className="fas fa-arrow-left"></i>
                        {tFunc('back')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="order-summary-section">
              <div className="order-summary-card">
                <h3>{tFunc('orderSummary')}</h3>
                
                <div className="summary-items">
                  {this.context.mycart.map((item, index) => (
                    <div key={index} className="summary-item">
                      <img 
                        src={`data:image/jpg;base64,${item.product.image}`} 
                        alt={item.product.name}
                        className="summary-item-image"
                      />
                      <div className="summary-item-details">
                        <h4>{item.product.name}</h4>
                        <p>Size: {item.selectedSize} | Color: {item.selectedColor}</p>
                        <p>Qty: {item.quantity}</p>
                      </div>
                      <div className="summary-item-price">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="summary-total">
                  <div className="total-line">
                    <span>{tFunc('total')}</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Success Modal */}
        {this.state.showSuccessModal && (
          <div className="modal-overlay" onClick={this.closeModal}>
            <div className="modal-content success-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div className="success-icon">
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22,4 12,14.01 9,11.01"></polyline>
                  </svg>
                </div>
                <h2>{tFunc('paymentSuccessful')}</h2>
                <p>{tFunc('orderPlaced')}</p>
              </div>
              <div className="modal-body">
                <div className="order-confirmation">
                  <div className="confirmation-item">
                    <span className="item-label">{tFunc('orderTotal')}:</span>
                    <span className="item-value">${CartUtil.getTotal(this.context.mycart).toFixed(2)}</span>
                  </div>
                  <div className="confirmation-item">
                    <span className="item-label">{tFunc('paymentMethod')}:</span>
                    <span className="item-value">{tFunc('creditCard')}</span>
                  </div>
                  <div className="confirmation-item">
                    <span className="item-label">{tFunc('status')}:</span>
                    <span className="item-value success-status">{tFunc('confirmed')}</span>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <p className="redirect-message">{tFunc('redirectingHome')}</p>
                <div className="loading-bar">
                  <div className="loading-progress"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Modal */}
        {this.state.showErrorModal && (
          <div className="modal-overlay" onClick={this.closeModal}>
            <div className="modal-content error-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div className="error-icon">
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                  </svg>
                </div>
                <h2>{tFunc('paymentFailed')}</h2>
                <p>{this.state.errorMessage}</p>
              </div>
              <div className="modal-footer">
                <button className="retry-btn" onClick={this.closeModal}>
                  {tFunc('tryAgain')}
                </button>
                <button className="back-btn-modal" onClick={() => this.props.navigate('/mycart')}>
                  {tFunc('backToCart')}
                </button>
              </div>
            </div>
          </div>
        )}

        <style jsx>{`
          .payment-page {
            background: #f8f9fa;
            min-height: 100vh;
            padding: 20px 0;
          }

          .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
          }

          .payment-header {
            text-align: center;
            margin-bottom: 40px;
          }

          .page-title {
            font-size: 2.5rem;
            color: #2c3e50;
            margin-bottom: 10px;
            font-weight: 300;
          }

          .payment-breadcrumb {
            color: #666;
            font-size: 14px;
          }

          .payment-content {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 40px;
            align-items: start;
          }

          .step-indicator {
            background: white;
            border-radius: 15px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            padding: 20px;
            margin-bottom: 20px;
          }

          .steps {
            display: flex;
            align-items: center;
            justify-content: center;
            max-width: 400px;
            margin: 0 auto;
          }

          .step {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            flex: 1;
          }

          .step-number {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            margin-bottom: 8px;
            transition: all 0.3s ease;
            border: 2px solid #e9ecef;
            background: white;
            color: #6c757d;
          }

          .step.active .step-number {
            background: #c8860d;
            color: white;
            border-color: #c8860d;
          }

          .step.completed .step-number {
            background: #27ae60;
            color: white;
            border-color: #27ae60;
          }

          .step-label {
            font-size: 14px;
            color: #6c757d;
            font-weight: 500;
          }

          .step.active .step-label {
            color: #c8860d;
            font-weight: 600;
          }

          .step.completed .step-label {
            color: #27ae60;
            font-weight: 600;
          }

          .step-connector {
            height: 2px;
            background: #e9ecef;
            flex: 1;
            margin: 0 15px;
          }

          .step.completed + .step-connector {
            background: #27ae60;
          }

          .payment-form-card {
            background: white;
            border-radius: 16px;
            padding: 30px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          }

          .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 1px solid #eee;
          }

          .card-header h2 {
            color: #2c3e50;
            font-size: 1.5rem;
            margin: 0;
          }

          .security-badge {
            display: flex;
            align-items: center;
            gap: 8px;
            color: #27ae60;
            font-size: 14px;
          }

          .test-mode-banner {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 8px;
            padding: 12px 16px;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 8px;
            color: #856404;
          }

          .payment-form {
            display: flex;
            flex-direction: column;
            gap: 20px;
          }

          .form-group {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }

          .form-row {
            display: flex;
            gap: 15px;
          }

          label {
            font-weight: 600;
            color: #2c3e50;
            font-size: 14px;
          }

          .input-wrapper {
            position: relative;
          }

          input {
            width: 100%;
            padding: 12px 16px;
            border: 2px solid #e1e8ed;
            border-radius: 8px;
            font-size: 16px;
            transition: all 0.2s;
            box-sizing: border-box;
          }

          input:focus {
            outline: none;
            border-color: #c8860d;
            box-shadow: 0 0 0 3px rgba(200, 134, 13, 0.1);
          }

          input.error {
            border-color: #e74c3c;
          }

          .card-icons {
            position: absolute;
            right: 12px;
            top: 50%;
            transform: translateY(-50%);
            display: flex;
            gap: 8px;
          }

          .card-icons i {
            font-size: 24px;
            color: #666;
          }

          .error-message {
            color: #e74c3c;
            font-size: 12px;
            margin-top: 4px;
          }

          .form-actions {
            display: flex;
            gap: 15px;
            margin-top: 10px;
          }

          .pay-btn {
            flex: 1;
            background: #c8860d;
            color: white;
            border: none;
            padding: 16px 24px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
          }

          .pay-btn:hover:not(:disabled) {
            background: #a86e0b;
            transform: translateY(-1px);
          }

          .pay-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }

          .test-btn {
            background: #3498db;
            color: white;
            border: none;
            padding: 16px 24px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .test-btn:hover {
            background: #2980b9;
            transform: translateY(-1px);
          }

          .back-btn {
            background: #6c757d;
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            gap: 8px;
            margin-top: 20px;
          }

          .back-btn:hover {
            background: #5a6268;
            transform: translateY(-1px);
          }

          .spinner {
            width: 20px;
            height: 20px;
            border: 2px solid transparent;
            border-top: 2px solid currentColor;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          .order-summary-card {
            background: white;
            border-radius: 16px;
            padding: 30px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            position: sticky;
            top: 20px;
          }

          .order-summary-card h3 {
            color: #2c3e50;
            margin-bottom: 20px;
            font-size: 1.3rem;
          }

          .summary-items {
            display: flex;
            flex-direction: column;
            gap: 15px;
            margin-bottom: 20px;
          }

          .summary-item {
            display: flex;
            gap: 15px;
            align-items: center;
          }

          .summary-item-image {
            width: 60px;
            height: 60px;
            object-fit: cover;
            border-radius: 8px;
          }

          .summary-item-details {
            flex: 1;
          }

          .summary-item-details h4 {
            margin: 0 0 5px 0;
            font-size: 14px;
            color: #2c3e50;
          }

          .summary-item-details p {
            margin: 0;
            font-size: 12px;
            color: #666;
          }

          .summary-item-price {
            font-weight: 600;
            color: #c8860d;
          }

          .summary-total {
            border-top: 2px solid #eee;
            padding-top: 20px;
          }

          .total-line {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 1.2rem;
            font-weight: 600;
            color: #2c3e50;
          }

          .step-navigation {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #e9ecef;
          }

          .back-step-btn {
            background: #6c757d;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 8px;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .back-step-btn:hover {
            background: #5a6268;
          }

          .payment-info-section {
            padding: 20px 0;
          }

          .payment-info-section h3 {
            color: #2c3e50;
            margin-bottom: 20px;
            font-size: 20px;
            font-weight: 600;
          }

          /* Modal Styles */
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            animation: fadeIn 0.3s ease-out;
          }

          .modal-content {
            background: white;
            border-radius: 20px;
            padding: 40px;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            animation: slideIn 0.3s ease-out;
          }

          .modal-header {
            text-align: center;
            margin-bottom: 30px;
          }

          .success-icon {
            color: #27ae60;
            margin-bottom: 20px;
          }

          .error-icon {
            color: #e74c3c;
            margin-bottom: 20px;
          }

          .modal-header h2 {
            color: #2c3e50;
            margin-bottom: 15px;
            font-size: 2rem;
            font-weight: 600;
          }

          .modal-header p {
            color: #666;
            font-size: 16px;
            line-height: 1.5;
          }

          .modal-body {
            margin-bottom: 30px;
          }

          .order-confirmation {
            background: #f8f9fa;
            border-radius: 12px;
            padding: 20px;
          }

          .confirmation-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 0;
            border-bottom: 1px solid #eee;
          }

          .confirmation-item:last-child {
            border-bottom: none;
          }

          .item-label {
            color: #666;
            font-weight: 500;
          }

          .item-value {
            color: #2c3e50;
            font-weight: 600;
          }

          .success-status {
            color: #27ae60;
            background: #d4edda;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 14px;
          }

          .modal-footer {
            text-align: center;
          }

          .redirect-message {
            color: #666;
            margin-bottom: 20px;
            font-size: 14px;
          }

          .loading-bar {
            width: 100%;
            height: 4px;
            background: #e9ecef;
            border-radius: 2px;
            overflow: hidden;
          }

          .loading-progress {
            height: 100%;
            background: #c8860d;
            width: 0;
            animation: progress 3s linear forwards;
          }

          .retry-btn, .back-btn-modal {
            background: #c8860d;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            margin: 0 10px;
          }

          .retry-btn:hover, .back-btn-modal:hover {
            background: #a86e0b;
            transform: translateY(-2px);
          }

          .back-btn-modal {
            background: #6c757d;
          }

          .back-btn-modal:hover {
            background: #5a6268;
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }

          @keyframes slideIn {
            from {
              transform: translateY(-50px);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }

          @keyframes progress {
            from { width: 0; }
            to { width: 100%; }
          }

          @media (max-width: 768px) {
            .payment-content {
              grid-template-columns: 1fr;
              gap: 20px;
            }

            .form-row {
              flex-direction: column;
              gap: 0;
            }

            .form-actions {
              flex-direction: column;
            }

            .next-btn, .use-address-btn {
              width: 100%;
              justify-content: center;
            }

            .steps {
              max-width: 300px;
            }

            .step-label {
              font-size: 12px;
            }

            .step-number {
              width: 35px;
              height: 35px;
            }

            .step-connector {
              margin: 0 10px;
            }

            .modal-content {
              padding: 30px 20px;
            }

            .modal-header h2 {
              font-size: 1.5rem;
            }

            .retry-btn, .back-btn-modal {
              display: block;
              width: 100%;
              margin: 10px 0;
            }
          }
        `}</style>
      </div>
    );
  }
}

export default withRouter(withLanguage(Payment));
