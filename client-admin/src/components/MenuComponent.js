import React, { Component } from "react";
import MyContext from "../contexts/MyContext";
import { useLanguage } from "../contexts/LanguageContext";
import { Link, useLocation } from "react-router-dom";

// Hook to get current location
const useCurrentLocation = () => {
  const location = useLocation();
  return location.pathname;
};

class Menu extends Component {
  static contextType = MyContext;

  render() {
    const { collapsed, isMobile, toggleSidebar } = this.props;
    
    return (
      <MenuWithLanguage 
        collapsed={collapsed}
        isMobile={isMobile}
        toggleSidebar={toggleSidebar}
      />
    );
  }
}

// Functional component to use language hooks
const MenuWithLanguage = ({ collapsed, isMobile, toggleSidebar }) => {
  const { t } = useLanguage();
  
  const MenuItems = [
    {
      path: "/admin/home",
      name: t('dashboard'),
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
      )
    },
    {
      path: "/admin/category",
      name: t('categories'),
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
        </svg>
      )
    },
    {
      path: "/admin/product",
      name: t('products'),
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <path d="M16 10a4 4 0 0 1-8 0"></path>
        </svg>
      )
    },
    {
      path: "/admin/order",
      name: t('orders'),
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 11H5a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2h-4l-3-3-3 3"></path>
          <path d="M12 2L9 5l3 3 3-3-3-3z"></path>
        </svg>
      )
    },
    {
      path: "/admin/customer",
      name: t('customers'),
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      )
    }
  ];
  
  return (
    <div className={`admin-sidebar ${collapsed ? 'collapsed' : ''} ${isMobile ? 'mobile-sidebar' : ''}`}>
      <div className="sidebar-header">
        <Link to="/admin/home" className="sidebar-logo">
          <div className="sidebar-logo-icon">P</div>
          <span>PANJ {t('admin')}</span>
        </Link>
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>
      
      <ul className="sidebar-menu">
        {MenuItems.map((item, index) => (
          <MenuItemComponent key={index} item={item} collapsed={collapsed} />
        ))}
      </ul>
    </div>
  );
};

// Functional component for menu items to use hooks
const MenuItemComponent = ({ item, collapsed }) => {
  const currentPath = useCurrentLocation();
  const isActive = currentPath === item.path;
  
  return (
    <li className="sidebar-menu-item">
      <Link 
        to={item.path} 
        className={`sidebar-menu-link ${isActive ? 'active' : ''}`}
        title={collapsed ? item.name : ''}
      >
        <span className="sidebar-menu-icon">{item.icon}</span>
        <span className="sidebar-menu-text">{item.name}</span>
      </Link>
    </li>
  );
};

export default Menu;
