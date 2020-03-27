/**
 * 用户编辑表单
 * 需要传递的属性(props):
 * 1. data: 从列表页传递过来用户的data信息
 * 2. handleSubmit: 表单提交的操作
 *     a. 需要传递url：编辑用户的url
 *     b. 需要传递values：表单数据
 */
import React, { useState, useEffect, useCallback, useMemo } from "react";

import { Row, Col, Button, Form, Input, Radio } from "antd";


export const FormBase = (props) => {
  // 状态
  const [data, setData] = useState({});
  
  const formRef = useMemo(() => React.createRef(), [])

  // 更新当前表单的数据
  const updateFiedsValue = useCallback((data) => {
    formRef.current.setFieldsValue(data);
  }, [formRef]);

  useEffect(() => {
    if(props.data !== data){
      setData(props.data);
      // 修改表单的数据
      updateFiedsValue(props.data);
    }
  }, [data, props.data, updateFiedsValue]);


  const handleSubmit = useCallback(values => {
    // 提交表单的处理函数
    // Form表单实例化的时候传递了handleSubmit，实际的操作都是调用它的
    // 主要是：editor或add操作

    // var url = `http://127.0.0.1:9000/api/v1/account/user/${this.state.data.id}`;
    props.handleSubmit(values);
  }, [props]);

  // 左侧表单Item的布局设置
  const formItemLayout = useMemo(() => {
    return {
      labelCol: {
        xs: { span: 8 },
        sm: { span: 8 },
        md: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 12 },
        sm: { span: 12 },
        md: { span: 12 }
      }
    };
  }, []);
  // 表单尾部的布局样式：Button
  const tailFormItemLayout = useMemo(() => {
    return {
        wrapperCol: {
          xs: {
            span: 8,
            offset: 8
          },
          sm: {
            span: 8,
            offset: 10
          }
        }
      };
  }, []);

  return (
      <Form name="userEditForm"
        onFinish={handleSubmit}
        initialValues={data}
        ref={formRef}
      >
        <Row>
          <Col xs={24} sm={24}>
            <Form.Item {...formItemLayout} label="用户名"
              name="username"
            >
              <Input placeholder="用户名" disabled={true} />
            </Form.Item>
            <Form.Item
              {...formItemLayout}
              name="is_active"
              label="状态"
              // help="禁用用户"
              rules={[
                {required: true, message: "请选择是否开启用户!" },
              ]}
            >
              <Radio.Group size="small" buttonStyle="solid">
                <Radio.Button value={true}>开启</Radio.Button>
                <Radio.Button value={false}>禁用</Radio.Button>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              {...formItemLayout}
              name="can_view"
              label="访问权限"
              // help="是否有权限访问本站"
              rules={[
                { required: true, message: "请选择是否给用户访问权限!" }
              ]}
            >
                <Radio.Group size="small" buttonStyle="solid">
                  <Radio.Button value={true}>能</Radio.Button>
                  <Radio.Button value={false}>否</Radio.Button>
                </Radio.Group>
            </Form.Item>

            <Form.Item {...formItemLayout} 
              label="超级用户" name="is_superuser"
              rules={[
                { required: true, message: "请选择是否是超级用户!" }

              ]}
            >
                <Radio.Group size="small" buttonStyle="solid">
                  <Radio.Button value={true}>是</Radio.Button>
                  <Radio.Button value={false}>否</Radio.Button>
                </Radio.Group>
            </Form.Item>

            <Form.Item {...formItemLayout} 
            label="手机号"
              name="mobile"
              rules={[
                { required: false, message: "请输入手机号!", max: 20 }
              ]}
            >
             <Input placeholder="mobile" />
            </Form.Item>

            <Form.Item {...formItemLayout} label="钉钉ID" name="dingding"
              rules={[

              ]}
            >
              <Input placeholder="dingding" />
            </Form.Item>

            <Form.Item {...formItemLayout} label="微信ID" name="wechart">
              <Input placeholder="wechart" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12} />
        </Row>
        <Form.Item {...tailFormItemLayout}>
          <Button
            type="primary"
            htmlType="submit"
          >
            修改
          </Button>
        </Form.Item>
      </Form>
    );
}

export default FormBase;