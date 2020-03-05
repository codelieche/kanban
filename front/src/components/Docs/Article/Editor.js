/**
 * 文章的编辑器左侧
 * 如果要插入内容，或者更新内容
 * let doc = editor.getDoc();
 * let cursor = doc.getCursor();
 * doc.replaceRange("新插入的内容", cursor)
 */
import React, {useState, useCallback, useEffect } from "react";
import { Controlled as CodeMirror} from "react-codemirror2";

// 样式文件写入：styles/less/code-mirror.less中
// require('codemirror/lib/codemirror.css');
// require('codemirror/theme/material.css');
// require('codemirror/theme/eclipse.css');
// require('codemirror/theme/yonce.css');

require('codemirror/mode/markdown/markdown');

export const Editor = (props) => {
    // 状态
    const [value, setValue] = useState(null);

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
        if(props.content !== value){
            setValue(props.content);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.content])

    return (
        <div style={{position: "relative", height: "100%"}}>
            <CodeMirror
              //  把editor实例传给上级
              editorDidMount={ editor => {window.editor = editor}}
              autoCursor={true}
              options={{
                mode: 'markdown',
                theme: 'eclipse',
                // theme: 'yonce',
                lineNumbers: true
              }}
              value={value}
              onBeforeChange={handleOnBeforeChange}
              onChange={handleChange}
            />
        </div>
    );
}

export default Editor;
