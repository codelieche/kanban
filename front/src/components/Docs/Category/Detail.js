/**
 * 分类详情页
 * 采用Hook方式：不编写class的情况下使用state，以及其它React特性。
 */
import React, {useState, useEffect, useContext, useMemo} from "react";
import { Link } from "react-router-dom";
import {
    Row,
    Col,
    Tag,
    Divider
} from "antd";

import { GlobalContext } from "../../Base/Context";
import Icon from "../../Base/Icon";
import ModelLogs from "../../Base/ModelLogs";
import fetchApi from "../../Utils/fetchApi";
import LoadingPage from "../../Page/Loading";

import BaseTable from "../../Page/BaseTable";

// 分类详情页
function CategoryDetail(props) {
    // 申明一个叫：data的state变量
    // 因为id可能是数字，也可能是字符，需要有个状态保存一下
    const [id, idState] = useState(null);
    const [data, dataState] = useState({});
    const [loaded, setLoaded] = useState(false);
    // 获取context
    const { setNavData } = useContext(GlobalContext);

    // 获取详情数据
    const fetchDetailData = (id) => {
        const url = `/api/v1/docs/category/${id}`;
        fetchApi.Get(url)
          .then(data => {
              // 修改状态
              dataState(data);
              setLoaded(true);
              // 修改标题
              document.title = `${data.name}-分类-看板`;

          })
            .catch(err => {
                setLoaded(true);
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

    // 用户权限
    const userPermissionElements = useMemo(() => {
        if(data.users_permisson && data.users_permisson.length > 0){
            let tagsElements = data.users_permisson.map((item, index) => {
                // console.log(item, index);
                return (
                    <Tag key={item.id} color={ item.is_active ? "blue" : ""}>
                        {item.user}
                        <Divider type="vertical" />
                        {item.permission}
                    </Tag>
                );
            });
            // 标签用div包裹起来
            return (
                <div style={{margin: "3px 0"}}>
                    {tagsElements}
                </div>
            )
             
        }else{
            return <span>无用户</span>;
        }
    }, [data.users_permisson])

    // 分类文章相关的表格
    // params字段:通过url可获取到的字段信息
    const paramsFields = useMemo(() => {
        return ["page", "search", "ordering", "parent", "level", "is_deleted"];
        
    // 为了让当切换了另外一个分类的时候，触发表格的更新
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.match.params.id]);

    // 表格的filter字段
    const filterColumns = useMemo(() => {
        return ["is_deleted", "parent"]
    }, [])

    // 表格的列
    const columns = useMemo(() => {
        return [
            {
                title: "ID",
                dataIndex: "id",
                key: "id",
                sorter: (a, b) => {},
                render: (text, record) => {
                    return <Link to={`/docs/article/${text}`}>{text}</Link>;
                },
                ellipsis: true,
                width: 50,
            },

            {
                title: "标题",
                dataIndex: "title",
                key: "title",
                width: 250,
                ellipsis: true,
            },
            {
                title: "父级页面",
                dataIndex: "parent",
                key: "parent",
                width: 180,
                ellipsis: true,
                render: (text, record) => {
                    if(!!text){
                        return (
                            <Link to={`/docs/article/${text.id}`}>
                                <Icon type="link" />
                                {text.title}
                            </Link>
                        );
                    }else{
                        return (
                            <div>---</div>
                        )
                    }
                }
            },
            {
                title: "添加者",
                dataIndex: "user",
                key: "user",
                width: 100,
                ellipsis: true,
                sorter: () => {}
            },
            {
                title: "创建时间",
                dataIndex: "time_added",
                key: "time_added",
                width: 180,
                ellipsis: true,
                sorter: (a, b) => {}
            },
            {
                title: "操作",
                key: "action",
                // width: 200,
                ellipsis: true,
                render: (text, record) => {
                    return (
                        <div>
                            {/* 查看详情 */}
                            <Link to={`/docs/article/${record.id}`}>
                                <Icon type="link" />查看详情
                            </Link>
                            {/* 查看属性 */}
                        </div>
                    )
                }
            }
        ]
    }, [])
    
    // 判断是否加载完了
    if(!loaded){
        return <LoadingPage size="large"/>;
    }

    // 相当于class方式的render(){}
    return (
        <div className="content">

            {/* 主体内容 */}
            <div className="main">
                <Row gutter={16}>
                    {/* 左侧内容：start */}
                    <Col xs={{span: 24}} sm={{span: 16}} lg={{span: 18}}>
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
                                <dt>所有者</dt>
                                <dd>{data.owner}</dd>
                            </dl>
                            <dl>
                                <dt>用户</dt>
                                <dd>{userPermissionElements}</dd>
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
                        
                        {/* 文章列表部分 */}
                        <div>
                            <Row className="title">
                                <h4>文章列表</h4>
                            </Row>
                            {/* 分类的文章列表 */}
                            <BaseTable 
                                columns={columns} 
                                filterColumns={filterColumns}  // filter会用到
                                paramsFields={paramsFields}  // url传递的参数

                                location={props.location} 
                                history={props.history}
                                
                                apiUrlPrefix={ id ? `/api/v1/docs/category/${id}/articles` : null}
                                pageUrlPrefix={`/docs/category/${id}`}
                            />
                        </div>
                        {/* 文章列表部分：end */}

                    </Col>
                    {/* 左侧内容：end */}

                    {/* 右侧内容：start */}
                    <Col xs={{span: 24}} sm={{span: 8}} lg={{span: 6}}>
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
