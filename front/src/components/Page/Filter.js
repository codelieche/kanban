/**
 * 标签按钮
 */
import React, { useState, useCallback, useEffect, useMemo} from "react";
import PropTypes from "prop-types";
import {
    Button,
    Tag,
    Dropdown,
    Select,
    message
} from "antd";

import Icon from "../Base/Icon";
import fetchApi from "../Utils/fetchApi";
import { getParamsFromLocationSearch } from "../Utils/UrlParam";

const fetchTagValuesData = (tagKey, callback) => {
    if(!tagKey){
        return;
    }

    let url = `/api/v1/tags/key/${tagKey}/values`;
    fetchApi.Get(url, {}, {})
      .then(responseData => {
          if(Array.isArray(responseData)){
            callback(responseData);
          }else{
              message.warn(JSON.stringify(responseData));
          }
      })
        .catch(err => {
            console.log(err);
        })
}

// 标签过滤组件
export const TagsFilter = ({activeTagKey, activeTagValue, type, handleSelected, handleFilterClear}) => {
    // 标签的keys
    const [tagKeys, setTagKeys] = useState([]);
    // const [tagValues, setTagValues] = useState([]);

    // 获取所有的标签: 后续标签实在太多，就可设置为只取热门的
    const fetchTagsData = useCallback(() => {
        let url = "/api/v1/tags/key/all";
        fetchApi.Get(url, {}, {})
          .then(responseData => {
              if(Array.isArray(responseData)){
                  setTagKeys(responseData);
              }else{
                  message.warn(JSON.stringify(responseData));
              }
          })
            .catch(err => {
                console.log(err);
            })
    }, [])

    useEffect(() => {
        fetchTagsData();
    }, [fetchTagsData])

    if(type === "select"){
        return (
            <TagsSelect 
              tags={tagKeys} 
              activeTagKey={activeTagKey}
              handleSelected={handleSelected}
              handleFilterClear={handleFilterClear}
            />
        )
    }

    return (
        <TagsList tags={tagKeys} 
          activeTagKey={activeTagKey} 
          activeTagValue={activeTagValue}
          handleSelected={handleSelected}
          handleFilterClear={handleFilterClear}
       />
    )
}

TagsFilter.propTypes = {
    activeTagKey: PropTypes.string,
    activeTagValue: PropTypes.string,
    type: PropTypes.string,
    handleSelected: PropTypes.func,    // 选择了tag后的处理函数
    handleFilterClear: PropTypes.func, // 清除tag过滤
}

// 已select的形式展示标签
export const TagsSelect = ({tags, activeTagKey, handleSelected, handleFilterClear}) => {
    // 状态
    const [currentTag, setCurrentTag] = useState();
    const [ tagValues, setTagValues ] = useState([]);
    const [currentTagValue, setCurrentTagValue] = useState();

    useEffect(() => {
        // console.log(activeTagKey);
        if(activeTagKey){
            setCurrentTag(activeTagKey);
            fetchTagValuesData(activeTagKey, setTagValues)
        }
    }, [activeTagKey])

    // tag key变更的时候
    const handleOnTagChange = useCallback((tagKey) => {
        setCurrentTag(tagKey);
        setCurrentTagValue(undefined);
        setTagValues([]);
        fetchTagValuesData(tagKey, setTagValues)
    }, [])

    // tag value变更的时候
    const handleOnTagValueChange = useCallback((value) => {
        setCurrentTagValue(value);
        if(handleSelected && typeof handleSelected === "function"){
            handleSelected({key: currentTag, value: value});
        }
    }, [currentTag, handleSelected])

    const tagsSelectOptions = useMemo(() => {
        if(tags && Array.isArray(tags)){
            return tags.map((item, index) => {
                return (
                    <Select.Option key={item.id} value={item.key}>
                        {item.key}
                    </Select.Option>
                )
            })
        }else{
            return null;
        }
    }, [tags])

    const tagValuesSelectOptions = useMemo(() => {
        if(tagValues && Array.isArray(tagValues)){
            return tagValues.map((item, index) => {
                return (
                    <Select.Option 
                      key={item.id} value={item.value}>
                        {item.value}
                    </Select.Option>
                )
            })
        }else{
            return null;
        }
    }, [tagValues])

    return (
        <div className="tags-select">
            <div>
                <Select  
                style={{minWidth: 80}}
                placeholder="选择标签Key"
                showSearch
                value={currentTag}
                onChange={handleOnTagChange}
                className="key"
                >
                    {tagsSelectOptions}
                </Select>

                {/* 标签值 */}
                {
                    tagValuesSelectOptions && (
                        <span>
                            <Select defaultValue="=" disabled>
                                <Select.Option value="=">=</Select.Option>
                            </Select>
                            <Select  
                            //   style={{width: 150}}
                            placeholder="选择值"
                            showSearch
                            onChange={handleOnTagValueChange}
                            value={currentTagValue}
                            className="value"
                            >
                                {tagValuesSelectOptions}
                            </Select>
                        </span>
                    
                    )
                }
            </div>

            <div className="clear">
                {
                    activeTagKey && (
                        <div className="close" onClick={
                            (e) => {
                                handleSelected({});
                                // setCurrentTag();
                                setCurrentTagValue();
                                // setTagValues([]);
                                if(typeof handleFilterClear === "function"){
                                    handleFilterClear();
                                }
                            }}>
                            清除<Icon type="close" />
                        </div>
                    )
                }
            </div>
        </div>
    )
}

