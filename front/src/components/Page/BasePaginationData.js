/**
 * 基础数据列表
 * 通过传递简单的参数：就可以获取相应的数据
 */
import React, { useState, useCallback, useEffect, useMemo} from "react";
import { 
    Row, Col,
    Input, Button,
    Pagination,
    message
} from "antd";

import Icon from "../Base/Icon";
import fetchApi from "../Utils/fetchApi";
import { getParamsFromLocationSearch } from "../Utils/UrlParam";

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
    // 列表数据、分页信息, url中的params,是否在加载数据
    const [urlParams, setUrlParams] = useState({});

    const [ count, setCount ] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    // const [ dataSource, setDataSource] = useState([]);
    // other是其它的一些状态，如果重要的就单独提取出来
    const [other, setOtherState] = useState({});
    // 表格列

    // params字段:通过url可获取到的字段信息
    // const paramsFields = useMemo(() => {
    //     return ["page", "search", "ordering", "parent", "level", "is_deleted"];
    // }, []);

    const paramsFields = useMemo(() => {
        return props.paramsFields ? props.paramsFields : [];
    }, [props.paramsFields])

    useEffect(() => {
        if(props.pageSize && props.pageSize > 0){
            setPageSize(props.pageSize);
        }
    }, [props.pageSize])

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
        url = `${url}&page_size=${pageSize}`;
        
        // 对params中的字段做处理：记得去掉page
        // 引入如果调用状态中的urlParams，获取到的可能不是最新值，所以这里从url中解析值
        let locationSearch = props.location.search;
        // console.log(locationSearch);
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
                //   setDataSource(data);
                  setCount(responseData.count);
                  props.setDataSource(data);
                  //   设置当前页
                  setPage(page);

              }else{
                  message.warn("获取分类文章列表出错")
                  message.warn(JSON.stringify(responseData));
                  props.setDataSource([]);
              }
          })
            .catch(err => {
                console.log(err);
                props.setDataSource([]);
            })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [apiUrlPrefix, pageUrlPrefix, paramsFields, props.setDataSource, pageSize, props.location.search])

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
    const handleTableChange = useCallback((page, pageSizeValue) => {
        if(!pageUrlPrefix){
            return
        }
        // console.log(page, pageSizeValue);

        // 获取当前的页
        let currentPage = page;

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

        // 跳转新的连接
        props.history.push(url);
        
    }, [pageUrlPrefix, props.history, urlParams.search])

    // 当尺寸变化的时候
    const onShowSizeChange = useCallback((current, size) => {
        // console.log(current, size);
        setPageSize(size);
        // fetchData(current);
    }, [])

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

    const toolsElement = useMemo(() => {
        if(props.showTools){
            return (
                <Row className="tools">
                    <Col sm={{span:12}} xs={{span: 24}}>
                        <Input.Search 
                        placeholder={ urlParams.search ? urlParams.search : "search" } 
                        style={{width: 200}}
                        onSearch={onSearchHandler}
                        allowClear
                        enterButton/>
                    </Col>
                    <Col sm={{span:12}} xs={{span: 24}} style={{textAlign: "right"}}>
                        {rightButtons}
                        {/* {page} */}
                    </Col>
                </Row>
            )
        }else{
            return null;
        }
    }, [onSearchHandler, props.showTools, rightButtons, urlParams.search])

    return (
        <div className="pagination">
            {toolsElement}
            
            {/* 渲染的数据 */}
            {props.children}

            <Pagination 
              current={page} 
              total={count} 
              onChange={handleTableChange}
              showSizeChanger
              showQuickJumper
              showTotal={total => `总共有 ${total} 条数据!`} // 导航左侧显示总共有多少条数据的信息
              pageSize={pageSize}
              onShowSizeChange={onShowSizeChange}
              hideOnSinglePage={props.hideOnSinglePage} // 当只有一页的时候是否隐藏
            />
            {/* <br/>
            {apiUrlPrefix}
            <br/>
            {pageUrlPrefix} */}
        </div>
    );
}

export default BaseTable;