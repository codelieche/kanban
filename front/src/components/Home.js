/**
 * App的首页
 */
import React from "react";

import { Layout } from "antd";

import { Switch, Route } from "react-router-dom";

import Header from "./Base/Header";
import Nav from "./Base/Nav";
import Footer from "./Base/Footer";

// 任务相关的首页
import TaskIndex from "./Task/Index";
// 文档相关的首页
import DocsIndex from "./Docs/Index";

import TestIndex from "./Test/Index";
import UserIndex from "./User/Index";

import UserCenterIndex from "./User/Center/Index";

// 检查登陆的方法
import CheckLogined from "./Utils/auth";

// antd的布局
const { Sider, Content } = Layout;

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // 侧边栏是否折叠
      callapsed: false,
      // 最后一次检查是否登陆的时间
      laskCheckTime: new Date(),
    };
  }

  componentDidMount() {
    // console.log(this.props);
    // console.log(this.state);

    // 组件将要mount前先检查下用户是否登陆了
    if (this.props.history.action === "PUSH") {
      // 不需要检查是否登陆
    } else {
      CheckLogined(this.props);
    }
  }

  // componentWillReceiveProps(nextProps) {}

  checkLoginOperation = () => {
    var now = new Date();
    var sub = 0;
    sub = now.getTime - this.state.laskCheckTime.getTime();
    // 六分钟之内不检查是否登陆
    if (sub > 1000 * 600) {
      this.setState({ laskCheckTime: now });
      CheckLogined(this.props);
    } else {
      // console.log("不需要检查登陆", sub);
    }
  };

  toggle = () => {
    // Nav收缩开关
    this.setState(prevState => {
      return {
        collapsed: !prevState.collapsed,
        defaultOpenKey: this.props.defaultOpenKey
          ? this.props.defaultOpenKey
          : null
      };
    });
  };

  onCollapse = collapsed => {
    // 侧边栏Sider的onCollapse事件
    this.setState({ collapsed });
  };

  render() {
    var navTogleIcon = this.state.collapsed ? "indent" : "outdent";
    return (
      <Layout style={{ height: "100vh", overflow: "auto" }}>
      {/* <Layout> */}
        <Layout.Header className="header">
          <Header />
        </Layout.Header>
        <Layout>
          <Sider
            trigger={null}
            collapsible
            collapsed={this.state.collapsed}
            onCollapse={this.onCollapse}
            className="sider"
            collapsedWidth={65}
            breakpoint="sm"
          >
            <div onClick={this.toggle.bind(this)} className="sider-toggle">
              {/* <Icon type={this.state.collapsed ? "menu-unfold" : "menu-fold"} /> */}
              <i className={`fa fa-${navTogleIcon}`}></i>
            </div>
            <Nav
              collapsed={this.state.collapsed}
              defaultOpenKey={this.props.defaultOpenKey}
              pathname={this.props.location.pathname}
            />
          </Sider>
          
          <Layout style={{ maxHeight: "100vh", overflow: "auto" }}>
          {/* <Layout> */}
            <Content className="container" style={{overflow: "auto"}}> 
              <Switch>
                {this.checkLoginOperation()}

                <Route
                  path="/task"
                  component={TaskIndex}
                  location={this.props.location}
                />

                <Route
                  path="/docs"
                  component={DocsIndex}
                  location={this.props.location}
                />

                <Route
                  path="/test"
                  component={TestIndex}
                  location={this.props.location}
                />
                
                <Route
                  path="/user"
                  component={UserIndex}
                  location={this.props.location}
                />
                <Route exat path="/" component={UserCenterIndex} />
              </Switch>
              
            </Content>
            <Layout.Footer>
              <Footer />
            </Layout.Footer>
          </Layout>
        </Layout>
      </Layout>
    );
  }
}
