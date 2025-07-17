import React, { Component } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

// Language Switcher Component (Functional component with hook)
const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
  };

  const getCurrentLanguageDisplay = () => {
    switch(language) {
      case 'vi': return '🇻🇳 VI';
      case 'ja': return '🇯🇵 JP';
      default: return '🇺🇸 EN';
    }
  };

  return (
    <div className="language-dropdown">
      <button className="language-toggle nav-link">
        {getCurrentLanguageDisplay()}
        <span className="dropdown-arrow">▼</span>
      </button>
      <div className="language-dropdown-menu">
        <button
          className={`language-option ${language === 'vi' ? 'active' : ''}`}
          onClick={() => handleLanguageChange('vi')}
          title="Tiếng Việt"
        >
          🇻🇳 Tiếng Việt
        </button>
        <button
          className={`language-option ${language === 'en' ? 'active' : ''}`}
          onClick={() => handleLanguageChange('en')}
          title="English"
        >
          🇺🇸 English
        </button>
        <button
          className={`language-option ${language === 'ja' ? 'active' : ''}`}
          onClick={() => handleLanguageChange('ja')}
          title="日本語"
        >
          🇯🇵 日本語
        </button>
      </div>
    </div>
  );
};

// HOC for class components to use language context
const withLanguage = (WrappedComponent) => {
  return (props) => {
    const languageContext = useLanguage();
    const { language, setLanguage, t } = languageContext;
    
    // Fallback t function if not available
    const fallbackT = (key) => key;
    
    return (
      <WrappedComponent
        {...props}
        language={language}
        setLanguage={setLanguage}
        t={t || fallbackT}
      />
    );
  };
};

export { LanguageSwitcher, withLanguage };
export default LanguageSwitcher;
