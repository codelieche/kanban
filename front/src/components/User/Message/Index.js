/**
 * 用户消息中心 相关的首页
 */

import React from "react";

import { NavLink, Route, Switch, Redirect } from "react-router-dom";

import { Row, Col, Badge } from "antd";

// import fetchApi from "../../Utils/fetchApi";
import MessageList from "./List";
import MessageDetail from "./Detail";
// 测试页面

class UserMessage extends React.Component {
  constructor(props) {
    super(props);
    // 未读消息count
    this.state = {
      unreadCount: 0
    };
  }

  updateUnReadCount = number => {
    // 修改未读消息的条数
    // 可以直接设置新的条数，也可以是-1
    if (number === "-1") {
      this.setState(prevState => {
        return {
          unreadCount: prevState.unreadCount - 1
        };
      });
    } else {
      if (this.state.unreadCount !== number) {
        this.setState({
          unreadCount: number
        });
      }
    }
  };

  render() {
    // 这里使用了右侧导航
    // 这个时候需要微米的Row布局使用flex布局
    // 内部一个设置指定宽度，另外一个设置flex为1，这样页面才会正常，否则会出现不正常情况
    return (
      <Row style={{ display: "flex", minHeight: "100%", overflow: "auto" }}>
        <Col span={4} className="right-nav">
          <div className="nav-title">
            <h3>消息中心</h3>
          </div>
          <ul className="right-nav-ul">
            <li>
              <NavLink activeClassName="active" to="/user/message/all">
                全部消息
              </NavLink>
            </li>
            <li>
              <NavLink activeClassName="active" to="/user/message/unread">
                <Badge
                  count={this.state.unreadCount}
                  // className="badge"
                  // style={{ marginLeft: 20, background: "#989898" }}
                  offset={[15, -5]}
                >
                  <span>未读消息</span>
                </Badge>
              </NavLink>
            </li>
            <li>
              <NavLink activeClassName="active" to="/user/message/read">
                已读消息
              </NavLink>
            </li>
            {/* <li>
                            <NavLink activeClassName="active" to="/user/message">开始页</NavLink>
                        </li> */}
          </ul>
        </Col>

        <Col style={{ listStyle: "inline-block", flex: 1 }}>
          <Switch>
            {/*右侧的页面  */}
            <Route
              exat
              path="/user/message/:type(all|unread|read)"
              render={props => (
                <MessageList
                  {...props}
                  updateUnReadCount={this.updateUnReadCount}
                />
              )}
            />
            <Route
              exat
              path="/user/message/:id(\d+)"
              component={MessageDetail}
            />
            <Route
              exat
              path="/user/message"
              render={() => <Redirect to="/user/message/all" push={false} />}
            />
          </Switch>
        </Col>
      </Row>
    );
  }
}

export default UserMessage;
