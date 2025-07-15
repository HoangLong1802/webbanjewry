import axios from 'axios';
import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import MyContext from '../contexts/MyContext';
import { withLanguage } from './LanguageSwitcher';

class Myorders extends Component {
  static contextType = MyContext;
  
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      order: null,
      showNotification: false,
      notificationMessage: '',
      notificationType: 'success'
    };
  }

  showNotification = (message, type = 'success') => {
    this.setState({ 
      showNotification: true, 
      notificationMessage: message,
      notificationType: type
    });
    setTimeout(() => {
      this.setState({ showNotification: false });
    }, 4000);
  }

  formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  }

  formatDate = (date) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getStatusBadge = (status) => {
    const statusStyles = {
      'PENDING': { bg: '#fef3c7', color: '#f59e0b', text: 'Pending' },
      'CONFIRMED': { bg: '#dcfce7', color: '#16a34a', text: 'Confirmed' },
      'SHIPPED': { bg: '#dbeafe', color: '#3b82f6', text: 'Shipped' },
      'DELIVERED': { bg: '#f0f9ff', color: '#0ea5e9', text: 'Delivered' },
      'CANCELLED': { bg: '#fee2e2', color: '#ef4444', text: 'Cancelled' }
    };
    
    const style = statusStyles[status] || statusStyles['PENDING'];
    return (
      <span className="status-badge" style={{ backgroundColor: style.bg, color: style.color }}>
        {style.text}
      </span>
    );
  }

  render() {
    if (this.context.token === '') return (<Navigate replace to='/login' />);
    
    const { t } = this.props;
    const fallbackTranslations = {
      myOrders: 'My Orders',
      orderHistory: 'Order History',
      orderId: 'Order ID',
      orderDate: 'Order Date',
      total: 'Total',
      status: 'Status',
      viewDetails: 'View Details',
      orderDetails: 'Order Details',
      product: 'Product',
      price: 'Price',
      quantity: 'Quantity',
      amount: 'Amount',
      subtotal: 'Subtotal',
      noOrders: 'No Orders Found',
      noOrdersMessage: 'You haven\'t placed any orders yet. Start shopping to see your orders here!',
      continueShopping: 'Continue Shopping',
      backToOrders: 'Back to Orders',
      orderSummary: 'Order Summary'
    };

    const tFunc = t || ((key) => fallbackTranslations[key] || key);

    const orders = this.state.orders.map((item) => {
      return (
        <div key={item._id} className="order-card" onClick={() => this.trItemClick(item)}>
          <div className="order-header">
            <div className="order-info">
              <h3 className="order-id">#{item._id.substring(0, 8)}</h3>
              <p className="order-date">{this.formatDate(item.cdate)}</p>
            </div>
            <div className="order-status">
              {this.getStatusBadge(item.status)}
            </div>
          </div>
          <div className="order-body">
            <div className="order-details">
              <div className="order-total">
                <span className="total-label">{tFunc('total')}:</span>
                <span className="total-amount">{this.formatPrice(item.total)} VND</span>
              </div>
              <div className="order-items-count">
                {item.items.length} {item.items.length === 1 ? 'item' : 'items'}
              </div>
            </div>
            <button className="view-details-btn">{tFunc('viewDetails')}</button>
          </div>
        </div>
      );
    });

    if (this.state.order) {
      var items = this.state.order.items.map((item, index) => {
        return (
          <div key={item.product._id} className="order-item">
            <div className="item-image">
              <img src={"data:image/jpg;base64," + item.product.image} alt={item.product.name} />
            </div>
            <div className="item-details">
              <h4 className="item-name">{item.product.name}</h4>
              <div className="item-options">
                {item.selectedSize && <span className="item-option">Size: {item.selectedSize}</span>}
                {item.selectedColor && <span className="item-option">Color: {item.selectedColor}</span>}
              </div>
              <div className="item-price">{this.formatPrice(item.product.price)} VND</div>
            </div>
            <div className="item-quantity">
              <span className="quantity-label">{tFunc('quantity')}:</span>
              <span className="quantity-value">{item.quantity}</span>
            </div>
            <div className="item-amount">
              <span className="amount-value">{this.formatPrice(item.product.price * item.quantity)} VND</span>
            </div>
          </div>
        );
      });
    }

    return (
      <div className="myorders-page">
        {/* Notification */}
        {this.state.showNotification && (
          <div className={`notification-toast ${this.state.notificationType}`}>
            <div className="notification-content">
              <span className="notification-icon">
                {this.state.notificationType === 'success' ? '✅' : '❌'}
              </span>
              <span className="notification-text">{this.state.notificationMessage}</span>
            </div>
          </div>
        )}

        <div className="container">
          <div className="page-header">
            <h1 className="page-title">{tFunc('myOrders')}</h1>
            <p className="page-subtitle">{tFunc('orderHistory')}</p>
          </div>

          {!this.state.order ? (
            <div className="orders-section">
              {this.state.orders.length > 0 ? (
                <div className="orders-grid">
                  {orders}
                </div>
              ) : (
                <div className="no-orders">
                  <div className="no-orders-icon">
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                      <line x1="3" y1="6" x2="21" y2="6"></line>
                      <path d="M16 10a4 4 0 0 1-8 0"></path>
                    </svg>
                  </div>
                  <h2>{tFunc('noOrders')}</h2>
                  <p>{tFunc('noOrdersMessage')}</p>
                  <button className="continue-shopping-btn" onClick={() => window.location.href = '/products'}>
                    {tFunc('continueShopping')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="order-details-section">
              <div className="order-details-header">
                <button className="back-btn" onClick={() => this.setState({ order: null })}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 12H5"></path>
                    <path d="M12 19l-7-7 7-7"></path>
                  </svg>
                  {tFunc('backToOrders')}
                </button>
                <div className="order-details-title">
                  <h2>{tFunc('orderDetails')}</h2>
                  <div className="order-details-meta">
                    <span className="order-id">#{this.state.order._id.substring(0, 8)}</span>
                    <span className="order-date">{this.formatDate(this.state.order.cdate)}</span>
                    {this.getStatusBadge(this.state.order.status)}
                  </div>
                </div>
              </div>

              <div className="order-details-content">
                <div className="order-items-section">
                  <h3>{tFunc('orderSummary')}</h3>
                  <div className="order-items-list">
                    {items}
                  </div>
                </div>

                <div className="order-summary-section">
                  <div className="order-summary-card">
                    <div className="summary-row">
                      <span>{tFunc('subtotal')}</span>
                      <span>{this.formatPrice(this.state.order.total)} VND</span>
                    </div>
                    <div className="summary-row">
                      <span>Shipping</span>
                      <span>Free</span>
                    </div>
                    <div className="summary-divider"></div>
                    <div className="summary-row summary-total">
                      <span>{tFunc('total')}</span>
                      <span>{this.formatPrice(this.state.order.total)} VND</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <style jsx>{`
          .myorders-page {
            background: #fafafa;
            min-height: 100vh;
            padding: 20px 0;
          }

          .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
          }

          /* Notification */
          .notification-toast {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 24px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            z-index: 1000;
            animation: slideInRight 0.3s ease-out;
          }

          .notification-toast.success {
            background: #10b981;
            color: white;
          }

          .notification-toast.error {
            background: #ef4444;
            color: white;
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

          /* Page Header */
          .page-header {
            text-align: center;
            margin-bottom: 40px;
          }

          .page-title {
            font-size: 2.5rem;
            font-weight: 300;
            color: #2c3e50;
            margin-bottom: 10px;
          }

          .page-subtitle {
            color: #666;
            font-size: 1.1rem;
          }

          /* Orders Grid */
          .orders-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
            gap: 20px;
          }

          .order-card {
            background: white;
            border-radius: 16px;
            padding: 24px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
            cursor: pointer;
            transition: all 0.3s ease;
            border: 1px solid transparent;
          }

          .order-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 30px rgba(0,0,0,0.12);
            border-color: #c8860d;
          }

          .order-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 20px;
          }

          .order-id {
            font-size: 1.2rem;
            font-weight: 600;
            color: #2c3e50;
            margin: 0 0 5px 0;
          }

          .order-date {
            color: #666;
            font-size: 14px;
            margin: 0;
          }

          .status-badge {
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .order-body {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .order-details {
            flex: 1;
          }

          .order-total {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 8px;
          }

          .total-label {
            color: #666;
            font-size: 14px;
          }

          .total-amount {
            font-size: 1.2rem;
            font-weight: 600;
            color: #c8860d;
          }

          .order-items-count {
            color: #666;
            font-size: 14px;
          }

          .view-details-btn {
            background: #c8860d;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
          }

          .view-details-btn:hover {
            background: #a86e0b;
            transform: translateY(-1px);
          }

          /* No Orders */
          .no-orders {
            text-align: center;
            padding: 60px 20px;
            background: white;
            border-radius: 16px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          }

          .no-orders-icon {
            color: #c8860d;
            margin-bottom: 20px;
          }

          .no-orders h2 {
            color: #2c3e50;
            margin-bottom: 10px;
          }

          .no-orders p {
            color: #666;
            margin-bottom: 30px;
          }

          .continue-shopping-btn {
            background: #c8860d;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
          }

          .continue-shopping-btn:hover {
            background: #a86e0b;
            transform: translateY(-1px);
          }

          /* Order Details */
          .order-details-header {
            display: flex;
            align-items: center;
            gap: 20px;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 1px solid #eee;
          }

          .back-btn {
            background: #f8f9fa;
            border: none;
            padding: 12px 16px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
            transition: all 0.2s;
            color: #2c3e50;
          }

          .back-btn:hover {
            background: #e9ecef;
          }

          .order-details-title h2 {
            color: #2c3e50;
            margin: 0 0 10px 0;
          }

          .order-details-meta {
            display: flex;
            align-items: center;
            gap: 15px;
          }

          .order-details-content {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 30px;
          }

          .order-items-section {
            background: white;
            border-radius: 16px;
            padding: 24px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          }

          .order-items-section h3 {
            color: #2c3e50;
            margin-bottom: 20px;
          }

          .order-items-list {
            display: flex;
            flex-direction: column;
            gap: 20px;
          }

          .order-item {
            display: flex;
            align-items: center;
            gap: 20px;
            padding: 16px;
            border: 1px solid #eee;
            border-radius: 12px;
          }

          .item-image {
            width: 80px;
            height: 80px;
            border-radius: 8px;
            overflow: hidden;
            flex-shrink: 0;
          }

          .item-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .item-details {
            flex: 1;
          }

          .item-name {
            color: #2c3e50;
            margin: 0 0 8px 0;
            font-size: 1.1rem;
          }

          .item-options {
            display: flex;
            gap: 15px;
            margin-bottom: 8px;
          }

          .item-option {
            color: #666;
            font-size: 14px;
          }

          .item-price {
            color: #c8860d;
            font-weight: 600;
          }

          .item-quantity {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 5px;
          }

          .quantity-label {
            color: #666;
            font-size: 12px;
          }

          .quantity-value {
            font-weight: 600;
            color: #2c3e50;
          }

          .item-amount {
            text-align: right;
            font-weight: 600;
            color: #2c3e50;
          }

          .order-summary-section {
            align-self: start;
          }

          .order-summary-card {
            background: white;
            border-radius: 16px;
            padding: 24px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
            position: sticky;
            top: 20px;
          }

          .summary-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
          }

          .summary-row span:first-child {
            color: #666;
          }

          .summary-row span:last-child {
            font-weight: 500;
            color: #2c3e50;
          }

          .summary-divider {
            height: 1px;
            background: #eee;
            margin: 20px 0;
          }

          .summary-total {
            font-size: 1.2rem;
            font-weight: 600;
            color: #2c3e50;
          }

          .summary-total span:last-child {
            color: #c8860d;
          }

          /* Responsive */
          @media (max-width: 768px) {
            .orders-grid {
              grid-template-columns: 1fr;
            }

            .order-details-content {
              grid-template-columns: 1fr;
            }

            .order-item {
              flex-direction: column;
              text-align: center;
            }

            .item-options {
              justify-content: center;
            }

            .page-title {
              font-size: 2rem;
            }
          }
        `}</style>
      </div>
    );
  }
  componentDidMount() {
    if (this.context.customer) {
      const cid = this.context.customer._id;
      this.apiGetOrdersByCustID(cid);
    }
  }
  // event-handlers
  trItemClick(item) {
    this.setState({ order: item });
  }
  // apis
  apiGetOrdersByCustID(cid) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/customer/orders/customer/' + cid, config).then((res) => {
      const result = res.data;
      this.setState({ orders: result });
    });
  }
}

export default withLanguage(Myorders);