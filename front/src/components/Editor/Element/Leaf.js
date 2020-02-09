/**
 * 渲染叶子节点组件
 */
import React from "react";

// 定义组件LeafElement来渲染叶子节点：比如：这里是常规字符，后面的**加粗**
export function LeafElement(props){
    // 
    // console.log(props);
    return (
        <span {...props.attributes} style={
            { 
                fontWeight: props.leaf && props.leaf.type==="bold" ? "bold" : "normal",
                fontStyle: props.leaf && props.leaf.type==="italic" ? "italic" : "",
                textDecoration: props.leaf && props.leaf.type==="underline" ? "underline" : "none",
            }
        }>
            {props.children}
        </span>
    );
}

export default LeafElement;
