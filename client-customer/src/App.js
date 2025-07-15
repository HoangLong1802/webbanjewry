import "./App.css";
import "./App-luxury.css";
import React, { Component } from "react";
import Main from "./components/MainComponent";
import { BrowserRouter } from 'react-router-dom';
import MyProvider from './contexts/MyProvider';
import { LanguageProvider } from './contexts/LanguageContext';

class App extends Component {
  render() {
    return (
      <LanguageProvider>
        <MyProvider>
          <BrowserRouter >
            <Main />
          </BrowserRouter>
        </MyProvider>
      </LanguageProvider>
    );
  }
}
export default App;
