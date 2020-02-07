/**
 * 前端代码App主入口
 */
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// 引入样式文件, 在index.js中引入了
// import '../styles/main.less';

// 各个组件
import Home from "../components/Home";
import Login from "../components/User/Login";
import NoMatch from "../components/Base/NoMatch";

function App(props) {
    return (
      <Router>
        <Switch>
          <Route exact={true} path="/user/login" component={Login} />

          <Route exact path="/" component={Home} />

          <Route
            path="/task"
            render={props => <Home defaultOpenKey="/task" {...props} />}
          />

          <Route
            path="/docs"
            render={props => <Home defaultOpenKey="/docs" {...props} />}
          />

          <Route
            path="/user"
            render={props => <Home defaultOpenKey="/user" {...props} />}
          />
          <Route
            path="/test"
            render={props => <Home defaultOpenKey="/test" {...props} />}
          />

          {/* 这个一定要放最后面 */}
          <Route component={NoMatch} />
        </Switch>
      </Router>
    );
}

export default App;
