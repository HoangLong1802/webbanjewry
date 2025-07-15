import axios from "axios";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import withRouter from "../utils/withRouter";
import MyContext from "../contexts/MyContext";
import { withLanguage } from "./LanguageSwitcher";

class ProductDetail extends Component {
  static contextType = MyContext;
  constructor(props) {
    super(props);
    this.state = {
      product: null,
      txtQuantity: 1,
      selectedImageIndex: 0,
      showZoom: false,
      showSizeGuide: false,
      activeTab: 'description',
      isAddingToCart: false,
      showNotification: false,
      selectedSize: null,
      selectedColor: null,
      reviews: [
        { id: 1, user: "Sarah M.", rating: 5, comment: "Absolutely stunning! The craftsmanship is exceptional.", date: "2025-01-10" },
        { id: 2, user: "Emma K.", rating: 5, comment: "Perfect gift for my anniversary. Highly recommend!", date: "2025-01-05" },
        { id: 3, user: "Lisa T.", rating: 4, comment: "Beautiful design, fast shipping. Love it!", date: "2024-12-28" }
      ]
    };
  }

  formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  increaseQuantity = () => {
    if (this.state.txtQuantity < 10) {
      this.setState({ txtQuantity: this.state.txtQuantity + 1 });
    }
  };

  decreaseQuantity = () => {
    if (this.state.txtQuantity > 1) {
      this.setState({ txtQuantity: this.state.txtQuantity - 1 });
    }
  };

  showNotification = (message) => {
    this.setState({ showNotification: message });
    setTimeout(() => {
      this.setState({ showNotification: false });
    }, 3000);
  };

  getColorValue = (colorName) => {
    const colorMap = {
      'gold': '#FFD700',
      'silver': '#C0C0C0',
      'bronze': '#CD7F32',
      'platinum': '#E5E4E2',
      'rose gold': '#E8B4A0',
      'white': '#FFFFFF',
      'black': '#000000',
      'red': '#FF0000',
      'blue': '#0000FF',
      'green': '#008000',
      'yellow': '#FFFF00',
      'purple': '#800080',
      'pink': '#FFC0CB'
    };
    return colorMap[colorName.toLowerCase()] || '#CCCCCC';
  };

  componentDidMount() {
    const params = this.props.params;
    this.apiGetProduct(params.id);
  }

  apiGetProduct(id) {
    axios.get("/api/customer/products/" + id).then((res) => {
      const result = res.data;
      this.setState({ product: result });
    });
  }

  btnAdd2CartClick = (product) => {
    const { t } = this.props;
    
    // Check if size and color are selected
    if (!this.state.selectedSize || !this.state.selectedColor) {
      this.showNotification(t('pleaseSelectSizeAndColor') || 'Please select size and color');
      return;
    }
    
    this.setState({ isAddingToCart: true });
    
    setTimeout(() => {
      const mycart = this.context.mycart;
      const index = mycart.findIndex((x) => 
        x.product._id === product._id && 
        x.selectedSize === this.state.selectedSize &&
        x.selectedColor === this.state.selectedColor
      );
      
      if (index === -1) {
        const newItem = {
          product: product,
          quantity: parseInt(this.state.txtQuantity),
          selectedSize: this.state.selectedSize,
          selectedColor: this.state.selectedColor,
        };
        mycart.push(newItem);
      } else {
        mycart[index].quantity += parseInt(this.state.txtQuantity);
      }
      this.context.setMycart(mycart);
      this.setState({ isAddingToCart: false });
      this.showNotification(t('addedToCart'));
    }, 500);
  };

