/**
 * 文档权限相关的工具
 * 1. 
 */
import React, {
    useState, useCallback, useMemo, useEffect
} from "react";

import PropTypes from "prop-types";

import {
    Tag, message
} from "antd";

import fetchApi from "../../Utils/fetchApi";
import Icon from "../../Base/Icon";
import { BaseFormModal} from "../../Page/BaseForm"

// 获取当前用户对分组的操作权限：read,write,delete等
export const fetchGroupPermissions = (categoryID, callback) => {
    let url = `/api/v1/docs/group/${categoryID}/permissions`;
    fetchApi.Get(url, {}, {})
      .then(responseData => {
        if(Array.isArray(responseData)){
            if(callback && typeof(callback) === "function"){
                callback(responseData);
            }
        }
      })
        .catch(err => {
            console.log(err);
        })
}

// 添加用户权限的modal
export const AddGroupUserPermissionButton = ({id, code, setPermissions, callback}) => {

    // 显示添加用户权限的modal
    const [showModal, setShowModal] = useState(false);
    //  查看当前用户是否有这个分组添加用户权限
    const [canAdd, setCanAdd] = useState(false);

    useEffect(() => {
        if( !!id ){
            fetchGroupPermissions(id, (data) => {
                if(Array.isArray(data)){
                    if(setPermissions && typeof setPermissions === "function"){
                        setPermissions(data);
                    }
                    if(data.indexOf("add_user") >= 0){
                        setCanAdd(true);
                    }
                }
                
            })
        }
    }, [id, setPermissions])

    // 显示modal
    const handleShowModal = useCallback(() => {
        setShowModal(true);
    }, [])

    // modal关闭的时候
    const handleModalAfterClose = useCallback(e => {
        setShowModal(false);
    }, [])

    // 表单字段
    const fields = useMemo(() => {
        return [
            {
                type: "input",
                name: "group",
                label: "分组",
                required: true,
                disabled: true,
                rules: [
                    {
                        required: true,
                        message: "请传递分组ID！"
                    }
                ]
            },
            {
                type: "input",
                name: "user",
                label: "用户",
                required: true,
                placeholder: "用户名",
                rules: [
                    {
                        required: true,
                        message: "请输入用户！"
                    }
                ]
            },
            {
                type: "radio",
                name: "permission",
                label: "权限",
                rules: [
                    {
                        required: true,
                        message: "请选择权限"
                    }
                ],
                choices: [
                    {text: "读", value: "R"},
                    {text: "读写", value: "RW"},
                    {text: "全部", value: "ALL"},
                ]
            }
        ]
    }, [])

    // 提交表单
    const handleFormSubmit = useCallback((values) => {
        // console.log(values);
        let url = `/api/v1/docs/groupuser/add`;
        values["user"] = [values["user"]];
        fetchApi.Post(url, {}, {data: values})
          .then(responseData => {
              // console.log(responseData);
              if(Array.isArray(responseData)){
                // 执行后续的回调函数
                if(callback && typeof callback === "function"){
                    callback();
                }
                // 隐藏modal
                setShowModal(false);
              }
          })
            .catch(err => {
                console.log(err);
                if(err.data){
                    if(err.data.message){
                        message.error(err.data.message);
                    }else{
                        message.error(JSON.stringify(err.data));
                    }
                }
            })
    }, [callback])

    if(!canAdd){
        // 无add权限的话 直接返回null
        return null;
    }

    return (
        <span>
            <Tag className="tag-plus" onClick={handleShowModal}>
                <Icon type="plus" />添加用户
            </Tag>
            <BaseFormModal
              title="添加用户"
              visible={showModal}
              handleAfterClose={handleModalAfterClose}
              fields={fields}
              handleSubmit={handleFormSubmit}
              data={{group: code, permission: "R", user: ""}}
            />
        </span>
    )
}

// 属性设置
AddGroupUserPermissionButton.propTypes = {
    id: PropTypes.number.isRequired,
    code: PropTypes.string.isRequired,
    setPermissions: PropTypes.func,
    callback: PropTypes.func,

}

// 删除分组的用户
export const delteGroupUserPermission = (code, user, callback) => {
    let url = `/api/v1/docs/groupuser/delete?group=${code}&user=${user}`;
    // 发起delete请求
    fetchApi.Delete(url, {}, {})
      .then(responseData => {
          if(responseData.status === 204){
              message.success(`删除${user}权限成功`);
              if(callback && typeof callback === "function"){
                  callback()
              }
          }else{
              message.warn("删除权限失败");
          }
      })
        .catch(err => {
            console.log(err);
        })
}

export default {
    fetchGroupPermissions,
    AddGroupUserPermissionButton,
    delteGroupUserPermission,
}