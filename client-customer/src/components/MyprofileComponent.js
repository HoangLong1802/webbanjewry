import axios from 'axios';
import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import MyContext from '../contexts/MyContext';
import { withLanguage } from './LanguageSwitcher';

class Myprofile extends Component {
  static contextType = MyContext;
  
  constructor(props) {
    super(props);
    this.state = {
      txtUsername: '',
      txtPassword: '',
      txtName: '',
      txtPhone: '',
      txtEmail: '',
      showNotification: false,
      notificationMessage: '',
      notificationType: 'success',
      isLoading: false,
      showPassword: false,
      addresses: [],
      showAddressForm: false,
      newAddress: {
        recipientName: '',
        recipientPhone: '',
        street: '',
        ward: '',
        district: '',
        city: '',
        postalCode: '',
        country: 'Vietnam'
      },
      editingAddressIndex: -1
    };
  }

  showNotification = (message, type = 'success') => {
    this.setState({ 
      showNotification: true, 
      notificationMessage: message,
      notificationType: type
    });
    setTimeout(() => {
      this.setState({ showNotification: false });
    }, 4000);
  }

  togglePasswordVisibility = () => {
    this.setState({ showPassword: !this.state.showPassword });
  }

  handleInputChange = (field, value) => {
    this.setState({ [field]: value });
  }

  validateForm = () => {
    const { txtUsername, txtPassword, txtName, txtPhone, txtEmail } = this.state;
    const errors = [];

    if (!txtUsername.trim()) errors.push('Username is required');
    if (!txtPassword.trim()) errors.push('Password is required');
    if (!txtName.trim()) errors.push('Name is required');
    if (!txtPhone.trim()) errors.push('Phone is required');
    if (!txtEmail.trim()) errors.push('Email is required');

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (txtEmail && !emailRegex.test(txtEmail)) {
      errors.push('Please enter a valid email address');
    }

    // Phone validation
    const phoneRegex = /^[0-9]{10,11}$/;
    if (txtPhone && !phoneRegex.test(txtPhone)) {
      errors.push('Please enter a valid phone number');
    }

    return errors;
  }

  // Address management methods
  toggleAddressForm = () => {
    this.setState({ 
      showAddressForm: !this.state.showAddressForm,
      editingAddressIndex: -1,
      newAddress: {
        recipientName: '',
        recipientPhone: '',
        street: '',
        ward: '',
        district: '',
        city: '',
        postalCode: '',
        country: 'Vietnam'
      }
    });
  }

  handleAddressChange = (field, value) => {
    this.setState({
      newAddress: {
        ...this.state.newAddress,
        [field]: value
      }
    });
  }

  validateAddress = () => {
    const { newAddress } = this.state;
    const errors = [];

    if (!newAddress.recipientName.trim()) errors.push('Recipient name is required');
    if (!newAddress.recipientPhone.trim()) errors.push('Recipient phone is required');
    if (!newAddress.street.trim()) errors.push('Street address is required');
    if (!newAddress.ward.trim()) errors.push('Ward is required');
    if (!newAddress.district.trim()) errors.push('District is required');
    if (!newAddress.city.trim()) errors.push('City is required');
    if (!newAddress.country.trim()) errors.push('Country is required');

    return errors;
  }

  saveAddress = async () => {
    const errors = this.validateAddress();
    if (errors.length > 0) {
      this.showNotification(errors.join('. '), 'error');
      return;
    }

    this.setState({ isLoading: true });

    try {
      const { editingAddressIndex, newAddress, addresses } = this.state;
      let updatedAddresses = [...addresses];

      if (editingAddressIndex >= 0) {
        updatedAddresses[editingAddressIndex] = newAddress;
      } else {
        updatedAddresses.push(newAddress);
      }

      const customer = this.context.customer;
      const body = { addresses: updatedAddresses };
      const config = { headers: { 'x-access-token': this.context.token } };

      const res = await axios.put(`/api/customer/customers/${customer._id}`, body, config);
      
      if (res.data) {
        this.setState({ 
          addresses: updatedAddresses,
          showAddressForm: false,
          editingAddressIndex: -1,
          newAddress: {
            recipientName: '',
            recipientPhone: '',
            street: '',
            ward: '',
            district: '',
            city: '',
            postalCode: '',
            country: 'Vietnam'
          }
        });
        
        // Update context
        this.context.setCustomer({
          ...customer,
          addresses: updatedAddresses
        });
        
        this.showNotification(editingAddressIndex >= 0 ? 'Address updated successfully' : 'Address added successfully', 'success');
      }
    } catch (error) {
      this.showNotification('Failed to save address. Please try again.', 'error');
      console.error('Address save error:', error);
    } finally {
      this.setState({ isLoading: false });
    }
  }

