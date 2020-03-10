/**
 * 文章详情页
 */

import React, {useState, useContext, useMemo, useCallback, useEffect} from "react";
import { Link } from "react-router-dom";

import {
    // Typography,
    Button,
    message,
} from "antd";
import ReactMarkdown from "react-markdown";
import EditableContent from "../../Base/EditableContent";
import Icon from "../../Base/Icon";
import { GlobalContext } from "../../Base/Context";
import fetchApi from "../../Utils/fetchApi";
// 引入文章相关操作的函数
import { patchUpdateArticle } from "./Operation";
import EditorArticleModel from "./EditorModal";
import CodeBlock from "../../Editor/Element/Code";
import LoadingPage from "../../Page/Loading";

export const ArticleDetail = function(props){
    // 状态
    const [articleID, setArticleID] = useState(null);
    const [data, setData] = useState({});
    // 修改全局的右侧顶部导航
    const { 
        setNavData, setRefreshNavTimes, 
        currentArticleCategoryID, setCurrentArticleCategoryID // 全局的文章分类ID
    } = useContext(GlobalContext);
    // 是否显示描述
    const [showDescription, setShowDescription] = useState(false);
    // 是否显示编辑的对话框
    const [showEditorModal, setShowEditorModal] = useState(false);
    // 判断是否加载完毕了
    const [loaded, setLoaded] = useState(false);

    const fetchDetailData = useCallback(id => {
        if(! id){
            return
        }
        // 开始获取数据
        let url = `/api/v1/docs/article/${id}`;
        fetchApi.Get(url, {}, {})
          .then(responseData => {
             setLoaded(true);
              if(responseData.id > 0){
                  setData(responseData);
                  setArticleID(id);
                  if( Number.isInteger(responseData.category) && currentArticleCategoryID !== responseData.category ){
                    // 修改全局的分类id
                    setCurrentArticleCategoryID(responseData.category);
                  }
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
                setLoaded(true);
                console.log(err);
            });
    }, [currentArticleCategoryID, setCurrentArticleCategoryID, setNavData])

    useEffect(() => {
        // let ac = new AbortController();
        if(props.match.params.id !== articleID || (data.id && props.match.params.id !== data.id.toString())){
            // setArticleID(props.match.params.id);
            // setData({});  // 把文章内容置空
            fetchDetailData(props.match.params.id);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.match.params.id, fetchDetailData])

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
    }, [setRefreshNavTimes]);

    // 编辑文章按钮
    const handleEditorButtonClick = useCallback(() => {
        setShowEditorModal(true);
    }, [])

    // 编辑文章关闭时候的设置
    const afterModalCloseHandle = useCallback(() => {
        // console.log("afterModalCloseHandle");
        setShowEditorModal(false);
        // 刷新一下当前页面
        setTimeout(() => {
            fetchDetailData(articleID);
        }, 300);

    }, [articleID, fetchDetailData]);

    // 判断是否加载完毕
    if(!loaded){
        return <LoadingPage size="large"/>
    }

    return (
        <article>
            <header className="middle">

                <div className="title">
                    {/* 显示描述等的开关 */}
                    <div className="toogle">
                        <span className="button" 
                          onClick={() => {setShowDescription(prevState => !prevState)}}
                        >
                            <Icon type="info-circle"/>
                            {showDescription ? "隐藏描述" : "显示描述"}
                        </span>
                    </div>

                    {/* 文章的标题行 */}
                    <div className="row">
                        <div className="icon">
                            <Icon type="file-text-o"></Icon>
                        </div>
                        {/* <Icon type="file-text-o"></Icon> */}
                        <EditableContent
                            key={`{data.id}-title`} 
                            content={data.title ? data.title : "无标题"}
                            contentType="text" // 类型是html或者text
                            tagName="h1"
                            //   onChange={e => console.log(e.target.text)}
                            //  当内容更新了之后，我们需要做点操作
                            handleContentUpdated={data => patchUpdateArticle(articleID, {title: data.text}, handleRefreshNav)}
                        />
                    </div>
                    
                </div>

                {
                    // 需要显示描述，才显示描述部分
                    showDescription && (
                        <div className="description">
                            <EditableContent
                            key={`{data.id}-description`} 
                            content={data.description ? data.description : "请填写文章描述"}
                            contentType="text" // 类型是html或者text
                            tagName="div"
                            //   onChange={e => console.log(e.target.text)}
                            //  当内容更新了之后，我们需要做点操作
                            handleContentUpdated={data => patchUpdateArticle(articleID, {description: data.text})}
                            />
                        </div>
                    )
                }
                
            </header>
            
            {/* 文章内容 */}
            <div className="content">
                <section >
                    <ReactMarkdown
                        renderers={{ code: CodeBlock }}
                        source={data.content ? data.content : "> 请编辑文章内容"}
                    />
                    <div className="editor-button">
                        <Button type="primary" 
                          size="small"
                          disabled={showEditorModal}
                          icon={<Icon type="edit"/>}
                          onClick={handleEditorButtonClick}>编辑</Button>
                    </div>
                </section>
            </div>
            {/* 文章内容结束 */}

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

            {/* 文章编辑的对话框 */}
            <EditorArticleModel 
              // 对话框是否显示
              visable={showEditorModal} 
              //   对话框初始的内容
              markdownContent={data.content}
              //   关闭对话框之后的操作
              afterModalCloseHandle={afterModalCloseHandle}
              //   更新文章操作
              handleContentUpdated={(data) => patchUpdateArticle(articleID, {content: data})}
            />
        </article>
    );
}

 export default ArticleDetail;
