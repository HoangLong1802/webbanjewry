import axios from "axios";
import React, { Component } from "react";
import MyContext from "../contexts/MyContext";
import { useLanguage } from "../contexts/LanguageContext";

class CategoryDetail extends Component {
  static contextType = MyContext; // using this.context to access global state
  constructor(props) {
    super(props);
    this.state = {
      txtID: "",
      txtName: "",
      isLoading: false,
      errors: {},
      showDeleteDialog: false
    };
  }

  render() {
    return <CategoryDetailWithLanguage 
      txtID={this.state.txtID}
      txtName={this.state.txtName}
      isLoading={this.state.isLoading}
      errors={this.state.errors}
      showDeleteDialog={this.state.showDeleteDialog}
      item={this.props.item}
      onInputChange={this.handleInputChange}
      onAddClick={this.btnAddClick}
      onUpdateClick={this.btnUpdateClick}
      onDeleteClick={this.btnDeleteClick}
      onDeleteConfirm={this.handleDeleteConfirm}
      onDeleteCancel={this.handleDeleteCancel}
    />;
  }

  handleInputChange = (field, value) => {
    this.setState({ 
      [field]: value,
      errors: { ...this.state.errors, [field]: '' }
    });
  }

  validateForm = () => {
    const errors = {};
    if (!this.state.txtName.trim()) {
      errors.txtName = 'Category name is required';
    }
    this.setState({ errors });
    return Object.keys(errors).length === 0;
  }

  btnDeleteClick = (e) => {
    e.preventDefault();
    const id = this.state.txtID;
    if (id) {
      this.setState({ showDeleteDialog: true });
    } else {
      alert("Please select a category to delete");
    }
  }

  handleDeleteConfirm = () => {
    const id = this.state.txtID;
    if (id) {
      this.setState({ isLoading: true, showDeleteDialog: false });
      this.apiDeleteCategory(id);
    }
  }

  handleDeleteCancel = () => {
    this.setState({ showDeleteDialog: false });
  }

  btnUpdateClick = (e) => {
    e.preventDefault();
    if (!this.validateForm()) return;
    
    const id = this.state.txtID;
    const name = this.state.txtName.trim();
    if (id && name) {
      this.setState({ isLoading: true });
      const cate = { name: name };
      this.apiPutCategory(id, cate);
    } else {
      alert("Please select a category and enter a name");
    }
  }

  btnAddClick = (e) => {
    e.preventDefault();
    if (!this.validateForm()) return;
    
    const name = this.state.txtName.trim();
    if (name) {
      this.setState({ isLoading: true });
      const cate = { name: name };
      this.apiPostCategory(cate);
    } else {
      alert("Please enter category name");
    }
  }

  // APIs
  apiDeleteCategory(id) {
    const config = { headers: { "x-access-token": this.context.token } };
    axios.delete("/api/admin/categories/" + id, config).then((res) => {
      const result = res.data;
      this.setState({ isLoading: false });
      if (result) {
        alert("Category deleted successfully!");
        this.setState({ txtID: "", txtName: "" });
        this.apiGetCategories();
      } else {
        alert("Failed to delete category!");
      }
    }).catch(() => {
      this.setState({ isLoading: false });
      alert("Error deleting category!");
    });
  } 

  apiPutCategory(id, cate) {
    const config = { headers: { "x-access-token": this.context.token } };
    axios.put("/api/admin/categories/" + id, cate, config).then((res) => {
      const result = res.data;
      this.setState({ isLoading: false });
      if (result) {
        alert("Category updated successfully!");
        this.apiGetCategories();
      } else {
        alert("Failed to update category!");
      }
    }).catch(() => {
      this.setState({ isLoading: false });
      alert("Error updating category!");
    });
  }

  apiPostCategory(cate) {
    const config = { headers: { "x-access-token": this.context.token } };
    axios.post("/api/admin/categories", cate, config).then((res) => {
      const result = res.data;
      this.setState({ isLoading: false });
      if (result) {
        alert("Category created successfully!");
        this.setState({ txtID: "", txtName: "" });
        this.apiGetCategories();
      } else {
        alert("Failed to create category!");
      }
    }).catch(() => {
      this.setState({ isLoading: false });
      alert("Error creating category!");
    });
  }

  apiGetCategories() {
    const config = { headers: { "x-access-token": this.context.token } };
    axios.get("/api/admin/categories", config).then((res) => {
      const result = res.data;
      this.props.updateCategories(result);
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.item !== prevProps.item) {
      this.setState({
        txtID: this.props.item ? this.props.item._id : "",
        txtName: this.props.item ? this.props.item.name : "",
        errors: {}
      });
    }
  }
}

const CategoryDetailWithLanguage = ({ 
  txtID, 
  txtName, 
  isLoading, 
  errors, 
  showDeleteDialog,
  item, 
  onInputChange, 
  onAddClick, 
  onUpdateClick, 
  onDeleteClick,
  onDeleteConfirm,
  onDeleteCancel
}) => {
  const { t } = useLanguage();

  return (
    <div className="category-detail-container">
      <div className="detail-header">
        <h2 className="detail-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
          </svg>
          {t('category_detail')}
        </h2>
        {item && (
          <div className="detail-status">
            <span className="status-indicator active"></span>
            {t('selected')}
          </div>
        )}
      </div>

      <div className="detail-content">
        <form className="detail-form">
          <div className="form-group">
            <label className="form-label">{t('category_id')}</label>
            <input
              type="text"
              className="form-input disabled"
              value={txtID}
              readOnly={true}
              placeholder="Auto-generated"
            />
          </div>

          <div className="form-group">
            <label className="form-label">{t('category_name')} *</label>
            <input
              type="text"
              className={`form-input ${errors.txtName ? 'error' : ''}`}
              value={txtName}
              onChange={(e) => onInputChange('txtName', e.target.value)}
              placeholder={t('enter_category_name')}
              disabled={isLoading}
            />
            {errors.txtName && (
              <div className="error-message">{errors.txtName}</div>
            )}
          </div>

          <div className="form-actions">
            <button 
              type="button"
              className="btn btn-primary"
              onClick={onAddClick}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="loading-spinner"></div>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12h14"></path>
                </svg>
              )}
              {t('add_new')}
            </button>

            <button 
              type="button"
              className="btn btn-warning"
              onClick={onUpdateClick}
              disabled={isLoading || !txtID}
            >
              {isLoading ? (
                <div className="loading-spinner"></div>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              )}
              {t('update')}
            </button>

            <button 
              type="button"
              className="btn btn-danger"
              onClick={onDeleteClick}
              disabled={isLoading || !txtID}
            >
              {isLoading ? (
                <div className="loading-spinner"></div>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3,6 5,6 21,6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              )}
              {t('delete')}
            </button>
          </div>

          {!item && (
            <div className="help-text">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              {t('select_category_help')}
            </div>
          )}
        </form>
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
              <p><strong>{txtName}</strong></p>
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

export default CategoryDetail;
