import React, { Component } from 'react';
import MyContext from './MyContext';
import axios from 'axios';

class MyProvider extends Component {
  constructor(props) {
    super(props);
    this.state = { // global state
      // variables - load from localStorage if available
      token: localStorage.getItem('adminToken') || '',
      username: localStorage.getItem('adminUsername') || '',
      // functions
      setToken: this.setToken,
      setUsername: this.setUsername
    };
  }
  
  componentDidMount() {
    // Validate stored token when component mounts
    const storedToken = localStorage.getItem('adminToken');
    if (storedToken) {
      this.validateToken(storedToken);
    }
  }
  
  validateToken = async (token) => {
    try {
      // Add token to axios headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // You can add a validate endpoint here if needed
      // const response = await axios.get('/api/admin/validate');
      // if (!response.data.success) {
      //   this.clearAuth();
      // }
    } catch (error) {
      console.log('Token validation failed:', error);
      this.clearAuth();
    }
  }
  
  clearAuth = () => {
    this.setState({ token: '', username: '' });
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUsername');
    delete axios.defaults.headers.common['Authorization'];
  }
  
  setToken = (value) => {
    this.setState({ token: value });
    // Save to localStorage
    if (value) {
      localStorage.setItem('adminToken', value);
      // Set axios default header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${value}`;
    } else {
      localStorage.removeItem('adminToken');
      delete axios.defaults.headers.common['Authorization'];
    }
  }
  
  setUsername = (value) => {
    this.setState({ username: value });
    // Save to localStorage
    if (value) {
      localStorage.setItem('adminUsername', value);
    } else {
      localStorage.removeItem('adminUsername');
    }
  }
  
  render() {
    return (
      <MyContext.Provider value={this.state}>
        {this.props.children}
      </MyContext.Provider>
    );
  }
}
export default MyProvider;