import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import { useLanguage } from '../contexts/LanguageContext';

class ProductDetail extends Component {
  static contextType = MyContext;
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      txtID: '',
      txtName: '',
      txtPrice: 0,
      cmbCategory: '',
      imgProduct: '',
      selectedSizes: [],
      selectedColors: [],
      isLoading: false,
      errors: {},
      showDeleteDialog: false
    };
  }

  render() {
    return <ProductDetailWithLanguage 
      {...this.state}
      item={this.props.item}
      curPage={this.props.curPage}
      updateProducts={this.props.updateProducts}
      onInputChange={this.handleInputChange}
      onAddClick={this.btnAddClick}
      onUpdateClick={this.btnUpdateClick}
      onDeleteClick={this.btnDeleteClick}
      onDeleteConfirm={this.handleDeleteConfirm}
      onDeleteCancel={this.handleDeleteCancel}
      onCategoryChange={this.handleCategoryChange}
      onImageChange={this.previewImage}
    />;
  }

  handleInputChange = (field, value) => {
    this.setState({ 
      [field]: value,
      errors: { ...this.state.errors, [field]: '' }
    });
  }

  handleCategoryChange = (e) => {
    this.setState({ cmbCategory: e.target.value });
  }

  handleDeleteConfirm = () => {
    const id = this.state.txtID;
    if (id) {
      this.setState({ isLoading: true, showDeleteDialog: false });
      this.apiDeleteProduct(id);
    }
  }

  handleDeleteCancel = () => {
    this.setState({ showDeleteDialog: false });
  }

  btnDeleteClick = (e) => {
    e.preventDefault();
    const id = this.state.txtID;
    if (id) {
      this.setState({ showDeleteDialog: true });
    } else {
      alert("Please select a product to delete");
    }
  }

  btnAddClick = (e) => {
    e.preventDefault();
    if (!this.validateForm()) return;
    
    const prod = {
      name: this.state.txtName, 
      price: this.state.txtPrice, 
      category: this.state.cmbCategory,
      image: this.state.imgProduct.replace(/^data:image\/[a-z]+;base64,/, ''),
      sizes: this.state.selectedSizes,
      colors: this.state.selectedColors
    };
    this.setState({ isLoading: true });
    this.apiPostProduct(prod);
  }

  btnUpdateClick = (e) => {
    e.preventDefault();
    if (!this.validateForm()) return;
    
    const prod = {
      name: this.state.txtName, 
      price: this.state.txtPrice, 
      category: this.state.cmbCategory,
      image: this.state.imgProduct.replace(/^data:image\/[a-z]+;base64,/, ''),
      sizes: this.state.selectedSizes,
      colors: this.state.selectedColors
    };
    this.setState({ isLoading: true });
    this.apiPutProduct(this.state.txtID, prod);
  }

  validateForm = () => {
    const errors = {};
    if (!this.state.txtName.trim()) errors.txtName = 'Product name is required';
    if (!this.state.txtPrice || this.state.txtPrice <= 0) errors.txtPrice = 'Valid price is required';
    if (!this.state.cmbCategory) errors.cmbCategory = 'Category is required';
    
    this.setState({ errors });
    return Object.keys(errors).length === 0;
  }

  previewImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        this.setState({ imgProduct: evt.target.result });
      }
      reader.readAsDataURL(file);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.item !== prevProps.item) {
      if (this.props.item != null) {
        this.setState({
          txtID: this.props.item._id, 
          txtName: this.props.item.name, 
          txtPrice: this.props.item.price,
          cmbCategory: this.props.item.category._id, 
          imgProduct: 'data:image/jpg;base64,' + this.props.item.image,
          errors: {}
        });
      } else {
        this.setState({
          txtID: '', 
          txtName: '', 
          txtPrice: 0,
          cmbCategory: '', 
          imgProduct: '',
          errors: {}
        });
      }
    }
  }

  componentDidMount() {
    this.apiGetCategories();
  }

  // APIs
  apiGetCategories() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/categories', config).then((res) => {
      const result = res.data;
      this.setState({ categories: result });
    });
  }

  apiPostProduct(prod) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.post('/api/admin/products', prod, config).then((res) => {
      const result = res.data;
      this.setState({ isLoading: false });
      if (result) {
        alert('Product added successfully!');
        this.setState({ 
          txtID: '', txtName: '', txtPrice: 0, cmbCategory: '', imgProduct: '',
          selectedSizes: [], selectedColors: []
        });
        this.props.updateProducts(result.products, result.noPages);
      } else {
        alert('Error adding product!');
      }
    }).catch(() => {
      this.setState({ isLoading: false });
      alert('Error adding product!');
    });
  }

  apiPutProduct(id, prod) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.put('/api/admin/products/' + id, prod, config).then((res) => {
      const result = res.data;
      this.setState({ isLoading: false });
      if (result) {
        alert('Product updated successfully!');
        this.props.updateProducts(result.products, result.noPages);
      } else {
        alert('Error updating product!');
      }
    }).catch(() => {
      this.setState({ isLoading: false });
      alert('Error updating product!');
    });
  }

  apiDeleteProduct(id) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.delete('/api/admin/products/' + id, config).then((res) => {
      const result = res.data;
      this.setState({ isLoading: false });
      if (result) {
        alert('Product deleted successfully!');
        this.setState({ 
          txtID: '', txtName: '', txtPrice: 0, cmbCategory: '', imgProduct: '',
          selectedSizes: [], selectedColors: []
        });
        this.props.updateProducts(result.products, result.noPages);
      } else {
        alert('Error deleting product!');
      }
    }).catch(() => {
      this.setState({ isLoading: false });
      alert('Error deleting product!');
    });
  }
}

