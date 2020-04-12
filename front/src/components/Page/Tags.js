/**
 * 标签相关的操作
 */
import React, {
    useState, useCallback, useMemo
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

AddObjectTag.propTypes = {
    tag: PropTypes.string.isRequired,
    appLabel: PropTypes.string.isRequired,
    model: PropTypes.string.isRequired,
    objectID: PropTypes.number.isRequired,
    callback: PropTypes.func
}

export default {
    fetchObjectTags,
    deleteObjectTag,
    AddObjectTag,
}
