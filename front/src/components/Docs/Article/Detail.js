/**
 * 文章详情页
 */

import React, {useState, useMemo, useCallback, useEffect} from "react";
import { Link } from "react-router-dom";

import {
    message
} from "antd";

import Icon from "../../Base/Icon";
import fetchApi from "../../Utils/fetchApi";

export const ArticleDetail = function(props){

    // 状态
    const [articleID, setArticleID] = useState(null);
    const [data, setData] = useState({});

    const fetchDetailData = useCallback(id => {
        setArticleID(id);
        if(! id){
            return
        }
        // 开始获取数据
        let url = `/api/v1/docs/article/${id}`;
        fetchApi.Get(url, {}, {})
          .then(responseData => {
              if(responseData.id > 0){
                  setData(responseData);
              }else{
                  // 获取文章数据出错
                  message.warn("获取文章数据出错");
              }
          })
            .catch(err => {
                console.log(err);
            });
    }, [])

    useEffect(() => {
        if(props.match.params.id !== articleID){
            // setArticleID(props.match.params.id);
            fetchDetailData(props.match.params.id);
        }
    }, [props.match.params.id, fetchDetailData, articleID])

    // 文章底部的子文章列表
    let childrenListElement = useMemo(() => {
        if(Array.isArray(data.children)){
            let elements = data.children.map((item, index) => {
                // console.log(item);
                return (
                    <li key={index}>
                        <Link to={`/docs/article/${item.id}`}>
                            <Icon type="file-text-o"></Icon>
                            {item.title ? item.title : <span className="no-title">无标题</span>}
                        </Link>
                    </li>
                );
            });
            return elements;
        }else{
            return [];
        }
    }, [data]);

    // console.log(childrenListElement);

    return (
        <article>
            <header className="middle">
                <div className="title">
                    <h1>
                        <Icon type="file-text-o"></Icon>
                        {data.title}
                    </h1>
                </div>
                <div className="description">
                    {data.description ? data.description : "无描述内容"}
                </div>
            </header>
            <content>

            </content>
            <section>
                文章内容
            </section>
            {
                childrenListElement.length > 0 && (
                    <section className="children">
                        <h2>子文章列表</h2>
                        <ul>
                            {childrenListElement}
                        </ul>
                    </section>
                )
            }
            <footer>

            </footer>
        </article>
    );
}

 export default ArticleDetail;
