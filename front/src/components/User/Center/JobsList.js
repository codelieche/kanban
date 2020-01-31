/**
 * 用户的任务信息列表
 */

import React from "react";
import { Row, Col, Card } from "antd";
import { Link } from "react-router-dom";
import fetchApi from "../../Utils/fetchApi";

export default class UserJobsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      showLoading: false,
      loaded: false
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    if (this.state.showLoading) {
      return;
    } else {
      this.setState({ showLoading: true });
    }
    // 加载用户任务信息
    const url = "/api/v1/task/job/list";
    // 开始获取数据
    fetchApi.Get(url)
      .then(responseData => {
        var data = responseData.results;
        if (data instanceof Array) {
          this.setState({ dataSource: data, loaded: true });
        }
      })
      .catch(err => {
        console.log(err);
        this.setState({ showLoading: false });
      });
  };

  render() {
    if (!this.state.loaded) {
      return <div className="no-content border">数据加载中....</div>;
    }

    if (this.state.dataSource.length === 0) {
      return (
        <div className="no-content border">
          您还没有任何任务信息
        </div>
      );
    }

    var itemElements = this.state.dataSource.map((item, index) => {
      return (
        <Col
          xs={{ span: 24 }}
          sm={{ span: 12 }}
          md={{ span: 12 }}
          lg={{ span: 8 }}
          className="info-item"
          key={index}
        >
          <Card title={item.name} bordered={true}>
            <div className="info">
              <div className="row">
                <span className="config">任务:</span>
                <span className="value">
                  <Link to={`/jobs/job/${item.id}`}>{item.title}</Link>
                </span>
              </div>
              <div className="row">
                <span className="config">创建者:</span>
                <span className="value">{item.creator}</span>
              </div>
              <div className="row">
                <span className="config">分类:</span>
                <span className="value">{item.category}</span>
              </div>
            </div>
            <div className="buttons">
              {/* <div className="button" /> */}
              <div className="button">
                <Link to={`/jobs/job/${item.id}`}>查看详情</Link>
              </div>
            </div>
          </Card>
        </Col>
      );
    });

    return (
      <div className="usercenter">
        <Row gutter={8}>{itemElements}</Row>
      </div>
    );
  }
}
