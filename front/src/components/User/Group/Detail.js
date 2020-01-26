/**
 * 用户组 详情页
 */

import React from "react";

import { Link } from "react-router-dom";

import { Row, Col, Breadcrumb } from "antd";
import ModelLogs from "../../Base/ModelLogs";

import fetchApi from "../../Utils/fetchApi";

export default class UserGroupDetail extends React.Component {
  constructor(props) {
    super(props);
    // 获取相应的详情数据
    this.state = {
      id: this.props.match.params.id,
      detail: {}
    };
  }

  componentDidMount() {
    if (this.props.location.state) {
      this.setState({
        detail: this.props.location.state.data
      });
    } else {
      // 获取detail数据
      this.fetchDetailData();
    }
  }

  fetchDetailData = () => {
    // 获取详情信息
    const url = "/api/v1/account/group/" + this.state.id;
    fetchApi.Get(url)
      .then(data => {
        this.setState({
          detail: data
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    return (
      <div className="content">
        <Breadcrumb className="nav">
          <Breadcrumb.Item>
            <Link to="/">首页</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/user/group">用户组</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>详情</Breadcrumb.Item>
        </Breadcrumb>
        <div className="main">
          <Row gutter={16}>
            <Col xs={{ span: 24 }} sm={{ span: 16 }}>
              <Row className="title">
                <h4>用户组详情</h4>
              </Row>
              <div className="info-property">
                <dl>
                  <dt>名称</dt>
                  <dd>{this.state.detail.name}</dd>
                </dl>
                <dl>
                  <dt>所有用户</dt>
                  <dd>
                    {this.state.detail.user_set
                      ? this.state.detail.user_set.join(", ")
                      : null}
                  </dd>
                </dl>
              </div>
            </Col>
            <Col xs={24} sm={8}>
                  <ModelLogs app="auth" model='group' id={this.state.id} />
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}
