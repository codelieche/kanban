/**
 * 任务分类列表页
 */
import React from "react";
import {
    Link
} from "react-router-dom";
import {
    Breadcrumb, Input,
    Row, Col, Button, Table,
    message, Divider
} from "antd";

// 图标组件
import Icon from "../../Base/Icon";

// 从utils中导入相关功能函数
import fetchApi from "../../Utils/fetchApi";
import { getParamsFromLocationSearch } from "../../Utils/UrlParam";
// 检查用户的权限
import { checkUserPermissionAndUpdateState } from "../../Utils/auth";
// 生成表单过滤选项的函数
import { generateTableFilterOptions } from "../../Utils/table";

class CategoryList extends React.Component{
    constructor(props){
        super(props);

        // 处理url中传递的数据
        let locationSearch = this.props.location.search;
        // // 通过url可以传递的参数
        this.paramsFields = ["page", "search", "ordering", "parent", "level", "is_deleted"]
        // 获取url中获取的字段信息
        let params = getParamsFromLocationSearch(this.paramsFields, locationSearch);

        // console.log(params);

        this.state = {
            // 当前页
            // currentPage: page,
            dataSource: [],
            dataCount: 10,
            loaded: false,
            // url传递的params
            locationSearch: this.props.location.search,
            // 记得把paramsFields传入到state中
            paramsFields: this.paramsFields,
            // 通过url传递的参数
            ...params,
            // filter options
            parentFilterOptions: [],
            // 权限
            userCanAddCategory: false,
        };
    }

    componentDidMount(){
        this.fetchData(this.state.page);

        // 生成列表filter parent options
        generateTableFilterOptions.bind(this)(
            "parentFilterOptions", "parentFilterDataSource", "/api/v1/task/category/all?level=1",
            "name", "id",
        );

        // 权限检查并设置state
        checkUserPermissionAndUpdateState.bind(this)("task.add_category", "userCanAddCategory");
    }

    static getDerivedStateFromProps(nextProps, prevState){
        // console.log(nextProps, prevState);
        if(nextProps.location.search !== prevState.locationSearch){
            // console.log(nextProps.location.search);
            // 处理url中传递的数据
            let locationSearch = nextProps.location.search;
            let params = getParamsFromLocationSearch(prevState.paramsFields, locationSearch);
            // let params = {};
            // 返回新的状态
            return {
                ...params,
                locationSearch: locationSearch,
            }

        }else{
            return null;
        }
    }

    componentDidUpdate(prevProps, prevState, snaptshot){
        if(prevState.locationSearch !== this.state.locationSearch){
            this.fetchData(this.state.page);
        }
    }

    fetchData = (page) => {
        // 因为有个刷新按钮，防止连续点击
        // 当fetch完数据后设置loaded状态为true
        if (this.state.loaded) {
            this.setState({
                loaded: false
            });
        } else {
            //正在加载，如果dataSource不是空直接返回
            // 这个时候是因为点了刷新数据，但是上次刷新的请求正在进行中，有数据就直接返回吧
            if (this.state.dataSource.length > 0) {
                return;
            }
        }
    
        // 对page进行校验
        if(isNaN(page) || ! page){
            page = 1;
        }else{
            page = parseInt(page, 10);
        }


        // 构造url
        let url = "/api/v1/task/category/list?page=" + page;
        // 对params中的字段做处理：记得去掉page
        this.paramsFields.forEach(item => {
            let value = this.state[item];
            // console.log(item, value);
            if(value !== undefined && value !== null && item !== "page"){
                url = `${url}&${item}=${value}`;
            }
        });

        // console.log(url);

        // 发起ajax请求
        fetchApi.Get(url)
          .then(responseData => {
            // 返回的json数据是数组才去修改列表相关的数据
            let data = responseData.results;
            if(data instanceof Array){
                this.setState({
                    dataSource: data,
                    loaded: true,
                    dataCount: responseData.count,
                    currentPage: page,
                });
            }else{
                this.setState({
                    loaded: true
                });
                message.error(JSON.stringify(responseData), 5);
            }
          })
            .catch(err => {
                console.log(err);
                this.setState({loaded: true});
            })
    }

    onSearchHandler = value => {
        // 搜索框回车后处理函数
        let noSearch = true;
        if(value){
            noSearch = false;
        }

        this.setState({
            search: value,
        }, () => {
            let url = `/task/category/list?page=1`;

            // 处理params
            this.paramsFields.forEach(item => {
                // item不是search、或者 (是search 但是有值的情况)就设置url
                if(item !== "search" || !noSearch){
                    let value = this.state[item];
                    if(value !== undefined){
                        url = `${url}&${item}=${value}`;
                    };
                }
            });

            this.props.history.push(url);
        });
    }

