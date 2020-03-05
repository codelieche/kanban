/**
 * 调度中心首页
 */
import React from "react";

import { Switch, Route } from "react-router-dom";

// test 相关组件
import Page from './Page';
import Test from './Test';
import EditorPage from './Editor';


export default class TestIndex extends React.Component {
  render() {
    return (
      <Switch>
        {/* Task Code相关组件 */}
        <Route exat path="/test/test" component={Test} />
        <Route exat path="/test/page" component={Page} />
        <Route exat path="/test/editor" component={EditorPage} />
      </Switch>
    );
  }
}
