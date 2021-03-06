/**
 * 分组列表页
 */
import React, {useState, useEffect, useMemo, useCallback, useContext} from "react"
import { Link } from "react-router-dom";
import {
    Input, Row, Col, 
    Button, Table, Tag, 
    Popconfirm,
    Divider, message
} from "antd";

// 基础组件
import { GlobalContext } from "../../Base/Context";
import Icon from "../../Base/Icon";

// Utils相关
import { getParamsFromLocationSearch } from "../../Utils/UrlParam";
import fetchApi from "../../Utils/fetchApi";
import { checkUserPermission } from "../../Utils/auth";
// 生成表单过滤选项的函数
import { generateTableFilterOptionsHook } from "../../Utils/table";

const deleteOnCancel = e => {
    // 选择取消的话，也弹出消息
    message.error("取消删除", 3);
}

// 父分组的颜色
const parantColors = ["#108ee9", "blue", "geekblue", "green", "gold"];

function GroupList(props){

    // params字段:通过url可获取到的字段信息
    const paramsFields = useMemo(() => {
        return ["page", "search", "ordering", "parent", "level", "is_deleted"];
    }, []);
    // 获取context
    const { setNavData } = useContext(GlobalContext);

    // 状态值：
    // 列表数据、分页信息, url中的params,是否在加载数据
    const [urlParams, urlParamsState] = useState({})
    const [dataSource, setDataSource] = useState([]);
    const [paginationData, paginationDataState] = useState({current: 1, total: 0});
    const [loading, loadingState] = useState(false);
    const [parentFilterOptions, parentFilterOptionsState] = useState([]);
    // other是其它的一些状态，如果重要的就单独提取出来
    const [other, otherState] = useState({});

    // 获取数据函数
    const fetchData = useCallback(page => {
        // console.log("fetch Data");
        // 因为有一个刷新按钮，防止连续点击
        // 当fetch完数据后设置loading状态为false
        if(loading){
            // 正在加载数据，如果dataSource不是空，直接返回
            // 这个时候是因为点了刷新数据，但是上次刷新的请求正在进行中，有数据就直接返回吧
            if(dataSource.length > 0){
                return;
            }
        }else{
            // 设置正在执行loading操作
            loadingState(true);
        }

        // 对page进行校验
        if(isNaN(page) || ! page){
            page = 1;
        }else{
            // 把page转换成数值类型
            page = parseInt(page, 10);
        }

        // 构造url
        let url = `/api/v1/docs/group/list?page=${page}`;
        // 对params中的字段做处理：记得去掉page
        // 引入如果调用状态中的urlParams，获取到的可能不是最新值，所以这里从url中解析值
        let locationSearch = props.location.search;
        let urlParams = getParamsFromLocationSearch(paramsFields, locationSearch)
        paramsFields.forEach(item => {
            let value = urlParams[item];
            // console.log(item, value);
            if(value !== undefined && value !== null && item !== "page"){
                url = `${url}&${item}=${value}`;
            }
        });

        // console.log(url);
        // console.log(urlParams);

        // 发起ajax请求
        fetchApi.Get(url)
        .then(responseData => {
            // 返回的json数据是数组才去修改列表相关的数据
            let data = responseData.results;
            if(data instanceof Array){
                // 更新状态
                setDataSource(data);

                loadingState(false);

                // 更新pagination对象
                paginationDataState({
                    current: page,
                    total: responseData.count,
                });
            }else{
                loadingState(false);
                message.error(JSON.stringify(responseData), 5);
            }
          })
            .catch(err => {
                console.log(err);
                loadingState(false);
            });
    },[dataSource.length, loading, paramsFields, props.location.search]);

    // 处理urlParams
    // 第2个参数，如果设置了urlParams就特别小心了，别搞个不断的更新urlParams
    // 所以：加了个other.locationSearch来保存props传递过来的url信息
    useEffect(() => {
        // console.log("处理 url params:", other);
        // 处理url中传递的数据
        let locationSearch = props.location.search;
        // 通过url可以传递的参数：paramsFields
        
        // 判断是否需要更新：通过params !== urlParams对比，肯定是每次都不等的
        if(locationSearch !== other.locationSearch){
            // console.log("更新 urlParams", other, locationSearch);
            let params = getParamsFromLocationSearch(paramsFields, locationSearch);
            // console.log(params);
            // 更新urlParams：
            urlParamsState(params);

            otherState(prevState => {
                prevState["locationSearch"] = locationSearch;
                return prevState;
            });
            // 更新数据：如果立刻执行fetchData，由于urlParams更新是异步的，这个时候获取数据可能不是最新的
            // 导致获取到的数据，实际不匹配
            // 所以在fetchDate中不调用urlParams，而让fetchData直接从props.location.search中解析值
            fetchData(params.page);
        }
    
    }, [paramsFields, props.location, urlParams, other, fetchData])

    // 判断是否需要判断一下权限
    useEffect(() => {
        // console.log("判断权限")
        if(other.userCanAddGroup === undefined){
            checkUserPermission("docs.add_group", (result) => otherState(prevState => {prevState["userCanAddGroup"] = result; return prevState}));
        }
    }, [other.userCanAddGroup]);

    // 获取parant过滤选项
    useEffect(() => {
        // 生成列表filter parent options
        if(!other.parentFilterOptionsLock){
            // console.log("执行 generateTableFilterOptionsHook");
            generateTableFilterOptionsHook(
                "/api/v1/docs/group/all?level=1", "name", "id", parentFilterOptionsState, null,
            );
            otherState(prevState => {
                prevState.parentFilterOptionsLock = true;
                return prevState;
            });
        }
    }, [other.parentFilterOptionsLock])

    // 顶部导航面包屑的数据
    // 设置导航
    useEffect(() => {
        const navData = [
            {
                title: "首页",
                icon: "home",
                link: "/"
            },
            {
                title: "文档分组",
                link: "/docs/group"
            },
            {
                title: "列表"
            }
        ]
        setNavData(navData);
    }, [setNavData])

    // 删除分组函数
    const deleteOnConfirm = useCallback((value) => {
        // 开始删除
        const url = `/api/v1/docs/group/${value.id}`;
        // 通过delete删除用户
        fetchApi.Delete(url)
          .then(response => {
            //   查看status状态码
            if (response.status === 204) {
              message.success(`删除分组(ID:${value.id}-${value.name}-${value.code})成功`, 3);
              // 刷新数据
              fetchData(paginationData.current);
            } else if (response.status === 200) {
              return response.json();
            } else {
              message.success(`删除分组(ID:${value.id}-${value.name}-${value.code})失败！`, 3);
              return response.json();
            }
          })
          .then(data => {
            if (data) {
              if (data.message) {
                message.warn(data.message, 8);
              } else {
                message.error(JSON.stringify(data), 3);
              }
            }
          })
          .catch(err => {
            console.log(err);
          });
    }, [fetchData, paginationData]);

    // 搜索处理函数
    const onSearchHandler = useCallback((value) => {
        // 搜索框回车后处理函数
        // console.log(value);
        // let noSearch = true;

        let url;
        if(value){
            // noSearch = false;
            url = `/docs/group/list?page=1&search=${value}`;
        }else{
            url = `/docs/group/list?page=1`;
        }
        // console.log(noSearch, value)
        
        // 处理params
        paramsFields.forEach(item => {
            // item不是search、或者 (是search 但是有值的情况)就设置url
            // if(item !== "search" || noSearch){
            if(item !== "search"){
                if(item !== "page"){
                    let value = urlParams[item];
                    // console.log(item, value);
                    if(value !== undefined && value !== null){
                        url = `${url}&${item}=${value}`;
                    };
                }
            }
        });
        // console.log(url);
        props.history.push(url);
    }, [paramsFields, props.history, urlParams])

    // 列表的columns
    const columns = useMemo(() => {
        return [
            {
                title: "ID",
                dataIndex: "id",
                key: "id",
                width: 75,
                sorter: (a, b) => {},
                render:(text, record) => {
                    return (
                        <Link to={`/docs/group/${record.id}`}>{text}</Link>
                    );
                }
            },
            {
                title: "分组名",
                dataIndex: "name",
                key: "name",
                width: 120,
                ellipsis: true
            },
            
            {
                title: "代码",
                dataIndex: "code",
                key: "code",
                width: 120,
                ellipsis: true
            },
            {
                title: "父级分组",
                dataIndex: "parent",
                key: "parent",
                filters: parentFilterOptions ? parentFilterOptions : [],
                filterMultiple: false,
                width: 115,
                ellipsis: true,
                render: (value, record) => {
                    return (
                        <Tag color={ record.level <= parantColors.length ? parantColors[record.level -1] : "" }>
                            {record.level > 1 ? value.name : "一级分组"}
                        </Tag>
                    );
                }
            },
            {
                title: "所有者",
                dataIndex: "owner",
                key: "owner",
                width: 100,
                ellipsis: true,
                sorter: () => {},
            },
            {
                title: "描述",
                dataIndex: "description",
                key: "description",
                width: 200,
                ellipsis: true, // 单元格自动省略
            },
            {
                title: "状态",
                dataIndex: "is_deleted",
                key: "is_deleted",
                width: 80,
                render: value => {
                  if (!value) {
                    return (
                      <div className="status">
                        <Icon type="check" />
                      </div>
                    );
                  } else {
                    return (
                      <span className="status">
                        <Icon type="close" />
                      </span>
                    );
                  }
                },
                filters: [
                    { text: "有效", value: "false" },
                    { text: "禁用", value: "true" }
                  ],
                  filterMultiple: false,
                  onFilter: (value, record) => record.is_deleted.toString() === value
            },
            {
                title: "操作",
                key: "action",
                // width: 300,
                ellipsis: true,
                render: (text, record) => {
                    // 看用户能否添加
                    if(other.userCanAddGroup){
                        return (
                            <span>
                                <Link to={`/docs/group/${text.id}`}>
                                    <Button type="link" size="small">
                                        <Icon type="link"> 详情</Icon>
                                    </Button>
                                </Link>

                                <Divider type="vertical" />

                                <Link to={`/docs/group/${text.id}/editor`}>
                                    <Button type="link" size="small">
                                        <Icon type="edit"> 编辑</Icon>
                                    </Button>
                                </Link>

                                <Divider type="vertical" />
                                <Popconfirm
                                    // disabled={text.is_deleted}
                                    title={`是否删除分组(ID:${text.id}-${text.name}-${text.code})`}
                                    onCancel={deleteOnCancel}
                                    onConfirm={() =>deleteOnConfirm(text)}
                                    >
                                    <span type="link">
                                        <Button type="link" size="small" danger disabled={text.is_deleted}>
                                        <Icon type="trash-o"> 删除</Icon>
                                        </Button>
                                    </span>
                                </Popconfirm>
                            </span>
                        );
                    }else{
                        return (
                            <span>
                               <Link to={`/docs/group/${text.id}`}>
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
    }, [deleteOnConfirm, other.userCanAddGroup, parentFilterOptions]);

    // 显示展开
    const expandable = useMemo(() => {
        return { 
            expandedRowRender: (record, index, indent, expanded) => {
                // console.log(record, index, indent, expanded)
                // console.log(dataSource)
                // return null;
                if(record.children.length > 0){
                    return (
                        <Table 
                            // showHeader={false}
                            bordered={false}
                            dataSource={record.children} 
                            rowKey={"id"}
                            //   columns={columns.slice(0, 6)} 
                            size="small"
                            columns={columns} 
                            pagination={false}
                            expandable={expandable} 
                        />
                    );
                }else{
                    return null;
                }
            },
            rowExpandable: record => record.children.length > 0,
            // 当点击展开的时候，会把childrenColumnName的数据追加到上级表格中。
            childrenColumnName: "__children",
            // indentSize: 0,
            // defaultExpandAllRows: true
        }
    }, [columns]);

    // 处理Table变更事件：点击了过滤、排序、页面等操作的时候触发
    const handleTableChange = useCallback((pagination, filters, sorter) => {
        // console.log(pagination, filters, sorter);
        // 获取当前的页
        let currentPage = pagination.current;

        // 过滤字段
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
        let url = `/docs/group/list?page=${currentPage}`;
        if(urlParams.search){
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
        // console.log(url);

        // 跳转新的连接
        props.history.push(url);
    }, [props.history, urlParams.search]);

    //  add button ELement
    const addButtonElement = useMemo(() => {
        if(other.userCanAddGroup){
            return (
                <Link to="/docs/group/add">
                    <Button
                      style={{width: 100}}
                      type="primary"
                      icon={<Icon type="plus"/>}
                    >Add</Button>
                </Link>
            );
        }else{
            return null;
        }
    }, [other.userCanAddGroup])
    

    // 显示顶级按钮组件
    let showLeveOneButton = useMemo(() => {
        return (
            <Button
              style={{width: 100}}
              onClick={() => {
                  let url;
                // 注意网页刷新后，level从location.search中获取到的值是字符型的1   
                if(urlParams.level !== 1 && urlParams.level !== "1"){
                    // urlParamsState(prevState => {
                    //     prevState.level = 1; 
                    //     urlParamsState(prevState);
                    //     return prevState
                    // });
                    url = "/docs/group/list?level=1";
                }else{
                    // urlParamsState(prevState => {
                    //     prevState.level = null; 
                    //     prevState.search = null; 
                    //     return prevState
                    // });
                    url = "/docs/group/list";
                }
                // onSearchHandler();
                props.history.push(url);
                }}
              type="primary"
              icon={<Icon type="filter"/>}
            >
                { urlParams.level !== 1 && urlParams.level !== "1" ? "一级分组" : "全部分组" } 
            </Button>
        );
    }, [props.history, urlParams.level]);

    // console.log(dataSource);
   
    return (
        <div className="content">
            {/* 面包屑开始 */}
            {/* <NavBreadcrumb data={navsData}  /> */}
            {/* 面包屑结束 */}
            
            {/* 主体内容开始 */}
            <div className="main">
                <div className="title">
                    <h4>文档分组</h4>
                </div>

                {/* 工具栏开始：搜索、属性、添加 */}
                <Row className="tools">
                    <Col span={12}>
                        <Input.Search
                          placeholder="search group"
                          style={{width: 200}}
                          onSearch={onSearchHandler}
                        >
                        
                        </Input.Search>
                    </Col>
                    <Col span={12} style={{textAlign: "right"}}>
                        <Button
                          type="default"
                          style={{width: 100}}
                          icon={<Icon type="refresh"/>}
                          onClick={() => fetchData(paginationData.current)}
                          >
                              刷新
                          </Button>
                          {/* 显示一级分组按钮和添加按钮 */}
                          {showLeveOneButton}
                          {addButtonElement}
                    </Col>
                </Row>
                {/* 工具栏结束 */}

                {/* 分组列表 */}
                <div className="main-list">
                    <Table
                       columns={columns}
                       dataSource={dataSource}
                       rowKey="id"
                       pagination={paginationData}
                       onChange={handleTableChange}
                       // 展开子表格: antd默认会追加children的数据到dataSource中
                       // 可通过修改childrenColumnName的名字来屏蔽这个功能
                       expandable={expandable}
                    />

                </div>
                {/* 分组列表结束 */}
            </div>
            {/* 主体内容结束 */}
        </div>
    );
}

export default GroupList;