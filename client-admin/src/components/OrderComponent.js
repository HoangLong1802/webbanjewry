import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import axios from 'axios';

class Order extends Component {
  static contextType = MyContext;
  
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      selectedOrder: null,
      showOrderDetails: false,
      isLoading: false,
      searchTerm: "",
      filterStatus: "all",
      isFullscreen: false
    };
  }

  componentDidMount() {
    this.apiGetOrders();
  }

  // APIs
  apiGetOrders() {
    this.setState({ isLoading: true });
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/orders', config).then((res) => {
      const result = res.data;
      this.setState({ orders: result, isLoading: false });
    }).catch(() => {
      this.setState({ isLoading: false });
    });
  }

  apiPutOrderStatus(id, status) {
    const body = { status: status };
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.put('/api/admin/orders/status/' + id, body, config).then((res) => {
      const result = res.data;
      if (result) {
        this.apiGetOrders();
        alert('Order status updated successfully!');
      } else {
        alert('Error updating order status!');
      }
    });
  }

  handleOrderClick = (order) => {
    this.setState({ 
      selectedOrder: order,
      showOrderDetails: true,
      isFullscreen: true
    });
  }

  handleBackToOrders = () => {
    this.setState({ 
      showOrderDetails: false,
      isFullscreen: false
    });
  }

  toggleFullscreen = () => {
    this.setState({ isFullscreen: !this.state.isFullscreen });
  }

  handleApproveClick = (e, orderId) => {
    e.stopPropagation();
    this.apiPutOrderStatus(orderId, 'APPROVED');
  }

  handleCancelClick = (e, orderId) => {
    e.stopPropagation();
    this.apiPutOrderStatus(orderId, 'CANCELED');
  }

  handleSearchChange = (e) => {
    this.setState({ searchTerm: e.target.value });
  }

  handleFilterChange = (e) => {
    this.setState({ filterStatus: e.target.value });
  }

  getFilteredOrders = () => {
    const { orders, searchTerm, filterStatus } = this.state;
    return orders.filter(order => {
      const matchesSearch = order.customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           order.customer.phone?.includes(searchTerm) ||
                           order.total.toString().includes(searchTerm);
      
      const matchesFilter = filterStatus === "all" || 
                           order.status.toLowerCase() === filterStatus.toLowerCase();
      
      return matchesSearch && matchesFilter;
    });
  }

  getStatusBadgeClass = (status) => {
    switch(status.toLowerCase()) {
      case 'pending': return 'pending';
      case 'approved': return 'approved';
      case 'canceled': return 'canceled';
      default: return 'pending';
    }
  }

  render() {
    const { 
      selectedOrder, 
      showOrderDetails,
      isLoading,
      searchTerm,
      filterStatus,
      isFullscreen
    } = this.state;
    
    const filteredOrders = this.getFilteredOrders();

    return (
      <div className={`admin-page ${isFullscreen ? 'fullscreen-mode' : ''}`}>
        <div className="page-header">
          <h1 className="page-title">Order Management</h1>
          <p className="page-subtitle">Manage and track customer orders</p>
        </div>

        <div className="admin-content">
          {/* Orders List Section */}
          {!showOrderDetails && (
            <div className="orders-section">
              <div className="section-header">
                <h2>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                  </svg>
                  Order List ({filteredOrders.length})
                </h2>
                <div className="table-controls">
                  <div className="search-box">
                    <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8"></circle>
                      <path d="m21 21-4.35-4.35"></path>
                    </svg>
                    <input
                      type="text"
                      className="search-input"
                      placeholder="Search orders..."
                      value={searchTerm}
                      onChange={this.handleSearchChange}
                    />
                  </div>
                  <select className="filter-select" value={filterStatus} onChange={this.handleFilterChange}>
                    <option value="all">All Orders</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="canceled">Canceled</option>
                  </select>
                </div>
              </div>

              <div className="table-container">
                {isLoading ? (
                  <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Loading...</p>
                  </div>
                ) : (
                  <table className="modern-table">
                    <thead>
                      <tr>
                        <th>Order Date</th>
                        <th>Customer</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((order) => (
                        <tr 
                          key={order._id} 
                          className="table-row"
                          onClick={() => this.handleOrderClick(order)}
                        >
                          <td>
                            <div className="order-date-info">
                              <div className="order-date">
                                {new Date(order.cdate).toLocaleDateString()}
                              </div>
                              <div className="order-time">
                                {new Date(order.cdate).toLocaleTimeString()}
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="customer-info">
                              <div className="customer-name">{order.customer.name}</div>
                              <div className="customer-phone">{order.customer.phone}</div>
                            </div>
                          </td>
                          <td>
                            <div className="order-total">${order.total}</div>
                          </td>
                          <td>
                            <span className={`status-badge ${this.getStatusBadgeClass(order.status)}`}>
                              {order.status}
                            </span>
                          </td>
                          <td>
                            <div className="action-buttons">
                              {order.status === 'PENDING' && (
                                <>
                                  <button
                                    className="btn-icon btn-success"
                                    onClick={(e) => this.handleApproveClick(e, order._id)}
                                    title="Approve Order"
                                  >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <path d="M9 12l2 2 4-4"></path>
                                      <circle cx="12" cy="12" r="9"></circle>
                                    </svg>
                                  </button>
                                  <button
                                    className="btn-icon btn-danger"
                                    onClick={(e) => this.handleCancelClick(e, order._id)}
                                    title="Cancel Order"
                                  >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <circle cx="12" cy="12" r="10"></circle>
                                      <path d="m15 9-6 6"></path>
                                      <path d="m9 9 6 6"></path>
                                    </svg>
                                  </button>
                                </>
                              )}
                              <button
                                className="btn-icon btn-primary"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  this.handleOrderClick(order);
                                }}
                                title="View Details"
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                  <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* Order Details Section */}
          {showOrderDetails && selectedOrder && (
            <div className={`order-detail-section ${isFullscreen ? 'fullscreen' : ''}`}>
              {isFullscreen && (
                <button 
                  className="fullscreen-close"
                  onClick={this.handleBackToOrders}
                  title="Close fullscreen"
                >
                  ✕
                </button>
              )}
              
              <div className="detail-header">
                <h2 className="detail-title">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                  </svg>
                  Order Details
                </h2>
                <div className="header-actions">
                  {!isFullscreen && (
                    <button 
                      className="btn-secondary"
                      onClick={this.toggleFullscreen}
                      title="Expand fullscreen"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
                      </svg>
                    </button>
                  )}
                  <button 
                    className="btn-secondary"
                    onClick={this.handleBackToOrders}
                  >
                    ← Back to Orders
                  </button>
                </div>
              </div>

              <div className="detail-content">
                <div className="order-details">
                  <div className="order-header">
                    <div className="order-info-section">
                      <h3>Order from {selectedOrder.customer.name}</h3>
                      <p>Phone: {selectedOrder.customer.phone}</p>
                      <p>Date: {new Date(selectedOrder.cdate).toLocaleString()}</p>
                    </div>
                    <div className="order-status-section">
                      <span className={`status-badge ${this.getStatusBadgeClass(selectedOrder.status)}`}>
                        {selectedOrder.status}
                      </span>
                      <div className="status-actions">
                        {selectedOrder.status === 'PENDING' && (
                          <>
                            <button
                              className="btn-success"
                              onClick={() => this.apiPutOrderStatus(selectedOrder._id, 'APPROVED')}
                            >
                              Approve Order
                            </button>
                            <button
                              className="btn-danger"
                              onClick={() => this.apiPutOrderStatus(selectedOrder._id, 'CANCELED')}
                            >
                              Cancel Order
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="order-items">
                    <h4>Order Items</h4>
                    <table className="items-table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Product</th>
                          <th>Price</th>
                          <th>Quantity</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.items.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>
                              <div className="product-info">
                                <img
                                  src={"data:image/jpg;base64," + item.product.image}
                                  alt={item.product.name}
                                  className="product-image"
                                />
                                <span>{item.product.name}</span>
                              </div>
                            </td>
                            <td>${item.product.price}</td>
                            <td>{item.quantity}</td>
                            <td>${item.product.price * item.quantity}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    
                    <div className="order-total-summary">
                      <strong>Total: ${selectedOrder.total}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Order;