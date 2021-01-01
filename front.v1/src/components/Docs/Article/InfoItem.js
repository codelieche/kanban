/**
 * 文章信息展示Item
 */
import React from "react";
import { Link } from "react-router-dom";

import {
    Skeleton
} from "antd";

// 文章标签
import { ShowObjectTags } from "../../Page/Tags";

export const ArticleListInfoItem = ({data}) => {

    return (
        <Skeleton loading={!data.id > 0}>
            <div className="article-item" key={data.id}>
                { data.cover && (
                    <Link to={`/docs/article/${data.id}`}>
                        <div className="cover">
                            <img src={data.cover} alt="封面" />
                        </div>
                    </Link>
                )}
                <div className="content">
                    <div className="title">
                        <Link to={`/docs/article/${data.id}`}>
                            <h2>{data.title}</h2>
                        </Link>
                    </div>
                    <div className="metadata">
                        {/* 显示文章的标签 */}
                        <ShowObjectTags 
                          appLabel="docs" model="article" objectID={data.id} 
                          filterPageUrl="/docs/article/list"
                        />
                        <span className="data">时间: {data.time_added}</span>
                        <span className="data">作者: {data.user}</span>
                    </div>

                    {!!data.description && (
                    <div className="description">
                        {data.description}
                    </div>)}
                </div>
            
            </div>
        </Skeleton>
    )
}

export default ArticleListInfoItem;