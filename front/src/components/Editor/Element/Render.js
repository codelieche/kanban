

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
            return <blockquote {...props}>{props.children}</blockquote>
        case "bold":
            return <strong {...props}>{props.children}</strong>
        case "list-ul":
            return <ul {...props}>{props.children}</ul>
        case "list-ol":
            return <ol {...props}>{props.children}</ol>
        case "list-item-ul":
            return <li {...props}>{props.children}</li>
        case "list-item-ol":
            return <li {...props}>{props.children}</li>
        case "h1":
            return <h1 {...props}>{props.children}</h1>
        case "h2":
                return <h2 {...props}>{props.children}</h2>
        case "h3":
            return <h3 {...props}>{props.children}</h3>
        case "h4":
            return <h4 {...props}>{props.children}</h4>
        case "h5":
            return <h5 {...props}>{props.children}</h5>
        case "h6":
            return <h6 {...props}>{props.children}</h6>
        case "image":
            // console.log(props);
            return <img {...props.attributes} alt={props.leaf.text} src={props.leaf.url}></img>
        // case "hr":
        //     return <hr />
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