import React, { Component } from "react";
import Menu from "./MenuComponent";
import Footer from "./FooterComponent";
import Chatbot from "./ChatbotComponent";
import Home from "./HomeComponent";
import { Routes, Route, Navigate } from 'react-router-dom';
import Product from './ProductComponent';
import ProductDetail from './ProductDetailComponent';
import Signup from './SignupComponent';
import Active from './ActiveComponent';
import ActivateAccount from './ActivateComponent';
import Login from './LoginComponent';
import Myprofile from './MyprofileComponent';
import Mycart from './MycartComponent';
import Payment from './PaymentComponent';
import Myorders from './MyordersComponent';
import ContactComponent from './ContactComponent';
import AboutComponent from './AboutComponent';

class Main extends Component {
  render() {
    return (
      <div className="body-customer">
        <Menu />
        <Routes>
          <Route path="/" element={<Navigate replace to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path='/product/category/:cid' element={<Product />} />
          
          <Route path='/products' element={<Product />} />
          <Route path='/product/search/:keyword' element={<Product />} />
          <Route path='/product/:id' element={<ProductDetail />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/active' element={<Active />} />
          <Route path='/activate' element={<ActivateAccount />} />
          <Route path='/login' element={<Login />} />
          <Route path='/myprofile' element={<Myprofile />} />
          <Route path='/mycart' element={<Mycart />} />
          <Route path='/payment' element={<Payment />} />
          <Route path='/myorders' element={<Myorders />} />
          <Route path='/contact' element={<ContactComponent />} />
          <Route path='/about' element={<AboutComponent />} />
        </Routes>
        <Footer />
        <Chatbot />
      </div>
    );
  }
}
export default Main;