// Functional component with language support
const ProductDetailWithLanguage = ({ 
  categories,
  txtID, 
  txtName, 
  txtPrice,
  cmbCategory,
  imgProduct,
  isLoading, 
  errors, 
  showDeleteDialog,
  item, 
  onInputChange, 
  onAddClick, 
  onUpdateClick, 
  onDeleteClick,
  onDeleteConfirm,
  onDeleteCancel,
  onCategoryChange,
  onImageChange
}) => {
  const { t } = useLanguage();

  return (
    <div className="product-detail-container">
      <div className="detail-header">
        <h2 className="detail-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
          {t('product_detail')}
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
            <label htmlFor="productId">{t('id')}</label>
            <input
              id="productId"
              type="text"
              value={txtID}
              onChange={(e) => onInputChange('txtID', e.target.value)}
              readOnly
              className="form-input readonly"
            />
          </div>

          <div className="form-group">
            <label htmlFor="productName">{t('name')} *</label>
            <input
              id="productName"
              type="text"
              value={txtName}
              onChange={(e) => onInputChange('txtName', e.target.value)}
              placeholder={t('enter_product_name')}
              className={`form-input ${errors.txtName ? 'error' : ''}`}
            />
            {errors.txtName && <span className="error-message">{errors.txtName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="productPrice">{t('price')} *</label>
            <input
              id="productPrice"
              type="number"
              value={txtPrice}
              onChange={(e) => onInputChange('txtPrice', e.target.value)}
              placeholder={t('enter_price')}
              className={`form-input ${errors.txtPrice ? 'error' : ''}`}
            />
            {errors.txtPrice && <span className="error-message">{errors.txtPrice}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="productCategory">{t('category')} *</label>
            <select
              id="productCategory"
              value={cmbCategory}
              onChange={onCategoryChange}
              className={`form-input ${errors.cmbCategory ? 'error' : ''}`}
            >
              <option value="">{t('select_category')}</option>
              {categories.map((cate) => (
                <option key={cate._id} value={cate._id}>
                  {cate.name}
                </option>
              ))}
            </select>
            {errors.cmbCategory && <span className="error-message">{errors.cmbCategory}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="productImage">{t('image')}</label>
            <input
              id="productImage"
              type="file"
              accept="image/jpeg, image/png, image/gif"
              onChange={onImageChange}
              className="form-input file-input"
            />
            {imgProduct && (
              <div className="image-preview">
                <img src={imgProduct} alt="Preview" />
              </div>
            )}
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={onAddClick}
              disabled={isLoading}
              className="btn-primary"
            >
              {isLoading ? (
                <svg width="16" height="16" viewBox="0 0 24 24" className="spinning">
                  <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              )}
              {t('add_new')}
            </button>

            <button
              type="button"
              onClick={onUpdateClick}
              disabled={!item || isLoading}
              className="btn-secondary"
            >
              {isLoading ? (
                <svg width="16" height="16" viewBox="0 0 24 24" className="spinning">
                  <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
                </svg>
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
              onClick={onDeleteClick}
              disabled={!item || isLoading}
              className="btn-danger"
            >
              {isLoading ? (
                <svg width="16" height="16" viewBox="0 0 24 24" className="spinning">
                  <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
                </svg>
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
              {t('select_product_help')}
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
              <p>{t('delete_product_confirm')}</p>
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

export default ProductDetail;
