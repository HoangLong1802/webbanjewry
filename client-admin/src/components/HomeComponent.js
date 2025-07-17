import React, { Component } from "react";
import MyContext from "../contexts/MyContext";
import { useLanguage } from "../contexts/LanguageContext";
import axios from "axios";

class Home extends Component {
  static contextType = MyContext;

  render() {
    return <HomeWithLanguage />;
  }
}

// Functional component to use language hooks
const HomeWithLanguage = () => {
  const { t } = useLanguage();
  const [stats, setStats] = React.useState({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    totalCategories: 0,
    loading: true
  });
  const [recentOrders, setRecentOrders] = React.useState([]);
  const [ordersLoading, setOrdersLoading] = React.useState(true);
  const [chartData, setChartData] = React.useState({
    salesChart: [],
    revenueChart: [],
    categoryChart: []
  });
  const [selectedChart, setSelectedChart] = React.useState(null);

  React.useEffect(() => {
    fetchDashboardStats();
    fetchRecentOrders();
    fetchChartData();
  }, []);

  const fetchChartData = async () => {
    try {
      const baseUrl = 'http://localhost:3000'; // Server is running on port 3000
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-access-token': token // Using the correct header format
        }
      };

      // Fetch chart data
      const ordersResponse = await axios.get(`${baseUrl}/api/admin/orders`, config);
      const orders = ordersResponse.data;
      
      // Generate sales chart data (last 7 days)
      const salesData = generateSalesChartData(orders);
      const revenueData = generateRevenueChartData(orders);
      const categoryData = await generateCategoryChartData(config, baseUrl);

      setChartData({
        salesChart: salesData,
        revenueChart: revenueData,
        categoryChart: categoryData
      });
    } catch (error) {
      console.error('Error fetching chart data:', error);
      // Fallback mock data
      setChartData({
        salesChart: [
          { date: '2024-01-01', sales: 45 },
          { date: '2024-01-02', sales: 52 },
          { date: '2024-01-03', sales: 48 },
          { date: '2024-01-04', sales: 61 },
          { date: '2024-01-05', sales: 55 },
          { date: '2024-01-06', sales: 67 },
          { date: '2024-01-07', sales: 73 }
        ],
        revenueChart: [
          { month: 'Jan', revenue: 15000 },
          { month: 'Feb', revenue: 18000 },
          { month: 'Mar', revenue: 22000 },
          { month: 'Apr', revenue: 19000 },
          { month: 'May', revenue: 25000 },
          { month: 'Jun', revenue: 28000 }
        ],
        categoryChart: [
          { category: 'Rings', count: 45, percentage: 35 },
          { category: 'Necklaces', count: 32, percentage: 25 },
          { category: 'Bracelets', count: 28, percentage: 22 },
          { category: 'Earrings', count: 23, percentage: 18 }
        ]
      });
    }
  };

  const generateSalesChartData = (orders) => {
    const last7Days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayOrders = orders.filter(order => {
        const orderDate = new Date(order.orderdate || order.date);
        return orderDate.toISOString().split('T')[0] === dateStr;
      });
      
      last7Days.push({
        date: dateStr,
        sales: dayOrders.length,
        revenue: dayOrders.reduce((sum, order) => sum + (order.total || 0), 0)
      });
    }
    
    return last7Days;
  };

  const generateRevenueChartData = (orders) => {
    const monthlyRevenue = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    orders.forEach(order => {
      const orderDate = new Date(order.orderdate || order.date);
      const month = months[orderDate.getMonth()];
      
      if (!monthlyRevenue[month]) {
        monthlyRevenue[month] = 0;
      }
      monthlyRevenue[month] += order.total || 0;
    });
    
    return months.map(month => ({
      month,
      revenue: monthlyRevenue[month] || 0
    })).filter(item => item.revenue > 0);
  };

  const generateCategoryChartData = async (config, baseUrl) => {
    try {
      const productsResponse = await axios.get(`${baseUrl}/api/admin/products`, config);
      const categoriesResponse = await axios.get(`${baseUrl}/api/admin/categories`, config);
      
      const products = productsResponse.data.products || [];
      const categories = categoriesResponse.data || [];
      
      const categoryCount = {};
      products.forEach(product => {
        const categoryName = product.category?.name || 'Uncategorized';
        categoryCount[categoryName] = (categoryCount[categoryName] || 0) + 1;
      });
      
      const total = products.length;
      return Object.entries(categoryCount).map(([category, count]) => ({
        category,
        count,
        percentage: Math.round((count / total) * 100)
      }));
    } catch (error) {
      return [];
    }
  };

  const fetchDashboardStats = async () => {
    try {
      // Try to fetch real data from server
      const baseUrl = 'http://localhost:3000'; // Server is running on port 3000
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-access-token': token // Using the correct header format
        }
      };
      
      // Fetch products count
      const productsResponse = await axios.get(`${baseUrl}/api/admin/products`, config);
      const totalProducts = productsResponse.data.products ? productsResponse.data.products.length : 0;

      // Fetch orders count and calculate revenue
      const ordersResponse = await axios.get(`${baseUrl}/api/admin/orders`, config);
      const orders = ordersResponse.data;
      const totalOrders = orders.length;
      const totalRevenue = orders.reduce((sum, order) => {
        return sum + (order.total || 0);
      }, 0);

      // Fetch customers count
      const customersResponse = await axios.get(`${baseUrl}/api/admin/customers`, config);
      const totalCustomers = customersResponse.data.length;

      // Fetch categories count
      const categoriesResponse = await axios.get(`${baseUrl}/api/admin/categories`, config);
      const totalCategories = categoriesResponse.data.length;

      setStats({
        totalProducts,
        totalOrders,
        totalCustomers,
        totalRevenue,
        totalCategories,
        loading: false
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Fallback to mock data if server is unavailable
      setStats({
        totalProducts: 156,
        totalOrders: 89,
        totalCustomers: 234,
        totalRevenue: 45678,
        totalCategories: 12,
        loading: false
      });
    }
  };

  const fetchRecentOrders = async () => {
    try {
      const baseUrl = 'http://localhost:3000'; // Server is running on port 3000
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-access-token': token // Using the correct header format
        }
      };
      
      const response = await axios.get(`${baseUrl}/api/admin/orders`, config);
      const orders = response.data;
      
      // Sort by date and get recent 5 orders
      const sortedOrders = orders.sort((a, b) => {
        const dateA = new Date(a.orderdate || a.date);
        const dateB = new Date(b.orderdate || b.date);
        return dateB - dateA;
      }).slice(0, 5);

      // Fetch customer details for each order
      const ordersWithCustomers = await Promise.all(
        sortedOrders.map(async (order) => {
          try {
            const customerResponse = await axios.get(`${baseUrl}/api/admin/customers/${order.customer}`, config);
            return {
              id: order._id,
              customer: customerResponse.data.name || 'Unknown Customer',
              status: order.status || 'Processing',
              total: order.total || 0,
              date: order.orderdate || new Date().toISOString()
            };
          } catch (error) {
            console.error('Error fetching customer:', error);
            return {
              id: order._id,
              customer: 'Unknown Customer',
              status: order.status || 'Processing',
              total: order.total || 0,
              date: order.orderdate || new Date().toISOString()
            };
          }
        })
      );

      setRecentOrders(ordersWithCustomers);
      setOrdersLoading(false);
    } catch (error) {
      console.error('Error fetching recent orders:', error);
      // Fallback to mock data
      setRecentOrders([
        { id: 1, customer: 'John Doe', status: 'Completed', total: 125.50, date: '2024-01-15' },
        { id: 2, customer: 'Jane Smith', status: 'Processing', total: 89.99, date: '2024-01-14' },
        { id: 3, customer: 'Bob Johnson', status: 'Pending', total: 200.00, date: '2024-01-13' },
        { id: 4, customer: 'Alice Brown', status: 'Completed', total: 150.75, date: '2024-01-12' },
        { id: 5, customer: 'Charlie Wilson', status: 'Processing', total: 99.99, date: '2024-01-11' }
      ]);
      setOrdersLoading(false);
    }
  };

  const renderChart = (type, data) => {
    switch (type) {
      case 'sales':
        return (
          <div className="chart-container">
            <div className="line-chart">
              {data.map((item, index) => (
                <div key={index} className="chart-point" style={{ height: `${Math.min(item.sales * 2, 40)}px` }}>
                  <div className="point-label">{item.sales}</div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'revenue':
        return (
          <div className="chart-container">
            <div className="bar-chart">
              {data.map((item, index) => (
                <div key={index} className="bar-item">
                  <div className="bar" style={{ height: `${Math.min(item.revenue / 1000, 40)}px` }}>
                    <div className="bar-label">${Math.round(item.revenue / 1000)}k</div>
                  </div>
                  <div className="bar-month">{item.month}</div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'category':
        return (
          <div className="chart-container">
            <div className="pie-chart-circle">
              <svg width="60" height="60" viewBox="0 0 60 60">
                {data.map((item, index) => {
                  const total = data.reduce((sum, d) => sum + d.percentage, 0);
                  let currentAngle = 0;
                  
                  // Calculate angles for previous slices
                  for (let i = 0; i < index; i++) {
                    currentAngle += (data[i].percentage / total) * 360;
                  }
                  
                  const sliceAngle = (item.percentage / total) * 360;
                  const radius = 25;
                  const centerX = 30;
                  const centerY = 30;
                  
                  // Calculate path for pie slice
                  const startAngle = (currentAngle * Math.PI) / 180;
                  const endAngle = ((currentAngle + sliceAngle) * Math.PI) / 180;
                  
                  const x1 = centerX + radius * Math.cos(startAngle);
                  const y1 = centerY + radius * Math.sin(startAngle);
                  const x2 = centerX + radius * Math.cos(endAngle);
                  const y2 = centerY + radius * Math.sin(endAngle);
                  
                  const largeArcFlag = sliceAngle > 180 ? 1 : 0;
                  
                  const pathData = [
                    `M ${centerX} ${centerY}`,
                    `L ${x1} ${y1}`,
                    `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                    'Z'
                  ].join(' ');
                  
                  const colors = ['#3498db', '#2ecc71', '#f39c12', '#e74c3c', '#9b59b6'];
                  
                  return (
                    <path
                      key={index}
                      d={pathData}
                      fill={colors[index % colors.length]}
                      stroke="#fff"
                      strokeWidth="1"
                    />
                  );
                })}
              </svg>
              <div className="pie-legend">
                {data.map((item, index) => (
                  <div key={index} className="legend-item">
                    <div 
                      className="legend-color"
                      style={{ backgroundColor: ['#3498db', '#2ecc71', '#f39c12', '#e74c3c', '#9b59b6'][index % 5] }}
                    ></div>
                    <span className="legend-text">{item.category}: {item.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  const renderDetailedChart = (type, data) => {
    switch (type) {
      case 'sales':
        return (
          <div className="chart-container detailed">
            <h4>{t('charts_sales_title')}</h4>
            <div className="line-chart detailed">
              {data.map((item, index) => (
                <div key={index} className="chart-point detailed" style={{ height: `${Math.min(item.sales * 5, 150)}px` }}>
                  <div className="point-label">{item.sales}</div>
                  <div className="point-date">{new Date(item.date).toLocaleDateString()}</div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'revenue':
        return (
          <div className="chart-container detailed">
            <h4>{t('charts_revenue_title')}</h4>
            <div className="bar-chart detailed">
              {data.map((item, index) => (
                <div key={index} className="bar-item">
                  <div className="bar detailed" style={{ height: `${Math.min(item.revenue / 200, 150)}px` }}>
                    <div className="bar-label">${Math.round(item.revenue / 1000)}k</div>
                  </div>
                  <div className="bar-month">{item.month}</div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'category':
        return (
          <div className="chart-container detailed">
            <h4>{t('charts_category_title')}</h4>
            <div className="pie-chart-circle detailed">
              <svg width="200" height="200" viewBox="0 0 200 200">
                {data.map((item, index) => {
                  const total = data.reduce((sum, d) => sum + d.percentage, 0);
                  let currentAngle = 0;
                  
                  // Calculate angles for previous slices
                  for (let i = 0; i < index; i++) {
                    currentAngle += (data[i].percentage / total) * 360;
                  }
                  
                  const sliceAngle = (item.percentage / total) * 360;
                  const radius = 80;
                  const centerX = 100;
                  const centerY = 100;
                  
                  // Calculate path for pie slice
                  const startAngle = (currentAngle * Math.PI) / 180;
                  const endAngle = ((currentAngle + sliceAngle) * Math.PI) / 180;
                  
                  const x1 = centerX + radius * Math.cos(startAngle);
                  const y1 = centerY + radius * Math.sin(startAngle);
                  const x2 = centerX + radius * Math.cos(endAngle);
                  const y2 = centerY + radius * Math.sin(endAngle);
                  
                  const largeArcFlag = sliceAngle > 180 ? 1 : 0;
                  
                  const pathData = [
                    `M ${centerX} ${centerY}`,
                    `L ${x1} ${y1}`,
                    `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                    'Z'
                  ].join(' ');
                  
                  const colors = ['#3498db', '#2ecc71', '#f39c12', '#e74c3c', '#9b59b6'];
                  
                  return (
                    <path
                      key={index}
                      d={pathData}
                      fill={colors[index % colors.length]}
                      stroke="#fff"
                      strokeWidth="2"
                    />
                  );
                })}
              </svg>
              <div className="pie-legend detailed">
                {data.map((item, index) => (
                  <div key={index} className="legend-item detailed">
                    <div 
                      className="legend-color detailed"
                      style={{ backgroundColor: ['#3498db', '#2ecc71', '#f39c12', '#e74c3c', '#9b59b6'][index % 5] }}
                    ></div>
                    <span className="legend-text detailed">{item.category}: {item.count} items ({item.percentage}%)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  const openChartModal = (chartType) => {
    setSelectedChart(chartType);
  };

  const closeChartModal = () => {
    setSelectedChart(null);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return '#28a745';
      case 'processing':
        return '#ffc107';
      case 'pending':
        return '#dc3545';
      case 'shipped':
        return '#007bff';
      default:
        return '#6c757d';
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">{t('dashboard')}</h1>
        <p className="dashboard-subtitle">{t('welcome_back')}</p>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon products">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-number">
              {stats.loading ? <div className="loading-spinner"></div> : stats.totalProducts}
            </div>
            <div className="stat-label">{t('total_products')}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orders">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 11H5a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2h-4l-3-3-3 3"></path>
              <path d="M12 2L9 5l3 3 3-3-3-3z"></path>
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-number">
              {stats.loading ? <div className="loading-spinner"></div> : stats.totalOrders}
            </div>
            <div className="stat-label">{t('total_orders')}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon customers">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-number">
              {stats.loading ? <div className="loading-spinner"></div> : stats.totalCustomers}
            </div>
            <div className="stat-label">{t('total_customers')}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon revenue">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-number">
              {stats.loading ? <div className="loading-spinner"></div> : formatCurrency(stats.totalRevenue)}
            </div>
            <div className="stat-label">{t('total_revenue')}</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="actions-grid">
        <div className="action-card">
          <div className="action-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="16"></line>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
          </div>
          <div className="action-content">
            <h3>{t('add_product')}</h3>
            <p>{t('add_new_product_description')}</p>
          </div>
        </div>

        <div className="action-card">
          <div className="action-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          <div className="action-content">
            <h3>{t('manage_categories')}</h3>
            <p>{t('manage_categories_description')}</p>
          </div>
        </div>

        <div className="action-card">
          <div className="action-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 11H5a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2h-4l-3-3-3 3"></path>
              <path d="M12 2L9 5l3 3 3-3-3-3z"></path>
            </svg>
          </div>
          <div className="action-content">
            <h3>{t('view_orders')}</h3>
            <p>{t('view_orders_description')}</p>
          </div>
        </div>
      </div>

      {/* Analytics & Charts Section */}
      <div className="charts-section">
        <div className="section-header">
          <div className="section-title-row">
            <div className="section-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <polyline points="9,9 9,15"></polyline>
                <polyline points="15,7 15,15"></polyline>
                <polyline points="12,11 12,15"></polyline>
              </svg>
            </div>
            <div className="section-content">
              <h2>Analytics & Charts</h2>
              <p>Click on any chart to view detailed analysis</p>
            </div>
          </div>
        </div>
        
        <div className="charts-grid">
          <div className="chart-card modern-card" onClick={() => openChartModal('sales')}>
            <div className="chart-header">
              <div className="header-left">
                <h3>Sales Trends</h3>
                <span className="chart-period">Last 7 days</span>
              </div>
              <div className="chart-icon sales-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="23,6 13.5,15.5 8.5,10.5 1,18"></polyline>
                  <polyline points="17,6 23,6 23,12"></polyline>
                </svg>
              </div>
            </div>
            <div className="chart-preview">
              {renderChart('sales', chartData.salesChart)}
            </div>
            <div className="chart-summary">
              <div className="metric-row">
                <span className="chart-metric">{chartData.salesChart.reduce((sum, item) => sum + item.sales, 0)}</span>
                <span className="metric-change positive">+12%</span>
              </div>
              <span className="chart-label">Total Sales</span>
            </div>
          </div>

          <div className="chart-card modern-card" onClick={() => openChartModal('revenue')}>
            <div className="chart-header">
              <div className="header-left">
                <h3>Revenue Growth</h3>
                <span className="chart-period">Monthly</span>
              </div>
              <div className="chart-icon revenue-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="1" x2="12" y2="23"></line>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
              </div>
            </div>
            <div className="chart-preview">
              {renderChart('revenue', chartData.revenueChart)}
            </div>
            <div className="chart-summary">
              <div className="metric-row">
                <span className="chart-metric">{formatCurrency(chartData.revenueChart.reduce((sum, item) => sum + item.revenue, 0))}</span>
                <span className="metric-change positive">+8%</span>
              </div>
              <span className="chart-label">Total Revenue</span>
            </div>
          </div>

          <div className="chart-card modern-card" onClick={() => openChartModal('category')}>
            <div className="chart-header">
              <div className="header-left">
                <h3>Product Categories</h3>
                <span className="chart-period">Distribution</span>
              </div>
              <div className="chart-icon category-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <circle cx="12" cy="12" r="4"></circle>
                  <line x1="12" y1="2" x2="12" y2="8"></line>
                  <line x1="12" y1="16" x2="12" y2="22"></line>
                  <line x1="4.93" y1="4.93" x2="9.17" y2="9.17"></line>
                  <line x1="14.83" y1="14.83" x2="19.07" y2="19.07"></line>
                  <line x1="2" y1="12" x2="8" y2="12"></line>
                  <line x1="16" y1="12" x2="22" y2="12"></line>
                  <line x1="4.93" y1="19.07" x2="9.17" y2="14.83"></line>
                  <line x1="14.83" y1="9.17" x2="19.07" y2="4.93"></line>
                </svg>
              </div>
            </div>
            <div className="chart-preview">
              {renderChart('category', chartData.categoryChart)}
            </div>
            <div className="chart-summary">
              <div className="metric-row">
                <span className="chart-metric">{chartData.categoryChart.length}</span>
                <span className="metric-change neutral">{Math.max(...chartData.categoryChart.map(c => c.percentage))}%</span>
              </div>
              <span className="chart-label">Categories</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Modal */}
      {selectedChart && (
        <div className="chart-modal-overlay" onClick={closeChartModal}>
          <div className="chart-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{t(`charts_${selectedChart}_title`)}</h2>
              <button className="close-btn" onClick={closeChartModal}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="modal-content">
              <div className="chart-detail">
                {renderChart(selectedChart, chartData[selectedChart + 'Chart'])}
              </div>
              <div className="chart-insights">
                <h3>{t('charts_insights')}</h3>
                {selectedChart === 'sales' && (
                  <ul>
                    <li>{t('charts_sales_insight1')}</li>
                    <li>{t('charts_sales_insight2')}</li>
                    <li>{t('charts_sales_insight3')}</li>
                  </ul>
                )}
                {selectedChart === 'revenue' && (
                  <ul>
                    <li>{t('charts_revenue_insight1')}</li>
                    <li>{t('charts_revenue_insight2')}</li>
                    <li>{t('charts_revenue_insight3')}</li>
                  </ul>
                )}
                {selectedChart === 'category' && (
                  <ul>
                    <li>{t('charts_category_insight1')}</li>
                    <li>{t('charts_category_insight2')}</li>
                    <li>{t('charts_category_insight3')}</li>
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Orders */}
      <div className="recent-orders">
        <div className="section-header">
          <h2>{t('recent_orders')}</h2>
          <button className="view-all-btn">{t('view_all')}</button>
        </div>
        
        {ordersLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>{t('loading_orders')}</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>{t('order_id')}</th>
                  <th>{t('customer')}</th>
                  <th>{t('status')}</th>
                  <th>{t('total')}</th>
                  <th>{t('date')}</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{order.customer}</td>
                    <td>
                      <span 
                        className="status-badge" 
                        style={{ backgroundColor: getStatusColor(order.status) }}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td>{formatCurrency(order.total)}</td>
                    <td>{new Date(order.date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {selectedChart && (
        <div className="chart-modal" onClick={closeChartModal}>
          <div className="chart-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="chart-modal-header">
              <h3>{t('charts_detail_title')}</h3>
              <button className="close-button" onClick={closeChartModal}>×</button>
            </div>
            <div className="chart-modal-body">
              {renderDetailedChart(selectedChart, chartData[selectedChart])}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
