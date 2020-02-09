/**
 * 默认的渲染段落
 */
import React from "react";

export function DefaultElement(props){
    return (
        <p {...props.attributes}>
            {props.children}
        </p>
    );
}

export default DefaultElement;