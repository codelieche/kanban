/**
 * Slate默认的段落是paragraph.
 * {
 *     type: "paragraph",
 *     children: [{text: "段落中的一段文本"}]
 * }
 */
//  为code节点定义一个React组件的渲染器
import React, { useEffect } from "react";

import SyntaxHighlighter from 'react-syntax-highlighter';
import { tomorrowNight } from 'react-syntax-highlighter/dist/esm/styles/hljs';


export function CodeElement(props){
    return (
        <pre {...props.attributtes}>
            <code>{props.children}</code>
        </pre>
    );
}

export function CodePrismDemo(props){

    useEffect( () => {

    })
    const code = `
    cost a = 900;
    console.log(a);
    a ++;
    console.log(a);
    alert(a);
    `.trim();

    const code2 = `
    import os

    if __name__ == "__main__":
        print(help(os))
    `.trim();

    return (
        <div>
            <div>
                <SyntaxHighlighter language="js" 
                    startingLineNumber={1}
                    showLineNumbers={true}
                    style={tomorrowNight}>
                        {code}
                    </SyntaxHighlighter>
                </div>
            <hr />
                <div>
                    <SyntaxHighlighter language="python" 
                    startingLineNumber={1}
                    showLineNumbers={true}
                    style={tomorrowNight}>
                        {code2}
                    </SyntaxHighlighter>
                </div>
        </div>
        
    );
}

export default CodeElement;
