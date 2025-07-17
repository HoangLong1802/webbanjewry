import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import ProductDetail from './ProductDetailComponent';
import { useLanguage } from '../contexts/LanguageContext';

class Product extends Component {
  static contextType = MyContext; // using this.context to access global state
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      noPages: 0,
      curPage: 1,
      itemSelected: null,
      loading: true,
      searchTerm: '',
      sortBy: 'name',
      sortOrder: 'asc',
      showDeleteDialog: false,
      productToDelete: null
    };
  }

  render() {
    return <ProductWithLanguage 
      products={this.state.products}
      noPages={this.state.noPages}
      curPage={this.state.curPage}
      itemSelected={this.state.itemSelected}
      loading={this.state.loading}
      searchTerm={this.state.searchTerm}
      sortBy={this.state.sortBy}
      sortOrder={this.state.sortOrder}
      showDeleteDialog={this.state.showDeleteDialog}
      productToDelete={this.state.productToDelete}
      onItemClick={this.trItemClick}
      onSearchChange={this.handleSearchChange}
      onSortChange={this.handleSortChange}
      onDeleteClick={this.handleDeleteClick}
      onDeleteConfirm={this.handleDeleteConfirm}
      onDeleteCancel={this.handleDeleteCancel}
      onPageClick={this.lnkPageClick}
      updateProducts={this.updateProducts}
    />;
  }

  handleSearchChange = (e) => {
    this.setState({ searchTerm: e.target.value });
  }

  handleSortChange = (field) => {
    const { sortBy, sortOrder } = this.state;
    const newOrder = sortBy === field && sortOrder === 'asc' ? 'desc' : 'asc';
    this.setState({ sortBy: field, sortOrder: newOrder });
  }

  handleDeleteClick = (product, e) => {
    e.stopPropagation();
    this.setState({ 
      showDeleteDialog: true, 
      productToDelete: product 
    });
  }

  handleDeleteConfirm = () => {
    const product = this.state.productToDelete;
    if (product) {
      this.apiDeleteProduct(product._id);
    }
    this.setState({ 
      showDeleteDialog: false, 
      productToDelete: null 
    });
  }

  handleDeleteCancel = () => {
    this.setState({ 
      showDeleteDialog: false, 
      productToDelete: null 
    });
  }

  updateProducts = (products, noPages) => { // arrow-function
    this.setState({ products: products, noPages: noPages });
  }

  componentDidMount() {
    this.apiGetProducts(this.state.curPage);
  }

  // event-handlers
  lnkPageClick = (index) => {
    this.apiGetProducts(index);
  }

  trItemClick = (item) => {
    this.setState({ itemSelected: item });
  }

  // apis
  apiGetProducts(page) {
    this.setState({ loading: true });
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/products?page=' + page, config).then((res) => {
      const result = res.data;
      this.setState({ 
        products: result.products, 
        noPages: result.noPages, 
        curPage: result.curPage,
        loading: false 
      });
    }).catch((error) => {
      console.error('Error fetching products:', error);
      this.setState({ loading: false });
    });
  }

  apiDeleteProduct(id) {
    const config = { headers: { "x-access-token": this.context.token } };
    axios.delete(`/api/admin/products/${id}`, config).then((res) => {
      if (res.data.success) {
        this.apiGetProducts(this.state.curPage); // Refresh the list
        // Clear selection if deleted item was selected
        if (this.state.itemSelected && this.state.itemSelected._id === id) {
          this.setState({ itemSelected: null });
        }
      }
    }).catch((error) => {
      console.error('Error deleting product:', error);
      alert('Error deleting product. Please try again.');
    });
  }
}

