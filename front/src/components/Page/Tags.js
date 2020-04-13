/**
 * 标签相关的操作
 */
import React, {
    useState, useCallback, useMemo, useEffect
} from "react";
import PropTypes from "prop-types";

import {
    Tag,
    Input,
    message
} from "antd";

import Icon from "../Base/Icon";
import fetchApi from "../Utils/fetchApi";

// 获取对象标签
export const fetchObjectTags = (appLabel, model, objectID, page=1, callback) => {
    // 连接
    let url = `/api/v1/tags/objecttag/list?app_label=${appLabel}&model=${model}&object_id=${objectID}&page=${page}`;
    if(!objectID){
        message.warn("获取标签，传递的objectID为空", 3);
        return;
    }
    // 发起请求
    fetchApi.Get(url, {}, {})
      .then(responseData => {
          let data = responseData.results;
          if(Array.isArray(data)){
              if(callback){
                  callback(data);
              }
          }else{
              // 获取文章标签出错啦
          }
      })
        .catch(err => {
            console.log(err);
        })
}

// 删除标签
export const deleteObjectTag = (objectID, callback) => {
    let url = `/api/v1/tags/objecttag/${objectID}`;
    // 发起删除请求
    fetchApi.Delete(url, {}, {})
      .then(responseData => {
          if(responseData.status === 204){
              message.info("删除标签成功");
              if(callback){
                callback();
              }
          }else{
              console.log(responseData);
              message.warn(JSON.stringify(responseData.data));
          }
      })
        .catch(err => {
            console.log(err);
        })
}

// 添加标签
export const AddObjectTag = ({tag, appLabel, model, objectID, callback}) => {
    // 状态
    const [inputVisibale, setInputVisibale] = useState(false);
    const [inputValue, setInputValue] = useState("");

    // 显示input
    const handleShowInput = useCallback(() => {
        setInputVisibale(true);
    }, [])

    // input表单值的变更
    const handleInputChange = useCallback(e => {
        setInputValue(e.target.value);
    }, [])

    

    // fetch创建对象标签
    const handleTagAddSubmit = useCallback((value) => {
        if(!value){
            message.warn("传递的标签纸为空");
            return;
        }
        let url = "/api/v1/tags/objecttag/create";
        let data = {
            app_label: appLabel,
            tag: tag,
            model: model,
            value: value,
            object_id: objectID,
        }
        // 发起创建请求
        fetchApi.Post(url, {}, {data})
          .then(responseData => {
              if(responseData.id > 0){
                  message.success("添加标签成功", 3);
                  if(typeof callback === "function"){
                      callback(responseData);
                  }
              }else{
                  message.warn(JSON.stringify(responseData));
              }
          })
            .catch(err => {
                console.log(err);
                if(err.data){
                    message.error(JSON.stringify(err.data));
                }else{
                }
            })
    }, [appLabel, callback, model, objectID, tag])

    // tag值的提交
    const handleInputConfirm = useCallback(e => {
        // console.log(inputValue);
        // console.log(inputVisibale);
        setInputVisibale(false);
        setInputValue("");

        if(!!inputValue){
            handleTagAddSubmit(inputValue);
        }

    }, [handleTagAddSubmit, inputValue]);

    const editInputElement = useMemo(() => {
        return (
            <Input
              size="small"
              className="tag-input"
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputConfirm}
              onPressEnter={handleInputConfirm}
              placeholder="新的标签"
            />
        );
    }, [handleInputChange, handleInputConfirm, inputValue])

    if(inputVisibale){
        return editInputElement;
    }else{
        return (
            <Tag className="tag-plus" onClick={handleShowInput}>
                <Icon type="plus" />添加标签
            </Tag>
        )
    }
}

// 添加对象标签的属性控制
AddObjectTag.propTypes = {
    tag: PropTypes.string.isRequired,
    appLabel: PropTypes.string.isRequired,
    model: PropTypes.string.isRequired,
    objectID: PropTypes.number.isRequired,
    callback: PropTypes.func
}

// 展示对象的标签
export const ShowObjectTags = ({appLabel, model, objectID, showAll, callback, canDelete, color}) => {
    // 状态：对象的标签数组
    const [dataSource, setDataSource] = useState([]);
    const [page, setPage] = useState(1);

    // 获取数据后的回调函数
    const fetchCallback = useCallback((tags) => {
        setDataSource(tags);
        if(typeof callback === "function"){
            callback(tags);
        }
    }, [callback])

    useEffect(() => {
        setPage(1);
    // 下面三项：每一项变更都会触发重置page，一般都是同时变更的
    }, [appLabel, model, objectID])

    // 首先是获取对象的标签数组
    useEffect(() => {
        if(appLabel && model && objectID){
            fetchObjectTags(appLabel, model, objectID, page, fetchCallback);
        }
    }, [appLabel, fetchCallback, model, objectID, page])

    // 展示数据
    const tagsElements = useMemo(() => {
        if(dataSource && Array.isArray(dataSource)){
            return dataSource.map((item, index) => {
                return (
                    <Tag key={item.id} color={color ? color : "blue"}>
                        {item.value}
                    </Tag>
                );
            })
        }else{
            return null;
        }
    }, [dataSource, color]);

    // 返回展示的标签
    if(tagsElements && tagsElements.length > 0){
        return (
            <div className="tags">
                {tagsElements}
            </div>
        )
    }else{
        return null;
    }
}

// ShowObjectTags的属性控制
ShowObjectTags.propTypes = {
    appLabel: PropTypes.string.isRequired, // 后端app的名称
    model: PropTypes.string.isRequired,    // 对应的Model
    objectID: PropTypes.number.isRequired, // 对象的主键
    color: PropTypes.string,    // 颜色
    showAll: PropTypes.bool,   // 是否显示全部
    callback: PropTypes.func,  // 获取标签数据后的回调函数
    canDelete: PropTypes.bool  // 能否删除标签
}

// 展示标签，传递dataSource
export const ShowObjectTagsDataSource = ({dataSource, canDelete, color}) => {
    // 展示数据
    const tagsElements = useMemo(() => {
        if(dataSource && Array.isArray(dataSource)){
            return dataSource.map((item, index) => {
                return (
                    <Tag key={item.id} color={color ? color : "blue"}>
                        {item.value}
                    </Tag>
                );
            })
        }else{
            return null;
        }
    }, [dataSource, color]);

     // 返回展示的标签
     if(tagsElements && tagsElements.length > 0){
        return (
            <div className="tags">
                {tagsElements}
            </div>
        )
    }else{
        return null;
    }
}

ShowObjectTagsDataSource.propTypes = {
    dataSource: PropTypes.object.isArray,
    canDelete: PropTypes.bool,
    color: PropTypes.string,
}

export default {
    fetchObjectTags,
    deleteObjectTag,
    AddObjectTag,
}