    handleTableChange = (pagination, filters, sorter) => {
        let currentPage = pagination.current;
        var filterColumns = ["is_deleted", "parent"];
        let values = {};
        filterColumns.forEach(item => {
            var v = filters[item];
            if(v){
                if(v instanceof Array){
                    values[item] = v[0];
                }else{
                    values[item] = v;
                }
            }else{
                values[item] = null;
            }
        });

        // 构造新的连接
        let url = `/task/category/list?page=${currentPage}`;
        if(this.state.search){
        url = `${url}&search=${this.state.search}`;
        }

        // 过滤字段
        filterColumns.forEach(item => {
            var v = values[item];
            if(v){
                url = `${url}&${item}=${v}`;
            }else{
                
            }
        });

        // 排序
        if(sorter && sorter.columnKey){
            if(sorter.order === "ascend"){
                // 升序排列
                url = `${url}&ordering=${sorter.columnKey}`;
            }else{
                // 降序排列
                url = `${url}&ordering=-${sorter.columnKey}`;
            }
        
        }
    
        // 跳转新的连接
        this.props.history.push(url);
    }

    
    render(){
        // 表格的列
        const columns = [
            {
                title: "ID",
                dataIndex: "id",
                key: "id",
                sorter: (a, b) => a.id - b.id
            },
            {
                title: "分类名",
                dataIndex: "name",
                key: "name",
            },
            {
                title: "代码",
                dataIndex: "code",
                key: "code"
            },
            {
                title: "父级分类",
                dataIndex: "parent",
                key: "parent",
                filters: this.state["parentFilterOptions"] ? this.state.parentFilterOptions : [],
                filterMultiple: false,
            },
            {
                title: "描述",
                dataIndex: "description",
                key: "description",
            },
            {
                title: "操作",
                key: "action",
                render: (text, record) => {
                    // 看用户能否添加
                    if(this.state.userCanAddCategory){
                        return (
                            <span>
                                <Link to={`/task/category/${text.id}`}>
                                    <Button type="link" size="small">
                                        <Icon type="link"> 详情</Icon>
                                    </Button>
                                </Link>

                                <Divider type="vertical" />

                                <Link to={`/task/category/${text.id}/editor`}>
                                    <Button type="link" size="small">
                                        <Icon type="edit"> 编辑</Icon>
                                    </Button>
                                </Link>
                                {/* <Divider type="vertical" /> */}
                            </span>
                        );
                    }else{
                        return (
                            <span>
                               <Link to={`/task/category/${text.id}`}>
                                <Button type="link" size="small">
                                    <Icon type="link"> 详情</Icon>
                                </Button>
                               </Link>
                            </span>
                        );
                    }
                }
            }
        ];

        //  add button ELement
        let addButtonElement;
        if(this.state.userCanAddCategory){
            addButtonElement = (
                <Link to="/task/category/add">
                    <Button
                      style={{width: 100}}
                      type="primary"
                      icon={<Icon type="plus"/>}
                    >Add</Button>
                </Link>
            );
        }
    
        return (
            <div className="content">
                {/* 面包屑开始 */}
                <Breadcrumb className="nav">
                    <Breadcrumb.Item>
                        <Link to="/"><Icon type="home" noMarginRight={true}/>首页</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <Link to="/task">任务</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>分类</Breadcrumb.Item>
                </Breadcrumb>
                {/* 面包屑结束 */}

                {/* 主体内容 */}
                <div className="main">
                    <div className="title">
                        <h4>任务分类</h4>
                    </div>
                    {/* 工具栏开始：搜索、刷新、添加 */}
                    <Row className="tools">
                        <Col span={12}>
                            <Input.Search
                            placeholder="search category"
                            style={{width: 200}}
                            onSearch={this.onSearchHandler}
                            />
                        </Col>
                        <Col span={12} style={{textAlign: "right"}}>
                            <Button
                            type="default"
                            style={{width: 100}}
                            icon={<Icon type="refresh" spin={!this.state.loaded} />}
                            onClick={() => this.fetchData(this.state.currentPage)}
                            >
                                刷新
                            </Button>
                            {addButtonElement}
                        </Col>
                    </Row>
                    {/* 工具栏结束 */}

                    {/* 分类列表 */}
                    <div className="main-list">
                        <Table
                          columns={columns}
                          dataSource={this.state.dataSource}
                          rowKey={"id"}
                          bordered={true}
                        //   size="small"
                          pagination={{current: this.state.currentPage, total: this.state.dataCount}}
                          onChange={this.handleTableChange}
                        />
                    </div>
                    {/* 分类列表结束 */}
                </div>

            </div>
        );
    }
}

export default CategoryList;