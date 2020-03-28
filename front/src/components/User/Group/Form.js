/**
 * 用户组 表单Form
 * 需要传递属性（props）
 * 1. data：编辑页会传过来obj
 * 2. type：editor 或者 add，根据这个来确定GroupForm
 */

import React, { useState, useCallback, useEffect, useMemo } from "react";
import { Button, Form, Input, Row, Col, Transfer } from "antd";
import fetchApi from "../../Utils/fetchApi";

const BaseForm = (props) => {
  // 状态
  // const [allUsers, setAllUsers] = useState([]);
  // const [allPermissions, setAllPermissions] = useState([]);
  const [data, setData] = useState({});
  // const [sourceData, setSourceData] = useState([]);
  const [transferDataSource, setTransferDataSource] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [targetKeys, setTargetKeys] = useState([]);

  // 权限相关的状态
  const [transferPermissionDataSource, setTransferPermissionDataSource] = useState([]);
  const [selectedPermissionKeys, setSelectedPermissionKeys] = useState([]);
  const [targetPermissionKeys, setTargetPermissionKeys] = useState([]);

  const formRef = useMemo(() => React.createRef(), []);

  // 监控props.data的变化
  useEffect(() => {
    if(props.data !== data){
      setData(props.data);
      if(props.data.user_set){
        setTargetKeys(props.data.user_set);
        
      }
      if(props.data.permissions){
        setTargetPermissionKeys(props.data.permissions);
      }
    }else{
      formRef.current.setFieldsValue(data);
    }
  }, [props.data, data, formRef])

  const handleSubmit = useCallback(values => {
    // 提交表单的处理函数
    // Form表单实例化的时候会传递handleSubmit,实际的操作都是调用它的
    // 主要是：editor或add操作
    // console.log(values);
    // console.log(this.state);
    values["user_set"] = targetKeys;
    values["permissions"] = targetPermissionKeys;
    
    props.handleSubmit(values);
  }, [props, targetKeys, targetPermissionKeys]);

  const fetchAllUserData = useCallback(() => {
    // 获取所有用户列表
    const url = "/api/v1/account/user/all";
    fetchApi.Get(url)
      .then(data => {
        if (data instanceof Array) {
          // 获取的数据是数组才ok
          // this.userall = data;
          // setAllUsers(data);
          // 生成穿梭框左边的源数据[{key: id, title: username}]
          let transferDataSource = data.map(item => ({
            key: item.id,
            title: item.username
          }));
          // 修改状态：设置穿梭框源数据和选中的key的值
          setTransferDataSource(transferDataSource)
        }
      })
      .catch(err => {
        console.log(err);
      });
    // fetch end
  }, []);

  const fetchAllPermissionData = useCallback(() => {
    // 获取所有用户列表
    const url = "/api/v1/account/permission/all";
    fetchApi.Get(url)
        .then(data => {
            if (data instanceof Array) {
                // 获取的数据是数组才ok
                // this.permissions = data;
                // setAllPermissions(data);
                // 生成穿梭框左边的源数据[{key: id, title: username}]
                let transferPermissionDataSource = data.map(item => ({
                    key: item.id,
                    title: `${item.codename}【${item.app_model}】`
                }));
                // 修改状态：设置穿梭框源数据和选中的key的值
                setTransferPermissionDataSource(transferPermissionDataSource);
            }
        })
        .catch(err => {
            console.log(err);
        });
    // fetch end
  }, []);

  // 获取所有用户和所有权限
  useEffect(() => {
    fetchAllUserData();
    fetchAllPermissionData();
  }, [fetchAllPermissionData, fetchAllUserData])

  // 穿梭框
  const handleTransferSelectChange = useCallback((sourceSelectedKeys, targetSelectedKeys) => {
    // 处理穿梭框选中item的操作
    // 当鼠标点击穿梭框的内容的时候，需要修改下选中的key的列表的值
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys])
  }, []);

  const handlePermissionTransferSelectChange = useCallback((sourceSelectedKeys, targetSelectedKeys) => {
    // 处理穿梭框选中item的操作
    // 当鼠标点击穿梭框的内容的时候，需要修改下选中的key的列表的值
    setSelectedPermissionKeys([...sourceSelectedKeys, ...targetSelectedKeys])
  }, []);

  const handleTransferChange = useCallback((nextTargetkeys, direction, moveKeys) => {
    // 处理穿梭框左右穿梭的函数
    // 把左边移动到邮编，右边移到左右的时候，主要就是改变右边的targetKeys的值
    setTargetKeys(nextTargetkeys);
  }, []);

  const handlePermissionTransferChange = useCallback((nextTargetkeys, direction, moveKeys) => {
    // 处理穿梭框左右穿梭的函数
    // 把左边移动到邮编，右边移到左右的时候，主要就是改变右边的targetKeys的值
    setTargetPermissionKeys(nextTargetkeys);
}, []);

  // Button提交按钮的名字
  const buttonTitle = useMemo(() => {
    return props.type === "editor" ? "修改" : "添加";
  }, [props.type])
  // Form的一些内建函数
  // Only Show error after a field is touched

  // 左侧表单Item的布局设置
  const formItemLayout = useMemo(() => {
    return {
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
  }, []);


  const tailLayout = useMemo( () => {
    return {
              wrapperCol: { offset: 8, span: 16 },
            };
    }, [])

  // 穿梭框布局设置
  const transferItemLayout = useMemo(() => {
    return {
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
      }, [])

  return (
    <Form ref={formRef} 
      onFinish={handleSubmit} initialValues={data}>
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
                dataSource={transferDataSource}
                targetKeys={targetKeys}
                selectedKeys={selectedKeys}
                onChange={handleTransferChange}
                onSelectChange={handleTransferSelectChange}
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
                  dataSource={transferPermissionDataSource}
                  targetKeys={targetPermissionKeys}
                  selectedKeys={selectedPermissionKeys}
                  onChange={handlePermissionTransferChange}
                  onSelectChange={handlePermissionTransferSelectChange}
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

export default BaseForm;
// export default Form.create()(BaseForm);
