/**
 * 文章编辑的对话框
 */
import React, { useState, useEffect, useCallback} from "react";

import {
    Modal,
} from "antd";
import ReactMarkdown from "react-markdown";
import EditableContent from "../../Base/EditableContent";

/**
 * 编辑文章的对话框，需要传递的属性
 * 1. markdownContent: 文章的content
 * 2. visiable: 是否显示弹出框，在文章页中用的是：showEditorModal这个状态
 * 3. handleContentUpdated: 编辑了内容后的处理函数，PATCH方法更新Content
 * 4. afterModalCloseHandle: 关闭或者点了确认后的操作
 *     4-1：设置showEditorModal为false
 * @param {*}} props 
 */
export const EditorArticleModel = function(props){

    const [markdownContent, setMarkdownContent] = useState(null);

    const handleOk = useCallback((e) => {

        // 调用后续的处理操作
        if(props.afterModalCloseHandle &&typeof props.afterModalCloseHandle === "function"){
            props.afterModalCloseHandle();
        }

    }, [props]);

    const handleCancle = useCallback(() => {
        // 调用后续的处理操作
        if(props.afterModalCloseHandle &&typeof props.afterModalCloseHandle === "function"){
            props.afterModalCloseHandle();
        }
    }, [props]);

    useEffect(() => {
        // console.log(props);
        if(props.markdownContent !== markdownContent){
            setMarkdownContent(props.markdownContent);
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.markdownContent])

    return (
        <Modal
          visible={props.visable}
          width="80%"
          wrapClassName="editor-modal"
          onCancel={handleCancle}
          onOk={handleOk}
          footer={null}
        >
             {/* 文章编辑弹出框 */}
             <div className="editor">
                {/* 左侧markdown */}
                <div className="markdown">
                    <EditableContent
                        content={props.markdownContent}
                        contentType="text" // 类型是html或者text
                        tagName="div"
                        // 当内容更新了之后，我们需要做点操作
                        handleContentUpdated={props.handleContentUpdated}
                        onChange={data => setMarkdownContent(data.target.text)}
                    />
                </div>
                {/* 右侧实时渲染的html */}
                <div className="html">
                    <ReactMarkdown
                      source={markdownContent ? markdownContent : "请输入文章内容"}
                    />
                </div>
            </div>
        </Modal>
    );
}

export default EditorArticleModel;