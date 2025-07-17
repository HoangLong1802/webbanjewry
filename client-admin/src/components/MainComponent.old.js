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
  
  constructor(props) {
    super(props);
    this.state = {
      sidebarCollapsed: false,
      isMobile: window.innerWidth <= 768
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize = () => {
    this.setState({ isMobile: window.innerWidth <= 768 });
  };

  toggleSidebar = () => {
    this.setState({ sidebarCollapsed: !this.state.sidebarCollapsed });
  };

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
    <div className="admin-layout">
      <Menu 
        collapsed={collapsed}
        isMobile={isMobile}
        toggleSidebar={toggleSidebar}
        t={t}
      />
      <div className={`admin-main ${collapsed ? 'sidebar-collapsed' : ''}`}>
        <div className="admin-header">
          <div className="header-left">
            <h1 className="header-title">PANJ {t('dashboard')}</h1>
            <div className="header-breadcrumb">
              <span>{t('dashboard')}</span>
              <span className="header-breadcrumb-separator">/</span>
              <span>{t('home')}</span>
            </div>
          </div>
          <div className="header-right">
            <div className="header-actions">
              <button className="header-action-btn" title={t('notifications')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
                <span className="badge">3</span>
              </button>
              
              {/* Language Switcher */}
              <div className="language-switcher">
                <div className="language-dropdown" ref={dropdownRef}>
                  <button 
                    className="language-current"
                    onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                  >
                    <span className="language-flag">{currentLanguage?.flag}</span>
                    <span className="language-name">{currentLanguage?.name}</span>
                    <svg 
                      className={`language-arrow ${showLanguageDropdown ? 'rotated' : ''}`}
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
              
              <button className="header-action-btn" title={t('settings')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
              </button>
            </div>
            <div className="header-user" onClick={onLogout}>
              <div className="header-user-avatar">
                {username.charAt(0).toUpperCase()}
              </div>
              <div className="header-user-info">
                <span className="header-user-name">{username}</span>
                <span className="header-user-role">{t('administrator')}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="admin-content">
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
      </div>
    </div>
  );
};

export default Main;
