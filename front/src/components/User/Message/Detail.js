/**
 * 用户消息 Detail Page
 * 路由设置：<Route exat path='/user/message/:id(\d+)' component={MessageDetail} />
 * 通过this.props.match.params.id就可以获取到message的id
 */
import React from "react";

import { Link } from "react-router-dom";

import fetchApi from "../../Utils/fetchApi";

export default class MessageDetail extends React.Component {
  constructor(props) {
    super(props);
    // console.log(this.props);
    // 获取相应的详情数据：
    this.state = {
      // DNS的id其实是域名：
      // 存储在etcd中的dns信息没数字id，但是key是唯一的，我们可以domain的name当id使用
      id: this.props.match.params.id,
      detail: {}
    };
  }

  componentDidMount() {
    // 获取detail数据
    this.fetchDetailData();

    // if(this.props.location.state && this.props.location.state.data){

    // }else{
    // 获取detail数据
    // this.fetchDetailData();
    // }
  }
  fetchDetailData = () => {
    //获取详情信息
    // get信息虽然是安全的，但是后台api大部分设置了需要登陆才可以访问
    const url = "/api/v1/account/message/" + this.state.id;
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
    var linkElement;
    if (this.state.detail.link) {
      linkElement = (
        <Link to={this.state.detail.link}>
          {this.state.detail.link}
        </Link>
      );
    }
    return (
      <div className="content">
        {/* <Breadcrumb className="nav">
          <Breadcrumb.Item>
            <Link to="/">首页</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/user/message/all">消息中心</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>详情</Breadcrumb.Item>
        </Breadcrumb> */}

        <div className="main">
          <div className="message">
            <div className="header">
              <div className="article-title">
                <h4>{this.state.detail.title}xx</h4>
              </div>
              <div className="meta">
                <span>消息类型: {this.state.detail.scope}</span>
                <span>发送者: {this.state.detail.sender}</span>
                <span>时间: {this.state.detail.time_added}</span>
              </div>
            </div>

            <div className="body">
              {this.state.detail.content}
              <br />
              {linkElement}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
