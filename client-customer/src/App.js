import "./App.css";
import "./App-luxury.css";
import React, { Component } from "react";
import Main from "./components/MainComponent";
import { BrowserRouter } from 'react-router-dom';
import MyProvider from './contexts/MyProvider';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';

class App extends Component {
  render() {
    return (
      <ThemeProvider>
        <LanguageProvider>
          <MyProvider>
            <BrowserRouter >
              <Main />
            </BrowserRouter>
          </MyProvider>
        </LanguageProvider>
      </ThemeProvider>
    );
  }
}
export default App;
