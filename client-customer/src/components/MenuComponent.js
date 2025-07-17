import axios from "axios";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import withRouter from "../utils/withRouter";
import MyContext from "../contexts/MyContext";
import { withLanguage } from "./LanguageSwitcher";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeSwitcher from "./ThemeSwitcher";

class Menu extends Component {
  static contextType = MyContext;
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      txtKeyword: "",
      showProductsDropdown: false,
      isMobileMenuOpen: false,
    };
  }

  toggleProductsDropdown = () => {
    this.setState({ showProductsDropdown: !this.state.showProductsDropdown });
  };

  closeDropdown = () => {
    this.setState({ showProductsDropdown: false });
  };

  toggleMobileMenu = () => {
    this.setState({ isMobileMenuOpen: !this.state.isMobileMenuOpen });
  };

  closeMobileMenu = () => {
    this.setState({ isMobileMenuOpen: false });
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
          <Link className="brand-text" to="/" onClick={this.closeMobileMenu}>
            PANJ
          </Link>
          
          {/* Desktop Navigation */}
          <ul className={`nav-links ${this.state.isMobileMenuOpen ? 'mobile-active' : ''}`}>
            <li><Link to="/" className="nav-link" onClick={this.closeMobileMenu}>{this.props.t('home')}</Link></li>
            
            <li className="nav-dropdown">
              <button className="dropdown-toggle nav-link" onClick={this.toggleProductsDropdown}>
                {this.props.t('products')}
                <span className="dropdown-arrow">▼</span>
              </button>
              {this.state.showProductsDropdown && (
                <div className="dropdown-menu">
                  <Link to="/products" className="dropdown-link" onClick={() => {this.closeMobileMenu(); this.closeDropdown();}}>
                    {this.props.t('allProducts')}
                  </Link>
                  {cates.map(item => 
                    React.cloneElement(item, { 
                      onClick: () => {this.closeMobileMenu(); this.closeDropdown();},
                      key: item.key 
                    })
                  )}
                </div>
              )}
            </li>
            
            <li><Link to="/about" className="nav-link" onClick={this.closeMobileMenu}>{this.props.t('about')}</Link></li>
            <li><Link to="/contact" className="nav-link" onClick={this.closeMobileMenu}>{this.props.t('contact')}</Link></li>
            
            {this.context.token === "" ? (
              <>
                <li><Link to="/login" className="nav-link" onClick={this.closeMobileMenu}>{this.props.t('login')}</Link></li>
                <li><Link to="/signup" className="nav-link" onClick={this.closeMobileMenu}>{this.props.t('register')}</Link></li>
              </>
            ) : (
              <>
                <li><Link to="/myprofile" className="nav-link" onClick={this.closeMobileMenu}>{this.props.t('welcome')}, {this.context.customer.name}</Link></li>
                <li><Link to="/myorders" className="nav-link" onClick={this.closeMobileMenu}>{this.props.t('myOrders')}</Link></li>
                <li>
                  <Link 
                    to="/home" 
                    onClick={() => {
                      this.lnkLogoutClick();
                      this.closeMobileMenu();
                    }} 
                    className="nav-link"
                  >
                    {this.props.t('logout')}
                  </Link>
                </li>
              </>
            )}
            
            <li>
              <Link to="/mycart" className="nav-link cart-link" onClick={this.closeMobileMenu}>
                🛒 {this.props.t('cart')} {this.context.mycart.length > 0 && `(${this.context.mycart.length})`}
              </Link>
            </li>
            
            <li className="nav-dropdown">
              <LanguageSwitcher />
            </li>
          </ul>

          {/* Mobile Hamburger Button */}
          <button 
            className="navbar-hamburger"
            onClick={this.toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <span className={`hamburger-line ${this.state.isMobileMenuOpen ? 'active' : ''}`}></span>
            <span className={`hamburger-line ${this.state.isMobileMenuOpen ? 'active' : ''}`}></span>
            <span className={`hamburger-line ${this.state.isMobileMenuOpen ? 'active' : ''}`}></span>
          </button>
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
