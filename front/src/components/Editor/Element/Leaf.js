/**
 * 渲染叶子节点组件
 */
import React from "react";

// 定义组件LeafElement来渲染叶子节点：比如：这里是常规字符，后面的**加粗**
export function LeafElement(props){
    // 渲染连接
    if(props.leaf.type === "link"){
        return (
            <a {...props.attributes} href={props.leaf.url}>
                {props.children}
            </a>
        );
    }
    // 渲染图片
    if(props.leaf.type === "image"){
        // console.log(props);
        return (
            <img {...props.attributes} alt={props.leaf.text} src={props.leaf.url}>
                {/* {props.children} */}
            </img>
        );
    }

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
