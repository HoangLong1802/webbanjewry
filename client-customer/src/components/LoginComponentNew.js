import axios from 'axios';
import React, { Component } from 'react';
import { Navigate, Link } from 'react-router-dom';
import MyContext from '../contexts/MyContext';
import { withLanguage } from './LanguageSwitcher';

class Login extends Component {
  static contextType = MyContext;
  constructor(props) {
    super(props);
    this.state = {
      txtUsername: '',
      txtPassword: '',
      isLoading: false,
      showPassword: false,
      rememberMe: false,
      notification: null, // For beautiful notifications
      notificationTimeout: null
    };
  }

  componentDidMount() {
    // Load saved credentials if remember me was checked
    const savedCredentials = localStorage.getItem('rememberMeCredentials');
    if (savedCredentials) {
      const { username, password, rememberMe } = JSON.parse(savedCredentials);
      this.setState({
        txtUsername: username || '',
        txtPassword: password || '',
        rememberMe: rememberMe || false
      });
    }
  }

  componentWillUnmount() {
    // Clear notification timeout on unmount
    if (this.state.notificationTimeout) {
      clearTimeout(this.state.notificationTimeout);
    }
  }

  // Show beautiful notification
  showNotification = (message, type = 'error') => {
    // Clear existing timeout
    if (this.state.notificationTimeout) {
      clearTimeout(this.state.notificationTimeout);
    }

    this.setState({ notification: { message, type } });
    
    const timeout = setTimeout(() => {
      this.setState({ notification: null, notificationTimeout: null });
    }, 5000);

    this.setState({ notificationTimeout: timeout });
  };

  dismissNotification = () => {
    if (this.state.notificationTimeout) {
      clearTimeout(this.state.notificationTimeout);
    }
    this.setState({ notification: null, notificationTimeout: null });
  };

  render() {
    const { t } = this.props;
    const { notification } = this.state;
    
    if (this.context.token === '') {
      return (
        <div className="auth-page">
          {/* Beautiful Notification */}
          {notification && (
            <div className={`notification notification-${notification.type}`}>
              <div className="notification-content">
                <span className="notification-icon">
                  {notification.type === 'error' ? '⚠️' : 
                   notification.type === 'success' ? '✅' : 
                   notification.type === 'warning' ? '⚠️' : 'ℹ️'}
                </span>
                <span className="notification-message">{notification.message}</span>
                <button className="notification-close" onClick={this.dismissNotification}>×</button>
              </div>
            </div>
          )}

          <div className="auth-container">
            <div className="auth-header">
              <Link to="/home" className="auth-logo">
                <h1>PANJ</h1>
              </Link>
              <h2 className="auth-title">{t('login')}</h2>
              <p className="auth-subtitle">{t('loginSubtitle')}</p>
            </div>

            <form className="auth-form" onSubmit={(e) => this.btnLoginClick(e)}>
              <div className="form-group">
                <label htmlFor="username" className="form-label">{t('username')}</label>
                <input
                  id="username"
                  type="text"
                  value={this.state.txtUsername}
                  onChange={(e) => this.setState({ txtUsername: e.target.value })}
                  className="form-input"
                  placeholder={t('usernamePlaceholder')}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">{t('password')}</label>
                <div className="password-input-container">
                  <input
                    id="password"
                    type={this.state.showPassword ? 'text' : 'password'}
                    value={this.state.txtPassword}
                    onChange={(e) => this.setState({ txtPassword: e.target.value })}
                    className="form-input"
                    placeholder={t('passwordPlaceholder')}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => this.setState({ showPassword: !this.state.showPassword })}
                  >
                    {this.state.showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <div className="form-options">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={this.state.rememberMe}
                    onChange={(e) => this.handleRememberMeChange(e.target.checked)}
                  />
                  <span className="checkbox-text">{t('rememberMe')}</span>
                </label>
                <Link to="/forgot-password" className="forgot-password">
                  {t('forgotPassword')}
                </Link>
              </div>

              <button 
                type="submit" 
                className="auth-button"
                disabled={this.state.isLoading}
              >
                {this.state.isLoading ? t('signingIn') : t('login')}
              </button>
            </form>

            <div className="auth-footer">
              <p>{t('dontHaveAccount')} <Link to="/signup">{t('signUp')}</Link></p>
            </div>
          </div>

          <style jsx>{`
            .notification {
              position: fixed;
              top: 20px;
              right: 20px;
              z-index: 1000;
              max-width: 400px;
              border-radius: 8px;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
              animation: slideIn 0.3s ease-out;
            }

            .notification-error {
              background: #fee;
              border-left: 4px solid #e53e3e;
            }

            .notification-success {
              background: #f0fff4;
              border-left: 4px solid #38a169;
            }

            .notification-warning {
              background: #fffbf0;
              border-left: 4px solid #dd6b20;
            }

            .notification-info {
              background: #f0f9ff;
              border-left: 4px solid #3182ce;
            }

            .notification-content {
              display: flex;
              align-items: center;
              padding: 12px 16px;
              gap: 12px;
            }

            .notification-icon {
              font-size: 20px;
              flex-shrink: 0;
            }

            .notification-message {
              flex: 1;
              font-size: 14px;
              color: #2d3748;
            }

            .notification-close {
              background: none;
              border: none;
              font-size: 18px;
              cursor: pointer;
              padding: 0;
              color: #718096;
              flex-shrink: 0;
            }

            .notification-close:hover {
              color: #2d3748;
            }

            @keyframes slideIn {
              from {
                transform: translateX(100%);
                opacity: 0;
              }
              to {
                transform: translateX(0);
                opacity: 1;
              }
            }

            .auth-page {
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
              padding: 20px;
            }

            .auth-container {
              background: white;
              border-radius: 20px;
              padding: 40px;
              box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
              max-width: 400px;
              width: 100%;
            }

            .auth-header {
              text-align: center;
              margin-bottom: 30px;
            }

            .auth-logo h1 {
              color: #c8860d;
              font-size: 2.5rem;
              margin-bottom: 10px;
              font-weight: 300;
              letter-spacing: 3px;
              text-decoration: none;
            }

            .auth-title {
              color: #2d3748;
              font-size: 1.8rem;
              margin-bottom: 8px;
              font-weight: 600;
            }

            .auth-subtitle {
              color: #718096;
              font-size: 1rem;
              margin-bottom: 0;
            }

            .form-group {
              margin-bottom: 20px;
            }

            .form-label {
              display: block;
              color: #2d3748;
              font-weight: 500;
              margin-bottom: 8px;
              font-size: 14px;
            }

            .form-input {
              width: 100%;
              padding: 12px 16px;
              border: 2px solid #e2e8f0;
              border-radius: 8px;
              font-size: 16px;
              transition: all 0.3s ease;
              background: #f8fafc;
            }

            .form-input:focus {
              outline: none;
              border-color: #c8860d;
              background: white;
              box-shadow: 0 0 0 3px rgba(200, 134, 13, 0.1);
            }

            .password-input-container {
              position: relative;
            }

            .password-toggle {
              position: absolute;
              right: 12px;
              top: 50%;
              transform: translateY(-50%);
              background: none;
              border: none;
              cursor: pointer;
              font-size: 16px;
              color: #718096;
              padding: 4px;
            }

            .password-toggle:hover {
              color: #c8860d;
            }

            .form-options {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 25px;
            }

            .checkbox-label {
              display: flex;
              align-items: center;
              cursor: pointer;
              font-size: 14px;
              color: #4a5568;
            }

            .checkbox-label input {
              margin-right: 8px;
            }

            .forgot-password {
              color: #c8860d;
              text-decoration: none;
              font-size: 14px;
              font-weight: 500;
            }

            .forgot-password:hover {
              text-decoration: underline;
            }

            .auth-button {
              width: 100%;
              background: #c8860d;
              color: white;
              border: none;
              padding: 14px 24px;
              border-radius: 8px;
              font-size: 16px;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.3s ease;
              margin-bottom: 20px;
            }

            .auth-button:hover:not(:disabled) {
              background: #a86e0b;
              transform: translateY(-2px);
              box-shadow: 0 4px 12px rgba(200, 134, 13, 0.4);
            }

            .auth-button:disabled {
              opacity: 0.6;
              cursor: not-allowed;
            }

            .auth-footer {
              text-align: center;
              color: #718096;
              font-size: 14px;
            }

            .auth-footer a {
              color: #c8860d;
              text-decoration: none;
              font-weight: 500;
            }

            .auth-footer a:hover {
              text-decoration: underline;
            }

            @media (max-width: 480px) {
              .auth-container {
                padding: 30px 20px;
              }
              
              .auth-logo h1 {
                font-size: 2rem;
              }
            }
          `}</style>
        </div>
      );
    } else {
      return <Navigate to="/home" />;
    }
  }

