/**
 * 搜索结果
 */
import React, {useState, useEffect, useMemo, useCallback} from "react";
import {
    Button
} from "antd";

import Icon from "../../Base/Icon";
import { copyTextFunc } from "../../Page/Copy";
import { ShowImageModal } from "../../Docs/Image/List2";

// 文章的item
import { ArticleListInfoItem } from "../../Docs/Article/InfoItem";

export const ImageInfoItem = ({data, onClick}) => {

    // 复制图片按钮
    const handleOnCopyClick = useCallback((event, title, content) => {
        event.stopPropagation();   // 防止冒泡
        // 执行复制操作
        copyTextFunc(title, content);
    }, [])

    return (
        <div className="image-item" key={data.id} onClick={onClick}>
            <div className="item-inner">
                <img src={data.file} alt="图片" />
                <div className="buttons">
                    <Button type="link" size="small" onClick={ (e) => {handleOnCopyClick(e, "图片链接", data.qiniu ? data.qiniu : data.file)}}>
                        <Icon type="copy" />链接
                    </Button>
                    <Button type="link" size="small" onClick={ (e) => {handleOnCopyClick(e, "Markdown", `![${data.filename}](${data.qiniu ? data.qiniu : data.file})`)}}>
                        <Icon type="copy" />Markdown
                    </Button>
                    
                    {/* <Button type="link" size="small" danger>
                        <Icon type="trash-o" /> 删除
                    </Button> */}
                </div>
            </div>
        </div>
    );
}

export const SearchResult = ({type, dataSource}) => {
    // 状态
    // 展示图片的列
    const [ columnNumber, setColumnNumber ] = useState(3);
    // 显示图片的modal
    const [showImageModal, setShowImageModal] = useState(false);
    const [currentImage, setCurrentImage] = useState({});

    const listRef = useMemo(() => React.createRef(), []);

    // 数据变更的时候，计算列
    useEffect(() => {
        // console.log(listRef)
        if(dataSource.length < 1){
            setColumnNumber(1);
            return;
        }

        if(listRef && listRef.current){
            let columnCount = Math.ceil((listRef.current.offsetWidth - 60) / 270);
            if(columnCount !== columnNumber){
                setColumnNumber(columnCount > 1 ? columnCount : 1);
            }
        }
        
    // 手动增加了dataSource到第二个参数中，这样当数据变化，就会计算
    }, [columnNumber, listRef, dataSource])

    // 点击图片，显示图片的modal
    const showImageToogle = useCallback( data => {
        setCurrentImage(data);
        setShowImageModal(true);
    }, []);

    const handleAfterShowImageModelClose = useCallback(() => {
        setCurrentImage({});
        setShowImageModal(false);
    }, [])

    const resultsItems = useMemo(() => {
        if(dataSource && Array.isArray(dataSource) && dataSource.length > 0){
            return dataSource.map((item, index) => {
                if(type === "article"){
                    return (
                        <div className="item" key={index}>
                            <ArticleListInfoItem data={item} />
                        </div>
                    )
                }else if(type === "image"){
                    return (
                        <ImageInfoItem
                         key={index} 
                         data={item}
                         onClick={() => showImageToogle(item)}/>
                    )
                }
                return (
                    <div className="item" key={index}>
                        {item.id}
                    </div>
                );
            })
        }else{
            return (
                <div className="no-content">
                    未搜索到相关数据
                </div>
            )
        }
    }, [dataSource, type, showImageToogle])

    // 自定义的style
    const selfStyle = useMemo(() => {
        if(type === "image"){
            return {
                style: {columnCount: columnNumber}
            };
        }else{
            return {}
        }
    }, [columnNumber, type])
    // console.log(selfStyle, columnNumber)

    return (
        <div className="results" ref={listRef} >
            <div className={ `${type}s`} {...selfStyle}>
                {resultsItems}
            </div>

            {
                type === "image" && (
                    <ShowImageModal 
                      visible={showImageModal}
                      data={currentImage} 
                      afterCloseHandle={handleAfterShowImageModelClose} />
                )
            }
        </div>
    )
}

export default SearchResult;