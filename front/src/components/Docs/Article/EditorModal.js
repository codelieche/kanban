/**
 * 文章编辑的对话框
 */
import React, { useState, useEffect, useCallback, useMemo} from "react";

import {
    Modal,
    Alert
} from "antd";
import MyEditor from "../../Editor";

/**
 * 编辑文章的对话框，需要传递的属性
 * 1. content: 文章的content
 * 2. visiable: 是否显示弹出框，在文章页中用的是：showEditorModal这个状态
 * 3. handleContentUpdated: 编辑了内容后的处理函数，PATCH方法更新Content
 * 4. afterModalCloseHandle: 关闭或者点了确认后的操作
 *     4-1：设置showEditorModal为false
 * @param {*}} props 
 */
export const MyEditorModel = function(props) {
    // 每次编辑都修改一下一markdown的内容，右侧渲染需要用到
    const [markdownContent, setMarkdownContent] = useState(null);
    // 判断是否更新了
    const [isUpdated, setIsUpdated] = useState(false);
    // 检查上次是否有未提交成功的内容
    const [lastContent, setLastContent] = useState(null);

    useEffect(() => {
        if(props.visable){
            let key = `article_${props.articleID}_content`;
            let value = localStorage.getItem(key);
            if(!!value){
                try {
                    setLastContent(JSON.parse(value));
                    
                } catch (error) {
                    console.log(error);
                    setLastContent(null);
                }
            }else{
                setLastContent(null);
            }
        }
        setMarkdownContent(props.markdownContent);

    }, [props.articleID, props.markdownContent, props.visable])

    // 修改文章内容
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

    let alertElement = useMemo(() => {

        if(lastContent && lastContent.content && props.visable){
            let message = (
                <div onDoubleClick={e => {
                    // console.log(e);
                    e.stopPropagation();
                    // console.log(lastContent.content);
                    setMarkdownContent(lastContent.content);
                    if(lastContent.key){
                        localStorage.removeItem(lastContent.key);
                    }
                    setLastContent(null);
                }}>
                    {`${lastContent.time}:更新未提交成功，双击切换成未提交的内容`}
                </div>
            )
            return (
                <Alert 
                    className="alert"
                    message={message}
                    type="warning"
                    closable
                    closeText="忽略"
                    onClose={e => {
                        e.stopPropagation();
                        if(lastContent.key){
                            localStorage.removeItem(lastContent.key);
                        }
                    }}
                />
            )
        }else{
            return null
        }
    }, [lastContent, props.visable])

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
             <div>
                 {alertElement}
                <MyEditor 
                  content={markdownContent}
                  onChange={value => setMarkdownContent(value)} // 当内容更新了之后，我们修改markdownContent
                />
             </div>

        </Modal>
    );
}

export default MyEditorModel;