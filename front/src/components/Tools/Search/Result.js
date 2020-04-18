/**
 * 搜索结果
 */
import React, {useMemo, useCallback} from "react";
import {
    Button
} from "antd";

import Icon from "../../Base/Icon";
import { copyTextFunc } from "../../Page/Copy";

// 文章的item
import { ArticleListInfoItem } from "../../Docs/Article/InfoItem";

export const ImageInfoItem = ({data}) => {

    // 复制图片按钮
    const handleOnCopyClick = useCallback((event, title, content) => {
        event.stopPropagation();   // 防止冒泡
        // 执行复制操作
        copyTextFunc(title, content);
    }, [])

    return (
        <div className="image-item" key={data.id}>
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
                        <div className="item" key={index}>
                            <ImageInfoItem data={item} />
                        </div>
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
    }, [type, dataSource])

    return (
        <div className="results">
            <div className={ `${type}s`}>
                {resultsItems}
            </div>
        </div>
    )
}

export default SearchResult;