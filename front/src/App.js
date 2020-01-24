import React from 'react';

import { Button } from "antd";

import './App.css';
import api from "./utils/fetchApi";

function App() {

  return (
    <div className="container">
      <header className="header">
        <div className="logo">
          <img src="https://www.codelieche.com/static/images/logo.svg" className="App-logo" alt="logo" />
        </div>
        <p>
          Hello React.js
          <br/>
          <Button onClick={api.testFetch}>按钮</Button>
        </p>
        
      </header>
    </div>
  );
}

export default App;
