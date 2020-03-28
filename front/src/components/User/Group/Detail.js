/**
 * 用户组 详情页
 */

import React, { useState, useEffect, useCallback, useContext} from "react";
import { Row, Col } from "antd";

import ModelLogs from "../../Base/ModelLogs";
import fetchApi from "../../Utils/fetchApi";
import { GlobalContext } from "../../Base/Context";
import LoadingPage from "../../Page/Loading";

export const UserGroupDetail = (props) => {
  // 获取全局的上下文
  const { setNavData } = useContext(GlobalContext);

  const [id, setID ] = useState(null);
  const [detail, setDetail] = useState({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // 设置导航数据
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
        title: "分组",
        link: "/user/group/list"
      },
      {
        title: "详情",
      }
    ])
  }, [setNavData]);


  const fetchDetailData = useCallback((groupID) => {
    // 获取详情信息
    const url = "/api/v1/account/group/" + groupID;
    fetchApi.Get(url)
      .then(data => {
        setDetail(data);
        setLoaded(true);
      })
      .catch(err => {
        console.log(err);
        setLoaded(true);
      });
  }, []);

  useEffect(() => {
    if(props.match.params.id && props.match.params.id !== id){
      setID(props.match.params.id);
      fetchDetailData(props.match.params.id);
    }
  }, [fetchDetailData, id, props.match.params.id])

  // 显示加载页面
  if(!loaded){
    return (
      <LoadingPage />
    );
  }

  return (
    <div className="content">
      <div className="main">
        <Row gutter={16}>
          <Col xs={{ span: 24 }} sm={{ span: 16 }}>
            <Row className="title">
              <h4>用户组详情</h4>
            </Row>
            <div className="info-property">
              <dl>
                <dt>名称</dt>
                <dd>{detail.name}</dd>
              </dl>
              <dl>
                <dt>所有用户</dt>
                <dd>
                  {detail.user_set
                    ? detail.user_set.join(", ")
                    : null}
                </dd>
              </dl>
            </div>
          </Col>
          <Col xs={24} sm={8}>
                <ModelLogs app="auth" model='group' id={id} />
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default UserGroupDetail;
