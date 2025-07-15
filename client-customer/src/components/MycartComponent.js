import React, { Component } from "react";
import MyContext from "../contexts/MyContext";
import CartUtil from "../utils/CartUtil";
import axios from "axios";
import withRouter from "../utils/withRouter";
import { withLanguage } from "../components/LanguageSwitcher";

class Mycart extends Component {
  static contextType = MyContext;
  render() {
    // Fallback translations in case t function is not available
    const fallbackTranslations = {
      cart: 'Shopping Cart',
      home: 'Home',
      emptyCart: 'Your Cart is Empty',
      emptyCartMessage: 'Looks like you haven\'t added anything to your cart yet.',
      continueShopping: 'Continue Shopping',
      itemsInCart: 'Items in Cart',
      orderSummary: 'Order Summary',
      subtotal: 'Subtotal',
      shipping: 'Shipping',
      tax: 'Tax',
      total: 'Total',
      free: 'Free',
      proceedToCheckout: 'Proceed to Checkout'
    };

    const t = this.props.t || ((key) => fallbackTranslations[key] || key);
    
    if (this.context.mycart.length === 0) {
      return (
        <div className="cart-page">
          <div className="container">
            <div className="cart-header">
              <h1 className="page-title">{t('cart')}</h1>
              <p className="cart-breadcrumb">
                <span>{t('home')}</span> / <span>{t('cart')}</span>
              </p>
            </div>
            
            <div className="empty-cart">
              <div className="empty-cart-icon">
                <i className="fas fa-shopping-bag"></i>
              </div>
              <h2>{t('emptyCart')}</h2>
              <p>{t('emptyCartMessage')}</p>
              <button 
                className="btn btn-primary"
                onClick={() => this.props.navigate('/products')}
              >
                {t('continueShopping')}
              </button>
            </div>
          </div>
        </div>
      );
    }

    const mycart = this.context.mycart.map((item, index) => {
      return (
        <div key={`${item.product._id}-${item.selectedSize || ''}-${item.selectedColor || ''}`} className="cart-item">
          <div className="cart-item-image">
            <img
              src={"data:image/jpg;base64," + item.product.image}
              alt={item.product.name}
            />
          </div>
          
          <div className="cart-item-info">
            <h3 className="cart-item-name">{item.product.name}</h3>
            <p className="cart-item-category">{item.product.category.name}</p>
            {item.selectedSize && (
              <p className="cart-item-size">Size: {item.selectedSize}</p>
            )}
            {item.selectedColor && (
              <p className="cart-item-color">Color: {item.selectedColor}</p>
            )}
            <div className="cart-item-price">
              <span className="price">${item.product.price}</span>
            </div>
          </div>
          
          <div className="cart-item-quantity">
            <div className="quantity-controls">
              <button 
                className="quantity-btn"
                onClick={() => this.updateQuantity(index, item.quantity - 1)}
              >
                -
              </button>
              <span className="quantity">{item.quantity}</span>
              <button 
                className="quantity-btn"
                onClick={() => this.updateQuantity(index, item.quantity + 1)}
              >
                +
              </button>
            </div>
          </div>
          
          <div className="cart-item-total">
            <span className="item-total">${(item.product.price * item.quantity).toFixed(2)}</span>
          </div>
          
          <div className="cart-item-remove">
            <button 
              className="remove-btn"
              onClick={() => this.lnkRemoveClick(index)}
            >
              <i className="fas fa-trash"></i>
            </button>
          </div>
        </div>
      );
    });

    return (
      <div className="cart-page">
        <div className="container">
          <div className="cart-header">
            <h1 className="page-title">{t('cart')}</h1>
            <p className="cart-breadcrumb">
              <span>{t('home')}</span> / <span>{t('cart')}</span>
            </p>
          </div>
          
          <div className="cart-content">
            <div className="cart-items">
              <div className="cart-items-header">
                <h2>{t('itemsInCart')} ({this.context.mycart.length})</h2>
              </div>
              
              <div className="cart-items-list">
                {mycart}
              </div>
            </div>
            
            <div className="cart-summary">
              <div className="cart-summary-card">
                <h3>{t('orderSummary')}</h3>
                
                <div className="summary-line">
                  <span>{t('subtotal')}</span>
                  <span>${CartUtil.getTotal(this.context.mycart).toFixed(2)}</span>
                </div>
                
                <div className="summary-line">
                  <span>{t('shipping')}</span>
                  <span>{t('free')}</span>
                </div>
                
                <div className="summary-line">
                  <span>{t('tax')}</span>
                  <span>$0.00</span>
                </div>
                
                <div className="summary-divider"></div>
                
                <div className="summary-total">
                  <span>{t('total')}</span>
                  <span>${CartUtil.getTotal(this.context.mycart).toFixed(2)}</span>
                </div>
                
                <button 
                  className="checkout-btn"
                  onClick={() => this.lnkCheckoutClick()}
                >
                  {t('proceedToCheckout')}
                </button>
                
                <button 
                  className="continue-shopping-btn"
                  onClick={() => this.props.navigate('/products')}
                >
                  {t('continueShopping')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  updateQuantity(itemIndex, newQuantity) {
    if (newQuantity < 1) {
      this.lnkRemoveClick(itemIndex);
      return;
    }
    
    const mycart = [...this.context.mycart];
    mycart[itemIndex].quantity = newQuantity;
    this.context.setMycart(mycart);
  }

  lnkRemoveClick(itemIndex) {
    const mycart = [...this.context.mycart];
    mycart.splice(itemIndex, 1);
    this.context.setMycart(mycart);
  }
  lnkCheckoutClick() {
    if (this.context.mycart.length > 0) {
      const customer = this.context.customer;
      if (customer) {
        // Redirect to payment page
        this.props.navigate("/payment");
      } else {
        this.props.navigate("/login");
      }
    } else {
      alert("Your cart is empty");
    }
  }
}
export default withRouter(withLanguage(Mycart));
