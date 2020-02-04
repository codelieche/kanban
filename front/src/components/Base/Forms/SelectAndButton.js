/**
 * 自定义表单控件：选择+按钮
 * 需要结合CheckTableValues使用
 * 父组件调用，这2个结合的组件：
 * 参考示例：Task/Category/Form.js中的引用
 */
import React, {useState, useEffect} from "react";
import {Button, Select} from "antd";

// Form.Item中如果设置了多个组件，那么value不知道传给谁了
// 故antd的：自定义表单控件
// 自定义或第三方的表单控件，也可以与 Form 组件一起使用。只要该组件遵循以下的约定：
// 1. 提供受控属性 value 或其它与 valuePropName 的值同名的属性。
// 2. 提供 onChange 事件或 trigger 的值同名的事件。
function SelectAndButton(props){
    // value = {}, onChange
    // console.log(props);
    const [data, dataState] = useState(0)

    // 
    useEffect(() => {
        if(props.checkValues !== data){
            dataState(props.checkValues);
        }
    }, [props.checkValues, data]);

    // 触发变更事件
    const triggerChange = changedValue => {
        if (props.onChange) {
            props.onChange({
            value: data,
            ...props.value,
            ...changedValue,
            });
        }
    };

    const onChange = values => {
        // console.log(values);
        if(!values){
            values = [];
        }
        // 修改当前组件的值
        dataState(values);
        // 判断是否需要修改checkValuesState
        if(props.checkValuesState){
            props.checkValuesState(values);
        }

        // 调用触发改变
        triggerChange({
            data: values,
            value: values,
        });
        
    };

    return (
        <div style={{display: "flex"}}>
            <Select
                style={{flex: 1}}
                allowClear={true}
                showSearch={true}
                model={props.isMultiple ? "multiple" : ""}
                // mode="multiple" // multiple | tags
                value={data ? data:[]}
                onChange={onChange}
            >
                {props.checkValues instanceof Array && props.checkValues.map((item, index) => {
                    return (
                        <Select.Option key={index} value={item}>
                        {item}
                        </Select.Option>
                    );
                })}
            </Select>
            <Button type="primary" 
                style={{width: 80}}
                onClick={props.onButtonClick}
            >选择</Button>
        </div>
    );
}

export default SelectAndButton;