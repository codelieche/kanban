/**
 * Slate默认的段落是paragraph.
 * {
 *     type: "paragraph",
 *     children: [{text: "段落中的一段文本"}]
 * }
 */
//  为code节点定义一个React组件的渲染器

import React from "react";
export function CodeElement(props){
    return (
        <pre {...props.attributtes}>
            <code>{props.children}</code>
        </pre>
    );
}

export default CodeElement;
