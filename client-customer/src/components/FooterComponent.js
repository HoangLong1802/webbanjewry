import React, { Component } from "react";
import { Link } from "react-router-dom";
import { withLanguage } from "./LanguageSwitcher";

class Footer extends Component {
  render() {
    return (
      <footer className="luxury-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3 className="footer-title">PANJ</h3>
              <p className="footer-description">
                {this.props.t('footerDesc')}
              </p>
              <div className="social-links">
                <a href="#" className="social-link">Facebook</a>
                <a href="#" className="social-link">Instagram</a>
                <a href="#" className="social-link">Youtube</a>
              </div>
            </div>
            
            <div className="footer-section">
              <h4 className="footer-subtitle">{this.props.t('productsMenu')}</h4>
              <ul className="footer-links">
                <li><Link to="/products">{this.props.t('allProducts')}</Link></li>
                <li><Link to="/categories/rings">{this.props.t('rings')}</Link></li>
                <li><Link to="/categories/necklaces">{this.props.t('necklaces')}</Link></li>
                <li><Link to="/categories/bracelets">{this.props.t('bracelets')}</Link></li>
                <li><Link to="/categories/earrings">{this.props.t('earrings')}</Link></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4 className="footer-subtitle">{this.props.t('customerSupport')}</h4>
              <ul className="footer-links">
                <li><Link to="/about">{this.props.t('about')}</Link></li>
                <li><Link to="/shipping">{this.props.t('shipping')}</Link></li>
                <li><Link to="/returns">{this.props.t('returns')}</Link></li>
                <li><Link to="/warranty">{this.props.t('warranty')}</Link></li>
                <li><Link to="/care-guide">{this.props.t('careGuide')}</Link></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4 className="footer-subtitle">{this.props.t('contact')}</h4>
              <div className="contact-info">
                <div className="contact-item">
                  <span className="contact-icon">📍</span>
                  <p>Binh Thanh District, Ho Chi Minh City</p>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">📧</span>
                  <p>
                    <a href="mailto:truonghoanglong1802@gmail.com" className="contact-link">
                      truonghoanglong1802@gmail.com
                    </a>
                  </p>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">💼</span>
                  <p>
                    <a 
                      href="https://www.linkedin.com/in/ho%C3%A0ng-long-tr%C6%B0%C6%A1ng-137684287/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="contact-link"
                    >
                      LinkedIn
                    </a>
                  </p>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">🕒</span>
                  <p>8:00 AM - 10:00 PM</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <div className="footer-bottom-content">
              <p>{this.props.t('copyright')}</p>
              <div className="footer-bottom-links">
                <Link to="/privacy">{this.props.t('privacyPolicy')}</Link>
                <Link to="/terms">{this.props.t('termsOfUse')}</Link>
                <Link to="/sitemap">{this.props.t('sitemap')}</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  }
}

export default withLanguage(Footer);