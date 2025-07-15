import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import withRouter from '../utils/withRouter';
import { withLanguage } from './LanguageSwitcher';

class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      filteredProducts: [],
      categories: [],
      currentCategoryName: null,
      filters: {
        category: '',
        priceRange: '',
        sortBy: 'name',
        searchTerm: ''
      },
      loading: true
    };
  }
  componentDidMount() {
    this.apiGetCategories(); // Load categories for filter
    const params = this.props.params;
    if (params.cid) {
      this.apiGetProductsByCatID(params.cid);
    } else if (params.keyword) {
      this.apiGetProductsByKeyword(params.keyword);
    } else {
      this.apiGetAllProducts(); // Load all products for /products page
    }
  }

  componentDidUpdate(prevProps) {
    const params = this.props.params;
    if (params.cid && params.cid !== prevProps.params.cid) {
      this.apiGetProductsByCatID(params.cid);
    } else if (params.keyword && params.keyword !== prevProps.params.keyword) {
      this.apiGetProductsByKeyword(params.keyword);
    }
  }

  // API Methods
  apiGetAllProducts() {
    this.setState({ loading: true });
    axios.get('http://localhost:3000/api/customer/products').then((res) => {
      const result = res.data;
      this.setState({ 
        products: result, 
        filteredProducts: result,
        loading: false 
      });
    }).catch((error) => {
      console.error('Error fetching products:', error);
      this.setState({ loading: false });
    });
  }

  apiGetCategories() {
    axios.get('http://localhost:3000/api/customer/categories').then((res) => {
      const result = res.data;
      this.setState({ categories: result });
    });
  }

  apiGetProductsByKeyword(keyword) {
    this.setState({ loading: true });
    axios.get('http://localhost:3000/api/customer/products/search/' + keyword).then((res) => {
      const result = res.data;
      this.setState({ 
        products: result, 
        filteredProducts: result, 
        loading: false 
      }, this.applyFilters);
    }).catch(() => {
      this.setState({ loading: false });
    });
  }

  apiGetProductsByCatID(cid) {
    this.setState({ loading: true });
    axios.get('http://localhost:3000/api/customer/products/category/' + cid).then((res) => {
      const result = res.data;
      this.setState({ 
        products: result, 
        filteredProducts: result, 
        loading: false 
      }, this.applyFilters);
    }).catch(() => {
      this.setState({ loading: false });
    });
    
    // Get category name - get all categories then find the specific one
    axios.get('http://localhost:3000/api/customer/categories').then((res) => {
      const categories = res.data;
      const category = categories.find(cat => cat._id === cid);
      if (category) {
        this.setState({ currentCategoryName: category.name });
      }
    });
  }

  applyFilters = () => {
    let filtered = [...this.state.products];
    const { category, priceRange, sortBy, searchTerm } = this.state.filters;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (category) {
      filtered = filtered.filter(product => product.category._id === category);
    }

    // Filter by price range
    if (priceRange) {
      const [min, max] = priceRange.split('-').map(Number);
      filtered = filtered.filter(product => {
        if (max) {
          return product.price >= min && product.price <= max;
        } else {
          return product.price >= min;
        }
      });
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    this.setState({ filteredProducts: filtered });
  };

  handleFilterChange = (filterType, value) => {
    this.setState({
      filters: {
        ...this.state.filters,
        [filterType]: value
      }
    }, this.applyFilters);
  };

  resetFilters = () => {
    this.setState({
      filters: {
        category: '',
        priceRange: '',
        sortBy: 'name',
        searchTerm: ''
      }
    }, this.applyFilters);
  };

  render() {
    const { t } = this.props;
    const prods = this.state.filteredProducts.map((item) => {
      return (
        <div key={item._id} className="product-card">
          <Link to={'/product/' + item._id} className="product-link">
            <div className="product-image">
              <img 
                src={"data:image/jpg;base64," + item.image} 
                alt={item.name}
              />
              <div className="product-overlay">
                <span className="view-details">{t('viewDetails')}</span>
              </div>
            </div>
            <div className="product-info">
              <h3 className="product-name">{item.name}</h3>
              <p className="product-price">{item.price.toLocaleString('vi-VN')} VNĐ</p>
            </div>
          </Link>
        </div>
      );
    });

    const params = this.props.params;
    let pageTitle = t('allProductsPage');
    let pageSubtitle = t('discoverOurCollection');

    if (params.cid && this.state.currentCategoryName) {
      pageTitle = this.state.currentCategoryName;
      pageSubtitle = `${t('productsInCategory')} ${this.state.currentCategoryName}`;
    } else if (params.keyword) {
      pageTitle = `${t('searchResults')}: "${params.keyword}"`;
      pageSubtitle = `${t('found')} ${this.state.filteredProducts.length} ${t('allProducts')}`;
    }

    if (this.state.loading) {
      return (
        <div className="products-page">
          <div className="container">
            <div className="products-header">
              <h1 className="products-title">Đang tải...</h1>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="products-page">
        <div className="container">
          <div className="products-header">
            <h1 className="products-title">{pageTitle}</h1>
            <p className="products-subtitle">{pageSubtitle}</p>
          </div>

          {/* Filters */}
          <div className="products-filters">
            <div className="filter-group">
              <label className="filter-label">{t('searchProducts')}</label>
              <input
                type="text"
                className="filter-input"
                placeholder={t('searchProductsPlaceholder')}
                value={this.state.filters.searchTerm}
                onChange={(e) => this.handleFilterChange('searchTerm', e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label className="filter-label">{t('category')}</label>
              <select
                className="filter-select"
                value={this.state.filters.category}
                onChange={(e) => this.handleFilterChange('category', e.target.value)}
              >
                <option value="">{t('allCategories')}</option>
                {this.state.categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">{t('priceRange')}</label>
              <select
                className="filter-select"
                value={this.state.filters.priceRange}
                onChange={(e) => this.handleFilterChange('priceRange', e.target.value)}
              >
                <option value="">{t('allPrices')}</option>
                <option value="0-500000">{t('under500k')}</option>
                <option value="500000-1000000">500K - 1M</option>
                <option value="1000000-2000000">1M - 2M</option>
                <option value="2000000-5000000">2M - 5M</option>
                <option value="5000000">{t('above5m')}</option>
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">{t('sortBy')}</label>
              <select
                className="filter-select"
                value={this.state.filters.sortBy}
                onChange={(e) => this.handleFilterChange('sortBy', e.target.value)}
              >
                <option value="name">{t('sortByName')}</option>
                <option value="price-low">{t('priceLowToHigh')}</option>
                <option value="price-high">{t('priceHighToLow')}</option>
                <option value="newest">{t('sortByNewest')}</option>
              </select>
            </div>

            <div className="filter-group">
              <button 
                className="filter-button reset"
                onClick={this.resetFilters}
              >
                {t('clearFilters')}
              </button>
            </div>
          </div>

          {/* Results Summary */}
          <div className="products-results">
            <span className="results-count">
              {t('showing')} {this.state.filteredProducts.length} {t('outOf')} {this.state.products.length} {t('allProducts')}
            </span>
          </div>

          {/* Products Grid */}
          {this.state.filteredProducts.length > 0 ? (
            <div className="products-grid">
              {prods}
            </div>
          ) : (
            <div className="no-products">
              <h3>{t('noProductsFound')}</h3>
              <p>{t('adjustFiltersMessage')}</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default withLanguage(withRouter(Product));