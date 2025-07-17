import React, { Component } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

class Contact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      subject: '',
      message: '',
      isSubmitting: false,
      submitMessage: ''
    };
  }

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { t } = this.props;
    
    this.setState({ isSubmitting: true });
    
    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      this.setState({
        submitMessage: t('messageSent'),
        name: '',
        email: '',
        subject: '',
        message: '',
        isSubmitting: false
      });
      
      setTimeout(() => {
        this.setState({ submitMessage: '' });
      }, 3000);
    } catch (error) {
      this.setState({
        submitMessage: t('messageError'),
        isSubmitting: false
      });
    }
  };

  render() {
    const { t } = this.props;
    
    return (
      <div className="contact-page">
        <div className="container">
          {/* Hero Section */}
          <div className="contact-hero">
            <h1 className="page-title">{t('contactUs')}</h1>
            <p className="page-subtitle">{t('contactSubtitle')}</p>
          </div>

          <div className="contact-content">
            {/* Contact Information */}
            <div className="contact-info-section">
              <div className="contact-card">
                <div className="contact-header">
                  <h2>{t('getInTouch')}</h2>
                  <p>{t('contactDescription')}</p>
                </div>

                <div className="contact-details">
                  <div className="contact-item">
                    <div className="contact-icon">
                      <i className="fas fa-user"></i>
                    </div>
                    <div className="contact-text">
                      <h4>{t('owner')}</h4>
                      <p>Trương Hoàng Long</p>
                    </div>
                  </div>

                  <div className="contact-item">
                    <div className="contact-icon">
                      <i className="fas fa-envelope"></i>
                    </div>
                    <div className="contact-text">
                      <h4>Email</h4>
                      <a href="mailto:truonghoanglong1802@gmail.com">
                        truonghoanglong1802@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="contact-item">
                    <div className="contact-icon">
                      <i className="fas fa-map-marker-alt"></i>
                    </div>
                    <div className="contact-text">
                      <h4>{t('address')}</h4>
                      <p>Binh Thanh District, Ho Chi Minh City, Vietnam</p>
                    </div>
                  </div>

                  <div className="contact-item">
                    <div className="contact-icon">
                      <i className="fab fa-linkedin"></i>
                    </div>
                    <div className="contact-text">
                      <h4>LinkedIn</h4>
                      <a 
                        href="https://www.linkedin.com/in/ho%C3%A0ng-long-tr%C6%B0%C6%A1ng-137684287/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        {t('linkedinProfile')}
                      </a>
                    </div>
                  </div>

                  <div className="contact-item">
                    <div className="contact-icon">
                      <i className="fas fa-clock"></i>
                    </div>
                    <div className="contact-text">
                      <h4>{t('businessHours')}</h4>
                      <p>8:00 AM - 10:00 PM ({t('daily')})</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="contact-form-section">
              <div className="contact-form-card">
                <h2>{t('sendMessage')}</h2>
                <p>{t('formDescription')}</p>

                <form onSubmit={this.handleSubmit} className="contact-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>{t('fullName')} *</label>
                      <input
                        type="text"
                        name="name"
                        value={this.state.name}
                        onChange={this.handleInputChange}
                        placeholder={t('enterName')}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={this.state.email}
                        onChange={this.handleInputChange}
                        placeholder={t('enterEmail')}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>{t('subject')} *</label>
                    <input
                      type="text"
                      name="subject"
                      value={this.state.subject}
                      onChange={this.handleInputChange}
                      placeholder={t('enterSubject')}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>{t('message')} *</label>
                    <textarea
                      name="message"
                      value={this.state.message}
                      onChange={this.handleInputChange}
                      placeholder={t('enterMessage')}
                      rows="6"
                      required
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    className="submit-btn"
                    disabled={this.state.isSubmitting}
                  >
                    {this.state.isSubmitting ? t('sending') : t('sendMessage')}
                  </button>

                  {this.state.submitMessage && (
                    <div className="submit-message">
                      {this.state.submitMessage}
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="map-section">
            <h2>{t('findUs')}</h2>
            <div className="map-container">
              <div className="google-map-wrapper">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.7718171843815!2d106.71017731533366!3d10.820270692288516!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317528f4a62fce9b%3A0x33c1813055acb613!2zUXXhuq1uIELDrG5oIFRo4bqhbmgsIFRow6BuaCBwaOG7kSBI4buTIENow60gTWluaCwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1642678235123!5m2!1svi!2s"
                  width="100%"
                  height="400"
                  style={{ border: 0, borderRadius: '20px' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="PANJ Jewelry Location - Binh Thanh District"
                ></iframe>
                <div className="map-overlay">
                  <div className="location-info">
                    <h3>PANJ Jewelry</h3>
                    <p>Binh Thanh District, Ho Chi Minh City</p>
                    <a 
                      href="https://maps.app.goo.gl/d63pTTcuJBByzMNv8"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="directions-btn"
                    >
                      <i className="fas fa-directions"></i>
                      {t('getDirections') || 'Get Directions'}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const ContactWithLanguage = (props) => {
  const { t } = useLanguage();
  return <Contact {...props} t={t} />;
};

export default ContactWithLanguage;
