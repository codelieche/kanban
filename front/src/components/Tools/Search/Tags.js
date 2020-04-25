/**
 * 标签按钮
 */
import React, { useState, useCallback, useEffect, useMemo} from "react";
import PropTypes from "prop-types";
import {
    Tag,
    Select,
    message
} from "antd";

import fetchApi from "../../Utils/fetchApi";

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
export const TagsFilter = ({activeTagKey, activeTagValue, type, handleSelected}) => {
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
              handleSelected={handleSelected}/>
        )
    }

    return (
        <TagsList tags={tagKeys} 
          activeTagKey={activeTagKey} 
          activeTagValue={activeTagValue}
          handleSelected={handleSelected}
       />
    )
}

TagsFilter.propTypes = {
    activeTagKey: PropTypes.string,
    activeTagValue: PropTypes.string,
    type: PropTypes.string,
    handleSelected: PropTypes.func,  // 选择了tag后的处理函数
}

// 已select的形式展示标签
export const TagsSelect = ({tags, activeTagKey, handleSelected}) => {
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
            handleSelected({key: currentTag, value: currentTagValue});
        }
    }, [currentTag, currentTagValue, handleSelected])

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
            <Select  
              style={{minWidth: 80}}
              placeholder="选择标签Key"
              showSearch
              value={currentTag}
              onChange={handleOnTagChange}
            >
                {tagsSelectOptions}
            </Select>

            {/* 标签值 */}
            {
                tagValuesSelectOptions && (
                    <span>
                        <Select defaultValue="=">
                            <Select.Option value="=">=</Select.Option>
                        </Select>
                        <Select  
                        //   style={{width: 150}}
                          placeholder="选择值"
                          showSearch
                          onChange={handleOnTagValueChange}
                          value={currentTagValue}
                        >
                            {tagValuesSelectOptions}
                        </Select>
                    </span>
                   
                )
            }
        </div>
    )
}

// 已列表的形式展示tags
export const TagsList = ({tags, activeTagKey, activeTagValue}) => {
    const [tagValues, setTagValues] = useState([]);

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

export default TagsFilter;
