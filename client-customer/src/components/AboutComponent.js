import React, { Component } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

class About extends Component {
  render() {
    return <AboutWithLanguage />;
  }
}

const AboutWithLanguage = () => {
  const { t } = useLanguage();
    
    return (
      <div className="about-page">
        <div className="container">
          {/* Hero Section */}
          <div className="about-hero">
            <h1 className="page-title">{t('aboutUs')}</h1>
            <p className="page-subtitle">{t('aboutSubtitle')}</p>
          </div>

          {/* Story Section */}
          <div className="about-story">
            <div className="story-content">
              <div className="story-text">
                <h2>{t('ourStory')}</h2>
                <p className="story-paragraph">
                  {t('storyParagraph1')}
                </p>
                <p className="story-paragraph">
                  {t('storyParagraph2')}
                </p>
                <p className="story-paragraph">
                  {t('storyParagraph3')}
                </p>
              </div>
              <div className="story-image">
                <div className="image-placeholder">
                  <i className="fas fa-gem"></i>
                  <p>PANJ Jewelry</p>
                </div>
              </div>
            </div>
          </div>

          {/* Founder Section */}
          <div className="founder-section">
            <div className="founder-content">
              <div className="founder-image">
                <div className="founder-placeholder">
                  <i className="fas fa-user-circle"></i>
                </div>
              </div>
              <div className="founder-info">
                <h2>{t('meetFounder')}</h2>
                <h3>Trương Hoàng Long</h3>
                <p className="founder-title">{t('founderTitle')}</p>
                <p className="founder-description">
                  {t('founderDescription')}
                </p>
                <div className="founder-contact">
                  <a 
                    href="mailto:truonghoanglong1802@gmail.com" 
                    className="contact-link"
                  >
                    <i className="fas fa-envelope"></i>
                    truonghoanglong1802@gmail.com
                  </a>
                  <a 
                    href="https://www.linkedin.com/in/ho%C3%A0ng-long-tr%C6%B0%C6%A1ng-137684287/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="contact-link"
                  >
                    <i className="fab fa-linkedin"></i>
                    LinkedIn Profile
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="values-section">
            <h2>{t('ourValues')}</h2>
            <div className="values-grid">
              <div className="value-card">
                <div className="value-icon">
                  <i className="fas fa-gem"></i>
                </div>
                <h3>{t('qualityTitle')}</h3>
                <p>{t('qualityDescription')}</p>
              </div>

              <div className="value-card">
                <div className="value-icon">
                  <i className="fas fa-palette"></i>
                </div>
                <h3>{t('craftsmanshipTitle')}</h3>
                <p>{t('craftsmanshipDescription')}</p>
              </div>

              <div className="value-card">
                <div className="value-icon">
                  <i className="fas fa-heart"></i>
                </div>
                <h3>{t('passionTitle')}</h3>
                <p>{t('passionDescription')}</p>
              </div>

              <div className="value-card">
                <div className="value-icon">
                  <i className="fas fa-users"></i>
                </div>
                <h3>{t('customerTitle')}</h3>
                <p>{t('customerDescription')}</p>
              </div>
            </div>
          </div>

          {/* Mission Section */}
          <div className="mission-section">
            <div className="mission-content">
              <h2>{t('ourMission')}</h2>
              <p className="mission-text">{t('missionStatement')}</p>
              
              <div className="mission-goals">
                <div className="goal-item">
                  <i className="fas fa-check-circle"></i>
                  <span>{t('goal1')}</span>
                </div>
                <div className="goal-item">
                  <i className="fas fa-check-circle"></i>
                  <span>{t('goal2')}</span>
                </div>
                <div className="goal-item">
                  <i className="fas fa-check-circle"></i>
                  <span>{t('goal3')}</span>
                </div>
                <div className="goal-item">
                  <i className="fas fa-check-circle"></i>
                  <span>{t('goal4')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="stats-section">
            <h2>{t('byNumbers')}</h2>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-number">500+</div>
                <div className="stat-label">{t('happyCustomers')}</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">1000+</div>
                <div className="stat-label">{t('jewelryPieces')}</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">50+</div>
                <div className="stat-label">{t('uniqueDesigns')}</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">3</div>
                <div className="stat-label">{t('yearsExperience')}</div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="about-cta">
            <h2>{t('joinJourney')}</h2>
            <p>{t('joinDescription')}</p>
            <div className="cta-buttons">
              <a href="/products" className="btn btn-primary">
                {t('exploreCollection')}
              </a>
              <a href="/contact" className="btn btn-secondary">
                {t('contactUs')}
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  };

export default About;
