import React, { Component } from 'react';
import axios from 'axios';
import { withLanguage } from './LanguageSwitcher';

class ActivateAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isSuccess: false,
      message: '',
      error: '',
      showEmailConfirmation: false
    };
  }

  componentDidMount() {
    // Check if there are URL parameters for activation
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const token = urlParams.get('token');

    if (id && token) {
      // If there are parameters, proceed with activation
      this.activateAccount();
    } else {
      // If no parameters, show email confirmation message
      this.setState({
        isLoading: false,
        showEmailConfirmation: true
      });
    }
  }

  activateAccount = async () => {
    try {
      // Get id and token from URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      const id = urlParams.get('id');
      const token = urlParams.get('token');

      if (!id || !token) {
        this.setState({
          isLoading: false,
          isSuccess: false,
          error: 'Invalid activation link'
        });
        return;
      }

      // Call activation API
      const response = await axios.post('/api/customer/active', {
        id: id,
        token: token
      });

      if (response.data && response.data._id) {
        this.setState({
          isLoading: false,
          isSuccess: true,
          message: 'Account activated successfully!'
        });
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          window.location.href = '/login';
        }, 3000);
      } else {
        this.setState({
          isLoading: false,
          isSuccess: false,
          error: 'Invalid activation link or account already activated'
        });
      }
    } catch (error) {
      console.error('Activation error:', error);
      this.setState({
        isLoading: false,
        isSuccess: false,
        error: 'Activation failed. Please try again or contact support.'
      });
    }
  };

  render() {
    const { t } = this.props;
    const { isLoading, isSuccess, message, error } = this.state;

    return (
      <div className="activate-page">
        <div className="activate-container">
          <div className="activate-header">
            <h1>PANJ Jewelry</h1>
            <h2>{t('accountActivation')}</h2>
          </div>

          <div className="activate-content">
            {isLoading && (
              <div className="loading">
                <div className="spinner"></div>
                <p>{t('activatingAccount')}</p>
              </div>
            )}

            {!isLoading && showEmailConfirmation && (
              <div className="email-confirmation">
                <div className="email-icon">📧</div>
                <h3>{t('accountActivation')}</h3>
                <p>{t('emailConfirmationMessage')}</p>
                <div className="confirmation-actions">
                  <button 
                    onClick={() => window.location.href = '/login'}
                    className="btn btn-primary"
                  >
                    {t('goToLogin')}
                  </button>
                  <button 
                    onClick={() => window.location.href = '/signup'}
                    className="btn btn-secondary"
                  >
                    {t('signUpAgain')}
                  </button>
                </div>
              </div>
            )}

            {!isLoading && !showEmailConfirmation && isSuccess && (
              <div className="success">
                <div className="success-icon">✅</div>
                <h3>{t('activationSuccess')}</h3>
                <p>{message}</p>
                <p>{t('redirectingToLogin')}</p>
                <div className="loading-bar">
                  <div className="loading-progress"></div>
                </div>
              </div>
            )}

            {!isLoading && !showEmailConfirmation && !isSuccess && (
              <div className="error">
                <div className="error-icon">❌</div>
                <h3>{t('activationFailed')}</h3>
                <p>{error}</p>
                <div className="error-actions">
                  <button 
                    onClick={() => window.location.href = '/signup'}
                    className="btn btn-primary"
                  >
                    {t('signUpAgain')}
                  </button>
                  <button 
                    onClick={() => window.location.href = '/login'}
                    className="btn btn-secondary"
                  >
                    {t('goToLogin')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <style jsx>{`
          .activate-page {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            padding: 20px;
          }

          .activate-container {
            background: white;
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            max-width: 500px;
            width: 100%;
            text-align: center;
          }

          .activate-header h1 {
            color: #c8860d;
            font-size: 2rem;
            margin-bottom: 10px;
            font-weight: 300;
            letter-spacing: 2px;
          }

          .activate-header h2 {
            color: #666;
            font-size: 1.2rem;
            margin-bottom: 30px;
            font-weight: 400;
          }

          .loading {
            padding: 20px;
          }

          .email-confirmation {
            padding: 30px;
            text-align: center;
          }

          .email-icon {
            font-size: 4rem;
            margin-bottom: 20px;
          }

          .email-confirmation h3 {
            color: #c8860d;
            margin-bottom: 20px;
            font-size: 1.5rem;
          }

          .email-confirmation p {
            color: #666;
            margin-bottom: 30px;
            font-size: 1.1rem;
            line-height: 1.6;
          }

          .confirmation-actions {
            display: flex;
            gap: 15px;
            justify-content: center;
            flex-wrap: wrap;
          }

          .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #f3f3f3;
            border-top: 4px solid #c8860d;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          .success {
            padding: 20px;
          }

          .success-icon {
            font-size: 3rem;
            margin-bottom: 20px;
          }

          .success h3 {
            color: #28a745;
            margin-bottom: 15px;
          }

          .loading-bar {
            width: 100%;
            height: 4px;
            background: #f0f0f0;
            border-radius: 2px;
            overflow: hidden;
            margin-top: 20px;
          }

          .loading-progress {
            height: 100%;
            background: #c8860d;
            width: 0%;
            animation: progress 3s linear forwards;
          }

          @keyframes progress {
            0% { width: 0%; }
            100% { width: 100%; }
          }

          .error {
            padding: 20px;
          }

          .error-icon {
            font-size: 3rem;
            margin-bottom: 20px;
          }

          .error h3 {
            color: #dc3545;
            margin-bottom: 15px;
          }

          .error-actions {
            margin-top: 30px;
            display: flex;
            gap: 15px;
            justify-content: center;
          }

          .btn {
            padding: 12px 24px;
            border: none;
            border-radius: 25px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-block;
          }

          .btn-primary {
            background: #c8860d;
            color: white;
          }

          .btn-primary:hover {
            background: #a86e0b;
            transform: translateY(-2px);
          }

          .btn-secondary {
            background: #6c757d;
            color: white;
          }

          .btn-secondary:hover {
            background: #5a6268;
            transform: translateY(-2px);
          }
        `}</style>
      </div>
    );
  }
}

export default withLanguage(ActivateAccount);
