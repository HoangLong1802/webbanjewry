import React, { Component } from "react";
import MyContext from "../contexts/MyContext";
import axios from "axios";

class Customer extends Component {
  static contextType = MyContext;
  
  constructor(props) {
    super(props);
    this.state = {
      customers: [],
      orders: [],
      selectedCustomer: null,
      selectedOrder: null,
      showOrderDetails: false,
      isLoading: false,
      searchTerm: "",
      filterStatus: "all"
    };
  }

  componentDidMount() {
    this.apiGetCustomers();
  }

  // APIs
  apiGetCustomers() {
    this.setState({ isLoading: true });
    const config = { headers: { "x-access-token": this.context.token } };
    axios.get("/api/admin/customers", config).then((res) => {
      const result = res.data;
      this.setState({ customers: result, isLoading: false });
    }).catch(() => {
      this.setState({ isLoading: false });
    });
  }

  apiGetOrdersByCustID(customerId) {
    this.setState({ isLoading: true });
    const config = { headers: { "x-access-token": this.context.token } };
    axios.get("/api/admin/orders/customer/" + customerId, config).then((res) => {
      const result = res.data;
      this.setState({ orders: result, isLoading: false });
    }).catch(() => {
      this.setState({ isLoading: false });
    });
  }

  apiPutCustomerDeactive(id, token) {
    const body = { token: token };
    const config = { headers: { "x-access-token": this.context.token } };
    axios.put("/api/admin/customers/deactive/" + id, body, config).then((res) => {
      const result = res.data;
      if (result) {
        this.apiGetCustomers();
        alert("Customer status updated successfully!");
      } else {
        alert("Error updating customer status!");
      }
    });
  }

  apiGetCustomerSendmail(id) {
    const config = { headers: { "x-access-token": this.context.token } };
    axios.get("/api/admin/customers/sendmail/" + id, config).then((res) => {
      const result = res.data;
      alert(result.message);
    });
  }

  handleCustomerClick = (customer) => {
    this.setState({ 
      selectedCustomer: customer,
      selectedOrder: null,
      showOrderDetails: false 
    });
    this.apiGetOrdersByCustID(customer._id);
  }

  handleOrderClick = (order) => {
    this.setState({ 
      selectedOrder: order,
      showOrderDetails: true 
    });
  }

  handleStatusToggle = (customer) => {
    if (customer.active === 0) {
      this.apiGetCustomerSendmail(customer._id);
    } else {
      this.apiPutCustomerDeactive(customer._id, customer.token);
    }
  }

  handleSearchChange = (e) => {
    this.setState({ searchTerm: e.target.value });
  }

  handleFilterChange = (e) => {
    this.setState({ filterStatus: e.target.value });
  }

  handleBackToOrders = () => {
    this.setState({ showOrderDetails: false });
  }

  getFilteredCustomers = () => {
    const { customers, searchTerm, filterStatus } = this.state;
    return customers.filter(customer => {
      const matchesSearch = customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           customer.phone?.includes(searchTerm);
      
      const matchesFilter = filterStatus === "all" || 
                           (filterStatus === "active" && customer.active === 1) ||
                           (filterStatus === "inactive" && customer.active === 0);
      
      return matchesSearch && matchesFilter;
    });
  }

  render() {
    const { 
      orders, 
      selectedCustomer, 
      selectedOrder, 
      showOrderDetails,
      isLoading,
      searchTerm,
      filterStatus
    } = this.state;
    
    const filteredCustomers = this.getFilteredCustomers();

    return (
      <div className="admin-page">
        <div className="page-header">
          <h1 className="page-title">Customer Management</h1>
          <p className="page-subtitle">Manage customers and orders</p>
        </div>

        <div className="admin-content">
          {/* Customer List Section */}
          <div className="customers-section">
            <div className="section-header">
              <h2>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                Customer List ({filteredCustomers.length})
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
                    placeholder="Search customers..."
                    value={searchTerm}
                    onChange={this.handleSearchChange}
                  />
                </div>
                <select className="filter-select" value={filterStatus} onChange={this.handleFilterChange}>
                  <option value="all">All Customers</option>
                  <option value="active">Active Customers</option>
                  <option value="inactive">Inactive Customers</option>
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
                      <th>Customer Info</th>
                      <th>Contact</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.map((customer) => (
                      <tr 
                        key={customer._id} 
                        className={`table-row ${selectedCustomer?._id === customer._id ? 'selected' : ''}`}
                        onClick={() => this.handleCustomerClick(customer)}
                      >
                        <td>
                          <div className="customer-info">
                            <div className="customer-icon">
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                              </svg>
                            </div>
                            <div>
                              <div className="customer-name">{customer.name}</div>
                              <div className="customer-username">@{customer.username}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="contact-info">
                            <div>{customer.email}</div>
                            <div className="phone">{customer.phone}</div>
                          </div>
                        </td>
                        <td>
                          <span className={`status-badge ${customer.active === 1 ? 'active' : 'inactive'}`}>
                            {customer.active === 1 ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className={`btn-icon ${customer.active === 1 ? 'btn-warning' : 'btn-success'}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                this.handleStatusToggle(customer);
                              }}
                              title={customer.active === 1 ? 'Deactivate' : 'Send Email & Activate'}
                            >
                              {customer.active === 1 ? (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <circle cx="12" cy="12" r="3"></circle>
                                  <path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24"></path>
                                </svg>
                              ) : (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                  <polyline points="22,6 12,13 2,6"></polyline>
                                </svg>
                              )}
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

          {/* Order Details Section */}
          {selectedCustomer && (
            <div className="customer-detail-section">
              <div className="detail-header">
                <h2 className="detail-title">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                  </svg>
                  {showOrderDetails ? 'Order Details' : 'Customer Orders'}
                </h2>
                {showOrderDetails && (
                  <button 
                    className="btn-secondary"
                    onClick={this.handleBackToOrders}
                  >
                    ← Back to Orders
                  </button>
                )}
              </div>

              <div className="detail-content">
                {!showOrderDetails ? (
                  /* Orders List */
                  <div>
                    <div className="customer-summary">
                      <h3>{selectedCustomer.name}</h3>
                      <p>{selectedCustomer.email}</p>
                      <p>Total Orders: {orders.length}</p>
                    </div>
                    
                    {orders.length > 0 ? (
                      <div className="orders-list">
                        {orders.map((order) => (
                          <div 
                            key={order._id}
                            className="order-card"
                            onClick={() => this.handleOrderClick(order)}
                          >
                            <div className="order-info">
                              <div className="order-date">
                                {new Date(order.cdate).toLocaleDateString()}
                              </div>
                              <div className="order-total">
                                ${order.total}
                              </div>
                              <div className="order-status">
                                <span className={`status-badge ${order.status.toLowerCase()}`}>
                                  {order.status}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="empty-state">
                        <p>No orders found</p>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Order Details */
                  selectedOrder && (
                    <div className="order-details">
                      <div className="order-header">
                        <h3>Order - {new Date(selectedOrder.cdate).toLocaleDateString()}</h3>
                        <span className={`status-badge ${selectedOrder.status.toLowerCase()}`}>
                          {selectedOrder.status}
                        </span>
                      </div>
                      
                      <div className="order-items">
                        <h4>Order Items</h4>
                        <table className="items-table">
                          <thead>
                            <tr>
                              <th>Product</th>
                              <th>Price</th>
                              <th>Quantity</th>
                              <th>Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedOrder.items.map((item, index) => (
                              <tr key={index}>
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
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Customer;
