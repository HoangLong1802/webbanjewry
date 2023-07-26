import React, { Component } from "react";
import { Link } from "react-router-dom";
class Home extends Component {
  render() {
    return (
      <div className="align-center">
        <h2 className="text-center">Hello Admin Wecome To PANJ</h2>
        <div className="home_menu-wrap">
          <div className="main__home--menu">
              <Link to="/admin/category">Category</Link>
              <Link className="main__a--wrap" to="/admin/product">Product</Link>
          </div>
          <div className="main__home--menu">
              <Link to="/admin/order">Order</Link>
              <Link className="main__a--wrap" to="/admin/customer">Customer</Link>
          </div>

        </div>
      </div>
    );
  }
}
export default Home;
