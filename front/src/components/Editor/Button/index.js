/**
 * 富文本编辑器按钮
 */

import React from "react";
import { Editor } from "slate";
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
        console.log(editor);
        Editor.addMark(editor, "type", type)
    }
}

export  function MarkButton({type, icon}) {
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
            <Icon type={type} noMarginRight={true} />
        </div>
    );
};

export const ButtonTools = React.forwardRef((props, ref) => {

    let tools = [
        {type: "bold", text: "粗体", icon: "bold"},
        {type: "italic", text: "斜体", icon: "italic"},
        {type: "underline", text: "下划线", icon: "underline"},
        {type: "list-ul", text: "无序列表", icon: "list-ul"},
        {type: "list-ol", text: "有序列表", icon: "list-ol"},
        {type: "link", text: "链接", icon: "link"},
    ]

    let toolsElemtns = tools.map((item, index) => {
        return (
            <MarkButton type={item.type} key={index} icon={item.icon}/>
        );
    })

    return (
        <div className="tools" {...props} ref={ref}>
            {toolsElemtns}
        </div>
    )
});

export default ButtonTools;