import axios from "axios";
import React, { Component } from "react";
import { Link } from "react-router-dom";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newprods: [],
      hotprods: [],
    };
  }
  render() {
    const newprods = this.state.newprods.map((item) => {
      return (
        <div key={item._id} className="inline">
          <Link to={"/product/" + item._id}>
            <img
              src={"data:image/jpg;base64," + item.image}
              width="300px"
              height="300px"
              alt=""
            />
            {item.name}
            <br />
            Price: {item.price}
          </Link>
        </div>
      );
    });
    const hotprods = this.state.hotprods.map((item) => {
      return (
        <div key={item._id} className="inline">
          <Link to={"/product/" + item._id}>
            <img
              src={"data:image/jpg;base64," + item.image}
              width="300px"
              height="300px"
              alt=""
            />
            {item.name}
            <br />
            Price: {item.price}
          </Link>
        </div>
      );
    });
    return (
      <div>
        <div className="align-center home__align--wrap">
          <h2 className="text-center">NEW PRODUCTS</h2>
          <div className="product_control">
            <div className="product">
            {newprods}{newprods}{newprods}{newprods}{newprods}{newprods}{newprods}
              </div>
          </div>
        </div>
        <div className="align-center  home__align--wrap">
          <h2 className="text-center">HOT PRODUCTS</h2>
          <div className="product_control">{this.check(hotprods)}</div>
        </div>
      </div>
    );
  }
  check(hotprods) {
    if (this.state.hotprods.length > 0) return hotprods;
  }
  componentDidMount() {
    this.apiGetNewProducts();
    this.apiGetHotProducts();
  }
  // apis
  apiGetNewProducts() {
    axios.get("/api/customer/products/new").then((res) => {
      const result = res.data;
      this.setState({ newprods: result });
    });
  }
  apiGetHotProducts() {
    axios.get("/api/customer/products/hot").then((res) => {
      const result = res.data;
      this.setState({ hotprods: result });
    });
  }
}
export default Home;
