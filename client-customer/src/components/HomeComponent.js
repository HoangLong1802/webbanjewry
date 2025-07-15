import axios from "axios";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { withLanguage } from "./LanguageSwitcher";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newprods: [],
      hotprods: [],
      loading: true
    };
    this.observerRef = React.createRef();
  }

  componentDidMount() {
    // Check if data already exists to avoid unnecessary API calls
    if (this.state.newprods.length === 0) {
      this.apiGetNewProducts();
    }
    if (this.state.hotprods.length === 0) {
      // Add delay to avoid simultaneous requests
      setTimeout(() => {
        this.apiGetHotProducts();
      }, 300);
    }
    this.setupScrollAnimations();
  }

  setupScrollAnimations = () => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
        }
      });
    }, observerOptions);

    // Observe all elements with animation classes
    setTimeout(() => {
      const elements = document.querySelectorAll('.animate-on-scroll');
      elements.forEach(el => observer.observe(el));
    }, 100);
  };

  formatPrice = (price) => {
    if (typeof price === 'number') {
      const formattedPrice = price.toLocaleString('vi-VN');
      return `${formattedPrice} ${this.props.t('currency')}`;
    }
    return `0 ${this.props.t('currency')}`;
  };

  handleImageLoad = (productId) => {
    // Image loaded successfully - can add additional logic here
    console.log(`Product image loaded: ${productId}`);
  };
  render() {
    const newprods = this.state.newprods.map((item, index) => {
      return (
        <div key={item._id} className="product-card luxurySlideIn" style={{animationDelay: `${index * 0.15}s`}}>
          <div className="product-image">
            <img
              src={"data:image/jpg;base64," + item.image}
              alt={item.name}
              onLoad={() => this.handleImageLoad(item._id)}
              onError={(e) => {
                e.target.style.opacity = '0.3';
                console.error('Failed to load image for product:', item.name);
              }}
            />
            <div className="product-overlay">
              <Link to={"/product/" + item._id} className="view-details">
                {this.props.t('viewDetails')}
              </Link>
            </div>
          </div>
          <div className="product-info">
            <h3 className="product-name">{item.name}</h3>
            <p className="product-price">{this.formatPrice(item.price)}</p>
            <p className="product-description">{this.props.t('luxuryJewelry')}</p>
          </div>
        </div>
      );
    });

    const hotprods = this.state.hotprods.map((item, index) => {
      return (
        <div key={item._id} className="product-card luxuryFloat" style={{animationDelay: `${index * 0.2}s`}}>
          <div className="product-image">
            <img
              src={"data:image/jpg;base64," + item.image}
              alt={item.name}
              onLoad={() => this.handleImageLoad(item._id)}
              onError={(e) => {
                e.target.style.opacity = '0.3';
                console.error('Failed to load image for product:', item.name);
              }}
            />
            <div className="product-overlay">
              <Link to={"/product/" + item._id} className="view-details">
                {this.props.t('viewDetails')}
              </Link>
            </div>
            <div className="hot-badge">{this.props.t('hotTrend')}</div>
          </div>
          <div className="product-info">
            <h3 className="product-name">{item.name}</h3>
            <p className="product-price">{this.formatPrice(item.price)}</p>
            <p className="product-description">{this.props.t('bestSeller')}</p>
          </div>
        </div>
      );
    });

    return (
      <div className="home-container">
        {/* Hero Section - Luxury Style */}
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">{this.props.t('heroTitle')}</h1>
            <p className="hero-subtitle">
              {this.props.t('heroSubtitle')}
            </p>
            <Link to="/products" className="hero-cta">
              {this.props.t('heroButton')}
            </Link>
          </div>
        </section>

        {/* Products Sections */}
        <div className="container">
          {/* New Products Section */}
          <section className="products-section">
            <div className="section-header">
              <h2 className="section-title">{this.props.t('newCollection')}</h2>
              <p className="section-subtitle">
                {this.props.t('newCollectionDesc')}
              </p>
            </div>
            
            {this.state.loading ? (
              <div className="products-grid">
                {[1,2,3,4].map(i => (
                  <div key={i} className="shimmer"></div>
                ))}
              </div>
            ) : (
              <div className="products-grid">
                {newprods.length > 0 ? newprods : (
                  <div className="loading-container">
                    <p>{this.props.t('noNewProducts')}</p>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Hot Products Section */}
          <section className="products-section">
            <div className="section-header">
              <h2 className="section-title">{this.props.t('hotTrends')}</h2>
              <p className="section-subtitle">
                {this.props.t('hotTrendsDesc')}
              </p>
            </div>
            
            <div className="products-grid">
              {hotprods.length > 0 ? hotprods : (
                <div className="loading-container">
                  <p>{this.props.t('noHotProducts')}</p>
                </div>
              )}
            </div>
          </section>

          {/* Features Section */}
          <section className="features-section">
            <div className="section-header">
              <h2 className="section-title">{this.props.t('whyChoosePanj')}</h2>
              <p className="section-subtitle">
                {this.props.t('whyChoosePanjDesc')}
              </p>
            </div>
            <div className="features-grid">
              <div className="feature-card">
                <span className="feature-icon">💎</span>
                <h3>{this.props.t('qualityTitle')}</h3>
                <p>{this.props.t('qualityDesc')}</p>
              </div>
              <div className="feature-card">
                <span className="feature-icon">✨</span>
                <h3>{this.props.t('designTitle')}</h3>
                <p>{this.props.t('designDesc')}</p>
              </div>
              <div className="feature-card">
                <span className="feature-icon">🎁</span>
                <h3>{this.props.t('serviceTitle')}</h3>
                <p>{this.props.t('serviceDesc')}</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  // apis - Enhanced with better error handling and loading states
  apiGetNewProducts(retryCount = 0) {
    this.setState({ loading: true });
    axios.get("/api/customer/products/new")
      .then((res) => {
        const result = res.data;
        // Ensure price is properly formatted from MongoDB
        const productsWithFormattedPrice = result.map(product => ({
          ...product,
          price: typeof product.price === 'string' ? parseInt(product.price) : product.price
        }));
        this.setState({ 
          newprods: productsWithFormattedPrice,
          loading: false 
        });
      })
      .catch((error) => {
        console.error('Error loading new products:', error);
        // Retry on 429 error with exponential backoff
        if (error.response?.status === 429 && retryCount < 3) {
          const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
          setTimeout(() => {
            this.apiGetNewProducts(retryCount + 1);
          }, delay);
        } else {
          this.setState({ loading: false });
        }
      });
  }

  apiGetHotProducts(retryCount = 0) {
    axios.get("/api/customer/products/hot")
      .then((res) => {
        const result = res.data;
        // Ensure price is properly formatted from MongoDB
        const productsWithFormattedPrice = result.map(product => ({
          ...product,
          price: typeof product.price === 'string' ? parseInt(product.price) : product.price
        }));
        this.setState({ hotprods: productsWithFormattedPrice });
      })
      .catch((error) => {
        console.error('Error loading hot products:', error);
        // Retry on 429 error with exponential backoff
        if (error.response?.status === 429 && retryCount < 3) {
          const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
          setTimeout(() => {
            this.apiGetHotProducts(retryCount + 1);
          }, delay);
        }
      });
  }
}
export default withLanguage(Home);
