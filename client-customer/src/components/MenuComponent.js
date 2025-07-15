import axios from "axios";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import withRouter from "../utils/withRouter";
import MyContext from "../contexts/MyContext";
import { withLanguage } from "./LanguageSwitcher";
import LanguageSwitcher from "./LanguageSwitcher";

class Menu extends Component {
  static contextType = MyContext;
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      txtKeyword: "",
      showProductsDropdown: false,
    };
  }

  toggleProductsDropdown = () => {
    this.setState({ showProductsDropdown: !this.state.showProductsDropdown });
  };

  closeDropdown = () => {
    this.setState({ showProductsDropdown: false });
  };
  render() {
    const cates = this.state.categories.map((item) => {
      return (
        <Link key={item._id} className="dropdown-link" to={"/product/category/" + item._id}>
          {item.name}
        </Link>
      );
    });
    return (
      <nav className="modern-navbar">
        <div className="navbar-container">
          <Link className="brand-text" to="/">
            PANJ
          </Link>
          
          <ul className="nav-links">
            <li><Link to="/" className="nav-link">{this.props.t('home')}</Link></li>
            
            <li className="nav-dropdown">
              <button className="dropdown-toggle nav-link">
                {this.props.t('products')}
                <span className="dropdown-arrow">▼</span>
              </button>
              <div className="dropdown-menu">
                <Link to="/products" className="dropdown-link">
                  {this.props.t('allProducts')}
                </Link>
                {cates}
              </div>
            </li>
            
            <li><Link to="/about" className="nav-link">{this.props.t('about')}</Link></li>
            <li><Link to="/contact" className="nav-link">{this.props.t('contact')}</Link></li>
            
            {this.context.token === "" ? (
              <>
                <li><Link to="/login" className="nav-link">{this.props.t('login')}</Link></li>
                <li><Link to="/signup" className="nav-link">{this.props.t('register')}</Link></li>
              </>
            ) : (
              <>
                <li><Link to="/myprofile" className="nav-link">{this.props.t('welcome')}, {this.context.customer.name}</Link></li>
                <li><Link to="/myorders" className="nav-link">{this.props.t('myOrders')}</Link></li>
                <li>
                  <Link to="/home" onClick={() => this.lnkLogoutClick()} className="nav-link">
                    {this.props.t('logout')}
                  </Link>
                </li>
              </>
            )}
            
            <li>
              <Link to="/mycart" className="nav-link">
                {this.props.t('cart')} {this.context.mycart.length > 0 && `(${this.context.mycart.length})`}
              </Link>
            </li>
            
            <li className="nav-dropdown">
              <LanguageSwitcher />
            </li>
          </ul>
        </div>
      </nav>
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
export default withRouter(withLanguage(Menu));
