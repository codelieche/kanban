/**
 * 用户中心首页
 * 包含组件：
 * 左边：文档信息等
 * 右边：消息中心
 */
import React, {useEffect, useContext} from "react";
import { Link } from "react-router-dom";
import { Row, Col } from "antd";

import Icon from "../../Base/Icon";
import { GlobalContext } from "../../Base/Context";
import UserGroupsList from "./GroupList";
import MessageList from "./MessageList";

export const UserCenterIndex = (props) => {

  // 修改右侧的导航数据
  const { setNavData } = useContext(GlobalContext);

  useEffect(() => {
    setNavData([
      {
        title: "首页",
        icon: "home",
        link: "/"
      },
      {
        title: "用户中心",
      }
    ])
  }, [setNavData])

  return (
    <Row className="content">
      {/*左边部分  */}
      <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{span: 16}} lg={{span: 18}} className="main">
        <div className="title position-relative">
          <h4>工作区列表</h4>
          <div className="right">
            <Link to="/docs/group/list">
              more <Icon type="angle-double-right"></Icon>
              {/* more <Icon type="chevron-circle-right"></Icon> */}
            </Link>
          </div>
        </div>
        <div>
          {/* 暂无任务信息 */}
          <UserGroupsList {...props} />
        </div>
      </Col>

      {/*右边部分  */}
      <Col xs={{ span: 24 }} sm={{span: 24}} md={{span: 16}} lg={{ span: 6}} className="sidebar">
        <MessageList />
      </Col>
    </Row>
  );
}

export default UserCenterIndex;
