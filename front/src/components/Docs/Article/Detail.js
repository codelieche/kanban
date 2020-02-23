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
    // 修改全局的右侧顶部导航
    const { setNavData, setRefreshNavTimes } = useContext(GlobalContext);

    const fetchDetailData = useCallback(id => {
        if(! id){
            return
        }
        // 开始获取数据
        let url = `/api/v1/docs/article/${id}`;
        fetchApi.Get(url, {}, {})
          .then(responseData => {
              if(responseData.id > 0){
                  setData(responseData);
                  setArticleID(id);
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
                          icon: parent.icon,
                          id: parent.id
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

                  // 修改浏览器当前标签的标题
                  document.title = `看板--${responseData.title}`;   
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
        // let ac = new AbortController();
        if(props.match.params.id !== articleID || (data.id && props.match.params.id !== data.id.toString())){
            // setArticleID(props.match.params.id);
            fetchDetailData(props.match.params.id);
        }
    }, [props.match.params.id, fetchDetailData, articleID, data])

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

    // 刷新导航: 刷新导航只要增加refreshNavTimes的值即可
    const handleRefreshNav = useCallback(() => {
        setRefreshNavTimes(prevState => prevState + 1);
    }, [setRefreshNavTimes])

    return (
        <article>
            <header className="middle">
                <div className="title">
                    <div className="icon">
                        <Icon type="file-text-o"></Icon>
                    </div>
                    {/* <h1> */}
                        {/* <Icon type="file-text-o"></Icon> */}
                        <EditableContent
                            key={`{data.id}-title`} 
                            content={data.title ? data.title : "无标题"}
                            contentType="text" // 类型是html或者text
                            tagName="h1"
                            //   onChange={e => console.log(e.target.text)}
                            //  当内容更新了之后，我们需要做点操作
                            // style={{outline: "none", whiteSpace: "pre-wrap"}}
                            handleContentUpdated={data => patchUpdateArticle(articleID, {title: data.text}, handleRefreshNav)}
                        />
                    {/* </h1> */}
                </div>
                <div className="description">

                    <EditableContent
                       key={`{data.id}-description`} 
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
                    key={`{data.id}-content`} 
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
