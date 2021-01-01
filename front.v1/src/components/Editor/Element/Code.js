/**
 * Markdown渲染code块
 */
import React from "react";
// import Loadable from "react-loadable";
import loadable from '@loadable/component'

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// import {MermaidElement} from "./Mermaid";

// https://github.com/conorhastings/react-syntax-highlighter/tree/master/dist/esm/styles

// import { okaidia } from 'react-syntax-highlighter/dist/esm/styles/prism'; // Good
// import { solarizedlight } from 'react-syntax-highlighter/dist/esm/styles/prism'; // 黄色底纹
// import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'; // Very Good
// import { xonokai } from 'react-syntax-highlighter/dist/esm/styles/prism'; 

import atomDark from "./AtomDark";
// import Loading from "../../Page/Loading";

// const AsyncMermaidElement = Loadable({
//     loader: () => import("./Mermaid"),
//     loading: Loading,
// });
const AsyncMermaidElement = loadable(() => import("./Mermaid"));

// ReactMarkdown渲染code node
export const CodeBlock = ({value, language}) => {
    // console.log(value, language);
    if( language === "mermaid"){
        return (
            <AsyncMermaidElement code={value} />
        )
    }

    return (
        <SyntaxHighlighter language={language} 
            style={ atomDark }
        >
            {value}
        </SyntaxHighlighter>
    )
}

export default CodeBlock;
