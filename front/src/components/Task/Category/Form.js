/**
 * 分类 表单Form
 * 需要传递的属性(props):
 * 1. data: 编辑页会传递过来object对象
 * 2. type: editor或者add，根据这个类确定GroupForm
 * 3. handleSubbmit: 表单提交时候，需要做的事情
 */
import React, { useState, useEffect } from "react";
import {
    Form,
    Input,
    InputNumber,
    Row,
    Col,
    Button,
    message
} from "antd";

import useUploadImageItem from "../../Hooks/UplaodImageItem";

// 分类表单
function CategoryForm(props){
    // 表单的ref
    const formRef = React.createRef();

    // 数据处理函数
    const [data, dataState] = useState({order: 1});
    // 上传文件要用到的状态
    const [fileListData, fileListDataState] = useState(null);

    // 相当于：componentDidMount()、componentWillUpdate()
    // 由于useEffect里面调用了dataState, 注意给其设置第二个参数[props.data, props.type, data]
    useEffect(() => {
        // console.log(props);
        if(data !== props.data && props.data){
            // 修改状态
            dataState(props.data);

            // 修改表单的数据：注意次数data是老的数据，记得用props.data来修改
            if(props.data.id > 0 && props.type === "editor"){
                // 需要修改一下表单的数据
                // let newData = props.data;
                // delete(newData, "image");
                formRef.current.setFieldsValue(props.data);
                // formRef.current.setFieldsValue(newData);
            }
        }
    }, [props.data, props.type, data, formRef, props]);

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

    const formItemTailLayout = {
        wrapperCol: { offset: 8, span: 8 },
    }

    const handleOnFinish = values => {
      values["image"] = fileListData;
      // 过滤掉parent字段: 因为api中不支持传递为空的parent
      if(!values["parent"]){
        delete values.parent;
      }
      if(! props.handleSubmit){
          message.error("没传递表单提交处理函数", 5);
          return
      }else{
          props.handleSubmit(values);
      }
    }

    // 渲染表单
    // 相当于class编写组件时的：render(){}
    return (
        <Form
          ref={formRef}
          onFinish={handleOnFinish}
          initialValues={data}
        >
            <Row>
                <Col xs={24} sm={24} md={24}>
                    <Form.Item
                      {...formItemLayout}
                      label="分类名"
                      name="name"
                      rules={[
                          {required: true, message: "请填写分类名"}
                      ]}
                    >
                      <Input placeholder="name" />
                    </Form.Item>

                    <Form.Item
                      {...formItemLayout}
                      label="Code"
                      name="code"
                      rules={[
                          {required: props.type === "editor" ? false: true, message: "请填写分类的code"}
                      ]}
                    >
                      <Input placeholder="code" disabled={props.type === "editor" ? true: false}/>
                    </Form.Item>

                    <Form.Item
                      {...formItemLayout}
                      label="父级分类"
                      name="parent"
                      rules={[
                          {required: false, message: "请填写父级分类"}
                      ]}
                    >
                      <Input placeholder="parent" />
                    </Form.Item>

                    <Form.Item
                      {...formItemLayout}
                      label="排序"
                      name="order"
                      rules={[
                          {required: true, message: "请填写分类的排序"}
                      ]}
                    >
                      <InputNumber min={1} max={100} />
                    </Form.Item>

                    <Form.Item
                      {...formItemLayout}
                      label="描述"
                      name="description"
                      rules={[
                          {required: true, message: "请描述一下当前分类"}
                      ]}
                    >
                      <Input.TextArea 
                        rows={4}
                        autoSize={{minRows: 4, maxRows: 20}}
                        placeholder="description" />
                    </Form.Item>

                    <Form.Item
                      style={{display: props.type === "editor" ? "show" : "none"}}
                      {...formItemLayout}
                      label="添加时间"
                      rules={[
                          {required: true, message: "请描述一下当前分类"}
                      ]}
                    >
                      <Input value={data.time_added ? data.time_added : null} disabled/>
                    </Form.Item>

                    <Form.Item
                      {...formItemLayout}
                      label="图片"
                      name="image"
                      rules={[
                          {required: false, message: "请填写图片"}
                      ]}
                    >
                      {/* 上传图片的组件：自定义的hooks */}
                      {useUploadImageItem(data.image, fileListData, fileListDataState)}
                    </Form.Item>

                    {/* 提交按钮 */}
                    <Form.Item 
                      style={{textAlign: "center"}}
                      {...formItemTailLayout}>
                         <Button type="primary" htmlType="submit">
                             {props.type === "editor" ? "编辑" : "添加"}
                         </Button>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
}

export default CategoryForm;