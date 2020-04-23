/**
 * 搜索相关的页面
 */
import React, { useState, useContext, useEffect, useCallback, useMemo } from "react";

import { GlobalContext } from "../../Base/Context";
import { Input, Tabs } from "antd";

import { getParamsFromLocationSearch } from "../../Utils/UrlParam";
import BasePaginationData from "../../Page/BasePaginationData";

import { SearchResult } from "./Result";

export const SearchIndex = (props) => {
    // 状态
    const [ loading, setLoading ] = useState(false);
    // 搜索的资源类型
    const [ sourceType, setSourceType ] = useState("article");
    // 搜索到的数据
    const [ dataSource, setDataSource ] = useState([]);

    // 搜索的值
    const [ searchValue, setSearchValue ] = useState("");

    // 导航
    const { setNavData } = useContext(GlobalContext);
    // 设置顶部的导航
    useEffect(() => {
        setNavData([
            {
                title: "首页",
                icon: "home",
                link: "/"
            },
            {
                title: "搜索",
                // icon: "search",
                link: "/tools/search"
            }
        ]);
    }, [setNavData])

    // 从url中获取type
    useEffect(() => {
        let params = getParamsFromLocationSearch(["sourceType", "search"], props.location.search);
        if( !!params) {
            if( !!params["sourceType"] ){
                setSourceType(params["sourceType"]);
            }

            if( !!params["search"] ){
                setSearchValue(params["search"]);
            }else{
                setSearchValue("");
            }
        }
    }, [props.location.search]);

    const handleOnSearch = useCallback((value) => {
        // console.log(value);

        if(!value){
            setDataSource([]);
            setLoading(false);
        }

        let url = `/tools/search?sourceType=${sourceType}&search=${value}`;
        props.history.push(url);
        // setSearchValue(value);

    }, [sourceType, props.history])

    // paramsFields字段：通过url可获取到的字段信息
    const paramsFields = useMemo(() => {
        return [
            "page", "page_size", "search", 
            "ordering", "parent", "is_deleted",
            "tag__keys", "tag__values"
        ];
    }, []);

    // 搜索类型变更
    const sourceTypeOnChange = useCallback((type, search) => {
        if(!type){
            return;
        }
        // 切换资源类型的时候，重新设置数值为空
        setDataSource([]);
        let url = `/tools/search?sourceType=${type}`;
        if(search){
            url = `${url}&search=${search}`
        }
        props.history.push(url);
    }, [props.history])
    
    // 搜索资源类型选择
    const sourceTypeSelect = useMemo(() => {
        return (
            <Tabs defaultActiveKey={sourceType} 
              onChange={value => value !== sourceType && sourceTypeOnChange(value, searchValue)}>
                <Tabs.TabPane tab="文章" key="article">
                </Tabs.TabPane>

                <Tabs.TabPane tab="图片" key="image">
                </Tabs.TabPane>
            </Tabs>
        );
    }, [searchValue, sourceType, sourceTypeOnChange])

    return (
        <div className="base-layout">
            <div className={searchValue ? "search results" : "search"}>
                <div className="form">
                    <div className="logo">
                        <img src="http://127.0.0.1:9000/static/image/kanban-blue.svg" alt="logo" />
                    </div>
                    <div className="input">
                        <Input.Search
                           placeholder={searchValue ? searchValue : ""}
                            loading={loading}
                            onSearch={handleOnSearch}
                            enterButton="搜索一下" 
                        />  
                    </div>
                </div>
            </div>
            
            {/* 搜索结果 */}
            {
                searchValue && (
                    <div className="main">
                        {/* 修改资源类型 */}
                        {sourceTypeSelect}

                        <SearchResult 
                            dataSource={dataSource} 
                            type={sourceType}/>
                    </div>
                )
            }
            

                {/* 分页数据 */}
                {
                    searchValue && (
                        <div className="footer">
                        <BasePaginationData
                            showTools={false}
                            paramsFields={paramsFields}
                            location={props.location}
                            history={props.history}
                            apiUrlPrefix={`/api/v1/docs/${sourceType}/list?search=${searchValue}`}
                            pageUrlPrefix={`/tools/search?sourceType=${sourceType}`}
                            setDataSource={setDataSource}
                            pageSize={20}
                        />
                    </div>
                    )
                }
        </div>
    )
}

export default SearchIndex;
