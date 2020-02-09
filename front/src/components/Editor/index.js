/**
 * 富文本编辑器
 */
import React, { useState, useMemo, useCallback} from "react";
import { createEditor, Editor } from "slate";
import { Slate, Editable, withReact} from "slate-react";
import { withHistory } from 'slate-history';

import { ButtonTools }from "./Button/index";
import onKeyDownFunc from "./Event/onKeyDown";
import {
    renderElementFunc,
    renderLeafElementFunc
} from "./Element/Render"

export function MyEditor(props){

    // 编辑器对象
    const editor = useMemo(() => {
        return withReact(
            // CMD + Z; CMD + Shift + Z: 撤销/取消撤销
            withHistory(
                createEditor()
            )
        );
    }, []);

    // 创建个状态
    const [value, setValue] = useState([
        {
            type: "paragraph",
            children: [{text: ""}]
        }
    ]);

    // 处理编辑器值变更事件
    const handleEditorOnChange = useCallback((value) => {
        // 调试输出
        console.log(value);
        // 修改状态值
        setValue(value);
    }, []);

    return (
        <div className="editor">
            <div>
                <Slate editor={editor} value={value} onChange={handleEditorOnChange}>
                    {/* 按钮 */}
                    <ButtonTools />

                    <Editable
                      placeholder="请输入内容"
                      //   渲染元素
                      renderElement={renderElementFunc}
                      // 渲染叶子节点
                      renderLeaf={renderLeafElementFunc}
                      autoFocus={true}
                      spellCheck={false}
                      onKeyDown={useCallback(event => onKeyDownFunc(event, editor), [editor])}
                    />
                </Slate>
            </div>
        </div>
    );
}

export default MyEditor;