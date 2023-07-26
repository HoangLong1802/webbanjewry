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
          <Link className="menu" to={"/product/category/" + item._id}>{item.name}</Link>
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
              onClick={(e) => this.btnSearchClick(e)}
            />
          </form>
          <div>
          <Link to='/mycart'>My cart</Link> have <b>{this.context.mycart.length}</b> items
          </div>
          {this.context.token === "" ? (
            <div className="imfor__menu--wrap">
              <Link to="/login">Login</Link> | <Link to="/signup">Sign-up</Link>{" "}
              | <Link to="/active">Active</Link>
            </div>
          ) : (
            <div>
              Hello <b>{this.context.customer.name}</b> |{" "}
              <Link to="/home" onClick={() => this.lnkLogoutClick()}>
                Logout
              </Link>{" "}
              | <Link to="/myprofile">My profile</Link> |{" "}
              <Link to="/myorders">My orders</Link>
            </div>
          )}
        </div>
        <div className="float-clear" />
      </div>
    );
  }
  btnSearchClick(e) {
    e.preventDefault();
    this.props.navigate("/product/search/" + this.state.txtKeyword);
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
}
export default withRouter(Menu);
