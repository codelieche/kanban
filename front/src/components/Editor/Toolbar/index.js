/**
 * 富文本编辑器按钮
 */

import React, { useCallback, useState, useEffect } from "react";

import {
    Row,
    Col
} from "antd";

import Icon from "../../Base/Icon";
import { UploadImageTabsModal } from "../../Page/UploadImage";


export  function MarkButton({type, icon, text, title, editor, historySize, setHistorySize, setModalVisible}) {

    // 获取editor
    const handleButtonOnClick = useCallback(event => {
        
        event.preventDefault();

        if(type === "image"){
            setModalVisible(true);
            return;
        }

        // console.log("鼠标按下了：", type, icon);
        let newHistorySize = editor.historySize();
        setHistorySize(newHistorySize);

        if(["undo", "redo"].indexOf(type) >= 0){
            switch(type){
                case "undo":
                    editor.undo();
                    return
                case "redo":
                    editor.redo();
                    return
                default:
                    return false;
            }
        }

        // 获取selections
        let selections = editor.getSelections();

        let selectionsResults = selections.map((item, index) => {
            let result;
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
                case "list-ul":
                    result = item.replace("\n", "\n- ")
                    result = "\n- " + result;
                    return result
                case "list-ol":
                    result = item.replace("\n", "\n1. ")
                    result = "\n1. " + result;
                    return result
                case "code":
                    return "`" + item + "`";  
                case "quote":
                    return "\n> " + item;
                case "blockquote":
                    return "\n```\n" + item + "\n```\n";
                case "table":
                    let tableStr = ` | Title1   | Title2 | Title3 | Title4 |
| ---- | --- | --- | --- |
| 1    | - | - | - |
| 2    | - | - | - |\n`;
                    return "\n\n" + tableStr;
                default:
                    return item;
            }
        });
        // 替换结果
        editor.replaceSelections(selectionsResults);

    }, [editor, setHistorySize, setModalVisible, type])

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
    // 历史记录
    const [historySize, setHistorySize] = useState({undo: 0, redo: 0});
    // 显示图片
    const [modalVisible, setModalVisible] = useState(false)

    useEffect(() => {
        if(props.editor){
            let newHistory = props.editor.historySize()
            setHistorySize(newHistory);
        }
    },[props.editor])
    

    let tools = [
        {type: "undo", text: "撤销", icon: "undo"},
        {type: "redo", text: "重做", icon: "repeat"},
        {type: "bold", text: "粗体", icon: "bold"},
        {type: "italic", text: "斜体", icon: "italic"},
        // {type: "underline", text: "下划线", icon: "underline"},
        {type: "strikethrough", text: "删除线", icon: "strikethrough"},
        {type: "list-ul", text: "无序列表", icon: "list-ul"},
        {type: "list-ol", text: "有序列表", icon: "list-ol"},
        {type: "link", text: "链接", icon: "link"},
        {type: "quote", text: "引用", icon: "quote-left"},
        {type: "blockquote", title: "代码块", icon: 'code'},
        {type: "table", title: "表格", icon: 'table'},
        {type: "image", text: "图片", icon: "image"},
        
    ]

    let toolsElemtns = tools.map((item, index) => {
        return (
            <MarkButton type={item.type} key={index} 
              icon={item.icon} text={item.text}
              historySize={historySize}
              setHistorySize={setHistorySize}
              setModalVisible={setModalVisible}
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

    const afterUploadImageHandle = useCallback((imageUrl) => {
        // 上传图片链接
        console.log("上传了图片：", imageUrl);
        // 获取selections
        let selections = props.editor.getSelections();

        let selectionsResults = selections.map((item, index) => {
                return `![${item}](${imageUrl})`;
        });
        // 替换结果
        props.editor.replaceSelections(selectionsResults);
        // 关闭对话框
        setModalVisible(false);

    }, [props.editor])

    return (
        <div className="tools">
            <Row style={{width: "100%"}}>
                <Col xs={{span:24}} sm={{span:16}} className="left">
                    {toolsElemtns}
                </Col>
                <Col xs={{span: 24}} sm={{span: 8}} className="right">
                    <div className="no-active" onClick={() => props.setDisplay(prevState => {return {markdown: true, html: !prevState.html}})}>
                        {/* eye eye-slash */}
                        <Icon type={(props.display && props.display.html) ? "eye-slash" : "eye"}/>
                    </div>

                    <div className={(!props.display.markdown && props.display.html) ? "active" : "no-active"} onClick={() => props.setDisplay(prevState => {return {markdown: !prevState.markdown, html: true}})}>
                        <Icon type="desktop"/>
                    </div>

                    <div className="no-active" onClick={testButtonClick}>
                        <Icon type="cog"/>
                    </div>
                </Col>
            </Row>

            {/* 上传图片的对话框 */}
            <UploadImageTabsModal 
              visible={modalVisible} 
              handleAfterClose={() => setModalVisible(false)}
              afterUploadHandle={afterUploadImageHandle}
            />
        </div>
    )
};

export default ButtonTools;