// Functional component with language support
const ProductWithLanguage = ({ 
  products, 
  noPages,
  curPage,
  itemSelected, 
  loading, 
  searchTerm, 
  sortBy, 
  sortOrder, 
  showDeleteDialog,
  productToDelete,
  onItemClick, 
  onSearchChange, 
  onSortChange, 
  onDeleteClick,
  onDeleteConfirm,
  onDeleteCancel,
  onPageClick,
  updateProducts 
}) => {
  const { t } = useLanguage();

  const getFilteredAndSortedProducts = () => {
    let filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'price') {
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
      } else if (sortBy === 'cdate') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  };

  const filteredProducts = getFilteredAndSortedProducts();

  const getSortIcon = (field) => {
    if (sortBy !== field) {
      return (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M8 9l4-4 4 4"></path>
          <path d="M16 15l-4 4-4-4"></path>
        </svg>
      );
    }
    return sortOrder === 'asc' ? (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M8 15l4-4 4 4"></path>
      </svg>
    ) : (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M16 9l-4 4-4-4"></path>
      </svg>
    );
  };

  // Pagination component
  const Pagination = () => {
    const pages = Array.from({ length: noPages }, (_, index) => index + 1);
    
    return (
      <div className="pagination-container">
        {pages.map(page => (
          <button
            key={page}
            className={`pagination-btn ${page === curPage ? 'active' : ''}`}
            onClick={() => onPageClick(page)}
          >
            {page}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1 className="page-title">{t('products')}</h1>
        <p className="page-subtitle">{t('manage_products_description')}</p>
      </div>

      <div className="admin-content">
        <div className="products-section">
          <div className="section-header">
            <h2>{t('product_list')}</h2>
            <div className="table-controls">
              <div className="search-box">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
                <input
                  type="text"
                  placeholder={t('search_products')}
                  value={searchTerm}
                  onChange={onSearchChange}
                  className="search-input"
                />
              </div>
              <div className="results-count">
                {filteredProducts.length} {t('products_found')}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>{t('loading_products')}</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="modern-table">
                <thead>
                  <tr>
                    <th onClick={() => onSortChange('_id')} className="sortable">
                      {t('id')}
                      {getSortIcon('_id')}
                    </th>
                    <th onClick={() => onSortChange('name')} className="sortable">
                      {t('name')}
                      {getSortIcon('name')}
                    </th>
                    <th onClick={() => onSortChange('price')} className="sortable">
                      {t('price')}
                      {getSortIcon('price')}
                    </th>
                    <th onClick={() => onSortChange('cdate')} className="sortable">
                      {t('creation_date')}
                      {getSortIcon('cdate')}
                    </th>
                    <th>{t('category')}</th>
                    <th>{t('image')}</th>
                    <th>{t('actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr
                      key={product._id}
                      className={`table-row ${itemSelected && itemSelected._id === product._id ? 'selected' : ''}`}
                      onClick={() => onItemClick(product)}
                    >
                      <td className="id-cell">#{product._id}</td>
                      <td className="name-cell">
                        <div className="product-info">
                          <div className="product-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                          </div>
                          <span className="product-name">{product.name}</span>
                        </div>
                      </td>
                      <td className="price-cell">
                        <span className="price-badge">${product.price}</span>
                      </td>
                      <td className="date-cell">
                        {new Date(product.cdate).toLocaleDateString()}
                      </td>
                      <td className="category-cell">
                        <span className="category-tag">{product.category.name}</span>
                      </td>
                      <td className="image-cell">
                        <div className="product-image">
                          <img 
                            src={"data:image/jpg;base64," + product.image} 
                            alt={product.name}
                          />
                        </div>
                      </td>
                      <td className="actions-cell">
                        <div className="action-buttons">
                          <button 
                            className="btn-icon edit" 
                            title={t('edit')}
                            onClick={(e) => {
                              e.stopPropagation();
                              onItemClick(product);
                            }}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                          </button>
                          <button 
                            className="btn-icon delete" 
                            title={t('delete')}
                            onClick={(e) => onDeleteClick(product, e)}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3,6 5,6 21,6"></polyline>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredProducts.length === 0 && (
                <div className="empty-state">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M16 16s-1.5-2-4-2-4 2-4 2"></path>
                    <line x1="9" y1="9" x2="9.01" y2="9"></line>
                    <line x1="15" y1="9" x2="15.01" y2="9"></line>
                  </svg>
                  <h3>{t('no_products_found')}</h3>
                  <p>{t('no_products_description')}</p>
                </div>
              )}

              {noPages > 1 && <Pagination />}
            </div>
          )}
        </div>

        <div className="product-detail-section">
          <ProductDetail item={itemSelected} curPage={curPage} updateProducts={updateProducts} />
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{t('confirm_delete')}</h3>
            </div>
            <div className="modal-body">
              <p>{t('delete_product_confirm')}</p>
              <p><strong>{productToDelete?.name}</strong></p>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={onDeleteCancel}>
                {t('cancel')}
              </button>
              <button className="btn-danger" onClick={onDeleteConfirm}>
                {t('delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Product;