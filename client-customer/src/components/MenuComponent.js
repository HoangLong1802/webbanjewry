import axios from "axios";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import withRouter from "../utils/withRouter";
import MyContext from "../contexts/MyContext";

class Menu extends Component {
  static contextType = MyContext;
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      txtKeyword: "",
    };
  }
  render() {
    const cates = this.state.categories.map((item) => {
      return (
        <li key={item._id} className="menu">
          <Link className="menu" to={"/product/category/" + item._id}>
            {item.name}
          </Link>
        </li>
      );
    });
    return (
      <div className="border-bottom">
        <div className="float-left">
          <ul className="menu">
            <Link className="logo" to="/"></Link>
            <li className="menu">
              <Link to="/">Home</Link>
            </li>
            <li className="menu">
              <Link to="/products" className="Product_menu_hover">Product</Link>
            </li>
              {cates}
          </ul>
        </div>
        <div className="float-right">
          <form className="search">
            <input
              type="search"
              placeholder="Enter keyword"
              className="keyword"
              value={this.state.txtKeyword}
              onChange={(e) => {
                this.setState({ txtKeyword: e.target.value });
              }}
            />
            <input
              type="submit"
              value="SEARCH"
              className="btn__search"
              onClick={(e) => this.btnSearchClick(e)}
            />
          </form>

          {this.context.token === "" ? (
            <div className="imfor__menu--wrap">
              <Link to="/login">Login</Link> | <Link to="/signup">Sign-up</Link>{" "}
              | <Link to="/active">Active</Link>
            </div>
          ) : (
            <div className="imfor__menu--wrap">
              Hello <b>{this.context.customer.name}</b> |{" "}
              <Link to="/myorders">My orders</Link> |{" "}
              <Link to="/myprofile">My profile</Link> |{" "}
              <Link to="/home" onClick={() => this.lnkLogoutClick()}>
                Logout
              </Link>{" "}
            </div>
          )}
          <div className="Mycard--wrap">
            {this.context.mycart.length > 0 ? (
              <Link to="/mycart">
                <svg
                  className="cart--wrap red"
                  stroke="currentColor"
                  fill="currentColor"
                  stroke-width="0"
                  viewBox="0 0 576 512"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M528.12 301.319l47.273-208C578.806 78.301 567.391 64 551.99 64H159.208l-9.166-44.81C147.758 8.021 137.93 0 126.529 0H24C10.745 0 0 10.745 0 24v16c0 13.255 10.745 24 24 24h69.883l70.248 343.435C147.325 417.1 136 435.222 136 456c0 30.928 25.072 56 56 56s56-25.072 56-56c0-15.674-6.447-29.835-16.824-40h209.647C430.447 426.165 424 440.326 424 456c0 30.928 25.072 56 56 56s56-25.072 56-56c0-22.172-12.888-41.332-31.579-50.405l5.517-24.276c3.413-15.018-8.002-29.319-23.403-29.319H218.117l-6.545-32h293.145c11.206 0 20.92-7.754 23.403-18.681z"></path>
                </svg>

                <div className="CSS__number--icon">
                  {this.context.mycart.length}
                </div>
              </Link>
            ) : (
              <Link to="/mycart">
                <svg
                  className="cart--wrap"
                  stroke="currentColor"
                  fill="currentColor"
                  stroke-width="0"
                  viewBox="0 0 576 512"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M528.12 301.319l47.273-208C578.806 78.301 567.391 64 551.99 64H159.208l-9.166-44.81C147.758 8.021 137.93 0 126.529 0H24C10.745 0 0 10.745 0 24v16c0 13.255 10.745 24 24 24h69.883l70.248 343.435C147.325 417.1 136 435.222 136 456c0 30.928 25.072 56 56 56s56-25.072 56-56c0-15.674-6.447-29.835-16.824-40h209.647C430.447 426.165 424 440.326 424 456c0 30.928 25.072 56 56 56s56-25.072 56-56c0-22.172-12.888-41.332-31.579-50.405l5.517-24.276c3.413-15.018-8.002-29.319-23.403-29.319H218.117l-6.545-32h293.145c11.206 0 20.92-7.754 23.403-18.681z"></path>
                </svg>
              </Link>
            )}
          </div>
        </div>
        <div className="float-clear" />
      </div>
    );
  }
  btnSearchClick(e) {
    if (this.state.txtKeyword) {
      e.preventDefault();
      this.props.navigate("/product/search/" + this.state.txtKeyword);
    } else {
      alert("please input search key");
    }
  }
  componentDidMount() {
    this.apiGetCategories();
  }

  // apis
  apiGetCategories() {
    axios.get("/api/customer/categories").then((res) => {
      const result = res.data;
      this.setState({ categories: result });
    });
  }
  lnkLogoutClick() {
    this.context.setToken("");
    this.context.setCustomer(null);
    this.context.setMycart([]);
  }
  // const menu_product_card = document.querySelector('.menu_product_card');
  // menu_product_card.addEventListener('mouseenter', () => {
  //   card.style.opacity = '1';
  // });

  // menu_product_card.addEventListener('mouseleave', () => {
  //   card.style.opacity = '0';
  // });
}
export default withRouter(Menu);
