/**
 * 基础表单
 * 通过传递fields来动态生成表单
 */
import React, {useState, useEffect, useCallback, useMemo} from "react";
import PropTypes from "prop-types";

import {
    Row, Col,
    Button,
    Input, Radio, Checkbox, Switch, DatePicker,
    Form
}from "antd";

const BaseFormFieldItem = ({data, formItemLayout}) => {
    // 生成choices的选项：单选、多选等
    const generateChoicesElements = useCallback((type, choices) => {
        if(!Array.isArray(choices)){
            return [];
        }

        switch(type){
            case "radio":
                // 如果value为null和undefined是会报错的
                return choices.map((item, index) => {
                    return (
                        <Radio.Button value={item.value} key={index}>
                            {item.text}
                        </Radio.Button>
                    );
                })
            case "checkbox":
                return choices.map((item, index) => {
                    return (
                        <Checkbox value={item.value} key={index}>
                            {item.text}
                        </Checkbox>
                    );
                });
            default:
                return null
        }
    }, [])

    let itemLayout = useMemo(() => {
        return data.layout ? data.layout : formItemLayout;
    }, [data.layout, formItemLayout])

    switch ( data.type ) {
        case "input" :
            return (
                <Form.Item {...itemLayout} 
                  label={data.label} name={data.name}                  // 表单左侧的Label
                  className={data.hiddle ? "hiddle" : null}            // 是否隐藏
                  rules={Array.isArray(data.rules) ? data.rules : []}  // 字段的规则
                  help={data.help}                                     // 帮组信息
                >
                    <Input 
                      disabled={data.disabled} 
                      {...data.props} // 其它的相关配置对象
                    />
                </Form.Item>
            )
        case "radio":
            return (
                <Form.Item {...itemLayout} 
                  label={data.label} name={data.name}
                  rules={Array.isArray(data.rules) ? data.rules : []}
                >
                    <Radio.Group size="small" buttonStyle="solid" {...data.props}>
                        {/* <Radio.Button value={true}>开启</Radio.Button>
                        <Radio.Button value={false}>禁用</Radio.Button> */}
                        {generateChoicesElements("radio", data.choices)}
                    </Radio.Group>
                </Form.Item>
            )
        case "checkbox":
            return (
                <Form.Item {...itemLayout}
                  label={data.label} name={data.name}
                  rules={Array.isArray(data.rules) ? data.rules : []}
                >
                    <Checkbox.Group {...data.props}>
                        {generateChoicesElements("checkbox", data.choices)}
                    </Checkbox.Group>
                  </Form.Item>
            );

        case "switch":
            return (
                <Form.Item {...itemLayout}
                  label={data.label} name={data.name}
                  rules={Array.isArray(data.rules) ? data.rules : []}
                  valuePropName="checked"  // 这个是不一样的哦，valuePropName不是value
                >
                    <Switch {...data.props}/>
                </Form.Item>
            );
        case "datepick":
            return (
                <Form.Item {...itemLayout}
                  label={data.label} name={data.name}
                  rules={Array.isArray(data.rules) ? data.rules : []}
                >
                    <DatePicker {...data.props} />
                </Form.Item>
            )
       
        default:
            return null;
    }
}

BaseFormFieldItem.propTypes = {
    data: PropTypes.shape({
        name: PropTypes.string.isRequired, // 表单字段的名字
        label: PropTypes.string,           // 表单的label
        help: PropTypes.string,            // 帮助信息
        choices: PropTypes.shape({         // 表单字段的选项：raido、checkbox会用到
            text: PropTypes.isRequired,
            value: PropTypes.isRequired,
        }).isArray,
        rules: PropTypes.object.isArray,   // 规则
        props: PropTypes.object,           // 各组件其它的配置，参考antd进行配置即可
    }).isRequired,
    formItemLayout: PropTypes.object,       // 表单字段的布局
}

export const BaseForm = (props) => {
    // 状态
    const [data, setData] = useState({});

    // 表单的name和ref：可以使用默认的，也可使用默认的
    const [formName, setFormName] = useState("baseForm");
    const [formRef, setFormRef] = useState(React.createRef());
    const [fields, setFields] = useState([])

    useEffect(() => {
        if(props.ref){
            setFormRef(props.ref);
        }
        if(props.name){
            setFormName(props.name);
        }
    }, [props.ref, props.name])

    // 更新当前表单的数据
  const updateFiedsValue = useCallback((data) => {
    formRef.current.setFieldsValue(data);
  }, [formRef]);

    // 初始化的数据
    useEffect(() => {
        if(props.data){
            setData(props.data);
            // 更新表单的数据
            updateFiedsValue(props.data);
        }
    }, [props.data, updateFiedsValue]);

    // 表单的字段
    useEffect(() => {
        if(props.fields && Array.isArray(props.fields)){
            setFields(props.fields);
        }
    }, [props.fields]);

    const handleSubmit = useCallback(values => {
        // 提交表单的处理函数
        if(typeof props.handleSubmit === "function"){
            props.handleSubmit(values);
        }
    }, [props])

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

    // 渲染表单的字段
    const formFieldsItems = useMemo(() => {
        return fields.map((item, index) => {
            return (
                <BaseFormFieldItem 
                  data={item} key={index} 
                  formItemLayout={formItemLayout}
                />
            );
        })
    }, [fields, formItemLayout])

    return (
        <Form name={formName}
          onFinish={handleSubmit}
          initialValues={data}
          ref={formRef}
          className="base-form"
          >
              <Row>
                  <Col span={24}>
                    {formFieldsItems}
                  </Col>
              </Row>
              <Form.Item {...tailFormItemLayout}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    >
                        {props.buttonName ? props.buttonName : "提交"}
                    </Button>
              </Form.Item>
          </Form>
    );
}

BaseForm.propTypes = {
    name: PropTypes.string,
    ref: PropTypes.object,
    fields: PropTypes.array.isRequired,
    data: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired
}

// fields示例：
// const baseFormFieds = [
//     {
//         type: "input",
//         label: "ID",
//         required: true,
//         name: "id",
//         hiddle: true,
//         placeholder: "请输入ID",
//         help: "请输入ID",
//         disabled: true,
//         rules: [
//             {
//                 required: true,
//                 message: "请输入ID"
//             }
//         ]

//     },
//     {
//         type: "input",
//         label: "名字",
//         required: true,
//         name: "name",
//         placeholder: "请输入名字",
//         help: "请输入用户名",
//         rules: [
//             {
//                 required: true,
//                 message: "请输入名字"
//             }
//         ]
//     },
//     {
//         type: "radio",
//         label: "状态",
//         name: "active",
//         help: "请输入状态",
//         rules: [
//             {
//                 required: true,
//                 message: "请选择状态"
//             }
//         ],
//         choices: [
//             {
//                 text: "开启",
//                 value: true,
//             },
//             {
//                 text: "禁用",
//                 value: false
//             },
//             {
//                 text: "不设置",
//                 value: "none"
//             }
//         ]
    
//     }
// ]

export default BaseForm;