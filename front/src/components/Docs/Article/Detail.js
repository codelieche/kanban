/**
 * 文章详情页
 */

import React, {useState, useContext, useMemo, useCallback, useEffect} from "react";
import { Link } from "react-router-dom";

import {
    // Typography,
    message
} from "antd";

import EditableContent from "../../Base/EditableContent";
import Icon from "../../Base/Icon";
import { GlobalContext } from "../../Base/Context";
import fetchApi from "../../Utils/fetchApi";
// 引入文章相关操作的函数
import { patchUpdateArticle } from "./Operation";

export const ArticleDetail = function(props){
    // 状态
    const [articleID, setArticleID] = useState(null);
    const [data, setData] = useState({});
    // const [setNavData] = useContext(RightContext);
    const { setNavData } = useContext(GlobalContext);

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
                  // 根据parent信息组织导航信息
                  let navData = [
                    {
                        title: responseData.title,
                        icon: responseData.icon
                    }
                  ];
                  let parent = responseData.parent;
                  while(!!parent){
                      let navItem = {
                          title: parent.title ? parent.title : "无标题",
                          link: `/docs/article/${parent.id}`,
                          icon: parent.icon
                      }
                      navData.unshift(navItem);

                      // 重新赋值parent
                      parent = parent.parent;
                      
                  }  
                  //   记得加入当前文章
                  navData.unshift(
                    {
                        title: "首页",
                        icon: "home",
                        link: "/"
                    })
                  if(typeof setNavData === "function"){
                    // console.log("新的页面导航信息：", navData);
                    setNavData(navData);
                  }else{
                      console.log("不能设置navData")
                  }
              }else{
                  // 获取文章数据出错
                  message.warn("获取文章数据出错");
              }
          })
            .catch(err => {
                console.log(err);
            });
    }, [setNavData])

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
                    {/* <Typography.Title editable={{editing: false, onChange: (e) => console.log(e)}}> */}
                        <h1>
                            {/* <div contentEditable={true} suppressContentEditableWarning>
                                {data.title}
                            </div> */}
                            <Icon type="file-text-o"></Icon>
                            <EditableContent 
                                content={data.title ? data.title : <span>无标题</span>}
                                contentType="text" // 类型是html或者text
                                tagName="span"
                                //   onChange={e => console.log(e.target.text)}
                                //  当内容更新了之后，我们需要做点操作
                                // style={{outline: "none", whiteSpace: "pre-wrap"}}
                                handleContentUpdated={data => patchUpdateArticle(articleID, {title: data.text})}
                            />
                        </h1>
                    {/* </Typography.Title> */}
                </div>
                <div className="description">
                    {/* <Typography.Paragraph 
                    //   editable={true}
                      editable={{onChange: (e) => console.log(e)}}
                    //   让其可显示换行
                      style={{whiteSpace: "pre-wrap"}}
                      onChange={(e) => console.log(e)}>
                        {data.description ? data.description : "无描述内容"}
                    </Typography.Paragraph> */}

                    <EditableContent 
                      content={data.description ? data.description : "默认的描述内容"}
                      contentType="text" // 类型是html或者text
                      tagName="div"
                      //   onChange={e => console.log(e.target.text)}
                      //  当内容更新了之后，我们需要做点操作
                      handleContentUpdated={data => patchUpdateArticle(articleID, {description: data.text})}
                    />

                   
                </div>
            </header>
            
            <section>
                <EditableContent
                    className="content" 
                    content={data.content ? data.content : <span>默认的文章内容</span>}
                    contentType="text" // 类型是html或者text
                    tagName="div"
                    // 当内容更新了之后，我们需要做点操作
                    handleContentUpdated={data => patchUpdateArticle(articleID, {content: data.text})}
                />
            </section>

            {/* 子文章 */}
            {
                childrenListElement.length > 0 && (
                    <section className="children">
                        <h2>文章列表</h2>
                        <ul>
                            {childrenListElement}
                        </ul>
                    </section>
                )
            }
            {/* 文章底部内容 */}
            <footer>

            </footer>
        </article>
    );
}

 export default ArticleDetail;
