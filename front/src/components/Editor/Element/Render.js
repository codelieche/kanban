

import React from "react";
import CodeElement from "./Code";
import DefaultElement from "./Default";
import LeafElement from "./Leaf";

// 渲染block
export const renderElementFunc = (props) => {
    switch(props.element.type){
        case "code":
            return <CodeElement {...props}/>
        case "blockquote":
            return <blockquote>{props.children}</blockquote>
        default:
            return <DefaultElement {...props}/>
    }
};

// 渲染叶子节点的函数
export const renderLeafElementFunc = (props) => {
    return (
        <LeafElement {...props} />
    );
}
export default {
    renderElementFunc,
    renderLeafElementFunc
}