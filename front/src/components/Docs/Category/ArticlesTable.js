/**
 * 分类文章列表
 */
import React, { useState, useCallback, useEffect, useMemo} from "react";
import { Link } from "react-router-dom";
import { 
    Row, Col,
    Input, Button,
    Table,
    message
} from "antd";

import Icon from "../../Base/Icon";
import fetchApi from "../../Utils/fetchApi";
import { getParamsFromLocationSearch } from "../../Utils/UrlParam";
import ResizeableTitle from "./Resizeable";

/**
 * 分类文章的表格
 * @param {*} props 
 */
export const CategoryArticlesTable = (props) => {
    // 状态
    const [apiUrlPrefix, setApiUrlPrefix] = useState(null);
    // 跳转页面的前缀
    const [pageUrlPrefix, setPageUrlPrefix] = useState(null);

    const [ page, setPage ] = useState(1);
    // 列表数据、分页信息, url中的params,是否在加载数据
    const [urlParams, urlParamsState] = useState({});

    const [ count, setCount ] = useState(0);
    const [ dataSource, setDataSource] = useState([]);
    // other是其它的一些状态，如果重要的就单独提取出来
    const [other, otherState] = useState({});
    // 表格列
    const [columnsArray, setColumnsArray] = useState([
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
    ])

    // params字段:通过url可获取到的字段信息
    const paramsFields = useMemo(() => {
        return ["page", "search", "ordering", "parent", "level", "is_deleted"];
    }, []);

    // 获取分类文章列表
    const fetchData = useCallback((page) => {
        // console.log(page);
        if(!props.apiUrlPrefix){
            return
        }

        // 对page进行校验
        if(isNaN(page) || ! page){
            page = 1;
        }else{
            // 把page转换成数值类型
            page = parseInt(page, 10);
        }

        // 构造url
        let url
        if(props.apiUrlPrefix.indexOf > 0){
            url = `${props.apiUrlPrefix}&page=${page}`;
        }else{
            url = `${props.apiUrlPrefix}?page=${page}`;
        }
        
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
        // 发起请求
        fetchApi.Get(url, {}, {})
          .then(responseData => {
              let data = responseData.results;
              if(Array.isArray(data)){
                  setDataSource(data);
                  setCount(responseData.count);
                  //   设置当前页
                  setPage(page);

              }else{
                  message.warn("获取分类文章列表出错")
                  message.warn(JSON.stringify(responseData));
              }
          })
            .catch(err => {
                console.log(err);
            })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.apiUrlPrefix, props.location.search])

    // 修改分类
    useEffect(() => {
        if(props.apiUrlPrefix !== apiUrlPrefix && props.apiUrlPrefix){
            setApiUrlPrefix(props.apiUrlPrefix);
            fetchData(urlParams.page)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchData, props.apiUrlPrefix])

    useEffect(() => {
        if(props.pageUrlPrefix && props.pageUrlPrefix !== pageUrlPrefix){
            setPageUrlPrefix(props.pageUrlPrefix);
        }
    }, [pageUrlPrefix, props.pageUrlPrefix])

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
            if(!!apiUrlPrefix){
                fetchData(params.page);
            }
        }
    
    }, [paramsFields, props.location, urlParams, other, fetchData, apiUrlPrefix])

    // 搜索处理函数
    const onSearchHandler = useCallback((value) => {
        // 搜索框回车后处理函数
        // console.log(value);
        // let noSearch = true;

        let url;
        if(props.pageUrlPrefix.indexOf("?") > 0){
            url = `${props.pageUrlPrefix}&page=1`;
        }else{
            url = `${props.pageUrlPrefix}?page=1`;
        }

        if(value){
            // noSearch = false;
            url = `${url}&search=${value}`;
        }
        // console.log(noSearch, value)
        
        // 处理params
        paramsFields.forEach(item => {
            // item不是search、或者 (是search 但是有值的情况)就设置url
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
    }, [props.pageUrlPrefix, paramsFields, props.history, urlParams])

    // 处理Table变更事件：点击了过滤、排序、页面等操作的时候触发
    const handleTableChange = useCallback((pagination, filters, sorter) => {
        if(!pageUrlPrefix){
            return
        }
        
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

        // 构造新的链接
        let url;
        if(pageUrlPrefix.indexOf("?") > 0){
            url = `${pageUrlPrefix}&page=${currentPage}`;
        }else{
            url = `${pageUrlPrefix}?page=${currentPage}`;
        }
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
        
    }, [pageUrlPrefix, props.history, urlParams.search])

    // 处理变更尺寸
    const handleResize = useCallback(index => (e, { size }) => {
        setColumnsArray(prevState => {
          const nextColumns = [...prevState];
          nextColumns[index] = {
            ...nextColumns[index],
            width: size.width,
          };
          return nextColumns;
        });
      }, []);

    const columns = useMemo(() => {
        // 处理变更尺寸
        return columnsArray.map((col, index) => ({
            ...col,
            onHeaderCell: column => ({
                width: column.width,
                onResize: handleResize(index),
            })
        }))
    }, [columnsArray, handleResize])

    const tableComponents = useMemo(() => {
        return {
            header: {
                cell: ResizeableTitle,
            }
        }
    }, []);

    return (
        <div className="articles-table">
            <Row className="tools">
                <Col sm={{span:12}} xs={{span: 24}}>
                    <Input.Search 
                      placeholder={ urlParams.search ? urlParams.search : "搜索文章" } 
                      style={{width: 200}}
                      onSearch={onSearchHandler}
                      enterButton/>
                </Col>
                <Col sm={{span:12}} xs={{span: 24}} style={{textAlign: "right"}}>
                    {/* <Input.Search 
                      placeholder="搜索文章" 
                      style={{width: 200}}
                      onSearch={onSearchHandler}
                      enterButton/> */}

                        <Button
                          type="default"
                          style={{width: 100}}
                          icon={<Icon type="refresh"/>}
                          onClick={() => fetchData(page)}
                          >
                              刷新
                          </Button>

                </Col>
            </Row>
            <Table rowKey="id"
              components={tableComponents}
              bordered
              columns={columns}
              dataSource={dataSource}
              pagination={{total: count, current: page}}
              onChange={handleTableChange}
            />
        </div>
    );
}

export default CategoryArticlesTable;