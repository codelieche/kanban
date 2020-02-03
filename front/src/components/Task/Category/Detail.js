/**
 * 分类详情页
 * 采用Hook方式：不编写class的情况下使用state，以及其它React特性。
 */
import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import {
    Row,
    Col,
    Breadcrumb
} from "antd";

import Icon from "../../Base/Icon";
import ModelLogs from "../../Base/ModelLogs";
import fetchApi from "../../Utils/fetchApi";


// 分类详情页
function CategoryDetail(props) {
    // 申明一个叫：data的state变量
    const [data, setData] = useState({});

    // 获取详情数据
    const fetchDetailData = (id) => {
        const url = `/api/v1/task/category/${id}`;
        fetchApi.Get(url)
          .then(data => {
              // 修改状态
              setData(data);
          })
            .catch(err => {
                console.log(err)
            });
    }

    // 相当于 componentDidMount和componentDidUpdate
    useEffect(() => {
        let id = props.match.params.id;
        // 特别注意state中的id是数值类型，props传过来的是字符型
        // 判断什么时候需要调用fetchDetailData，这个需要特别慎重
        if(id !== String(data.id)){
            fetchDetailData(props.match.params.id);
        }
    });

    // 相当于class方式的render(){}
    return (
        <div className="content">
            {/* 面包屑导航开始 */}
            <Breadcrumb className="nav">
                <Breadcrumb.Item>
                    <Link to="/"><Icon type="home" noMarginRight={true}/>首页</Link>
                </Breadcrumb.Item>

                <Breadcrumb.Item>
                    <Link to="/task/job">任务</Link>
                </Breadcrumb.Item>

                <Breadcrumb.Item>
                    <Link to="/task/category">分类</Link>
                </Breadcrumb.Item>

                <Breadcrumb.Item>详情</Breadcrumb.Item>
            </Breadcrumb>
            {/* 面包屑导航结束 */}

            {/* 主体内容 */}
            <div className="main">
                <Row gutter={16}>
                    {/* 左侧内容：start */}
                    <Col xs={{span: 24}} sm={{span: 16}}>
                        <Row className="title">
                            <h4>分类详情</h4>
                        </Row>
                        <div className="info-property">
                            <dl>
                                <dt>名称</dt>
                                <dd>{data.name}</dd>
                            </dl>
                            <dl>
                                <dt>Code</dt>
                                <dd>{data.code}</dd>
                            </dl>
                            <dl>
                                <dt>状态</dt>
                                <dd className="status">
                                    <Icon type={data.is_deleted ? "close" : "check"} />
                                </dd>
                            </dl>
                            <dl>
                                <dt>描述</dt>
                                <dd>{data.description}</dd>
                            </dl>
                            {
                                data.image &&  
                                <dl>
                                    <dt></dt>
                                    <dd><img alt="图片" src={data.image}></img></dd>
                                </dl>
                            }
                           
                            <dl>
                                <dt>添加时间</dt>
                                <dd>{data.time_added}</dd>
                            </dl>
                           
                        </div>
                    </Col>
                    {/* 左侧内容：end */}

                    {/* 右侧内容：start */}
                    <Col xs={{span: 24}} sm={{span: 8}}>
                        <ModelLogs app="task" model="category" id={props.match.params.id}></ModelLogs>
                    </Col>
                    {/* 右侧内容：end */}
                </Row>
            </div>
        </div>
    );
}

export default CategoryDetail;
