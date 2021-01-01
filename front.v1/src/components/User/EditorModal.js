/**
 * 用户编辑对话框
 * 需要传递的属性(props):
 *  1. display
 *  2. data: 用户的数据
 *  3. afterHandler: 操作完后要执行的函数
 */

import React, { useState, useCallback, useEffect } from "react";
import { Modal, message } from "antd";

import fetchApi from "../Utils/fetchApi";
import UserEditorForm from "./EditorForm";

export const EditUserModal = (props) => {
  // 状态
  const [visible, setVisible ] = useState(false);
  const [data, setData] = useState({});
  const [showLoading, setShowLoading ] = useState(false);

  useEffect(() => {
    if(props.data !== data){
      setData(props.data);
      setShowLoading(false);
    }

    if(props.visible !== visible){
      setVisible(props.visible);
      setShowLoading(false);
    }
  }, [props.visible, props.data, data, visible]);

  const handleCancel = useCallback(e => {
    message.info("取消编辑", 3);
    
    setVisible(false);
    setShowLoading(false);

    if (props.afterHandler) {
      // 关闭对话框，不需要刷新数据
      props.afterHandler(false);
    }
  }, [props]);

  const handleEditorSubmit = useCallback(values => {
    // 提交编辑
    var url = `/api/v1/account/user/${data.id}`;
    // PUT/PATCH修改用户信息
    fetchApi.Put(url, {}, 
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        data: values
    })
      .then(responseData => {
        if (responseData.id === data.id) {
          // 成功
          message.success("修改用户信息成功", 5);

          // 关闭弹出框
          setVisible(false);
          setShowLoading(false);

          if (props.afterHandler) {
            props.afterHandler();
          }
        } else {
          // 失败
          message.error(JSON.stringify(responseData), 5);
          setShowLoading(false);
        }
      })
      .catch(err => {
        setShowLoading(false);
        // console.log(err);
        if(err.status === 400){
          message.error(JSON.stringify(err.data), 5);
        }else{
          message.error("编辑出现错误！", 5);
        }
      });
  }, [data.id, props]);

  
  return (
    <Modal
      title="编辑用户"
      visible={visible}
      onCancel={handleCancel}
      footer={null}
    >
      <UserEditorForm
        data={data}
        showLoading={showLoading}
        handleSubmit={handleEditorSubmit}
      />
    </Modal>
  );
}

export default EditUserModal;