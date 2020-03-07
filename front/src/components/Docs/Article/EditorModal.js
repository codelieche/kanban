/**
 * 文章编辑的对话框
 */
import React, { useState, useEffect, useCallback} from "react";

import {
    Modal,
} from "antd";
import ReactMarkdown from "react-markdown";
// import EditableContent from "../../Base/EditableContent";
import CodeBlock from "./../../Editor/Element/Code";
import Editor from "./Editor";
import MyEditor from "../../Editor";

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
    // 每次编辑都修改一下一markdown的内容，右侧渲染需要用到
    const [markdownContent, setMarkdownContent] = useState(null);
    // 判断是否更新了
    const [isUpdated, setIsUpdated] = useState(false);

    const patchUpdateContent = useCallback(() => {
        if(isUpdated){
            // 文章更新了
            if(isUpdated && props.content !== markdownContent){
                // console.log("最新文章内容:\n", markdownContent);
                if(props.handleContentUpdated){
                    props.handleContentUpdated(markdownContent);
                }
            }
        }
    }, [isUpdated, markdownContent, props]);

    const handleOk = useCallback((e) => {
        // 发起更新文章操作
        patchUpdateContent();

        // 调用后续的处理操作
        if(props.afterModalCloseHandle && typeof props.afterModalCloseHandle === "function"){
            props.afterModalCloseHandle();
        }
    }, [patchUpdateContent, props]);

    const handleCancle = useCallback(() => {
        // 发起更新文章操作
        patchUpdateContent();

        // 调用后续的处理操作
        if(props.afterModalCloseHandle && typeof props.afterModalCloseHandle === "function"){
            props.afterModalCloseHandle();
        }
    }, [patchUpdateContent, props]);

    useEffect(() => {
        // console.log(props);
        if(props.markdownContent !== markdownContent && !markdownContent){
            setMarkdownContent(props.markdownContent);
        }

        // 设置更新
        if( !isUpdated && markdownContent !== props.content){
            // console.log("文章内容更新了")
            setIsUpdated(true);
        }
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.markdownContent, isUpdated])

    useEffect(() => {
        // 最后需要处理的操作
        return () => {
            if(isUpdated){
                console.log("我更新了，我需要做点操作");
            }
        }
    }, [isUpdated]);

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

                <div className="content">
                <div className="markdown">
                    {/* <EditableContent
                        content={props.markdownContent}
                        contentType="text" // 类型是html或者text
                        tagName="div"
                        className="content"
                        // 当内容更新了之后，我们需要做点操作
                        handleContentUpdated={props.handleContentUpdated}
                        onChange={data => setMarkdownContent(data.target.text)}
                    /> */}

                    <Editor content={props.markdownContent}
                      onChange={value => setMarkdownContent(value)}
                      // 当内容更新了之后，我们需要做点操作
                      handleContentUpdated={props.handleContentUpdated}
                    />
                </div>
                {/* 右侧实时渲染的html */}
                <div className="html">
                    <ReactMarkdown
                      source={markdownContent ? markdownContent : "请输入文章内容"}
                      renderers={{ code: CodeBlock }}
                    />
                </div>
                </div>
            </div>
        </Modal>
    );
}

export const MyEditorModel = function(props){
    // 每次编辑都修改一下一markdown的内容，右侧渲染需要用到
    const [markdownContent, setMarkdownContent] = useState(null);
    // 判断是否更新了
    const [isUpdated, setIsUpdated] = useState(false);

    const patchUpdateContent = useCallback(() => {
        if(isUpdated){
            // 文章更新了
            if(isUpdated && props.content !== markdownContent){
                // console.log("最新文章内容:\n", markdownContent);
                if(props.handleContentUpdated){
                    props.handleContentUpdated(markdownContent);
                }
            }
        }
    }, [isUpdated, markdownContent, props]);

    const handleOk = useCallback((e) => {
        // 发起更新文章操作
        patchUpdateContent();

        // 调用后续的处理操作
        if(props.afterModalCloseHandle && typeof props.afterModalCloseHandle === "function"){
            props.afterModalCloseHandle();
        }
    }, [patchUpdateContent, props]);

    const handleCancle = useCallback(() => {
        // 发起更新文章操作
        patchUpdateContent();

        // 调用后续的处理操作
        if(props.afterModalCloseHandle && typeof props.afterModalCloseHandle === "function"){
            props.afterModalCloseHandle();
        }
    }, [patchUpdateContent, props]);

    useEffect(() => {
        // console.log(props);
        if(props.markdownContent !== markdownContent && !markdownContent){
            setMarkdownContent(props.markdownContent);
        }

        // 设置更新
        if( !isUpdated && markdownContent !== props.content){
            // console.log("文章内容更新了")
            setIsUpdated(true);
        }
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.markdownContent, isUpdated])

    useEffect(() => {
        // 最后需要处理的操作
        return () => {
            if(isUpdated){
                console.log("我更新了，我需要做点操作");
            }
        }
    }, [isUpdated]);

    return (
        <Modal
          visible={props.visable}
          width="90%"
          wrapClassName="editor-modal"
          onCancel={handleCancle}
          onOk={handleOk}
          footer={null}
          destroyOnClose={!!props.content} // 如果内容不是是空，就关闭的时候销毁。防止在空页面，content为上一篇的内容
        >
             {/* 文章编辑弹出框 */}
             <MyEditor 
               content={props.markdownContent}
               onChange={value => setMarkdownContent(value)}
               // 当内容更新了之后，我们需要做点操作
             />
        </Modal>
    );
}

// export default EditorArticleModel;
export default MyEditorModel;