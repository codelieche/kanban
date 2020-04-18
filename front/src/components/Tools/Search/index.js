/**
 * 搜索相关的页面
 */
import React, { useState, useContext, useEffect, useCallback, useMemo } from "react";

import { GlobalContext } from "../../Base/Context";
import { Input } from "antd";

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
                icon: "search",
                link: "/tools/search"
            }
        ]);
    }, [setNavData])

    // 从url中获取type
    useEffect(() => {
        let params = getParamsFromLocationSearch(["sourceType"], props.location.search);
        if(!!params && !!params["sourceType"]){
            setSourceType(params["sourceType"]);
        }
    }, [props.location.search]);

    const handleOnSearch = useCallback((value) => {
        console.log(value);
        if(!value){
            setDataSource([]);
            setLoading(false);
        }

        setSearchValue(value);


    }, [])

    // paramsFields字段：通过url可获取到的字段信息
    const paramsFields = useMemo(() => {
        return ["page", "page_size", "search", "ordering", "parent", "is_deleted"];
    }, []);
    

    return (
        <div className="content">
            <div className="main">
                <div className="search">
                    <div className="form">
                        <div className="logo">
                            <img src="http://127.0.0.1:9000/static/image/logo-kanban.svg" alt="logo" />
                        </div>
                        <div className="input">
                            <Input.Search
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
                    <SearchResult 
                        dataSource={dataSource} 
                        type={sourceType}/>
                    )
                }
                

                  {/* 分页数据 */}
                  {
                      searchValue && (
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
                      )
                  }
                 
            </div>
        </div>
    )
}

export default SearchIndex;
