import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';

class ProductDetail extends Component {
  static contextType = MyContext; // using this.context to access global state
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      txtID: '',
      txtName: '',
      txtPrice: 0,
      cmbCategory: '',
      imgProduct: '',
      selectedSizes: [], // Array of selected sizes
      selectedColors: [], // Array of selected colors
    };
  }
  render() {
    const cates = this.state.categories.map((cate) => {
      if (this.props.item != null) {
        return (<option key={cate._id} value={cate._id} selected={cate._id === this.props.item.category._id}>{cate.name}</option>);
      } else {
        return (<option key={cate._id} value={cate._id}>{cate.name}</option>);
      }
    });
    return (
      <div className="float-right">
        <h2 className="text-center">PRODUCT DETAIL</h2>
        <form>
          <table>
            <tbody>
              <tr>
                <td>ID</td>
                <td className='input_productDetail--wrap'><input type="text" value={this.state.txtID} onChange={(e) => { this.setState({ txtID: e.target.value }) }} readOnly={true} /></td>
              </tr>
              <tr>
                <td>Name</td>
                <td className='input_productDetail--wrap'><input type="text" value={this.state.txtName} onChange={(e) => { this.setState({ txtName: e.target.value }) }} /></td>
              </tr>
              <tr>
                <td>Price</td>
                <td className='input_productDetail--wrap'><input type="text" value={this.state.txtPrice} onChange={(e) => { this.setState({ txtPrice: e.target.value }) }} /></td>
              </tr>
              <tr>
                <td>Image</td>
                <td className='input_productDetail--wrap flie_product--wrap' ><input type="file" name="fileImage" accept="image/jpeg, image/png, image/gif" onChange={(e) => this.previewImage(e)} /></td>
              </tr>
              <tr>
                <td>Category</td>
                <td className='input_productDetail--wrap select_productDetail--wrap'><select onChange={(e) => { this.setState({ cmbCategory: e.target.value }) }}>{cates}</select></td>
              </tr>
              <tr>
                <td>Sizes</td>
                <td className='input_productDetail--wrap'>
                  <div className="size-checkboxes">
                    {[8, 9, 10, 11, 12, 13, 14, 15].map(size => (
                      <label key={size} className="size-checkbox">
                        <input
                          type="checkbox"
                          value={size}
                          checked={this.state.selectedSizes.includes(size)}
                          onChange={(e) => this.handleSizeChange(e, size)}
                        />
                        {size}
                      </label>
                    ))}
                  </div>
                </td>
              </tr>
              <tr>
                <td>Colors</td>
                <td className='input_productDetail--wrap'>
                  <div className="color-inputs">
                    {this.state.selectedColors.map((color, index) => (
                      <div key={index} className="color-input-group">
                        <input
                          type="text"
                          value={color}
                          onChange={(e) => this.handleColorChange(e, index)}
                          placeholder="Enter color name"
                        />
                        <button type="button" onClick={() => this.removeColor(index)}>Remove</button>
                      </div>
                    ))}
                    <button type="button" onClick={this.addColor}>Add Color</button>
                  </div>
                </td>
              </tr>
              <tr>
                <td></td>
                <td className='input_productDetail--wrap btn_productDetail--wrap'>
                <input type="submit" value="ADD NEW" onClick={(e) => this.btnAddClick(e)} />
                <input type="submit" value="UPDATE" onClick={(e) => this.btnUpdateClick(e)} />
                <input type="submit" value="DELETE" onClick={(e) => this.btnDeleteClick(e)} />
                </td>
              </tr>
              <tr>
                {
                  this.state.imgProduct?
                  <td align='center' colSpan="2"><img src={this.state.imgProduct} width="300px" height="300px" alt="" /></td>
                  :<td></td>
                }
                
              </tr>
            </tbody>
          </table>
        </form>
        <style jsx>{`
          .size-checkboxes {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
          }
          .size-checkbox {
            display: flex;
            align-items: center;
            gap: 5px;
            cursor: pointer;
          }
          .color-inputs {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }
          .color-input-group {
            display: flex;
            gap: 10px;
            align-items: center;
          }
          .color-input-group input {
            flex: 1;
            padding: 5px;
            border: 1px solid #ccc;
            border-radius: 4px;
          }
          .color-input-group button {
            padding: 5px 10px;
            background: #dc3545;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          }
          .color-input-group button:hover {
            background: #c82333;
          }
          .color-inputs > button {
            padding: 8px 16px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            width: fit-content;
          }
          .color-inputs > button:hover {
            background: #0056b3;
          }
        `}</style>
      </div>
    );
  }
  
  // Handle size selection
  handleSizeChange = (e, size) => {
    const { selectedSizes } = this.state;
    if (e.target.checked) {
      this.setState({ selectedSizes: [...selectedSizes, size] });
    } else {
      this.setState({ selectedSizes: selectedSizes.filter(s => s !== size) });
    }
  }

  // Handle color input
  handleColorChange = (e, index) => {
    const { selectedColors } = this.state;
    selectedColors[index] = e.target.value;
    this.setState({ selectedColors });
  }

  // Add new color input
  addColor = () => {
    this.setState({ selectedColors: [...this.state.selectedColors, ''] });
  }

  // Remove color input
  removeColor = (index) => {
    const colors = this.state.selectedColors.filter((_, i) => i !== index);
    this.setState({ selectedColors: colors });
  }
  
  btnDeleteClick(e) {
    e.preventDefault();
    if (window.confirm('ARE YOU SURE?')) {
      const id = this.state.txtID;
      if (id) {
        this.apiDeleteProduct(id);
      } else {
        alert('Please input id');
      }
    }
  }
  // apis
  apiDeleteProduct(id) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.delete('/api/admin/products/' + id, config).then((res) => {
      const result = res.data;
      if (result) {
        alert('Product Have Been Deleted');
        this.apiGetProducts();
      } else {
        alert('Product Could Not be Deleted');
      }
    });
  }
  btnUpdateClick(e) {
    e.preventDefault();
    const id = this.state.txtID;
    const name = this.state.txtName;
    const price = parseInt(this.state.txtPrice);
    const category = this.state.cmbCategory;
    const image = this.state.imgProduct.replace(/^data:image\/[a-z]+;base64,/, ''); // remove "data:image/...;base64,"
    const sizes = this.state.selectedSizes;
    const colors = this.state.selectedColors.filter(color => color.trim() !== '');
    
    if (id && name && price && category && image) {
      const prod = { name: name, price: price, category: category, image: image, sizes: sizes, colors: colors };
      this.apiPutProduct(id, prod);
    } else {
      alert('Please input id and name and price and category and image');
    }
  }
  // apis
  apiPutProduct(id, prod) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.put('/api/admin/products/' + id, prod, config).then((res) => {
      const result = res.data;
      if (result) {
        alert('Product Have Been Updated');
        this.apiGetProducts();
      } else {
        alert('Product Could Not Be Updated');
      }
    });
  }
  btnAddClick(e) {
    e.preventDefault();
    const name = this.state.txtName;
    const price = parseInt(this.state.txtPrice);
    const category = this.state.cmbCategory;
    const image = this.state.imgProduct.replace(/^data:image\/[a-z]+;base64,/, ''); // remove "data:image/...;base64,"
    const sizes = this.state.selectedSizes;
    const colors = this.state.selectedColors.filter(color => color.trim() !== '');
    
    if (name && price && category && image) {
      const prod = { name: name, price: price, category: category, image: image, sizes: sizes, colors: colors };
      this.apiPostProduct(prod);
    } else {
      alert('Please input name and price and category and image');
    }
  }
  // apis
  apiPostProduct(prod) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.post('/api/admin/products', prod, config).then((res) => {
      const result = res.data;
      if (result) {
        alert('Product Have Been Added');
        this.apiGetProducts();
      } else {
        alert('Product Could Not Be Added');
      }
    });
  }
  apiGetProducts() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/products?page=' + this.props.curPage, config).then((res) => {
      const result = res.data;
      // this.props.updateProducts(result.products, result.noPages);
      if (result.products.length !== 0) {
        this.props.updateProducts(result.products, result.noPages);
      } else {
        axios.get('/api/admin/products?page=' + (this.props.curPage - 1), config).then((res) => {
          const result = res.data;
          this.props.updateProducts(result.products, result.noPages);
        });
      }
    });
  }
  
  componentDidMount() {
    this.apiGetCategories();
  }
  componentDidUpdate(prevProps) {
    if (this.props.item !== prevProps.item) {
      this.setState({
        txtID: this.props.item._id,
        txtName: this.props.item.name,
        txtPrice: this.props.item.price,
        cmbCategory: this.props.item.category._id,
        imgProduct: 'data:image/jpg;base64,' + this.props.item.image,
        selectedSizes: this.props.item.sizes || [],
        selectedColors: this.props.item.colors || []
      });
    }
  }
  // event-handlers
  previewImage(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        this.setState({ imgProduct: evt.target.result });
      }
      reader.readAsDataURL(file);
    }
  }
  // apis
  apiGetCategories() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/categories', config).then((res) => {
      const result = res.data;
      this.setState({ categories: result });
    });
  }
}
export default ProductDetail;