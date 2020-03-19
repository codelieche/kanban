/**
 * 用户编辑对话框
 * 需要传递的属性(props):
 *  1. display
 *  2. data: 用户的数据
 *  3. afterHandler: 操作完后要执行的函数
 */

import React, { Component } from "react";
import { Modal, message } from "antd";

import fetchApi from "../Utils/fetchApi";
import UserEditorForm from "./EditorForm";

export default class EditUserModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: this.props.data ? this.props.data : {},
      visible: this.props.visible,
      showLoading: false
    };
  }

  static getDerivedStateFromProps(nexProps, prevState) {
    // 当父组件传递的属性改变的时候，要改变下自身的状态
    if (
      nexProps.data !== prevState.data ||
      nexProps.visible !== prevState.visible
    ) {
      // 设置下content的内容为空, 所以给ApproveForm传递个id，在ApproveForm里面再设置content为空
      return {
        data: nexProps.data,
        visible: nexProps.visible,
        showLoading: false
      };
    }else{
      return null;
    }
  }

  handleCancel = e => {
    message.info("取消编辑", 3);
    this.setState({
      visible: false,
      showLoading: false
    });

    if (this.props.afterHandler) {
      // 关闭对话框，不需要刷新数据
      this.props.afterHandler(false);
    }
  };

  handleEditorSubmit = values => {
    // 提交编辑
    var url = `/api/v1/account/user/${this.state.data.id}`;
    // PUT/PATCH修改用户信息
    fetchApi.Put(url, {}, 
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        data: values
    })
      .then(data => {
        if (data.id === this.state.data.id) {
          // 成功
          message.success("修改用户信息成功", 5);

          // 关闭弹出框
          this.setState({
            visible: false,
            showLoading: false
          });

          if (this.props.afterHandler) {
            this.props.afterHandler();
          }
        } else {
          // 失败
          message.error(JSON.stringify(data), 5);
          this.setState({
            showLoading: false
          });
        }
      })
      .catch(err => {
        this.setState({ showLoading: false });
        message.error("编辑出现错误！", 5);
      });
  };

  render() {
    return (
      <Modal
        title="编辑用户"
        visible={this.state.visible}
        onCancel={this.handleCancel}
        footer={null}
      >
        <UserEditorForm
          data={this.state.data}
          handleSubmit={this.handleEditorSubmit}
        />
      </Modal>
    );
  }
}
