/**
 * 分类详情页
 * 采用Hook方式：不编写class的情况下使用state，以及其它React特性。
 */
import React, {useState, useEffect, useContext} from "react";
// import { Link } from "react-router-dom";
import {
    Row,
    Col,
} from "antd";

import { GlobalContext } from "../../Base/Context";
import Icon from "../../Base/Icon";
import ModelLogs from "../../Base/ModelLogs";
import fetchApi from "../../Utils/fetchApi";

// 分类详情页
function CategoryDetail(props) {
    // 申明一个叫：data的state变量
    // 因为id可能是数字，也可能是字符，需要有个状态保存一下
    const [id, idState] = useState(null);
    const [data, dataState] = useState({});
    // 获取context
    const { setNavData } = useContext(GlobalContext);

    // 获取详情数据
    const fetchDetailData = (id) => {
        const url = `/api/v1/docs/category/${id}`;
        fetchApi.Get(url)
          .then(data => {
              // 修改状态
              dataState(data);
          })
            .catch(err => {
                console.log(err)
            });
    }

    // 相当于 componentDidMount和componentDidUpdate
    // 特别小心，一不小心就陷入循环了
    useEffect(() => {
        // console.log(props)
        let paramID = props.match.params.id;
        // 特别注意state中的id是数值类型，props传过来的是字符型
        // 判断什么时候需要调用fetchDetailData，这个需要特别慎重
        if(paramID !== id){
            // 修改id的状态
            idState(paramID);
            fetchDetailData(props.match.params.id);
        }
    }, [props, id]);

    // 设置导航
    useEffect(() => {
        // 顶部导航面包屑的数据
        const navData = [
            {
                title: "首页",
                icon: "home",
                link: "/"
            },
            {
                title: "文档分类",
                link: "/docs/category"
            },
            {
                title: "详情"
            }
        ]
        setNavData(navData);
    }, [setNavData])

    // 相当于class方式的render(){}
    return (
        <div className="content">
            {/* 面包屑导航开始 */}
            {/* <Breadcrumb className="nav">
                <Breadcrumb.Item>
                    <Link to="/"><Icon type="home" noMarginRight={true}/>首页</Link>
                </Breadcrumb.Item>

                <Breadcrumb.Item>
                    <Link to="/docs/">文档</Link>
                </Breadcrumb.Item>

                <Breadcrumb.Item>
                    <Link to="/docs/category">分类</Link>
                </Breadcrumb.Item>

                <Breadcrumb.Item>详情</Breadcrumb.Item>
            </Breadcrumb> */}
            {/* 面包屑导航结束 */}

            {/* 主体内容 */}
            <div className="main">
                <Row gutter={16}>
                    {/* 左侧内容：start */}
                    <Col xs={{span: 24}} sm={{span: 16}}>
                        <Row className="title">
                            <h4>文档分类详情</h4>
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
                                <dt>父级分类</dt>
                                <dd>{data.parent ? data.parent : "---"}</dd>
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
                        {/* props.match.params.id有可能是字符，所以还是传递data.id更准确 */}
                        {data.id > 0 && <ModelLogs app="docs" model="category" id={data.id}></ModelLogs>}
                    </Col>
                    {/* 右侧内容：end */}
                </Row>
            </div>
        </div>
    );
}

export default CategoryDetail;
