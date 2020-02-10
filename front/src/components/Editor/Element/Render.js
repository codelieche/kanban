

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
        case "bold":
            return <strong>{props.children}</strong>
        case "list-ul":
            return <ul>{props.children}</ul>
        case "list-item-ul":
            return <li>{props.children}</li>
        case "h1":
            return <h1>{props.children}</h1>
        case "h2":
                return <h2>{props.children}</h2>
        case "h3":
            return <h3>{props.children}</h3>
        case "h4":
            return <h4>{props.children}</h4>
        case "h5":
            return <h5>{props.children}</h5>
        case "h6":
            return <h6>{props.children}</h6>
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