/**
 * 富文本编辑器按钮
 */

import React from "react";
import { Editor, Transforms } from "slate";
import { useSlate } from "slate-react";

import Icon from "../../Base/Icon";

export function isMarkActive(editor, type){
    const marks = Editor.marks(editor);
    return marks ? marks["type"] === type : false
}

export const toggleMark = (editor, type) => {
    const isActive = isMarkActive(editor, type)

    if (isActive) {
        Editor.removeMark(editor, "type")
    } else {
        // console.log(editor);
        Editor.addMark(editor, "type", type)
    }
}

export  function MarkButton({type, icon, text, title}) {
    // 获取editor
    let editor = useSlate();

    return (
        <div className={isMarkActive(editor, type) ? "active" : "no-active"}
            onClick={event => {
                event.preventDefault();
                // console.log("鼠标按下了：", type, icon);
                toggleMark(editor, type);
            }}
        >
            {/* 有icon就显示icon，无icon就显示text */}
            { icon ? <Icon type={icon} noMarginRight={true} /> : <Icon>{text}</Icon>}
        </div>
    );
};

export const ButtonTools = function(props) {
    let editor = useSlate();
    let tools = [
        {type: "bold", text: "粗体", icon: "bold"},
        {type: "italic", text: "斜体", icon: "italic"},
        {type: "underline", text: "下划线", icon: "underline"},
        {type: "strikethrough", text: "删除线", icon: "strikethrough"},
        {type: "list-ul", text: "无序列表", icon: "list-ul"},
        {type: "list-ol", text: "有序列表", icon: "list-ol"},
        {type: "link", text: "链接", icon: "link"},
        {type: "blockquote", title: "引用", text: '“'},
        {type: "code", text: "代码块", icon: "code"},
        {type: "image", text: "图片", icon: "image"},
    ]

    let toolsElemtns = tools.map((item, index) => {
        return (
            <MarkButton type={item.type} key={index} icon={item.icon} text={item.text}/>
        );
    });

    const testButtonClick = (event) => {
        // 阻止event的默认事件
        console.log(event);
        event.preventDefault();
        console.log(editor);
        // Editor.insertNode(editor, {
        //     type: "blockquote",
        //     children: [{text: ""}]
        // }, {
        //     at: editor.selection ? editor.selection.focus.path : null,
        // });

        editor.insertBreak()
        Transforms.insertNodes(
            editor, [{
                type: "paragraph",
                children: [{text: "123"}]
            }]
        );


    }

    return (
        <div className="tools">
            {toolsElemtns}
            <div className="no-active" onClick={testButtonClick}>
                <Icon type="cog"/>
            </div>
        </div>
    )
};

export default ButtonTools;