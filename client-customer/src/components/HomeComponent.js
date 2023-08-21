import axios from "axios";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import video from "../assets/videos/homePage/ad_video.mp4";
import picture from "../assets/pictures/homePage/home__first.jpg"
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newprods: [],
      hotprods: []
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
            <div class="name_and_price">
              <p>{item.name}</p>
              <p className="css_price">Price: {item.price}</p>
            </div>
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
            <div class="name_and_price">
              <p>{item.name}</p>
              <p className="css_price">Price: {item.price}</p>
            </div>
          </Link>
        </div>
      );
    });
    return (
      <div>
        <div class="video-background">
          <video autoPlay muted loop playsInline> 
            <source src={video} type="video/mp4" />
          </video>
        </div>
        <div className="main__home--wrap">
          <div className="mainHome__left--wrap">
            <div className="align-center home__align--wrap">
              <h2 className="text-center"> NEW PRODUCTS </h2>
              <div className="product_control">
                <div className="product">
                  {newprods} {newprods} {newprods} {newprods} {newprods}{" "}
                  {newprods}
                  {newprods}
                </div>
              </div>
            </div>
            <div className="align-center  home__align--wrap">
              <h2 className="text-center"> HOT PRODUCTS </h2>
              <div className="product_control">
                <div className="product">
                  {this.check(hotprods)}</div>
              </div>
            </div>
          </div>
          <div className="mainHome__right--wrap">
            {/* <img src={picture}></img> */}
          </div>
        </div>
        
      </div>
    );
  }

  check(hotprods) {
    if (this.state.hotprods.length > 0){
      return [hotprods,hotprods,hotprods,hotprods,hotprods,hotprods];
    } 
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
