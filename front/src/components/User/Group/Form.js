/**
 * 用户组 表单Form
 * 需要传递属性（props）
 * 1. data：编辑页会传过来obj
 * 2. type：editor 或者 add，根据这个来确定GroupForm
 */

import React from "react";
import { Button, Form, Input, Row, Col, Transfer } from "antd";
import fetchApi from "../../Utils/fetchApi";

class BaseForm extends React.Component {
  constructor(props) {
    super(props);
    //  先处理传递过来的data
    var data = this.props.data ? this.props.data : {};
    this.state = {
      sourceData: [],
      data: data,
      transferDataSource: [],
      //  穿梭框选中的key和目标keys
      selectedKeys: [],
      //  右边表单中Target选中的keys
      targetKeys: data.user_set ? data.user_set : [],

      // 权限相关的数据：搞成跟设置user的穿梭框类似
      transferPermisionDataSource: [],
      selectedPermissionKeys: [],
      targetPermissionKeys: data.permissions ? data.permissions : [],
    };
  }

  formRef = React.createRef();

  componentDidMount() {
    //  获取所有用户的列表
    this.fetchAllUserData();
    // 获取所有权限的列表
    this.fetchAllPermissionData();
  }


  static getDerivedStateFromProps(nextProps, prevState) {
    // 由于最开始的editor页面穿过来的data是空，后面editro页面重新获取了group数据，重新传递过来
    if (nextProps.data !== prevState.data) {
      return {
        //group的数据
        data: nextProps.data,
        // 选中的user数据
        // targetKeys: nextProps.data.user_set
        targetKeys: nextProps.data && nextProps.data.user_set ? nextProps.data.user_set : [],
        // 选择的权限数据
        targetPermissionKeys: nextProps.data.permissions ? nextProps.data.permissions : [],
      };
    }else{
      return null;
    }
  }

  componentDidUpdate(prevProps, prevState, snaptshot){
    // 如果状态变更了，就需要重新获取一下数据
    if(prevProps.data !== this.state.data){
        // 需要更新一下初始化的数据
        // console.log(this.state.data)
        this.formRef.current.setFieldsValue(this.state.data);
    }
  }

  handleSubmit = values => {
    // 提交表单的处理函数
    // Form表单实例化的时候会传递handleSubmit,实际的操作都是调用它的
    // 主要是：editor或add操作
    // console.log(values);
    // console.log(this.state);
    values["user_set"] = this.state.targetKeys;
    values["permissions"] = this.state.targetPermissionKeys;
    
    this.props.handleSubmit(values);
  };

  fetchAllUserData() {
    // 获取所有用户列表
    const url = "/api/v1/account/user/all";
    fetchApi.Get(url)
      .then(data => {
        if (data instanceof Array) {
          // 获取的数据是数组才ok
          this.userall = data;
          // 生成穿梭框左边的源数据[{key: id, title: username}]
          let transferDataSource = data.map(item => ({
            key: item.id,
            title: item.username
          }));
          // 修改状态：设置穿梭框源数据和选中的key的值
          this.setState({
            transferDataSource: transferDataSource
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
    // fetch end
  }

  fetchAllPermissionData() {
    // 获取所有用户列表
    const url = "/api/v1/account/permission/all";
    fetchApi.Get(url)
        .then(data => {
            if (data instanceof Array) {
                // 获取的数据是数组才ok
                this.permissions = data;
                // 生成穿梭框左边的源数据[{key: id, title: username}]
                let transferPermissionDataSource = data.map(item => ({
                    key: item.id,
                    title: `${item.codename}【${item.app_model}】`
                }));
                // 修改状态：设置穿梭框源数据和选中的key的值
                this.setState({
                    transferPermissionDataSource: transferPermissionDataSource
                });
            }
        })
        .catch(err => {
            console.log(err);
        });
    // fetch end
}

  // 穿梭框
  handleTransferSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    // 处理穿梭框选中item的操作
    // 当鼠标点击穿梭框的内容的时候，需要修改下选中的key的列表的值
    this.setState({
      selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys]
    });
  };

  handlePermissionTransferSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    // 处理穿梭框选中item的操作
    // 当鼠标点击穿梭框的内容的时候，需要修改下选中的key的列表的值
    this.setState({
        selectedPermissionKeys: [...sourceSelectedKeys, ...targetSelectedKeys]
    });
  };

  handleTransferChange = (nextTargetkeys, direction, moveKeys) => {
    // 处理穿梭框左右穿梭的函数
    // 把左边移动到邮编，右边移到左右的时候，主要就是改变右边的targetKeys的值
    this.setState({ targetKeys: nextTargetkeys });
  };

  handlePermissionTransferChange = (nextTargetkeys, direction, moveKeys) => {
    // 处理穿梭框左右穿梭的函数
    // 把左边移动到邮编，右边移到左右的时候，主要就是改变右边的targetKeys的值
    this.setState({ targetPermissionKeys: nextTargetkeys });
};

  render() {
    // Button提交按钮的名字
    const buttonTitle = this.props.type === "editor" ? "修改" : "添加";
    // Form的一些内建函数
   
    // Only Show error after a field is touched

    // 左侧表单Item的布局设置
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
        md: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 },
        md: { span: 14 }
      }
    };

    const tailLayout = {
      wrapperCol: { offset: 8, span: 16 },
    };

    // 穿梭框布局设置
    const transferItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 0 },
        md: { span: 0 }
      },
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        // 注意：sm尺寸设置了偏移，md尺寸的时候默认也会偏移
        sm: { span: 18, offset: 3 },
        md: { span: 16, offset: 4 }
      }
    };

    return (
      <Form ref={this.formRef} 
        onFinish={this.handleSubmit} initialValues={this.state.data}>
        <Row>
          <Col xs={24} sm={24} md={24}>
            <Form.Item
              {...formItemLayout}
              label="分组名"
              name="name"
              rules={[
                { required: true, message: "Please input group name!" },
              ]}
            >
              <Input placeholder="name" />
            </Form.Item>

            <Form.Item {...transferItemLayout}
              name="user_set"
              label=""
            >
              <div>
                <Transfer
                  listStyle={{
                    maxWidth: 300,
                    width: "43%",
                    minHeight: 250,
                    overflow: "auto"
                  }}
                  dataSource={this.state.transferDataSource}
                  targetKeys={this.state.targetKeys}
                  selectedKeys={this.state.selectedKeys}
                  onChange={this.handleTransferChange}
                  onSelectChange={this.handleTransferSelectChange}
                  titles={["所有用户", "组成员"]}
                  showSearch
                  render={item => item.title}
                />
              </div>
            </Form.Item>

            <Form.Item
              {...transferItemLayout}
              name="permissions"
            >
              <div>
                <Transfer
                    listStyle={{
                        maxWidth: 300,
                        width: "43%",
                        minHeight: 250,
                        overflow: "auto"
                    }}
                    dataSource={this.state.transferPermissionDataSource}
                    targetKeys={this.state.targetPermissionKeys}
                    selectedKeys={this.state.selectedPermissionKeys}
                    onChange={this.handlePermissionTransferChange}
                    onSelectChange={this.handlePermissionTransferSelectChange}
                    titles={["所有权限", "组权限"]}
                    showSearch
                    render={item => item.title}
                />
              </div>
            </Form.Item>
            <Form.Item {...tailLayout}>
              <Button
                type="primary"
                htmlType="submit"
              >
                {buttonTitle}
              </Button>
            </Form.Item>
          </Col>
        </Row>
        <Row className="center">
          
        </Row>
      </Form>
    );
  }
}

export default BaseForm;
// export default Form.create()(BaseForm);