  editAddress = (index) => {
    this.setState({
      newAddress: { ...this.state.addresses[index] },
      editingAddressIndex: index,
      showAddressForm: true
    });
  }

  deleteAddress = async (index) => {
    if (!window.confirm('Are you sure you want to delete this address?')) {
      return;
    }

    this.setState({ isLoading: true });

    try {
      const { addresses } = this.state;
      const updatedAddresses = addresses.filter((_, i) => i !== index);

      const customer = this.context.customer;
      const body = { addresses: updatedAddresses };
      const config = { headers: { 'x-access-token': this.context.token } };

      const res = await axios.put(`/api/customer/customers/${customer._id}`, body, config);
      
      if (res.data) {
        this.setState({ addresses: updatedAddresses });
        
        // Update context
        this.context.setCustomer({
          ...customer,
          addresses: updatedAddresses
        });
        
        this.showNotification('Address deleted successfully', 'success');
      }
    } catch (error) {
      this.showNotification('Failed to delete address. Please try again.', 'error');
      console.error('Address delete error:', error);
    } finally {
      this.setState({ isLoading: false });
    }
  }

  render() {
    if (this.context.token === '') return (<Navigate replace to='/login' />);
    
    const { t } = this.props;
    const fallbackTranslations = {
      myProfile: 'My Profile',
      personalInformation: 'Personal Information',
      username: 'Username',
      password: 'Password',
      name: 'Full Name',
      phone: 'Phone Number',
      email: 'Email Address',
      updateProfile: 'Update Profile',
      updating: 'Updating...',
      profileUpdated: 'Profile updated successfully!',
      profileUpdateError: 'Failed to update profile',
      enterUsername: 'Enter your username',
      enterPassword: 'Enter your password',
      enterName: 'Enter your full name',
      enterPhone: 'Enter your phone number',
      enterEmail: 'Enter your email address',
      showPassword: 'Show Password',
      hidePassword: 'Hide Password',
      accountSecurity: 'Account Security',
      contactInformation: 'Contact Information',
      addresses: 'Addresses',
      addAddress: 'Add Address',
      editAddress: 'Edit Address',
      deleteAddress: 'Delete Address',
      saveAddress: 'Save Address',
      cancel: 'Cancel',
      recipientName: 'Recipient Name',
      recipientPhone: 'Recipient Phone',
      street: 'Street',
      ward: 'Ward',
      district: 'District',
      city: 'City',
      postalCode: 'Postal Code',
      country: 'Country'
    };

    const tFunc = t || ((key) => fallbackTranslations[key] || key);

    return (
      <div className="myprofile-page">
        {/* Notification */}
        {this.state.showNotification && (
          <div className={`notification-toast ${this.state.notificationType}`}>
            <div className="notification-content">
              <span className="notification-icon">
                {this.state.notificationType === 'success' ? '✅' : '❌'}
              </span>
              <span className="notification-text">{this.state.notificationMessage}</span>
            </div>
          </div>
        )}

        <div className="container">
          <div className="page-header">
            <h1 className="page-title">{tFunc('myProfile')}</h1>
            <p className="page-subtitle">{tFunc('personalInformation')}</p>
          </div>

          <div className="profile-content">
            <div className="profile-card">
              <div className="profile-avatar">
                <div className="avatar-circle">
                  <span className="avatar-text">
                    {this.state.txtName.charAt(0).toUpperCase() || this.context.customer?.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="avatar-info">
                  <h3>{this.state.txtName || this.context.customer?.name}</h3>
                  <p>{this.state.txtEmail || this.context.customer?.email}</p>
                </div>
              </div>

              <form className="profile-form" onSubmit={(e) => this.btnUpdateClick(e)}>
                <div className="form-sections">
                  <div className="form-section">
                    <h4 className="section-title">{tFunc('accountSecurity')}</h4>
                    
                    <div className="form-group">
                      <label htmlFor="username">{tFunc('username')}</label>
                      <div className="input-wrapper">
                        <input
                          type="text"
                          id="username"
                          value={this.state.txtUsername}
                          onChange={(e) => this.handleInputChange('txtUsername', e.target.value)}
                          placeholder={tFunc('enterUsername')}
                          required
                        />
                        <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="password">{tFunc('password')}</label>
                      <div className="input-wrapper">
                        <input
                          type={this.state.showPassword ? "text" : "password"}
                          id="password"
                          value={this.state.txtPassword}
                          onChange={(e) => this.handleInputChange('txtPassword', e.target.value)}
                          placeholder={tFunc('enterPassword')}
                          required
                        />
                        <button 
                          type="button" 
                          className="password-toggle"
                          onClick={this.togglePasswordVisibility}
                        >
                          {this.state.showPassword ? (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94L6.06 6.06a2 2 0 0 0 0 2.83l10.09 10.09a2 2 0 0 0 2.83 0l-1.02-1.02z"></path>
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                              <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                          ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                              <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="form-section">
                    <h4 className="section-title">{tFunc('contactInformation')}</h4>
                    
                    <div className="form-group">
                      <label htmlFor="name">{tFunc('name')}</label>
                      <div className="input-wrapper">
                        <input
                          type="text"
                          id="name"
                          value={this.state.txtName}
                          onChange={(e) => this.handleInputChange('txtName', e.target.value)}
                          placeholder={tFunc('enterName')}
                          required
                        />
                        <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="phone">{tFunc('phone')}</label>
                      <div className="input-wrapper">
                        <input
                          type="tel"
                          id="phone"
                          value={this.state.txtPhone}
                          onChange={(e) => this.handleInputChange('txtPhone', e.target.value)}
                          placeholder={tFunc('enterPhone')}
                          required
                        />
                        <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                        </svg>
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="email">{tFunc('email')}</label>
                      <div className="input-wrapper">
                        <input
                          type="email"
                          id="email"
                          value={this.state.txtEmail}
                          onChange={(e) => this.handleInputChange('txtEmail', e.target.value)}
                          placeholder={tFunc('enterEmail')}
                          required
                        />
                        <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                          <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="form-actions">
                  <button 
                    type="submit" 
                    className="update-btn"
                    disabled={this.state.isLoading}
                  >
                    {this.state.isLoading ? (
                      <>
                        <div className="spinner"></div>
                        {tFunc('updating')}
                      </>
                    ) : (
                      <>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                          <polyline points="17,21 17,13 7,13 7,21"></polyline>
                          <polyline points="7,3 7,8 15,8"></polyline>
                        </svg>
                        {tFunc('updateProfile')}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Address Section */}
            <div className="address-section">
              <div className="section-header">
                <h2 className="section-title">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  {tFunc('addresses')}
                </h2>
                <button 
                  className="add-address-btn"
                  onClick={this.toggleAddressForm}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="16"></line>
                    <line x1="8" y1="12" x2="16" y2="12"></line>
                  </svg>
                  {tFunc('addAddress')}
                </button>
              </div>

              <div className="address-list">
                {this.state.addresses.length === 0 ? (
                  <div className="no-addresses">
                    <div className="empty-state">
                      <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      <h3>{tFunc('noAddresses')}</h3>
                      <p>{tFunc('noAddressesDesc')}</p>
                    </div>
                  </div>
                ) : (
                  this.state.addresses.map((address, index) => (
                    <div key={index} className="address-card">
                      <div className="address-content">
                        <div className="address-header">
                          <div className="address-badge">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                              <polyline points="9,22 9,12 15,12 15,22"></polyline>
                            </svg>
                            {tFunc('address')} {index + 1}
                          </div>
                          <div className="address-actions">
                            <button 
                              className="edit-address-btn"
                              onClick={() => this.editAddress(index)}
                              title={tFunc('editAddress')}
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                              </svg>
                            </button>
                            <button 
                              className="delete-address-btn"
                              onClick={() => this.deleteAddress(index)}
                              title={tFunc('deleteAddress')}
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="3,6 5,6 21,6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                              </svg>
                            </button>
                          </div>
                        </div>
                        
                        <div className="address-info">
                          <div className="recipient-info">
                            <p className="recipient-name">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                              </svg>
                              {address.recipientName}
                            </p>
                            <p className="recipient-phone">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                              </svg>
                              {address.recipientPhone}
                            </p>
                          </div>
                          
                          <div className="address-details">
                            <p className="address-line">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                <circle cx="12" cy="10" r="3"></circle>
                              </svg>
                              {address.street}
                            </p>
                            <p className="address-location">
                              {address.ward}, {address.district}, {address.city}
                            </p>
                            <p className="address-postal">
                              {address.postalCode} - {address.country}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {this.state.showAddressForm && (
                <div className="address-form-overlay">
                  <div className="address-form">
                    <div className="form-header">
                      <h3 className="form-title">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        {this.state.editingAddressIndex >= 0 ? tFunc('editAddress') : tFunc('addAddress')}
                      </h3>
                      <button 
                        className="close-form-btn"
                        onClick={this.toggleAddressForm}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    </div>

                    <div className="form-content">
                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="recipientName">{tFunc('recipientName')}</label>
                          <div className="input-wrapper">
                            <input
                              type="text"
                              id="recipientName"
                              value={this.state.newAddress.recipientName}
                              onChange={(e) => this.handleAddressChange('recipientName', e.target.value)}
                              placeholder={tFunc('recipientName')}
                            />
                            <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                              <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                          </div>
                        </div>
                        
                        <div className="form-group">
                          <label htmlFor="recipientPhone">{tFunc('recipientPhone')}</label>
                          <div className="input-wrapper">
                            <input
                              type="text"
                              id="recipientPhone"
                              value={this.state.newAddress.recipientPhone}
                              onChange={(e) => this.handleAddressChange('recipientPhone', e.target.value)}
                              placeholder={tFunc('recipientPhone')}
                            />
                            <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                            </svg>
                          </div>
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="street">{tFunc('streetAddress')}</label>
                        <div className="input-wrapper">
                          <input
                            type="text"
                            id="street"
                            value={this.state.newAddress.street}
                            onChange={(e) => this.handleAddressChange('street', e.target.value)}
                            placeholder={tFunc('streetAddress')}
                          />
                          <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                          </svg>
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="ward">{tFunc('ward')}</label>
                          <input
                            type="text"
                            id="ward"
                            value={this.state.newAddress.ward}
                            onChange={(e) => this.handleAddressChange('ward', e.target.value)}
                            placeholder={tFunc('ward')}
                          />
                        </div>
                        
                        <div className="form-group">
                          <label htmlFor="district">{tFunc('district')}</label>
                          <input
                            type="text"
                            id="district"
                            value={this.state.newAddress.district}
                            onChange={(e) => this.handleAddressChange('district', e.target.value)}
                            placeholder={tFunc('district')}
                          />
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="city">{tFunc('city')}</label>
                          <input
                            type="text"
                            id="city"
                            value={this.state.newAddress.city}
                            onChange={(e) => this.handleAddressChange('city', e.target.value)}
                            placeholder={tFunc('city')}
                          />
                        </div>
                        
                        <div className="form-group">
                          <label htmlFor="postalCode">{tFunc('postalCode')}</label>
                          <input
                            type="text"
                            id="postalCode"
                            value={this.state.newAddress.postalCode}
                            onChange={(e) => this.handleAddressChange('postalCode', e.target.value)}
                            placeholder={tFunc('postalCode')}
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="country">{tFunc('country')}</label>
                        <input
                          type="text"
                          id="country"
                          value={this.state.newAddress.country}
                          onChange={(e) => this.handleAddressChange('country', e.target.value)}
                          placeholder={tFunc('country')}
                        />
                      </div>
                    </div>

                    <div className="form-actions">
                      <button 
                        className="save-address-btn"
                        onClick={this.saveAddress}
                        disabled={this.state.isLoading}
                      >
                        {this.state.isLoading ? (
                          <>
                            <div className="spinner"></div>
                            {tFunc('saving')}
                          </>
                        ) : (
                          <>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                              <polyline points="17,21 17,13 7,13 7,21"></polyline>
                              <polyline points="7,3 7,8 15,8"></polyline>
                            </svg>
                            {tFunc('saveAddress')}
                          </>
                        )}
                      </button>
                      <button 
                        className="cancel-btn"
                        onClick={this.toggleAddressForm}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                        {tFunc('cancel')}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        <style jsx>{`
          .myprofile-page {
            background: #fafafa;
            min-height: 100vh;
            padding: 20px 0;
          }

          .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 0 20px;
          }

          /* Notification */
          .notification-toast {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 24px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            z-index: 1000;
            animation: slideInRight 0.3s ease-out;
          }

          .notification-toast.success {
            background: #10b981;
            color: white;
          }

          .notification-toast.error {
            background: #ef4444;
            color: white;
          }

          .notification-content {
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .notification-icon {
            font-size: 20px;
          }

          .notification-text {
            font-weight: 500;
          }

          @keyframes slideInRight {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }

          /* Page Header */
          .page-header {
            text-align: center;
            margin-bottom: 40px;
          }

          .page-title {
            font-size: 2.5rem;
            font-weight: 300;
            color: #2c3e50;
            margin-bottom: 10px;
          }

          .page-subtitle {
            color: #666;
            font-size: 1.1rem;
          }

          /* Profile Card */
          .profile-card {
            background: white;
            border-radius: 16px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
            overflow: hidden;
          }

          .profile-avatar {
            background: linear-gradient(135deg, #c8860d 0%, #f4c430 100%);
            padding: 40px;
            text-align: center;
            color: white;
          }

          .avatar-circle {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            background: rgba(255,255,255,0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
            border: 3px solid rgba(255,255,255,0.3);
          }

          .avatar-text {
            font-size: 2.5rem;
            font-weight: 600;
          }

          .avatar-info h3 {
            margin: 0 0 8px 0;
            font-size: 1.5rem;
            font-weight: 500;
          }

          .avatar-info p {
            margin: 0;
            opacity: 0.9;
            font-size: 1rem;
          }

          /* Profile Form */
          .profile-form {
            padding: 40px;
          }

          .form-sections {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            margin-bottom: 40px;
          }

          .form-section {
            display: flex;
            flex-direction: column;
            gap: 20px;
          }

          .section-title {
            color: #2c3e50;
            font-size: 1.2rem;
            font-weight: 600;
            margin: 0 0 10px 0;
            padding-bottom: 10px;
            border-bottom: 2px solid #c8860d;
          }

          .form-group {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }

          label {
            font-weight: 600;
            color: #2c3e50;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .input-wrapper {
            position: relative;
          }

          input {
            width: 100%;
            padding: 16px 50px 16px 16px;
            border: 2px solid #e1e8ed;
            border-radius: 12px;
            font-size: 16px;
            transition: all 0.3s ease;
            background: #fafafa;
            box-sizing: border-box;
          }

          input:focus {
            outline: none;
            border-color: #c8860d;
            background: white;
            box-shadow: 0 0 0 3px rgba(200, 134, 13, 0.1);
          }

          .input-icon {
            position: absolute;
            right: 16px;
            top: 50%;
            transform: translateY(-50%);
            color: #666;
            pointer-events: none;
          }

          .password-toggle {
            position: absolute;
            right: 16px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            cursor: pointer;
            color: #666;
            padding: 4px;
            border-radius: 4px;
            transition: all 0.2s;
          }

          .password-toggle:hover {
            color: #c8860d;
            background: rgba(200, 134, 13, 0.1);
          }

          /* Form Actions */
          .form-actions {
            display: flex;
            justify-content: center;
            padding-top: 20px;
            border-top: 1px solid #eee;
          }

          .update-btn {
            background: #c8860d;
            color: white;
            border: none;
            padding: 16px 32px;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 10px;
            min-width: 180px;
            justify-content: center;
          }

          .update-btn:hover:not(:disabled) {
            background: #a86e0b;
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(200, 134, 13, 0.3);
          }

          .update-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
          }

          /* Address Section */
          .address-section {
            background: white;
            border-radius: 20px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
            padding: 30px;
            margin-top: 30px;
            backdrop-filter: blur(10px);
          }

          .section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #f8f9fa;
          }

          .section-title {
            font-size: 1.5rem;
            font-weight: 700;
            color: #2c3e50;
            display: flex;
            align-items: center;
            gap: 10px;
            margin: 0;
          }

          .section-title svg {
            color: #c8860d;
          }

          .add-address-btn {
            background: linear-gradient(135deg, #c8860d 0%, #ffd700 100%);
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 15px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 4px 15px rgba(200, 134, 13, 0.3);
          }

          .add-address-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(200, 134, 13, 0.4);
          }

          .address-list {
            display: grid;
            gap: 20px;
            margin-bottom: 20px;
          }

          .no-addresses {
            text-align: center;
            padding: 60px 20px;
          }

          .empty-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 20px;
          }

          .empty-state svg {
            color: #c8860d;
            opacity: 0.6;
          }

          .empty-state h3 {
            color: #2c3e50;
            font-size: 1.3rem;
            font-weight: 600;
            margin: 0;
          }

          .empty-state p {
            color: #6c757d;
            font-size: 1rem;
            margin: 0;
          }

          .address-card {
            background: #f8f9fa;
            border: 2px solid #e9ecef;
            border-radius: 15px;
            padding: 25px;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
          }

          .address-card:hover {
            border-color: #c8860d;
            background: white;
            box-shadow: 0 6px 20px rgba(200, 134, 13, 0.1);
          }

          .address-content {
            position: relative;
            z-index: 1;
          }

          .address-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
          }

          .address-badge {
            background: linear-gradient(135deg, #c8860d 0%, #ffd700 100%);
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 0.9rem;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .address-actions {
            display: flex;
            gap: 10px;
          }

          .edit-address-btn, .delete-address-btn {
            background: none;
            border: none;
            padding: 8px;
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .edit-address-btn {
            color: #17a2b8;
            background: rgba(23, 162, 184, 0.1);
          }

          .edit-address-btn:hover {
            background: rgba(23, 162, 184, 0.2);
            transform: translateY(-1px);
          }

          .delete-address-btn {
            color: #dc3545;
            background: rgba(220, 53, 69, 0.1);
          }

          .delete-address-btn:hover {
            background: rgba(220, 53, 69, 0.2);
            transform: translateY(-1px);
          }

          .address-info {
            display: grid;
            gap: 15px;
          }

          .recipient-info {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }

          .recipient-name, .recipient-phone {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 1rem;
            font-weight: 600;
            color: #2c3e50;
            margin: 0;
          }

          .recipient-name svg, .recipient-phone svg {
            color: #c8860d;
          }

          .address-details {
            display: flex;
            flex-direction: column;
            gap: 5px;
          }

          .address-line {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 1rem;
            font-weight: 600;
            color: #2c3e50;
            margin: 0;
          }

          .address-line svg {
            color: #c8860d;
          }

          .address-location, .address-postal {
            font-size: 0.95rem;
            color: #6c757d;
            margin: 0;
            padding-left: 26px;
          }

          /* Address Form Styles */
          .address-form-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            backdrop-filter: blur(5px);
          }

          .address-form {
            background: white;
            border-radius: 20px;
            max-width: 600px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            animation: slideIn 0.3s ease;
          }

          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(-30px) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          .form-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 30px 30px 20px;
            border-bottom: 2px solid #f8f9fa;
          }

          .form-title {
            font-size: 1.5rem;
            font-weight: 700;
            color: #2c3e50;
            display: flex;
            align-items: center;
            gap: 10px;
            margin: 0;
          }

          .form-title svg {
            color: #c8860d;
          }

          .close-form-btn {
            background: none;
            border: none;
            padding: 10px;
            border-radius: 10px;
            cursor: pointer;
            color: #6c757d;
            transition: all 0.3s ease;
          }

          .close-form-btn:hover {
            background: rgba(108, 117, 125, 0.1);
            color: #dc3545;
          }

          .form-content {
            padding: 30px;
          }

          .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 20px;
          }

          .form-group {
            margin-bottom: 20px;
          }

          .form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: #2c3e50;
            font-size: 1rem;
          }

          .input-wrapper {
            position: relative;
          }

          .form-group input {
            width: 100%;
            padding: 15px 20px;
            border: 2px solid #e9ecef;
            border-radius: 15px;
            font-size: 1rem;
            transition: all 0.3s ease;
            background: #f8f9fa;
            color: #2c3e50;
          }

          .form-group input:focus {
            outline: none;
            border-color: #c8860d;
            background: white;
            box-shadow: 0 0 0 3px rgba(200, 134, 13, 0.1);
          }

          .input-icon {
            position: absolute;
            right: 15px;
            top: 50%;
            transform: translateY(-50%);
            color: #6c757d;
            pointer-events: none;
          }

          .form-group input:focus + .input-icon {
            color: #c8860d;
          }

          .form-actions {
            display: flex;
            gap: 15px;
            padding: 20px 30px 30px;
            border-top: 2px solid #f8f9fa;
          }

          .save-address-btn {
            background: linear-gradient(135deg, #c8860d 0%, #ffd700 100%);
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 15px;
            font-size: 1.1rem;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 10px;
            box-shadow: 0 6px 20px rgba(200, 134, 13, 0.3);
            flex: 1;
            justify-content: center;
          }

          .save-address-btn:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(200, 134, 13, 0.4);
          }

          .save-address-btn:disabled {
            opacity: 0.7;
            cursor: not-allowed;
          }

          .cancel-btn {
            background: linear-gradient(135deg, #6c757d 0%, #495057 100%);
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 15px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 10px;
            box-shadow: 0 4px 15px rgba(108, 117, 125, 0.2);
          }

          .cancel-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(108, 117, 125, 0.3);
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

          /* Responsive Design */
          @media (max-width: 768px) {
            .address-section {
              padding: 20px;
            }

            .section-header {
              flex-direction: column;
              gap: 15px;
              align-items: stretch;
            }

            .add-address-btn {
              justify-content: center;
            }

            .address-card {
              padding: 20px;
            }

            .address-header {
              flex-direction: column;
              gap: 15px;
              align-items: stretch;
            }

            .address-actions {
              justify-content: center;
            }

            .recipient-info {
              text-align: center;
            }

            .address-form {
              width: 95%;
            }

            .form-header {
              padding: 20px;
            }

            .form-content {
              padding: 20px;
            }

            .form-row {
              grid-template-columns: 1fr;
              gap: 0;
            }

            .form-actions {
              padding: 15px 20px 20px;
              flex-direction: column;
            }

            .save-address-btn, .cancel-btn {
              width: 100%;
              justify-content: center;
            }
          }

          /* ...existing styles... */
        `}</style>
      </div>
    );
  }
  componentDidMount() {
    if (this.context.customer) {
      this.setState({
        txtUsername: this.context.customer.username,
        txtPassword: this.context.customer.password,
        txtName: this.context.customer.name,
        txtPhone: this.context.customer.phone,
        txtEmail: this.context.customer.email,
        addresses: this.context.customer.addresses || []
      });
    }
  }
  // event-handlers
  btnUpdateClick(e) {
    e.preventDefault();
    
    const errors = this.validateForm();
    if (errors.length > 0) {
      this.showNotification(errors.join('. '), 'error');
      return;
    }

    this.setState({ isLoading: true });

    const { txtUsername, txtPassword, txtName, txtPhone, txtEmail } = this.state;
    const customer = { 
      username: txtUsername, 
      password: txtPassword, 
      name: txtName, 
      phone: txtPhone, 
      email: txtEmail 
    };
    
    this.apiPutCustomer(this.context.customer._id, customer);
  }

  // apis
  apiPutCustomer(id, customer) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.put('/api/customer/customers/' + id, customer, config).then((res) => {
      const result = res.data;
      this.setState({ isLoading: false });
      
      if (result) {
        this.showNotification('Profile updated successfully!', 'success');
        this.context.setCustomer(result);
      } else {
        this.showNotification('Failed to update profile. Please try again.', 'error');
      }
    }).catch((error) => {
      this.setState({ isLoading: false });
      this.showNotification('An error occurred while updating profile.', 'error');
      console.error('Update error:', error);
    });
  }
}

export default withLanguage(Myprofile);