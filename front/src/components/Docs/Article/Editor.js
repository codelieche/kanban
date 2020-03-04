/**
 * 文章的编辑器左侧
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
