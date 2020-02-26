/**
 * 用户中心右侧消息列表
 * 先获取最新的十条消息
 */
import React from "react";

import { Link } from "react-router-dom";
import fetchApi from "../../Utils/fetchApi";

import MessageItem from "./MessageItem";

export default class MessageList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      more: false,
      messageList: []
    };
  }

  componentDidMount() {
    this.fetchMessageData();
  }

  fetchMessageData = () => {
    // 从api获取最新的十条消息
    var url = "/api/v1/account/message/list";
    fetchApi.Get(url)
      .then(responseData => {
        // 把results保存到state中
        var data = responseData.results;
        if (data instanceof Array) {
          // 获取到的数据需要是个数组
          var more = responseData.next ? true : false;
          this.setState({
            messageList: data,
            more: more
          });
        }
      });
  };

  render() {
    // 先渲染messageItem
    var messageItems, messageListInner, moreMessage;
    messageItems = this.state.messageList.map((item, index) => {
      return (
        <MessageItem message={item} key={index} history={this.props.history} />
      );
    });
    if (this.state.more) {
      moreMessage = (
        <div className="more">
          <Link className="" to="/user/message/all">
            查看更多
          </Link>
        </div>

      );
    }

    if (messageItems.length > 0) {
      messageListInner = (
        <div className="inner">
          <ul className="list">{messageItems}</ul>
          {moreMessage}
        </div>
      );
    } else {
      messageListInner = <div className="no-content">暂无消息</div>;
    }

    return (
      <div className="panel">
        <div className="header">消息列表</div>
        {messageListInner}
      </div>
    );
  }
}