  render() {
    const { t } = this.props;
    const prod = this.state.product;
    
    if (prod != null) {
      return (
        <div className="luxury-product-page">
          {/* Notification Toast */}
          {this.state.showNotification && (
            <div className="notification-toast">
              <div className="notification-content">
                <span className="notification-icon">✅</span>
                <span className="notification-text">{this.state.showNotification}</span>
              </div>
            </div>
          )}

          {/* Breadcrumb */}
          <div className="container">
            <nav className="modern-breadcrumb">
              <Link to="/home" className="breadcrumb-item">{t('home')}</Link>
              <span className="breadcrumb-separator">•</span>
              <Link to="/products" className="breadcrumb-item">{t('products')}</Link>
              <span className="breadcrumb-separator">•</span>
              <span className="breadcrumb-current">{prod.name}</span>
            </nav>
          </div>

          <div className="container">
            <div className="product-showcase">
              
              {/* Product Images Gallery */}
              <div className="product-gallery">
                <div className="main-image-wrapper">
                  <div className="image-container">
                    <img
                      src={"data:image/jpg;base64," + prod.image}
                      alt={prod.name}
                      className="hero-image"
                      onClick={() => this.setState({ showZoom: true })}
                    />
                    <button className="zoom-btn" onClick={() => this.setState({ showZoom: true })}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.35-4.35"></path>
                        <line x1="15" y1="11" x2="7" y2="11"></line>
                        <line x1="11" y1="15" x2="11" y2="7"></line>
                      </svg>
                    </button>
                    {prod.category.name === "Hot" && (
                      <div className="luxury-badge">
                        <span className="badge-icon">🔥</span>
                        <span className="badge-text">{t('hotTrend')}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Thumbnail Gallery */}
                <div className="thumbnail-row">
                  {[1, 2, 3, 4].map((index) => (
                    <div key={index} className={`thumbnail-item ${index === 1 ? 'active' : ''}`}>
                      <img src={"data:image/jpg;base64," + prod.image} alt={`${prod.name} ${index}`} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Product Information */}
              <div className="product-info">
                <div className="product-header">
                  <h1 className="product-title">{prod.name}</h1>
                  <div className="product-meta">
                    <span className="category-tag">{prod.category.name}</span>
                    <div className="rating-stars">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className="star filled">★</span>
                      ))}
                      <span className="rating-text">(127 reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="price-section">
                  <span className="current-price">{this.formatPrice(prod.price)} VND</span>
                  <span className="original-price">{this.formatPrice(prod.price * 1.2)} VND</span>
                  <span className="discount-badge">-17%</span>
                </div>

                <div className="product-description">
                  <p>Experience luxury craftsmanship with this exquisite piece from our premium collection. Handcrafted with attention to detail and made from the finest materials.</p>
                </div>

                {/* Product Options */}
                <div className="product-options">
                  <div className="options-row">
                    <div className="option-group">
                      <label className="option-label">Size:</label>
                      <div className="size-selector">
                        {prod.sizes && prod.sizes.length > 0 ? (
                          prod.sizes.map((size) => (
                            <button 
                              key={size} 
                              className={`size-btn ${this.state.selectedSize === size ? 'active' : ''}`}
                              onClick={() => this.setState({ selectedSize: size })}
                            >
                              {size}
                            </button>
                          ))
                        ) : (
                          <span className="no-options">No sizes available</span>
                        )}
                      </div>
                    </div>

                    <div className="option-group">
                      <label className="option-label">Color:</label>
                      <div className="color-selector">
                        {prod.colors && prod.colors.length > 0 ? (
                          prod.colors.map((color, index) => (
                            <button
                              key={index}
                              className={`color-btn ${this.state.selectedColor === color ? 'active' : ''}`}
                              style={{ backgroundColor: this.getColorValue(color) }}
                              onClick={() => this.setState({ selectedColor: color })}
                              title={color}
                            >
                              <span className="color-name">{color}</span>
                            </button>
                          ))
                        ) : (
                          <span className="no-options">No colors available</span>
                        )}
                      </div>
                    </div>

                    <div className="option-group">
                      <label className="option-label">Quantity:</label>
                      <div className="quantity-selector">
                        <button className="qty-btn" onClick={this.decreaseQuantity}>-</button>
                        <span className="qty-display">{this.state.txtQuantity}</span>
                        <button className="qty-btn" onClick={this.increaseQuantity}>+</button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="action-buttons">
                  <button 
                    className="add-to-cart-btn"
                    onClick={() => this.btnAdd2CartClick(prod)}
                    disabled={this.state.isAddingToCart}
                  >
                    {this.state.isAddingToCart ? (
                      <div className="loading-spinner"></div>
                    ) : (
                      <>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                          <line x1="3" y1="6" x2="21" y2="6"></line>
                          <path d="M16 10a4 4 0 0 1-8 0"></path>
                        </svg>
                        {t('addToCart')}
                      </>
                    )}
                  </button>
                </div>

                {/* Product Features */}
                <div className="product-features">
                  <div className="feature-item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                      <path d="M2 17l10 5 10-5"></path>
                      <path d="M2 12l10 5 10-5"></path>
                    </svg>
                    <span>Free shipping worldwide</span>
                  </div>
                  <div className="feature-item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 12l2 2 4-4"></path>
                      <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"></path>
                      <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"></path>
                    </svg>
                    <span>Lifetime warranty</span>
                  </div>
                  <div className="feature-item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    <span>30-day return policy</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Details Tabs */}
            <div className="product-tabs">
              <div className="tab-nav">
                {['description', 'specifications', 'reviews', 'care'].map((tab) => (
                  <button
                    key={tab}
                    className={`tab-btn ${this.state.activeTab === tab ? 'active' : ''}`}
                    onClick={() => this.setState({ activeTab: tab })}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              <div className="tab-content">
                {this.state.activeTab === 'description' && (
                  <div className="tab-panel">
                    <h3>Product Description</h3>
                    <p>This exceptional piece represents the pinnacle of jewelry craftsmanship. Each element is meticulously designed and created by our master artisans using traditional techniques passed down through generations.</p>
                    <ul>
                      <li>Handcrafted with premium materials</li>
                      <li>Unique design inspired by classical elegance</li>
                      <li>Perfect for special occasions</li>
                      <li>Comes with authenticity certificate</li>
                    </ul>
                  </div>
                )}
                
                {this.state.activeTab === 'specifications' && (
                  <div className="tab-panel">
                    <h3>Specifications</h3>
                    <div className="specs-grid">
                      <div className="spec-item">
                        <span className="spec-label">Material:</span>
                        <span className="spec-value">18K Gold</span>
                      </div>
                      <div className="spec-item">
                        <span className="spec-label">Weight:</span>
                        <span className="spec-value">12.5g</span>
                      </div>
                      <div className="spec-item">
                        <span className="spec-label">Dimensions:</span>
                        <span className="spec-value">25mm x 15mm</span>
                      </div>
                      <div className="spec-item">
                        <span className="spec-label">Stone:</span>
                        <span className="spec-value">Natural Diamond</span>
                      </div>
                    </div>
                  </div>
                )}

                {this.state.activeTab === 'reviews' && (
                  <div className="tab-panel">
                    <h3>Customer Reviews</h3>
                    <div className="reviews-container">
                      {this.state.reviews.map((review) => (
                        <div key={review.id} className="review-item">
                          <div className="review-header">
                            <span className="reviewer-name">{review.user}</span>
                            <div className="review-rating">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <span key={star} className={`star ${star <= review.rating ? 'filled' : ''}`}>★</span>
                              ))}
                            </div>
                            <span className="review-date">{review.date}</span>
                          </div>
                          <p className="review-comment">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {this.state.activeTab === 'care' && (
                  <div className="tab-panel">
                    <h3>Care Instructions</h3>
                    <div className="care-instructions">
                      <div className="care-item">
                        <strong>Daily Care:</strong>
                        <p>Clean with a soft, lint-free cloth after each wear to maintain shine.</p>
                      </div>
                      <div className="care-item">
                        <strong>Storage:</strong>
                        <p>Store in individual pouches to prevent scratching and tarnishing.</p>
                      </div>
                      <div className="care-item">
                        <strong>Professional Cleaning:</strong>
                        <p>Have your jewelry professionally cleaned every 6 months for optimal appearance.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Zoom Modal */}
          {this.state.showZoom && (
            <div className="zoom-modal" onClick={() => this.setState({ showZoom: false })}>
              <div className="zoom-content">
                <img src={"data:image/jpg;base64," + prod.image} alt={prod.name} />
                <button className="close-zoom">×</button>
              </div>
            </div>
          )}

          <style jsx>{`
            .luxury-product-page {
              background: #fafafa;
              min-height: 100vh;
              padding: 20px 0;
            }

            .container {
              max-width: 1200px;
              margin: 0 auto;
              padding: 0 20px;
            }

            /* Notification Toast */
            .notification-toast {
              position: fixed;
              top: 20px;
              right: 20px;
              background: #4CAF50;
              color: white;
              padding: 16px 24px;
              border-radius: 12px;
              box-shadow: 0 4px 20px rgba(0,0,0,0.15);
              z-index: 1000;
              animation: slideInRight 0.3s ease-out;
            }

            .notification-content {
              display: flex;
              align-items: center;
              gap: 12px;
            }

            .notification-icon {
              font-size: 20px;
            }

            .notification-text {
              font-weight: 500;
            }

            @keyframes slideInRight {
              from {
                transform: translateX(100%);
                opacity: 0;
              }
              to {
                transform: translateX(0);
                opacity: 1;
              }
            }

            /* Breadcrumb */
            .modern-breadcrumb {
              display: flex;
              align-items: center;
              gap: 12px;
              margin-bottom: 40px;
              font-size: 14px;
            }

            .breadcrumb-item {
              color: #666;
              text-decoration: none;
              transition: color 0.2s;
            }

            .breadcrumb-item:hover {
              color: #c8860d;
            }

            .breadcrumb-separator {
              color: #999;
            }

            .breadcrumb-current {
              color: #c8860d;
              font-weight: 500;
            }

            /* Product Showcase */
            .product-showcase {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 60px;
              margin-bottom: 80px;
            }

            /* Product Gallery */
            .product-gallery {
              display: flex;
              flex-direction: column;
              gap: 20px;
            }

            .main-image-wrapper {
              position: relative;
              background: white;
              border-radius: 20px;
              padding: 20px;
              box-shadow: 0 8px 32px rgba(0,0,0,0.1);
            }

            .image-container {
              position: relative;
              overflow: hidden;
              border-radius: 16px;
            }

            .hero-image {
              width: 100%;
              height: 500px;
              object-fit: cover;
              cursor: zoom-in;
              transition: transform 0.3s ease;
            }

            .hero-image:hover {
              transform: scale(1.05);
            }

            .zoom-btn {
              position: absolute;
              top: 20px;
              right: 20px;
              background: rgba(255,255,255,0.9);
              border: none;
              width: 44px;
              height: 44px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
              transition: all 0.2s;
            }

            .zoom-btn:hover {
              background: white;
              transform: scale(1.1);
            }

            .luxury-badge {
              position: absolute;
              top: 20px;
              left: 20px;
              background: linear-gradient(45deg, #ff6b6b, #ff8e8e);
              color: white;
              padding: 8px 16px;
              border-radius: 20px;
              display: flex;
              align-items: center;
              gap: 6px;
              font-size: 12px;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 1px;
            }

            .thumbnail-row {
              display: flex;
              gap: 15px;
              justify-content: center;
            }

            .thumbnail-item {
              width: 80px;
              height: 80px;
              border-radius: 12px;
              overflow: hidden;
              border: 2px solid transparent;
              cursor: pointer;
              transition: all 0.2s;
            }

            .thumbnail-item.active {
              border-color: #c8860d;
            }

            .thumbnail-item:hover {
              transform: scale(1.05);
            }

            .thumbnail-item img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }

            /* Product Info */
            .product-info {
              display: flex;
              flex-direction: column;
              gap: 30px;
            }

            .product-header {
              border-bottom: 1px solid #eee;
              padding-bottom: 20px;
            }

            .product-title {
              font-size: 2.5rem;
              font-weight: 300;
              color: #2c3e50;
              margin-bottom: 15px;
              line-height: 1.2;
            }

            .product-meta {
              display: flex;
              align-items: center;
              gap: 20px;
            }

            .category-tag {
              background: #c8860d;
              color: white;
              padding: 6px 12px;
              border-radius: 20px;
              font-size: 12px;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 1px;
            }

            .rating-stars {
              display: flex;
              align-items: center;
              gap: 8px;
            }

            .star {
              color: #ddd;
              font-size: 18px;
            }

            .star.filled {
              color: #ffd700;
            }

            .rating-text {
              color: #666;
              font-size: 14px;
            }

            /* Price Section */
            .price-section {
              display: flex;
              align-items: center;
              gap: 15px;
              flex-wrap: wrap;
            }

            .current-price {
              font-size: 2rem;
              font-weight: 600;
              color: #c8860d;
            }

            .original-price {
              font-size: 1.2rem;
              color: #999;
              text-decoration: line-through;
            }

            .discount-badge {
              background: #e74c3c;
              color: white;
              padding: 4px 8px;
              border-radius: 6px;
              font-size: 12px;
              font-weight: 600;
            }

            /* Product Description */
            .product-description {
              color: #666;
              line-height: 1.6;
              font-size: 16px;
            }

            /* Product Options */
            .product-options {
              display: flex;
              flex-direction: column;
              gap: 25px;
            }

            .options-row {
              display: flex;
              gap: 30px;
              align-items: flex-start;
            }

            .option-group {
              display: flex;
              flex-direction: column;
              gap: 10px;
              min-width: 120px;
            }

            .option-label {
              font-weight: 600;
              color: #2c3e50;
              font-size: 14px;
              text-transform: uppercase;
              letter-spacing: 1px;
              margin-bottom: 5px;
            }

            .size-selector {
              display: flex;
              gap: 10px;
            }

            .size-btn {
              width: 44px;
              height: 44px;
              border: 2px solid #ddd;
              background: white;
              border-radius: 8px;
              cursor: pointer;
              transition: all 0.2s;
              font-weight: 600;
            }

            .size-btn:hover, .size-btn.active {
              border-color: #c8860d;
              background: #c8860d;
              color: white;
            }

            .color-selector {
              display: flex;
              gap: 10px;
              flex-wrap: wrap;
            }

            .color-btn {
              width: 44px;
              height: 44px;
              border: 2px solid #ddd;
              border-radius: 8px;
              cursor: pointer;
              transition: all 0.2s;
              position: relative;
              overflow: hidden;
              display: flex;
              align-items: center;
              justify-content: center;
            }

            .color-btn:hover, .color-btn.active {
              border-color: #c8860d;
              transform: scale(1.05);
            }

            .color-name {
              position: absolute;
              bottom: -20px;
              left: 50%;
              transform: translateX(-50%);
              font-size: 10px;
              color: #333;
              white-space: nowrap;
              opacity: 0;
              transition: opacity 0.2s;
            }

            .color-btn:hover .color-name {
              opacity: 1;
            }

            .no-options {
              color: #999;
              font-style: italic;
              padding: 10px;
            }

            .quantity-selector {
              display: flex;
              align-items: center;
              gap: 0;
              width: fit-content;
              border: 2px solid #ddd;
              border-radius: 8px;
              overflow: hidden;
            }

            .qty-btn {
              width: 44px;
              height: 44px;
              border: none;
              background: white;
              cursor: pointer;
              font-size: 18px;
              font-weight: 600;
              transition: background 0.2s;
            }

            .qty-btn:hover {
              background: #f8f9fa;
            }

            .qty-display {
              width: 60px;
              height: 44px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: 600;
              border-left: 1px solid #ddd;
              border-right: 1px solid #ddd;
            }

            /* Action Buttons */
            .action-buttons {
              display: flex;
              gap: 15px;
            }

            .add-to-cart-btn {
              width: 100%;
              background: #c8860d;
              color: white;
              border: none;
              padding: 16px 24px;
              border-radius: 12px;
              font-size: 16px;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.2s;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 10px;
            }

            .add-to-cart-btn:hover:not(:disabled) {
              background: #a86e0b;
              transform: translateY(-2px);
            }

            .add-to-cart-btn:disabled {
              opacity: 0.6;
              cursor: not-allowed;
            }

            .loading-spinner {
              width: 20px;
              height: 20px;
              border: 2px solid transparent;
              border-top: 2px solid currentColor;
              border-radius: 50%;
              animation: spin 1s linear infinite;
            }

            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }

            /* Product Features */
            .product-features {
              display: flex;
              flex-direction: column;
              gap: 12px;
              padding: 20px;
              background: #f8f9fa;
              border-radius: 12px;
            }

            .feature-item {
              display: flex;
              align-items: center;
              gap: 12px;
              color: #666;
              font-size: 14px;
            }

            .feature-item svg {
              color: #c8860d;
              flex-shrink: 0;
            }

            /* Product Tabs */
            .product-tabs {
              background: white;
              border-radius: 20px;
              box-shadow: 0 8px 32px rgba(0,0,0,0.1);
              overflow: hidden;
            }

            .tab-nav {
              display: flex;
              border-bottom: 1px solid #eee;
            }

            .tab-btn {
              flex: 1;
              background: none;
              border: none;
              padding: 20px;
              cursor: pointer;
              font-weight: 600;
              color: #666;
              transition: all 0.2s;
              text-transform: uppercase;
              letter-spacing: 1px;
              font-size: 14px;
            }

            .tab-btn:hover, .tab-btn.active {
              color: #c8860d;
              background: #fafafa;
            }

            .tab-content {
              padding: 40px;
            }

            .tab-panel h3 {
              color: #2c3e50;
              margin-bottom: 20px;
              font-size: 1.5rem;
              font-weight: 600;
            }

            .tab-panel p {
              color: #666;
              line-height: 1.6;
              margin-bottom: 15px;
            }

            .tab-panel ul {
              color: #666;
              padding-left: 20px;
            }

            .tab-panel li {
              margin-bottom: 8px;
            }

            /* Specifications */
            .specs-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
              gap: 20px;
            }

            .spec-item {
              display: flex;
              justify-content: space-between;
              padding: 12px 0;
              border-bottom: 1px solid #eee;
            }

            .spec-label {
              font-weight: 600;
              color: #2c3e50;
            }

            .spec-value {
              color: #666;
            }

            /* Reviews */
            .reviews-container {
              display: flex;
              flex-direction: column;
              gap: 25px;
            }

            .review-item {
              padding: 20px;
              background: #f8f9fa;
              border-radius: 12px;
            }

            .review-header {
              display: flex;
              align-items: center;
              gap: 15px;
              margin-bottom: 12px;
            }

            .reviewer-name {
              font-weight: 600;
              color: #2c3e50;
            }

            .review-rating {
              display: flex;
              gap: 2px;
            }

            .review-date {
              color: #999;
              font-size: 14px;
              margin-left: auto;
            }

            .review-comment {
              color: #666;
              line-height: 1.6;
            }

            /* Care Instructions */
            .care-instructions {
              display: flex;
              flex-direction: column;
              gap: 20px;
            }

            .care-item {
              padding: 20px;
              background: #f8f9fa;
              border-radius: 12px;
            }

            .care-item strong {
              color: #2c3e50;
              display: block;
              margin-bottom: 8px;
            }

            /* Zoom Modal */
            .zoom-modal {
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: rgba(0,0,0,0.8);
              display: flex;
              align-items: center;
              justify-content: center;
              z-index: 2000;
              cursor: zoom-out;
            }

            .zoom-content {
              position: relative;
              max-width: 90%;
              max-height: 90%;
            }

            .zoom-content img {
              max-width: 100%;
              max-height: 100%;
              object-fit: contain;
            }

            .close-zoom {
              position: absolute;
              top: 20px;
              right: 20px;
              background: rgba(255,255,255,0.9);
              border: none;
              width: 44px;
              height: 44px;
              border-radius: 50%;
              font-size: 24px;
              cursor: pointer;
              transition: all 0.2s;
            }

            .close-zoom:hover {
              background: white;
              transform: scale(1.1);
            }

            /* Responsive Design */
            @media (max-width: 768px) {
              .product-showcase {
                grid-template-columns: 1fr;
                gap: 40px;
              }

              .product-title {
                font-size: 2rem;
              }

              .current-price {
                font-size: 1.5rem;
              }

              .options-row {
                flex-direction: column;
                gap: 20px;
              }

              .option-group {
                min-width: unset;
              }

              .action-buttons {
                flex-direction: column;
              }

              .tab-nav {
                flex-direction: column;
              }

              .tab-content {
                padding: 20px;
              }
            }
          `}</style>
        </div>
      );
    } else {
      return (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading product details...</p>
        </div>
      );
    }
  }
}

export default withRouter(withLanguage(ProductDetail));