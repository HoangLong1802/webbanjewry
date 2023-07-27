import axios from "axios";
import React, { Component } from "react";
import withRouter from "../utils/withRouter";
import MyContext from "../contexts/MyContext";

class ProductDetail extends Component {
  static contextType = MyContext;
  constructor(props) {
    super(props);
    this.state = {
      product: null,
      txtQuantity: 1,
    };
  }
  render() {
    const prod = this.state.product;
    if (prod != null) {
      return (
        <div className="align-center">
          <h2 className="text-center">PRODUCT DETAILS</h2>
          <figure className="caption-right">
            <img
              src={"data:image/jpg;base64," + prod.image}
              width="400px"
              height="400px"
              alt=""
            />
            {/* <figcaption> */}
              <form className="css__detail--component">
                <table>
                  <tbody>
                    <tr className="css_tr--wrap">
                      <td >ID:</td>
                      <td>{prod._id}</td>
                    </tr>
                    <tr className="css_tr--wrap">
                      <td >Name:</td>
                      <td>{prod.name}</td>
                    </tr>
                    <tr className="css_tr--wrap">
                      <td >Price:</td>
                      <td>{prod.price}</td>
                    </tr>
                    <tr className="css_tr--wrap">
                      <td >Category:</td>
                      <td>{prod.category.name}</td>
                    </tr>
                    <tr className="css_tr--wrap">
                      <td>Quantity:</td>
                      <td>
                        <input
                          className="input__wrap--table"
                          type="number"
                          min="1"
                          max="99"
                          value={this.state.txtQuantity}
                          onChange={(e) => {
                            this.setState({ txtQuantity: e.target.value });
                          }}
                        />
                      </td>
                    </tr>
                    <tr className="addtocart__css--wrap">
                      <td></td>
                      <td>
                        <input
                          type="submit"
                          value="ADD TO CART"
                          onClick={(e) => this.btnAdd2CartClick(e)}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </form>
            {/* </figcaption> */}
          </figure>
        </div>
      );
    }
    return <div />;
  }
  btnAdd2CartClick(e) {
    e.preventDefault();
    const product = this.state.product;
    const quantity = parseInt(this.state.txtQuantity);
    if (quantity) {
      const mycart = this.context.mycart;
      const index = mycart.findIndex(x => x.product._id === product._id); // check if the _id exists in mycart
      if (index === -1) { // not found, push newItem
        const newItem = { product: product, quantity: quantity };
        mycart.push(newItem);
      } else { // increasing the quantity
        mycart[index].quantity += quantity;
      }
      this.context.setMycart(mycart);
      alert('Product Have Been Add To Cart!');
    } else {
      alert('Please input quantity');
    }
  }
  componentDidMount() {
    const params = this.props.params;
    this.apiGetProduct(params.id);
  }
  // apis
  apiGetProduct(id) {
    axios.get("/api/customer/products/" + id).then((res) => {
      const result = res.data;
      this.setState({ product: result });
    });
  }
}
export default withRouter(ProductDetail);
