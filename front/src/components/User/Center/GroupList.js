/**
 * 用户的文档分组列表
 */

import React, {useState, useMemo, useCallback, useEffect} from "react";
import { Row, Col, Card, Tooltip } from "antd";
import { Link } from "react-router-dom";

import Icon from "../../Base/Icon";
import fetchApi from "../../Utils/fetchApi";
import LoadingPage from "../../Page/Loading";

export const UserGroupsList = (props) => {
  // 状态
  const [dataSource, setDataSource] = useState([]);
  const [ showLoading, setShowLoading ] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const fetchData = useCallback(() => {
    if (showLoading) {
      return;
    } else {
      setShowLoading(true);
    }
    // 加载用户任务信息
    const url = "/api/v1/docs/group/list";
    // 开始获取数据
    fetchApi.Get(url)
      .then(responseData => {
        var data = responseData.results;
        if (data instanceof Array) {
          // this.setState({ dataSource: data, loaded: true });
          setDataSource(data);
          setLoaded(true);
        }else{
          setLoaded(true);
          setDataSource([]);
        }
      })
      .catch(err => {
        console.log(err);
        // this.setState({ showLoading: false });
        setShowLoading(false);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if(dataSource.length === 0 && !loaded){
      fetchData()
    }
  }, [dataSource.length, fetchData, loaded])

  let itemElements = useMemo(() => {
    // 各分类元素
    let elements = dataSource.map((item, index) => {
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
                  <span className="config">名称:</span>
                  <span className="value">
                    <Link to={`/docs/group/${item.id}`}>{item.name}</Link>
                  </span>
                </div>
                <div className="row">
                  <span className="config">代码:</span>
                  <span className="value">{item.code}</span>
                </div>
              </div>
              <div className="buttons">
                {/* <div className="button" /> */}
                <div className="button">
                  <Link to={`/docs/group/${item.id}`}>查看详情</Link>
                </div>
                <div className="button">
                  <Link to={`/docs/group/${item.id}/articles`}>查看文章</Link>
                </div>
              </div>
            </Card>
          </Col>
        );
      })
      // 返回元素
      return elements;

    }, [dataSource]);

    if (!loaded) {
      // return <div className="no-content border">数据加载中....</div>;
      return <div className="usercenter"><LoadingPage /></div>;
    }
  
    if (dataSource.length === 0) {
      return (
        <div className="no-content border">
          您还没有任何工作区信息
        </div>
      );
    }

    return (
      <div className="usercenter position-relative">
        <Row gutter={8}>
          {itemElements}
        </Row>

        {/* 右下角显示个添加分组的+号 */}
        <div className="add bottom-right">
          <Link to="/docs/group/add">
            <Tooltip title="添加工作组" placement="bottom">
                <div>
                  <Icon type="plus" noMarginRight={true}></Icon>
               </div>
            </Tooltip>
          </Link>
        </div>
      </div>
    );
}

export default UserGroupsList;