  btnLoginClick(e) {
    e.preventDefault();
    const { t } = this.props;
    const username = this.state.txtUsername.trim();
    const password = this.state.txtPassword.trim();
    
    if (username && password) {
      this.setState({ isLoading: true });
      const account = { username: username, password: password };
      this.apiLogin(account);
    } else {
      this.showNotification(t('pleaseInputCredentials'), 'warning');
    }
  }

  apiLogin(account) {
    const { t } = this.props;
    axios.post('/api/customer/login', account).then((res) => {
      const result = res.data;
      this.setState({ isLoading: false });
      
      if (result.success === true) {
        // Handle remember me functionality
        if (this.state.rememberMe) {
          // Save credentials to localStorage
          const credentialsToSave = {
            username: this.state.txtUsername,
            password: this.state.txtPassword,
            rememberMe: true
          };
          localStorage.setItem('rememberMeCredentials', JSON.stringify(credentialsToSave));
        } else {
          // Remove saved credentials if remember me is unchecked
          localStorage.removeItem('rememberMeCredentials');
        }

        this.showNotification(t('loginSuccess'), 'success');
        
        // Delay navigation to show success message
        setTimeout(() => {
          this.context.setToken(result.token);
          this.context.setCustomer(result.customer);
        }, 1000);
        
      } else {
        // Show specific error message
        let errorMessage = result.message || t('loginFailed');
        if (result.message === 'Incorrect username or password') {
          errorMessage = t('incorrectCredentials');
        } else if (result.message === 'Account is deactive') {
          errorMessage = t('accountDeactivated');
        }
        
        this.showNotification(errorMessage, 'error');
      }
    }).catch((error) => {
      this.setState({ isLoading: false });
      console.error('Login error:', error);
      this.showNotification(t('loginError'), 'error');
    });
  }

  handleRememberMeChange = (checked) => {
    this.setState({ rememberMe: checked });
    
    // If unchecked, immediately remove saved credentials
    if (!checked) {
      localStorage.removeItem('rememberMeCredentials');
    }
  };
}

export default withLanguage(Login);
