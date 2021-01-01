import React from 'react';

import { Button } from "antd";
// import {StarFilled} from "@ant-design/icons";
import api from "../Utils/fetchApi";
import Icon from "../Base/Icon";
import MermaidPreviewDemo from "./demo/mermaid";

// import "../../styles/font-awesome.min.css";

class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      iconType: "refresh fa-5x",
      spin: false,
    }
  }

  onIconSpinClick = () => {
    if(this.state.spin){
      this.setState({
        spin: false,
      });
    }else{
      this.setState({
        spin: true,
      });
    }
  }

  render(){
    // console.log("test page");
    return (
      <div style={{
          margin:"100px", marginTop: "15%", border: "1px solid #999", padding: 10,
          textAlign: "center", borderRadius: 5,
        }}>
        <header className="header" >
          <div className="logo" style={{width: 250, backgroundColor: "#4A90E2", padding:10}}>
            <img src="https://www.codelieche.com/static/images/logo.svg" className="App-logo" alt="logo" />
          </div>
          <span style={{padding: 20, backgroundColor: "#f9f9f9", display:"block"}}>
            Hello React.js
            <br/>
            <Button onClick={api.testFetch}>按钮</Button>
            <br/>
            {/* <StarFilled /> */}
            <br/>
            <i className="fa fa-camera-retro fa-5x"></i>
            {/* <i className="fa fa-refresh fa-spin fa-4x"></i>
            <i className="fa fa-refresh fa-4x"></i>
            <i className="fa fa-spinner fa-pulse fa-4x"></i> */}
            <br />

            <Button onClick={this.onIconSpinClick}>Loding</Button>
            <Icon type={this.state.iconType} spin={this.state.spin}></Icon>
          </span>
          
        </header>

        <div>
          <div>Test: MermaidPreviewDemo</div>
          <MermaidPreviewDemo />
        </div>
      </div>
    );
  }
}
  
  export default App;
  