// 已列表的形式展示tags
export const TagsList = ({tags, activeTagKey, activeTagValue}) => {
    const [tagValues, setTagValues] = useState([]);

    // 获取标签的标签值
    const fetchTagValuesData = useCallback((tagKey) => {
        if(!tagKey){
            return;
        }
        let url = `/api/v1/tags/key/${tagKey}/values`;
        fetchApi.Get(url, {}, {})
          .then(responseData => {
              if(Array.isArray(responseData)){
                setTagValues(responseData);
              }else{
                  message.warn(JSON.stringify(responseData));
              }
          })
            .catch(err => {
                console.log(err);
            })
    }, [])

    // 标签key元素
    const tagsElements = useMemo(() => {
        if(!tags || !Array.isArray(tags)){
            return null;
        }
        return tags.map((item, index) => {
                return (
                    <span 
                      className="item" key={item.id}
                      onClick={e => fetchTagValuesData(item.key)}
                    >
                        <Tag color={activeTagKey === item.key ? "blue" : ""}>{item.key}</Tag>
                    </span>
                )
        })
    }, [tags, activeTagKey, fetchTagValuesData])

    // 标签值元素
    const tagValuesElements = useMemo(() => {
        return tagValues.map((item, index) => {
                return (
                    <span 
                      className="item" key={item.id}
                    //   onClick={e => fetchTagValuesData(item.key)}
                    >
                        <Tag color={activeTagValue === item.value ? "blue" : ""}>{item.value}</Tag>
                    </span>
                )
        })
    }, [activeTagValue, tagValues])

    return (
        <div>
            {
                tags.length > 0 && (
                    <div className="tags-list">
                        <div className="title">标签:</div>
                        <div className="list">
                            { tagsElements }
                        </div>
                    </div>
                )
            }

            {/* 标签值 */}
            {
                tagValues.length > 0 && (
                    <div className="tags-list">
                        <div className="title">标签值:</div>
                        <div className="list">
                            { tagValuesElements }
                        </div>
                    </div>
                )
            }
            
        </div>
    )
}

// 过滤按钮
export const TagsFilterButton = ({pageUrl, paramsFields, history, location}) => {
    const [activeTagKey, setActiveTagKey] = useState();
    const [activeTagValue, setActiveTagValue] = useState();

    useEffect(() => {
        let locationSearch = location.search;
        // console.log(locationSearch);
        let urlParams = getParamsFromLocationSearch(["tag__keys", "tag__values"], locationSearch)
        // console.log(urlParams);
        if(urlParams["tag__keys"]){
            setActiveTagKey(urlParams["tag__keys"]);
        }else{
            setActiveTagKey();
        }

        if(urlParams["tag__values"]){
            setActiveTagValue(urlParams["tag__values"]);
        }else{
            setActiveTagValue();
        }
    }, [location.search])

    // 处理filter了之后
    const handleTagSelected = useCallback(tag => {
        const locationSearch = location.search;
        let urlParams = getParamsFromLocationSearch(paramsFields, locationSearch);
        let url = pageUrl;

        paramsFields.forEach(item => {
            if(
                item && urlParams[item] 
                && ["tag__keys", "tag__values"].indexOf(item) < 0
            ){
                let value = urlParams[item];
                if(value !== undefined && value !== null){
                    if(url.indexOf("?") > 0){
                        url = `${url}&${item}=${value}`;
                    }else{
                        url = `${url}?${item}=${value}`;
                    }
                }
            }
        })

        // tag_keys, tag_values
        for(var item in tag){
            if(["key", "value"].indexOf(item) >= 0){
                let value = tag[item];
                if(value !== undefined && value !== null){
                    if(url.indexOf("?") > 0){
                        url = `${url}&tag__${item}s=${value}`;
                    }else{
                        url = `${url}?tag__${item}s=${value}`;
                    }
                }
            }
        }

        // 跳转
        // console.log(url);
        history.push(url);
        
    }, [location.search, pageUrl, paramsFields, history]);

    // 清除filter
    const handleFilterClear = useCallback(() => {
        setActiveTagKey();
        setActiveTagValue();
    }, [])

    const tagsFilter = useMemo(() => {
        return (
            <TagsFilter 
              type="select"
              activeTagKey={activeTagKey}
              activeTagValue={activeTagValue}
              handleSelected={handleTagSelected}
              handleFilterClear={handleFilterClear}
            />
        )
    }, [activeTagKey, activeTagValue, handleTagSelected, handleFilterClear])

    
    
    const buttonStyle = useMemo(() => {
        let btnStyle = {
            width: 100
        }
        if(activeTagKey){
            btnStyle["color"] = "#40a9ff"
            btnStyle["borderColor"] = "#40a9ff"
        }
        return btnStyle;
    }, [activeTagKey])

    return (
        <span>
            <Dropdown 
                overlay={tagsFilter}
                placement="bottomCenter"
                trigger={['click']}
            >
                <Button 
                    // style={{display: "inline-block", marginRight: 10, cursor: "pointer"}}
                    style={buttonStyle}
                    type="default"
                    icon={<Icon type="filter" />}
                >
                    Filter
                </Button>
            </Dropdown>
        </span>
    )
}

TagsFilterButton.propTypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    paramsFields: PropTypes.arrayOf(PropTypes.string).isRequired,
    pageUrl: PropTypes.string.isRequired,
}

export default TagsFilter;
