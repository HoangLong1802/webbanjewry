import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withLanguage } from './LanguageSwitcher';
import Notification from './NotificationComponent';
import SocialLogin from './SocialLogin';

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      txtUsername: '',
      txtPassword: '',
      txtConfirmPassword: '',
      txtName: '',
      txtPhone: '',
      txtEmail: '',
      isLoading: false,
      showPassword: false,
      showConfirmPassword: false,
      agreeToTerms: false,
      subscribeNewsletter: true,
      notification: {
        show: false,
        type: 'info',
        title: '',
        message: ''
      }
    };
  }

  render() {
    const { t } = this.props;
    
    return (
      <div className="auth-page">
        <div className="auth-container signup">
          <div className="auth-header">
            <Link to="/home" className="auth-logo">
              <h1>PANJ</h1>
            </Link>
            <h2 className="auth-title">{t('createAccount')}</h2>
            <p className="auth-subtitle">{t('signupSubtitle')}</p>
          </div>

          <form className="auth-form" onSubmit={(e) => this.btnSignupClick(e)}>
            <div className="form-row">
              <div className="form-group half">
                <label htmlFor="name" className="form-label">{t('fullName')}</label>
                <input
                  type="text"
                  id="name"
                  className="form-input"
                  value={this.state.txtName}
                  onChange={(e) => this.setState({ txtName: e.target.value })}
                  placeholder={t('fullNamePlaceholder')}
                  required
                />
              </div>
              <div className="form-group half">
                <label htmlFor="username" className="form-label">{t('username')}</label>
                <input
                  type="text"
                  id="username"
                  className="form-input"
                  value={this.state.txtUsername}
                  onChange={(e) => this.setState({ txtUsername: e.target.value })}
                  placeholder={t('usernamePlaceholder')}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group half">
                <label htmlFor="email" className="form-label">{t('email')}</label>
                <input
                  type="email"
                  id="email"
                  className="form-input"
                  value={this.state.txtEmail}
                  onChange={(e) => this.setState({ txtEmail: e.target.value })}
                  placeholder={t('emailPlaceholder')}
                  required
                />
              </div>
              <div className="form-group half">
                <label htmlFor="phone" className="form-label">{t('phone')}</label>
                <input
                  type="tel"
                  id="phone"
                  className="form-input"
                  value={this.state.txtPhone}
                  onChange={(e) => this.setState({ txtPhone: e.target.value })}
                  placeholder={t('phonePlaceholder')}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">{t('password')}</label>
              <div className="password-input-container">
                <input
                  type={this.state.showPassword ? "text" : "password"}
                  id="password"
                  className="form-input"
                  value={this.state.txtPassword}
                  onChange={(e) => this.setState({ txtPassword: e.target.value })}
                  placeholder={t('passwordPlaceholder')}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => this.setState({ showPassword: !this.state.showPassword })}
                >
                  {this.state.showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">{t('confirmPassword')}</label>
              <div className="password-input-container">
                <input
                  type={this.state.showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  className="form-input"
                  value={this.state.txtConfirmPassword}
                  onChange={(e) => this.setState({ txtConfirmPassword: e.target.value })}
                  placeholder={t('confirmPasswordPlaceholder')}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => this.setState({ showConfirmPassword: !this.state.showConfirmPassword })}
                >
                  {this.state.showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={this.state.agreeToTerms}
                  onChange={(e) => this.setState({ agreeToTerms: e.target.checked })}
                  required
                />
                <span className="checkmark"></span>
                {t('agreeToTerms')} <Link to="/terms" className="terms-link">{t('termsAndConditions')}</Link>
              </label>

              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={this.state.subscribeNewsletter}
                  onChange={(e) => this.setState({ subscribeNewsletter: e.target.checked })}
                />
                <span className="checkmark"></span>
                {t('subscribeNewsletter')}
              </label>
            </div>

            <button
              type="submit"
              className={`auth-btn primary ${this.state.isLoading ? 'loading' : ''}`}
              disabled={this.state.isLoading || !this.state.agreeToTerms}
            >
              {this.state.isLoading ? t('creatingAccount') : t('createAccount')}
            </button>
          </form>

          <SocialLogin />

          <div className="auth-footer">
            <p>{t('alreadyHaveAccount')} <Link to="/login" className="auth-link">{t('signIn')}</Link></p>
          </div>
        </div>
        
        <Notification
          show={this.state.notification.show}
          type={this.state.notification.type}
          title={this.state.notification.title}
          message={this.state.notification.message}
          onHide={this.hideNotification}
        />
      </div>
    );
  }

  showNotification = (type, title, message) => {
    this.setState({
      notification: {
        show: true,
        type,
        title,
        message
      }
    });
  };

  hideNotification = () => {
    this.setState({
      notification: {
        ...this.state.notification,
        show: false
      }
    });
  };

  btnSignupClick(e) {
    e.preventDefault();
    const { t } = this.props;
    
    if (this.state.txtPassword !== this.state.txtConfirmPassword) {
      this.showNotification('error', t('error'), t('passwordMismatch'));
      return;
    }

    if (!this.state.agreeToTerms) {
      this.showNotification('warning', t('warning'), t('mustAgreeToTerms'));
      return;
    }

    this.setState({ isLoading: true });
    
    const account = {
      username: this.state.txtUsername,
      password: this.state.txtPassword,
      name: this.state.txtName,
      phone: this.state.txtPhone,
      email: this.state.txtEmail
    };
    
    this.apiSignup(account);
  }

  apiSignup(account) {
    const { t } = this.props;
    axios.post('/api/customer/signup', account).then((res) => {
      const result = res.data;
      this.setState({ isLoading: false });
      
      if (result.success === true) {
        this.showNotification('success', t('success'), t('signupSuccess'));
        setTimeout(() => {
          window.location.href = '/active';
        }, 2000);
      } else {
        // Handle specific error messages
        let errorMessage = result.message || t('signupFailed');
        
        if (result.message === 'Username already exists') {
          errorMessage = t('usernameExists');
        } else if (result.message === 'Email already exists') {
          errorMessage = t('emailExists');
        } else if (result.message === 'Exists username or email') {
          errorMessage = t('usernameExists') + ' ' + t('or') + ' ' + t('emailExists');
        }
        
        this.showNotification('error', t('error'), errorMessage);
      }
    }).catch((error) => {
      this.setState({ isLoading: false });
      console.error('Signup error:', error);
      
      // Better error handling
      if (error.response) {
        // Server responded with error status
        const errorMessage = error.response.data?.message || t('signupError');
        this.showNotification('error', t('error'), errorMessage);
      } else if (error.request) {
        // Network error
        this.showNotification('error', t('networkError'), t('checkConnection'));
      } else {
        // Other error
        this.showNotification('error', t('error'), t('signupError'));
      }
    });
  }
}

export default withLanguage(Signup);