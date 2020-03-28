/**
 * 用户消息中心 相关的首页
 */

import React, {useState, useEffect, useCallback, useContext} from "react";

import { NavLink, Route, Switch, Redirect } from "react-router-dom";

import { Row, Col, Badge } from "antd";

// import fetchApi from "../../Utils/fetchApi";
import { GlobalContext } from "../../Base/Context";
import MessageList from "./List";
import MessageDetail from "./Detail";
// 测试页面

export const UserMessage = (props) => {
  // 状态
  const [unreadCount, setUnreadCount] = useState(0);

  // 导航数据
  const { setNavData } = useContext(GlobalContext);

  useEffect(() => {
    setNavData([
      {
        title: "首页",
        icon: "home",
        link: "/"
      },
      {
        title: "用户",
        link: "/user"
      },
      {
        title: "消息中心",
        link: "/user/message/list"
      },
    ])
  }, [setNavData])


  const updateUnReadCount = useCallback(number => {
    // 修改未读消息的条数
    // 可以直接设置新的条数，也可以是-1
    if (number === "-1") {
      setUnreadCount(prevState => prevState -1);
    } else {
      setUnreadCount(number);
    }
  }, []);

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
                count={unreadCount}
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
                updateUnReadCount={updateUnReadCount}
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

export default UserMessage;
