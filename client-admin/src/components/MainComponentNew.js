import React, { Component } from "react";
import MyContext from "../contexts/MyContext";
import { useLanguage } from "../contexts/LanguageContext";
import Home from "./HomeComponent";
import { Routes, Route, Navigate } from "react-router-dom";
import Category from './CategoryComponent';
import Product from './ProductComponent';
import Order from './OrderComponent';
import Customer from './CustomerComponent';

class Main extends Component {
  static contextType = MyContext;
  
  render() {
    if (this.context.token !== "") {
      return (
        <MainWithLanguage 
          username={this.context.username}
          onLogout={() => this.lnkLogoutClick()}
        />
      );
    }
    return <div />;
  }

  lnkLogoutClick() {
    this.context.setToken("");
    this.context.setUsername("");
  }
}

// Functional component to use hooks
const MainWithLanguage = ({ username, onLogout }) => {
  const { t, language, setLanguage } = useLanguage();
  const [showLanguageDropdown, setShowLanguageDropdown] = React.useState(false);
  const [showMobileMenu, setShowMobileMenu] = React.useState(false);
  const dropdownRef = React.useRef(null);

  const languageOptions = [
    { code: 'en', name: t('english'), flag: '🇺🇸' },
    { code: 'vi', name: t('vietnamese'), flag: '🇻🇳' },
    { code: 'ja', name: t('japanese'), flag: '🇯🇵' }
  ];

  const handleLanguageChange = (langCode) => {
    setLanguage(langCode);
    setShowLanguageDropdown(false);
  };

  const currentLanguage = languageOptions.find(lang => lang.code === language);

  // Navigation items
  const navigationItems = [
    { path: "/admin/home", name: t('dashboard'), icon: "🏠" },
    { path: "/admin/category", name: t('categories'), icon: "📁" },
    { path: "/admin/product", name: t('products'), icon: "💍" },
    { path: "/admin/order", name: t('orders'), icon: "📋" },
    { path: "/admin/customer", name: t('customers'), icon: "👥" }
  ];

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowLanguageDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <div className="admin-layout-fullscreen">
      {/* Top Navigation Bar */}
      <nav className="admin-topbar">
        <div className="topbar-container">
          {/* Left Side - Brand & Navigation */}
          <div className="topbar-left">
            <div className="brand-logo">
              <span className="brand-text">PANJ Admin</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="desktop-nav">
              {navigationItems.map((item, index) => (
                <a key={index} href={item.path} className="nav-item">
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-text">{item.name}</span>
                </a>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="mobile-menu-btn"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
            </button>
          </div>

          {/* Right Side - Actions & User */}
          <div className="topbar-right">
            <div className="topbar-actions">
              <button className="action-btn" title={t('notifications')}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
                <span className="notification-badge">3</span>
              </button>
              
              {/* Language Switcher */}
              <div className="language-switcher" ref={dropdownRef}>
                <button 
                  className="language-current"
                  onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                >
                  <span className="language-flag">{currentLanguage?.flag}</span>
                  <svg 
                    className={`dropdown-arrow ${showLanguageDropdown ? 'rotated' : ''}`}
                    width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  >
                    <polyline points="6,9 12,15 18,9"></polyline>
                  </svg>
                </button>
                
                {showLanguageDropdown && (
                  <div className="language-options">
                    {languageOptions.map(option => (
                      <button
                        key={option.code}
                        className={`language-option ${option.code === language ? 'active' : ''}`}
                        onClick={() => handleLanguageChange(option.code)}
                      >
                        <span className="language-flag">{option.flag}</span>
                        <span className="language-name">{option.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* User Profile */}
            <div className="user-profile" onClick={onLogout}>
              <div className="user-avatar">
                {username.charAt(0).toUpperCase()}
              </div>
              <div className="user-info">
                <span className="user-name">{username}</span>
                <span className="user-role">{t('administrator')}</span>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6,9 12,15 18,9"></polyline>
              </svg>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {showMobileMenu && (
          <div className="mobile-nav">
            {navigationItems.map((item, index) => (
              <a 
                key={index} 
                href={item.path} 
                className="mobile-nav-item"
                onClick={() => setShowMobileMenu(false)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-text">{item.name}</span>
              </a>
            ))}
          </div>
        )}
      </nav>

      {/* Main Content Area */}
      <main className="admin-main-content">
        <div className="content-wrapper">
          <Routes>
            <Route
              path="/admin"
              element={<Navigate replace to="/admin/home" />}
            />
            <Route path="/admin/home" element={<Home />} />
            <Route path='/admin/category' element={<Category />} />
            <Route path='/admin/product' element={<Product />} />
            <Route path='/admin/order' element={<Order />} />
            <Route path='/admin/customer' element={<Customer />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default Main;
