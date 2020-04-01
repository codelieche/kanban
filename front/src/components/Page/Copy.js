/**
 * 通用的复制组件
 * 传递的属性:
 * 1. title: 字符
 * 2. content: 要复制的内容
 * 3. text：复制icon后面的文字提示
 */
import React, {useCallback} from "react";
import PropTypes from "prop-types";
import { message } from "antd";

import Icon from "../Base/Icon";

// 复制文本函数
export const copyTextFunc = (title, content) => {
    if(window.clipboardData){
        window.clipboardData.clearData();
        window.clipboardData.setData("Text", content);
        message.success(`已复制${title}到剪切板!`);

    }else{
        let tmpInput = document.createElement('input');
        tmpInput.value = content;                      // 设置内容
        document.body.appendChild(tmpInput);           // 添加元素到body的后面
        tmpInput.select();                             // 选择对象
        document.execCommand("copy");                  // 执行浏览器复制命令
        message.success(`${title}:已复制到剪切板!`, 3);  // 弹出成功消息
        document.body.removeChild(tmpInput);           // 记得移除掉这个
    }
}

// 复制Icon组件
export const CopyIcon = ({title, content, className, text}) => {

    const handleCopyClick = useCallback((e) => {
        // console.log(e);
        e.stopPropagation();
        if(!content){
            message.warn("复制的内容为空");
        }

        // 执行复制函数
        copyTextFunc(title, content);

    }, [content, title])

    return (
        <span onClick={handleCopyClick}>
            <Icon type="copy" className={className}></Icon>{text}
        </span>
    )
}

// 类型检查
CopyIcon.propTypes = {
    title: PropTypes.string,
    content: PropTypes.string.isRequired,
    text: PropTypes.string,
}

export default CopyIcon;