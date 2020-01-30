/**
 * 用户中心首页
 * 包含组件：
 * 左边：任务信息等
 * 右边：消息中心
 */
import React from "react";

import { Row, Col } from "antd";

import UserJobsList from "./JobsList";
import MessageList from "./MessageList";

export default class UserCenterIndex extends React.Component {
  // constructor(props){
  //     super(props);
  //     console.log('ok');
  // }

  render() {
    return (
      <Row className="content">
        {/*左边部分  */}
        <Col xs={{ span: 24 }} sm={{ span: 24 }} lg={{span: 16}} className="main">
          <div className="title">
            <h4>任务列表</h4>
          </div>
          <div>
            {/* 暂无任务信息 */}
            <UserJobsList {...this.props} />
          </div>
        </Col>

        {/*右边部分  */}
        <Col xs={{ span: 24 }} sm={{span: 24}} lg={{ span: 8 }} className="sidebar">
          <MessageList history={this.props.history} />
        </Col>
      </Row>
    );
  }
}
