/**
 * 默认的渲染段落
 */
import React from "react";

export function DefaultElement(props){
    console.log(props);
    return (
        <div {...props.attributes}>
            {props.children}
        </div>
    );
}

export default DefaultElement;