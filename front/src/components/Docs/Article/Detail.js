/**
 * 文章详情页
 */

import React, {useState, useContext, useMemo, useCallback, useEffect} from "react";
import { Link } from "react-router-dom";

import {
    Button,
    Result,
    Menu, Dropdown,
    message,
} from "antd";
import ReactMarkdown from "react-markdown";
// import htmlParser from 'react-markdown/plugins/html-parser'

import EditableContent from "../../Base/EditableContent";
import Icon from "../../Base/Icon";
import { GlobalContext } from "../../Base/Context";
import fetchApi from "../../Utils/fetchApi";
// 引入文章相关操作的函数
import { patchUpdateArticle } from "./Operation";
import EditorArticleModel from "./EditorModal";
import CodeBlock from "../../Editor/Element/Code";
import LoadingPage from "../../Page/Loading";
import { CopyIcon, copyTextFunc } from "../../Page/Copy";
// 上传文章图片
import { UploadImageTabsModal } from "../../Page/UploadImage";
// 文章评论
import ArticleDiscussions from "./Discussions";

export const ArticleDetail = function(props){
    // 状态
    const [articleID, setArticleID] = useState(null);
    const [data, setData] = useState({});
    // 修改全局的右侧顶部导航
    const { 
        setNavData, setRefreshNavTimes, 
        currentArticleGroupID, setCurrentArticleGroupID,  // 全局的文章分类ID
        groupPermissions, setGroupPermissions
    } = useContext(GlobalContext);
    // 是否显示描述、显示讨论
    const [showDescription, setShowDescription] = useState(false);
    const [showEditCover, setShowEditCover] = useState(false);
    const [showDiscussion, setShowDiscussion] = useState(false);
    // 是否显示编辑的对话框
    const [showEditorModal, setShowEditorModal] = useState(false);
    // 判断是否加载完毕了
    const [loaded, setLoaded] = useState(false);
    // 是否需要渲染错误页
    const [rendeErrorPage, setRendeErrorPage] = useState(0);
    // 获取当前分类的权限
    // const [groupPermissions, setGroupPermissions] = useState([]);
    const [canEditor, setCanEditor] = useState(false);

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
                  if( Number.isInteger(responseData.group) && currentArticleGroupID !== responseData.group ){
                    // 修改全局的分类id
                    setCurrentArticleGroupID(responseData.group);
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
                // 判断错误是不是：404或者403
                if(err && err.status && (err.status === 403 || err.status === 404)){
                    setData({})
                    setRendeErrorPage(err.status);
                }
            });
    }, [currentArticleGroupID, setCurrentArticleGroupID, setNavData])

    useEffect(() => {
        // let ac = new AbortController();
        if(props.match.params.id !== articleID || (data.id && props.match.params.id !== data.id.toString())){
            // setArticleID(props.match.params.id);
            // setData({});  // 把文章内容置空
            setLoaded(false);
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

    // 获取当前用户对分组的操作权限：read,write,delete等
    const fetchGroupPermissions = useCallback( groupID => {
        let url = `/api/v1/docs/group/${groupID}/permissions`;
        fetchApi.Get(url, {}, {})
          .then(responseData => {
            if(Array.isArray(responseData)){
                setGroupPermissions(responseData);
            }
          })
            .catch(err => {
                console.log(err);
            })
    }, [setGroupPermissions])

    // 监控当前分组是否变化
    useEffect(() => {
        if(currentArticleGroupID > 0){
            fetchGroupPermissions(currentArticleGroupID);
        }
    }, [currentArticleGroupID, fetchGroupPermissions])

    useEffect(() => {
        // 页面刷新不获取权限，所以加入了这个
        if(data && data.group > 0 && data.group !== currentArticleGroupID){
            fetchGroupPermissions(data.group);
        }
    },[currentArticleGroupID, data, fetchGroupPermissions])

    // 监控能否编辑
    useEffect(() => {
        if(groupPermissions.indexOf("write") >= 0){
            setCanEditor(true);
        }else{
            setCanEditor(false);
        }
    }, [groupPermissions])

    const afterCoverUploadHandle = useCallback((imageUrl) => {
        // 回调函数
        const callback = () => {
            setShowEditCover(false);
            // 刷新图片数据
            fetchDetailData(articleID);
        }
        // 先patch修改
        patchUpdateArticle(articleID, {cover: imageUrl}, callback)
    }, [articleID, fetchDetailData])

    // 复制文章的html
    const copyArticleContentHtml = useCallback(() => {
        // 1. 获取到article元素
        try {
            let articleEle = document.getElementsByTagName("article")[0];

            // 2. 获取到文章内容
            let contentEle = articleEle.getElementsByClassName("content")[0];
            // window.xx = contentEle;
            let contentHtml = contentEle.innerHTML;
            // 3. 执行复制函数
            copyTextFunc("文章HTML", contentHtml);
        } catch (error) {
            console.log(error);
            message.warn("复制文章HTML出错");
        }

    }, []);

    // 文章操作
    const articleOperationMenus = useMemo(() => {
        return (
            <Menu>
                <Menu.Item onClick={handleEditorButtonClick}>
                    <Icon type="edit" />编辑内容
                </Menu.Item>
                <Menu.Item>
                    <CopyIcon title="文章内容" content={data.content ? data.content : "内容为空"} text="复制内容" />
                </Menu.Item>
                <Menu.Item onClick={copyArticleContentHtml}>
                    <Icon type="copy" />复制HTML
                </Menu.Item>
                <Menu.Item disabled={true}>
                    <Icon type="trash-o" />删除文章
                </Menu.Item>
            </Menu>
        );
    }, [handleEditorButtonClick, data.content, copyArticleContentHtml])

    // 判断是否加载完毕
    if(!loaded){
        return <LoadingPage size="large"/>
    }

    // 判断是不是渲染错误页：404或者403
    if( !data.id && rendeErrorPage > 0){
        // 需要渲染错误页面
        if(rendeErrorPage === 403){
            return (
                <Result status="403" title="403"
                    subTitle={`Sorry，您暂时无权限访问本页面:${props.history.location.pathname}`}
                    extra={(
                        <Button type="primary">
                            <Link to="/">返回首页</Link>
                        </Button>
                    )}
                />
            )
        }else if(rendeErrorPage === 404){
            return (
                <Result status="404" title="404"
                    subTitle={`Sorry，您访问的页面不存在:${props.history.location.pathname}`}
                    extra={(
                        <Button type="primary">
                            <Link to="/">返回首页</Link>
                        </Button>
                    )}
                />
            )
        }
    }

    // const parseHtml = htmlParser({
    //     isValidNode: node => node.type !== 'script',
    //     processingInstructions: [/* ... */]
    // })

    

    return (
        <article>
            {/* 操作按钮:有编辑权限才可显示 */}
            {canEditor ? (
                    <div className="tools">
                        <Dropdown overlay={articleOperationMenus} overlayClassName="article-tools">
                            <div className="toogle">
                                <Icon type="ellipsis-h" />
                            </div>
                        </Dropdown>
                    </div>
                ): null}

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

                        <span className="button" 
                          onClick={() => {setShowEditCover(prevState => !prevState)}}
                        >
                            <Icon type="image"/>
                            { canEditor && (data.cover ? "修改封面" : "添加封面")}
                        </span>

                        <span className="button" 
                          onClick={() => {setShowDiscussion(prevState => !prevState)}}
                        >
                            <Icon type="commenting"/>
                            {showDiscussion ? "隐藏讨论" : "显示讨论"}
                        </span>
                    </div>

                    {/* 文章的标题行 */}
                    <div className="row">
                        <div className="icon">
                            <Icon type="file-text-o"></Icon>
                        </div>
                        {/* <Icon type="file-text-o"></Icon> */}
                        {canEditor ? (
                            <EditableContent
                                key={`{data.id}-title`} 
                                content={data.title ? data.title : "无标题"}
                                contentType="text" // 类型是html或者text
                                tagName="h1"
                                //   onChange={e => console.log(e.target.text)}
                                //  当内容更新了之后，我们需要做点操作
                                handleContentUpdated={data => patchUpdateArticle(articleID, {title: data.text}, handleRefreshNav)}
                            />
                        ) : (
                        <h1>{data.title ? data.title : "无标题"}</h1>
                        )}
                        
                    </div>
                    
                </div>
                
                {/* 显示封面 */}
                {
                    data.cover && (
                        <div className="cover">
                            <img src={data.cover} alt="封面" />
                        </div>
                    )
                }

                {
                    // 需要显示描述，才显示描述部分
                    showDescription && (
                        <div className="description">
                            {canEditor ? (
                                <EditableContent
                                    key={`{data.id}-description`} 
                                    content={data.description ? data.description : "请填写文章描述"}
                                    contentType="text" // 类型是html或者text
                                    tagName="div"
                                    //   onChange={e => console.log(e.target.text)}
                                    //  当内容更新了之后，我们需要做点操作
                                    handleContentUpdated={data => patchUpdateArticle(articleID, {description: data.text})}
                                />
                            ): (
                                <div>{data.description ? data.description : "请填写文章描述"}</div>
                            )}
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
                        // escapeHtml={false}
                        // astPlugins={[htmlParser()]}
                    />
                    {/* 有编辑权限，就显示编辑按钮 */}
                    {/* {canEditor ? (
                        <div className="editor-button">
                            <Button type="primary" 
                            size="small"
                            disabled={showEditorModal}
                            icon={<Icon type="edit"/>}
                            onClick={handleEditorButtonClick}>编辑</Button>
                        </div>
                    ): null} */}
                   
                </section>

                {/* 文章评论 */}
                {showDiscussion && (
                    <section>
                        <div className="title">
                            <h2>评论</h2>
                        </div>
                        <ArticleDiscussions id={articleID} />
                    </section>
                )}
                
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
            {canEditor && (
                <EditorArticleModel 
                    articleID={articleID}  // 文章id，会检查是否有未提交的
                    // 对话框是否显示
                    visable={showEditorModal} 
                    //   对话框初始的内容
                    markdownContent={data.content}
                    //   关闭对话框之后的操作
                    afterModalCloseHandle={afterModalCloseHandle}
                    //   更新文章操作
                    handleContentUpdated={(data) => patchUpdateArticle(articleID, {content: data})}
                />
            )}

            {/* 文章图片封面 */}
            {
                (canEditor && showEditCover) && (
                    <UploadImageTabsModal 
                      visible={showEditCover}
                      afterUploadHandle={afterCoverUploadHandle}
                      handleAfterClose={() => setShowEditCover(false)}
                    />
                )
            }
            
        </article>
    );
}

 export default ArticleDetail;
