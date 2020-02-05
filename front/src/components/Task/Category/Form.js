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
    Modal,
    Radio,
    message
} from "antd";

// import TestDemo from "../../Hooks/Demo";
// import Icon from "../../Base/Icon";
// 上传图片的Item
import UploadImageItem from "../../Base/Forms/UplaodImageItem";
// 从表单中选择值【数组】
import CheckValuesFromTable from "../../Base/Forms/CheckTableValues";
// 自定义的表单控件
import SelectAndButton from "../../Base/Forms/SelectAndButton";

// 分类表单
function CategoryForm(props){
    // 表单的ref
    const formRef = React.createRef();

    // 数据处理函数
    const [data, dataState] = useState({order: 1});
    // 上传文件要用到的状态
    const [fileListData, fileListDataState] = useState(null);
    // 弹出框
    const [visibleModal, visibleModalState] = useState(false);
    // 父级分类的选择值
    const [checkValues, checkValuesState] = useState([]);

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
                let newData = props.data;
                // 如果pareng的值是null，那就不要设置哦
                if(props.data["parent"]){
                  newData["parent"] = props.data["parent"];
                }else{
                  newData["parent"] = [];
                }
                // formRef.current.setFieldsValue(props.data);
                formRef.current.setFieldsValue(newData);

                // 修改默认的选择值
                checkValuesState([props.data.parent]);
            }
        }
    }, [props.data, props.type, data, formRef, props]);

    // 当选择parent变更的时候，需要重新给表单赋值
    useEffect(() => {
      // console.log(checkValues);
      // if(checkValues instanceof Array && checkValues.length > 0 && checkValues[0] !== data.parent){
      if(checkValues instanceof Array){
          // console.log("我需要修改表单中的parent");
          // 修改表单的值
          formRef.current.setFieldsValue({
            parent: checkValues,
          });
      }
    }, [checkValues, formRef]);

    const handleModelOk = () => {
      // console.log("处理关闭", checkValues);
      // console.log(formRef.current)
      // 关闭弹出框
      visibleModalState(false);
      formRef.current.setFieldsValue({
        parent: checkValues,
      });
    }

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
      // console.log(values);
      // console.log(values.parent);
      if(!values["parent"]){
        values["parent"] = "";
      }else{
        if(values["parent"] instanceof Array){
          if(values["parent"].length > 0){
            values["parent"] = values["parent"][0];
          }else{
            // 删掉parent字段
            // delete values.parent;
            values["parent"] = "";
          }
        }
      }
      // console.log(values);

      if(! props.handleSubmit){
          message.error("没传递表单提交处理函数", 5);
          return
      }else{
          props.handleSubmit(values);
      }
    }


    // 表格的列
    const categoryListColumns = [
      {
          title: "ID",
          dataIndex: "id",
          key: "id",
          sorter: (a, b) => a.id - b.id
      },
      {
          title: "分类名",
          dataIndex: "name",
          key: "name",
      },
      {
          title: "代码",
          dataIndex: "code",
          key: "code"
      },
      {
          title: "父级分类",
          dataIndex: "parent",
          key: "parent",
      },
      {
          title: "描述",
          dataIndex: "description",
          key: "description",
      }
    ]

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
                      {/* <Input placeholder="parent"
                        onClick={() => {visibleModalState(true)}}
                        addonAfter={<div><Icon type="search">选择</Icon></div>}
                      /> */}
                      {/* 采用了表单自定义的控件 */}
                      <SelectAndButton 
                        checkValues={checkValues}
                        checkValuesState={checkValuesState}
                        onButtonClick={() => visibleModalState(true)}
                        isMultiple={false}
                      />
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
                      <UploadImageItem 
                        url={data.image}
                        fileListData={fileListData}
                        fileListDataState={fileListDataState}
                      />
                    </Form.Item>

                    <Form.Item
                      {...formItemLayout}
                      label="状态"
                      name="is_deleted">
                          <Radio.Group buttonStyle="solid">
                            <Radio.Button value={false}>有效</Radio.Button>
                            <Radio.Button value={true}>禁用</Radio.Button>
                          </Radio.Group>
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

            <Modal
                title="请选择父级分类"
                visible={visibleModal}
                width={"70%"}
                // footer={null}
                onOk={handleModelOk}
                onCancel={() => {visibleModalState(false)}}
              >
                  <CheckValuesFromTable
                    checkValues={checkValues}
                    checkValuesState={checkValuesState} 
                    dataSourceUrl="/api/v1/task/category/list"
                    columns={categoryListColumns}
                    rowKey="code"
                    isMultiple={false}
                    disabledKeys={[data.code]}
                  />
              </Modal>

              {/* <TestDemo value={data} /> */}

        </Form>
    );
}

export default CategoryForm;