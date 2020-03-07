/**
 * 富文本编辑器
 */
import React, { useState, useCallback, useEffect} from "react";
import { Controlled as CodeMirror} from "react-codemirror2";
import ReactMarkdown from "react-markdown";
// import Icon from "../Base/Icon";

import CodeBlock from "./Element/Code";
import { ButtonTools }from "./Toolbar/index";

require('codemirror/mode/markdown/markdown');

export function MyEditor(props){
    // 状态
    const [value, setValue] = useState(null);
    // 编辑器实例
    const [editor, setEditor] = useState(null)
    // 显示模式
    const [display, setDisplay] = useState({markdown: true, html: true})

    const handleChange = useCallback((editor, data, value) => {
        // console.log(editor, data, value);
        // setValue(value)
        if(props.onChange && typeof props.onChange === "function"){
            props.onChange(value);
        }
       
    }, [props])

    const handleOnBeforeChange = useCallback((editor, data, value) => {
        // data是一个对象，输入了啥字符啊，cursor的from和to啊
        // console.log(editor);
        setValue(value);
    }, [])

    useEffect(() => {
        // console.log(props);
        if(props.content !== value){
            setValue(props.content);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.content])


    return (
        <div className="editor">
            {/* 头部的按钮 */}
            <div>
                {/* 按钮 */}
                <ButtonTools editor={editor} display={display} setDisplay={setDisplay} />
            </div>

            <div className="content">
                {/* 左侧的内容 */}
                <div className="markdown" style={{display: display.markdown ? "block" : "none"}}>
                    <div style={{position: "relative", height: "100%", display: display.markdown ? "block" : "none"}}>
                        <CodeMirror
                            //  把editor实例传给上级
                            editorDidMount={ editor => {setEditor(editor)}}
                            autoCursor={true}
                            options={{
                                mode: 'markdown',
                                theme: 'eclipse',
                                lineNumbers: true
                            }}
                            value={value}
                            onBeforeChange={handleOnBeforeChange}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                
                {/* 右侧的内容 */}
                <div className="html"  style={{display: display.html ? "block" : "none"}}>
                    <ReactMarkdown
                      source={value ? value : "请输入文章内容"}
                      renderers={{ code: CodeBlock }}
                    />
                </div>
            </div>
        </div>
    );
}

export default MyEditor;