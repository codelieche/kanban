/**
 * 基础数据列表
 */
import React, { useState, useCallback, useEffect, useMemo} from "react";
import { 
    Row, Col,
    Input, Button,
    Table,
    message
} from "antd";

import Icon from "../Base/Icon";
import fetchApi from "../Utils/fetchApi";
import { getParamsFromLocationSearch } from "../Utils/UrlParam";
import ResizeableTitle from "./Resizeable";

/**
 * 数据的表格
 * @param {*} props 
 * 需要传递的属性
 * 1. columns：Table展示的列
 * 2. apiUrlPrefix: 获取数据的接口，eg：/api/v1/docs/article/list
 * 3. pageUrlPrefix: 前端页面，eg：/docs/article/list
 */
export const BaseTable = (props) => {
    // 状态
    const [apiUrlPrefix, setApiUrlPrefix] = useState(null);
    // 跳转页面的前缀
    const [pageUrlPrefix, setPageUrlPrefix] = useState(null);

    const [ page, setPage ] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    // 列表数据、分页信息, url中的params,是否在加载数据
    const [urlParams, setUrlParams] = useState({});

    const [ count, setCount ] = useState(0);
    const [ dataSource, setDataSource] = useState([]);
    // other是其它的一些状态，如果重要的就单独提取出来
    const [other, setOtherState] = useState({});
    // 表格列
    const [columnsArray, setColumnsArray] = useState([])

    // 从上级获取columns数组
    useEffect(() => {
        if(columnsArray.length === 0 && props.columns){
            setColumnsArray(props.columns);
        }else{
            // console.log("columns变更了")
            setColumnsArray(props.columns);
        }

    }, [columnsArray.length, props.columns])

    // params字段:通过url可获取到的字段信息
    // const paramsFields = useMemo(() => {
    //     return ["page", "search", "ordering", "parent", "level", "is_deleted"];
    // }, []);
    const paramsFields = useMemo(() => {
        return props.paramsFields ? props.paramsFields : [];
    }, [props.paramsFields])

    // 获取分类文章列表
    const fetchData = useCallback((page) => {
        // console.log(page, isNaN(page), !page);
        if(!props.apiUrlPrefix){
            return
        }
        if(props.apiUrlPrefix !== apiUrlPrefix || pageUrlPrefix !== props.pageUrlPrefix){
            return
        }

        // 对page进行校验
        if(isNaN(page) || !page){
            page = 1;
        }else{
            // 把page转换成数值类型
            page = parseInt(page, 10);
            // console.log(page);
        }

        // 构造url
        let url
        if(props.apiUrlPrefix.indexOf("?") > 0){
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
        // console.log(url);
        // 发起请求
        fetchApi.Get(url, {}, {})
          .then(responseData => {
              let data = responseData.results;
              if(Array.isArray(data)){
                  setDataSource(data);
                  setCount(responseData.count);
                  //   设置当前页
                  setPage(page);
              }else if(Array.isArray(responseData)){
                  setDataSource(responseData);
                  setCount(responseData.length);
                  setPageSize(responseData.length);
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
    }, [apiUrlPrefix, pageUrlPrefix, paramsFields, props.apiUrlPrefix, props.location.search, props.pageUrlPrefix])

    // 修改分类
    useEffect(() => {
        // console.log(props.apiUrlPrefix);
        if(props.apiUrlPrefix !== apiUrlPrefix && props.apiUrlPrefix){
            setApiUrlPrefix(props.apiUrlPrefix);
            // if(!!apiUrlPrefix){
            //     // console.log("刷新数据")
            //     fetchData()
            // }
        }
    }, [apiUrlPrefix, props.apiUrlPrefix])

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
            setUrlParams(params);

            setOtherState(prevState => {
                prevState["locationSearch"] = locationSearch;
                return prevState;
            });

            // 更新数据：如果立刻执行fetchData，由于urlParams更新是异步的，这个时候获取数据可能不是最新的
            // 导致获取到的数据，实际不匹配
            // 所以在fetchDate中不调用urlParams，而让fetchData直接从props.location.search中解析值
            if(!!apiUrlPrefix && apiUrlPrefix === props.apiUrlPrefix){
                // console.log(params.page);
                // fetchData(params.page);
            }else{
                // console.log("未传递apiUrlPrefix")
            }
        }else{
            // console.log(urlParams);
            if(apiUrlPrefix === props.apiUrlPrefix && props.pageUrlPrefix === pageUrlPrefix){
                // console.log(urlParams);
                fetchData(urlParams.page)
            }else{
                // console.log(urlParams, "不要发起fetch")
            }
        }
    
    }, [paramsFields, props.location, urlParams, other, fetchData, 
        apiUrlPrefix, props.apiUrlPrefix, props.pageUrlPrefix, pageUrlPrefix])

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
        // var filterColumns = ["is_deleted", "parent"];
        var filterColumns = props.filterColumns ? props.filterColumns : [];
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
            url = `${url}&search=${urlParams.search}`;
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

        // 从urlParams中获取数据: 如果不从这里获取，则会丢失掉这些
        paramsFields.forEach(item => {
            let value = urlParams[item];
            // console.log(item, value);
            if(value !== undefined && value !== null && ["page", "ordering"].indexOf(item) < 0 && filterColumns.indexOf(item) < 0){
                url = `${url}&${item}=${value}`;
            }
        });

        // console.log(url);
        // 跳转新的连接
        props.history.push(url);
        
    }, [pageUrlPrefix, paramsFields, props.filterColumns, props.history, urlParams])

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

    // 右侧的按钮
    let rightButtons = useMemo(() => {
        if(props.rightButtons){
            return props.rightButtons;
        }else{
            return (
                <Button
                    type="default"
                    style={{width: 100}}
                    icon={<Icon type="refresh"/>}
                    onClick={() => fetchData(page)}
                    >
                        刷新
                </Button>
            );
        }
    }, [fetchData, page, props.rightButtons]);

    // 监控刷新数据
    const reFreshData = useCallback(() => {
        fetchData(page);
    }, [fetchData, page])

    useEffect(() => {
        // 刷新数据
        // console.log(props.reFreshTimes);
        if(props.reFreshTimes && props.reFreshTimes > 0){
            reFreshData()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.reFreshTimes])

    // console.log({total: count, current: page}, pageSize)

    // 显示展开
    const expandable = useMemo(() => {
        if(props.expandable) {
            return props.expandable;
        }else{
            return {
                // expandedRowRender: (record, index) => {
                //     if(record.children && record.children.length > 0){
                //         return <span>有{record.children.length}条子元素</span>;
                //     }else{
                //         return null;
                //     }
                // },
                expandIcon: ({expanded, onExpand, record}) => {
                    // console.log(props);
                    if(record && record.children && record.children.length > 0){
                        if(expanded){
                            return (
                            <span onClick={e => {onExpand(record, e)}}>
                                <span className="ant-table-row-expand-icon ant-table-row-expand-icon-expanded">
                                </span>
                            </span>
                            )
                        }else{
                            return (
                                <span onClick={e => {onExpand(record, e)}}>
                                    {/* <Icon type="plus" /> */}
                                    <span className="ant-table-row-expand-icon ant-table-row-expand-icon-collapsed">

                                    </span>
                                </span>
                            );
                        }
                    }else{
                        return " "
                    }
                },
                rowExpandable: (record, index) => {
                    return record.children && record.children.length > 0
                },
            }
        }
    }, [props]);

    return (
        <div className="base-table">
            <Row className="tools">
                <Col sm={{span:12}} xs={{span: 24}}>
                    <Input.Search 
                      placeholder={ urlParams.search ? urlParams.search : "search" } 
                      style={{width: 200}}
                      onSearch={onSearchHandler}
                      enterButton/>
                </Col>
                <Col sm={{span:12}} xs={{span: 24}} style={{textAlign: "right"}}>
                    {rightButtons}
                    {/* {page} */}
                </Col>
            </Row>
            <Table rowKey="id"
              components={tableComponents}
              bordered
              columns={columns}
              dataSource={dataSource}
              pagination={{total: count, current: page, pageSize: pageSize}}
              onChange={handleTableChange}
              expandable={expandable}
            />

            {/* <br/>
            {apiUrlPrefix}
            <br/>
            {pageUrlPrefix} */}
        </div>
    );
}

export default BaseTable;