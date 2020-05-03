import React, { useState, useMemo, useCallback } from "react";

import {
    Modal, Divider, message
} from "antd";

import Icon from "../../Base/Icon";
import { CopyIcon } from "../../Page/Copy";

// 上传文章图片
import { ShowObjectTags, AddObjectTag } from "../../Page/Tags";
// 可编辑的Content
import EditableContent from "../../Base/EditableContent";
import { patchUpdateObject } from "./Operation";

export const ShowImageModal = ({visible, data, afterCloseHandle}) => {
    // 状态
    const [showInfo, setShowInfo] = useState(true);
    const [ reFreshTimes, setRefreshTimes] = useState(0);

    const handleOnOkOrCancel = useCallback((e) => {
        if(afterCloseHandle){
            afterCloseHandle();
        }
    }, [afterCloseHandle])

    const imageElement = useMemo(() => {
        if((data && data.id > 0) && (data.file || data.qiniu)){
            setShowInfo(true);
            return (
                <img src={data.qiniu ? data.qiniu : data.file} alt="图片" />
            );
        }else{
            return null;
        }
    }, [data]);

    const imageUrl = useMemo(() => {
        return data.qiniu ? data.qiniu : data.file;
    }, [data])

    const imageTagsElements = useMemo(() => {
        if(data && data.id > 0){
            return (
                <ShowObjectTags 
                    appLabel="docs" model="image" 
                    objectID={data.id} canDelete={true}
                    reFreshTimes={reFreshTimes}
                    filterPageUrl="/docs/image/list"
                />
            )
        }else{
            return null;
        }
        
    }, [data, reFreshTimes])

    const handleFilenameUpdate = useCallback((content) => {
        patchUpdateObject(
            "docs", "image", data.id, 
            {filename: content.text},
            (d) => {
                if(d.id > 0){
                    message.success("修改图片名成功");
                    data.filename = content.text;
                }
            }
        );
        // 输出消息
        
    }, [data.filename, data.id])

    return (
        <Modal
          width="100%"
          visible={visible}
          wrapClassName="show-image-modal"
          bodyStyle={{height: "100%", width: "100%", boxSizing: "border-box"}}
          style={{top: "0", width: "100%"}}
          onOk={handleOnOkOrCancel}
          onCancel={handleOnOkOrCancel}
          footer={null}
        >
            <div className="show-image" style={{display: visible ? "block" : "none"}}>
                {/* <img src={data.file} alt="图片" /> */}
                {imageElement}

                {/* 图片信息 */}
                <div className="info info-property" style={{display: showInfo ? "block" : "none"}}>
                    
                    <div className="close" onClick={() => setShowInfo(false)}>
                        <span className="text">隐藏</span><Icon type="close" />
                    </div>
                    <dl>
                        <dt>上传者:</dt>
                        <dd>{data.user}</dd>
                    </dl>
                    <dl>
                        <dt>图片名:</dt>
                        <dd>
                            {/* {data.filename} */}
                            <EditableContent
                              key={data.id}
                              content={data.filename ? data.filename : "无文件名"}
                              contentType="text"
                              tagName="div"
                              spellCheck={false}
                              handleContentUpdated={handleFilenameUpdate}
                              />

                        </dd>
                    </dl>
                    <dl>
                        <dt>状态:</dt>
                        <dd className="status">
                            <Icon type={data.is_active ? "check" : "close"} />
                        </dd>
                    </dl>

                    {/* 图片的尺寸 */}
                    {(!!data.width && data.width > 0) && (
                        <dl>
                        <dt>尺寸:</dt>
                        <dd>
                            {  `${data.width} x ${data.height}`}
                        </dd>
                    </dl>
                    )}
                    <dl>
                        <dt>标签:</dt>
                        <dd className="tags">
                            {imageTagsElements}
                            {data.id && (
                                <AddObjectTag 
                                    tagKey="tag"   // 由于key是关键词，用tagKey 
                                    appLabel="docs" model="image" objectID={data.id}
                                    // callback={fetchImageTagsData} // 添加标签后的回调函数
                                    callback={() => {setRefreshTimes(prevState => prevState + 1)}} // 添加标签后的回调函数
                                />
                            )}
                            
                        </dd>
                    </dl>
                    
                    {/* 复制图片连接 */}
                    {
                        imageUrl && (
                            <dl>
                                <dt>操作:</dt>
                                <dd>
                                    <CopyIcon title="链接" content={imageUrl} text="复制链接" className="copy" />
                                    <Divider type="vertical" />
                                    <CopyIcon title="Markdown" content={`![data.filename](${imageUrl})`} text="Markdown" className="copy" />
                                </dd>
                            </dl>
                        )
                    }
                    
                    <dl>
                        <dt>添加时间:</dt>
                        <dd>{data.time_added}</dd>
                    </dl>
                   
                </div>
                {/* 图片信息结束 */}
                
            </div>
          </Modal>
    );
}

export default ShowImageModal;