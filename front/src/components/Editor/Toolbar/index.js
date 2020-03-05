/**
 * 富文本编辑器按钮
 */

import React, { useCallback } from "react";

import Icon from "../../Base/Icon";


export  function MarkButton({type, icon, text, title, editor}) {

    // 获取editor
    const handleButtonOnClick = useCallback(event => {
        event.preventDefault();
        // console.log("鼠标按下了：", type, icon);

        // 获取selections
        let selections = editor.getSelections();

        let selectionsResults = selections.map((item, index) => {
            switch(type){
                case "link":
                    return `[${item}]()`;
                case "image":
                    return `![${item}]()`;
                case "italic":
                    return `*${item}*`;
                case "bold":
                    return `**${item}**`;
                case "strikethrough":
                    return `~~${item}~~`;
                case "code":
                    return "`" + item + "`";  
                case "blockquote":
                    return "\n```\n" + item + "\n```\n";
                default:
                    return item;
            }
        });
        // 替换结果
        editor.replaceSelections(selectionsResults);

    }, [editor, type])

    return (
        <div className={ false ? "active" : "no-active"}
            onClick={handleButtonOnClick}
        >
            {/* 有icon就显示icon，无icon就显示text */}
            { icon ? <Icon type={icon} noMarginRight={true} /> : <Icon>{text}</Icon>}
        </div>
    );
};

export const ButtonTools = function(props) {
    let tools = [
        {type: "bold", text: "粗体", icon: "bold"},
        {type: "italic", text: "斜体", icon: "italic"},
        // {type: "underline", text: "下划线", icon: "underline"},
        {type: "strikethrough", text: "删除线", icon: "strikethrough"},
        {type: "list-ul", text: "无序列表", icon: "list-ul"},
        {type: "list-ol", text: "有序列表", icon: "list-ol"},
        {type: "link", text: "链接", icon: "link"},
        {type: "blockquote", title: "引用", icon: 'code'},
        // {type: "code", text: "代码块", icon: "code"},
        {type: "image", text: "图片", icon: "image"},
    ]

    let toolsElemtns = tools.map((item, index) => {
        return (
            <MarkButton type={item.type} key={index} 
              icon={item.icon} text={item.text}
              editor={props.editor}/>
        );
    });

    const testButtonClick = (event) => {
        // 阻止event的默认事件
        console.log(event);
        event.preventDefault();

        console.log(props.editor);

        // 想编辑器中插入个图片
        let doc = props.editor.getDoc();
        let cursor = doc.getCursor();
        // let pos = {
        //     line: cursor.line(),
        //     ch: cursor.ch
        // }
        console.log(doc, cursor);
        // 插入图片
        // doc.replaceRange("![]()", cursor);
        // doc.replaceRange("![]()", cursor);
        doc.replaceSelection("![]()");
        // 如果是替换多个，可使用
        // doc.replaceSelections(["v1", "v2", "v3"]);
        window.editor = props.editor;
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