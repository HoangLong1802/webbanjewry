import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import { useLanguage } from '../contexts/LanguageContext';

class Login extends Component {
  static contextType = MyContext;
  
  constructor(props) {
    super(props);
    this.state = {
      txtUsername: '',
      txtPassword: '',
      loading: false,
      error: ''
    };
  }

  render() {
    if (this.context.token === '') {
      return (
        <LoginWithLanguage 
          state={this.state}
          setState={(newState) => this.setState(newState)}
          onLogin={(e) => this.btnLoginClick(e)}
        />
      );
    }
    return (<div />);
  }

  // event-handlers
  btnLoginClick(e) {
    e.preventDefault();
    const username = this.state.txtUsername;
    const password = this.state.txtPassword;
    
    if (username && password) {
      this.setState({ loading: true, error: '' });
      const account = { username: username, password: password };
      this.apiLogin(account);
    } else {
      this.setState({ error: 'Please enter both username and password' });
    }
  }

  // apis
  apiLogin(account) {
    axios.post('/api/admin/login', account).then((res) => {
      const result = res.data;
      if (result.success === true) {
        this.context.setToken(result.token);
        this.context.setUsername(account.username);
      } else {
        this.setState({ 
          loading: false, 
          error: result.message || 'Login failed. Please try again.' 
        });
      }
    }).catch((error) => {
      this.setState({ 
        loading: false, 
        error: 'Connection failed. Please check your internet connection and try again.' 
      });
    });
  }
}

// Functional component to use hooks
const LoginWithLanguage = ({ state, setState, onLogin }) => {
  const { t } = useLanguage();
  
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <div className="login-logo-icon">P</div>
            <h1>PANJ</h1>
          </div>
          <h2>{t('adminLogin')}</h2>
          <p>{t('loginWelcome')}</p>
        </div>
        
        <form onSubmit={onLogin} className="login-form">
          {state.error && (
            <div className="login-error">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
              {state.error}
            </div>
          )}
          
          <div className="login-form-group">
            <label htmlFor="username">{t('username')}</label>
            <div className="login-input-wrapper">
              <input
                type="text"
                id="username"
                className="login-input"
                value={state.txtUsername}
                onChange={(e) => setState({ ...state, txtUsername: e.target.value, error: '' })}
                placeholder={t('enterUsername')}
                required
              />
              <svg className="login-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
          </div>

          <div className="login-form-group">
            <label htmlFor="password">{t('password')}</label>
            <div className="login-input-wrapper">
              <input
                type="password"
                id="password"
                className="login-input"
                value={state.txtPassword}
                onChange={(e) => setState({ ...state, txtPassword: e.target.value, error: '' })}
                placeholder={t('enterPassword')}
                required
              />
              <svg className="login-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <circle cx="12" cy="16" r="1"></circle>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
          </div>

          <button 
            type="submit" 
            className="login-btn"
            disabled={state.loading}
          >
            {state.loading ? (
              <>
                <div className="loading-spinner"></div>
                {t('signingIn')}
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 3h6v6M10 14L21 3M21 3v6M21 3h-6"></path>
                </svg>
                {t('signIn')}
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>{t('copyright')}</p>
        </div>
      </div>
    </div>
  );
};

export default Login;