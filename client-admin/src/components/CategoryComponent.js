import axios from "axios";
import React, { Component } from "react";
import MyContext from "../contexts/MyContext";
import CategoryDetail from "./CategoryDetailComponent";
import { useLanguage } from "../contexts/LanguageContext";

class Category extends Component {
  static contextType = MyContext; // using this.context to access global state
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      itemSelected: null,
      loading: true,
      searchTerm: '',
      sortBy: 'name',
      sortOrder: 'asc',
      showDeleteDialog: false,
      categoryToDelete: null
    };
  }

  render() {
    return <CategoryWithLanguage 
      categories={this.state.categories}
      itemSelected={this.state.itemSelected}
      loading={this.state.loading}
      searchTerm={this.state.searchTerm}
      sortBy={this.state.sortBy}
      sortOrder={this.state.sortOrder}
      showDeleteDialog={this.state.showDeleteDialog}
      categoryToDelete={this.state.categoryToDelete}
      onItemClick={this.trItemClick}
      onSearchChange={this.handleSearchChange}
      onSortChange={this.handleSortChange}
      onDeleteClick={this.handleDeleteClick}
      onDeleteConfirm={this.handleDeleteConfirm}
      onDeleteCancel={this.handleDeleteCancel}
      updateCategories={this.updateCategories}
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

  getFilteredAndSortedCategories = () => {
    const { categories, searchTerm, sortBy, sortOrder } = this.state;
    
    let filtered = categories.filter(category =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category._id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (typeof aValue === 'string') {
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
  }

  componentDidMount() {
    this.apiGetCategories();
  }
  // event-handlers
  trItemClick = (item) => {
    this.setState({ itemSelected: item });
  }

  handleDeleteClick = (category, e) => {
    e.stopPropagation(); // Prevent row selection
    this.setState({ 
      showDeleteDialog: true, 
      categoryToDelete: category 
    });
  }

  handleDeleteConfirm = () => {
    const category = this.state.categoryToDelete;
    if (category) {
      this.apiDeleteCategory(category._id);
    }
    this.setState({ 
      showDeleteDialog: false, 
      categoryToDelete: null 
    });
  }

  handleDeleteCancel = () => {
    this.setState({ 
      showDeleteDialog: false, 
      categoryToDelete: null 
    });
  }
  
  // apis
  apiGetCategories() {
    this.setState({ loading: true });
    const config = { headers: { "x-access-token": this.context.token } };
    axios.get("/api/admin/categories", config).then((res) => {
      const result = res.data;
      this.setState({ categories: result, loading: false });
    }).catch((error) => {
      console.error('Error fetching categories:', error);
      this.setState({ loading: false });
    });
  }
  
  updateCategories = (categories) => { // arrow-function
    this.setState({ categories: categories });
  }

  // apis
  apiDeleteCategory(id) {
    const config = { headers: { "x-access-token": this.context.token } };
    axios.delete(`/api/admin/categories/${id}`, config).then((res) => {
      if (res.data.success) {
        this.apiGetCategories(); // Refresh the list
        // Clear selection if deleted item was selected
        if (this.state.itemSelected && this.state.itemSelected._id === id) {
          this.setState({ itemSelected: null });
        }
      }
    }).catch((error) => {
      console.error('Error deleting category:', error);
      alert('Error deleting category. Please try again.');
    });
  }
}

// Functional component with language support
const CategoryWithLanguage = ({ 
  categories, 
  itemSelected, 
  loading, 
  searchTerm, 
  sortBy, 
  sortOrder, 
  showDeleteDialog,
  categoryToDelete,
  onItemClick, 
  onSearchChange, 
  onSortChange, 
  onDeleteClick,
  onDeleteConfirm,
  onDeleteCancel,
  updateCategories 
}) => {
  const { t } = useLanguage();

  const getFilteredAndSortedCategories = () => {
    let filtered = categories.filter(category =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category._id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (typeof aValue === 'string') {
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

  const filteredCategories = getFilteredAndSortedCategories();

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

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1 className="page-title">{t('categories')}</h1>
        <p className="page-subtitle">{t('manage_categories_description')}</p>
      </div>

      <div className="admin-content">
        <div className="categories-section">
          <div className="section-header">
            <h2>{t('category_list')}</h2>
            <div className="table-controls">
              <div className="search-box">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
                <input
                  type="text"
                  placeholder={t('search_categories')}
                  value={searchTerm}
                  onChange={onSearchChange}
                  className="search-input"
                />
              </div>
              <div className="results-count">
                {filteredCategories.length} {t('categories_found')}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>{t('loading_categories')}</p>
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
                    <th>{t('products_count')}</th>
                    <th>{t('status')}</th>
                    <th>{t('actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCategories.map((category) => (
                    <tr
                      key={category._id}
                      className={`table-row ${itemSelected && itemSelected._id === category._id ? 'selected' : ''}`}
                      onClick={() => onItemClick(category)}
                    >
                      <td className="id-cell">#{category._id}</td>
                      <td className="name-cell">
                        <div className="category-info">
                          <div className="category-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                            </svg>
                          </div>
                          <span className="category-name">{category.name}</span>
                        </div>
                      </td>
                      <td className="count-cell">
                        <span className="count-badge">{category.products?.length || 0}</span>
                      </td>
                      <td className="status-cell">
                        <span className="status-badge active">{t('active')}</span>
                      </td>
                      <td className="actions-cell">
                        <div className="action-buttons">
                          <button 
                            className="btn-icon edit" 
                            title={t('edit')}
                            onClick={(e) => {
                              e.stopPropagation();
                              onItemClick(category);
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
                            onClick={(e) => onDeleteClick(category, e)}
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
              
              {filteredCategories.length === 0 && (
                <div className="empty-state">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M16 16s-1.5-2-4-2-4 2-4 2"></path>
                    <line x1="9" y1="9" x2="9.01" y2="9"></line>
                    <line x1="15" y1="9" x2="15.01" y2="9"></line>
                  </svg>
                  <h3>{t('no_categories_found')}</h3>
                  <p>{t('no_categories_description')}</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="category-detail-section">
          <CategoryDetail item={itemSelected} updateCategories={updateCategories} />
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
              <p>{t('delete_category_confirm')}</p>
              <p><strong>{categoryToDelete?.name}</strong></p>
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

export default Category;
