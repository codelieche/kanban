/**
 * Markdown渲染code块
 */
import React from "react";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

// https://github.com/conorhastings/react-syntax-highlighter/tree/master/dist/esm/styles
// import { github } from 'react-syntax-highlighter/dist/esm/styles/hljs';
// import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
// import { solarizedDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

// import { okaidia } from 'react-syntax-highlighter/dist/esm/styles/prism'; // Good
// import { solarizedlight } from 'react-syntax-highlighter/dist/esm/styles/prism'; // 黄色底纹
// import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'; // Very Good
// import { xonokai } from 'react-syntax-highlighter/dist/esm/styles/prism'; 

import atomDark from "./AtomDark";

export const CodeBlock = ({value, language}) => {
    console.log(value, language);
    return (
        <SyntaxHighlighter language={language} 
            style={ atomDark }
        >
            {value}
        </SyntaxHighlighter>
    )
}

export default CodeBlock;
