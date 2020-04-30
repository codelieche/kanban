/**
 * 【文章页】时候的左侧
 * 左右布局左侧的内容
 * 获取文章的分类
 */
import React, {useState, useEffect, useCallback, useMemo, useContext} from "react"
import { Link } from "react-router-dom";
import {Layout, Menu, Dropdown, message} from "antd";
import { Resizable } from 'react-resizable';

import { GlobalContext } from "./Context";
import Icon from "./Icon";
import ArticlesNav from "./ArticlesNav";
import fetchApi from "../Utils/fetchApi";

// 显示文章相关的左侧Sider
function LeftSider({showLeftSider, setShowLeftSider}){
    // 用户所有的分类列表
    const [groups, setGroups] = useState([]);

    // 选中的当前分类：这个的作用于是用于左侧导航的
    // 遵循一点：通过修改全局的分类ID，然后再触发修改currentGroup
    const [currentGroup, setCurrentGroup] = useState({});

    // 刷新导航相关的操作
    const { 
        setRefreshNavTimes, history, 
        // groupPermissions,
        currentArticleGroupID,   // 是设置了全局的上下文的
        setCurrentArticleGroupID, // 在article详情页会用到
    } = useContext(GlobalContext);


    let widthInit = useMemo(() => {
        // 从localStorage中获取宽度
        let widthValue = localStorage.getItem("leftSiderWidth");

        let result = parseInt(widthValue);
        // console.log(widthValue, isNaN(widthValue), typeof widthValue, result);
        if(result){
            return (result >= 156 && result <= 460) ? result : 200;
        }else{
            return 200;
        }
    }, []);

    // 左侧导航的宽度
    const [width, setWidth] = useState(widthInit);

    // 获取分组的列表
    const fetchGroupsData = useCallback(() => {
        let url = "/api/v1/docs/group/all";
        fetchApi.Get(url)
          .then(responseData => {
              if(Array.isArray(responseData)){
                  setGroups(responseData);
              }else{
                  message.warn("获取分组列表数据出错", 3);
              }
          })
            .catch(err => {
                console.log(err);
            })
    }, [setGroups])

    useEffect(() => {
        // 获取分类数据
        if(groups.length === 0 ){
            fetchGroupsData();
        }

        // 组件要卸载的时候，储存一下宽度
        return () => {localStorage.setItem("leftSiderWidth", width);}
    }, [groups.length, fetchGroupsData, width])

    // 重新设置当前分组: 
    // 获取到分组列表了、或者修改了全局分组的id了，都会触发
    useEffect(() => {
        // console.log(currentArticleGroupID, categories);
        if(!!currentArticleGroupID && currentArticleGroupID > 0){
            // console.log("设置了分类ID:", currentArticleGroupID, groups);
            // 需要重新设置一下当前的分类了
            if(!currentGroup.id  || currentGroup.id !== currentArticleGroupID){
                for(var i=0; i< groups.length; i++){
                    // console.log(categories[i]);
                    if(groups[i].id === currentArticleGroupID){
                        // setCurrentCategory(categories[i]);
                        // 先修改当前文章的分类ID: 还要记得设置当前的分类
                        setCurrentArticleGroupID(groups[i].id);
                        setCurrentGroup(groups[i])
                        break;
                    }
                }
            }else{
                // console.log("未进入循环")
            }
        }else{
            // console.log("还没分类ID");
            // 如果有分类就设置第一个
            if(groups.length > 0){
                //   设置列表的第一个为，当前的分类
                setCurrentGroup(groups[0]);
            }
        }
    }, [groups, currentArticleGroupID, currentGroup.id, setCurrentArticleGroupID])

    const onResize = useCallback((event, { element, size }) => {
        // console.log(size.width);
        // 左边栏最小156px；最大460px；
        if(size.width < 156){
            setWidth(156);
            return;
        }
        
        if(size.width <= 460){
            setWidth(size.width);
            // localStorage.setItem("leftSiderWidth", size.width);
        }else{
            setWidth(460);
        }
      }, [setWidth]);

    // namespace的选项
    let categoriesElements = useMemo(() => {
        let menuItems = groups.map((item, index) => {
            return (
                <Menu.Item key={index} onClick={e => {
                    // console.log(e);
                    // 修改浏览器当前标签的标题
                    document.title = `看板-分类-${item.name}`;
                    // setCurrentCategory(item);
                    // 遵循修改全局的分类id，再去触发修改当前分类对象
                    setCurrentArticleGroupID(item.id);
                }}>
                    {item.name}
                </Menu.Item>
            );
        });

        return (
            <Menu className="categories-list">
                {menuItems}
            </Menu>
        );
    }, [groups, setCurrentArticleGroupID]);

    const toogleLeftSider = useCallback((e) => {
        e.preventDefault();
        setShowLeftSider(prevState => {
            localStorage.setItem("showLeftSider", !prevState);
            return !prevState;
        });
    }, [setShowLeftSider]);

    const articlesNavElement = useMemo(() => {
        if(showLeftSider){
            return (
             <ArticlesNav 
               group={currentGroup.id}
            />
            )
        }else{
            return null;
        }
    }, [currentGroup.id, showLeftSider]);

    const handlerAddNewArticle = useCallback(e => {
        // console.log(e);
        // 阻止冒泡
        e.stopPropagation();
        // 添加个新的文章
        if(currentGroup.id < 0){
            message.warn("还未选择分类，不可创建文章", 3);
            return;
        }

        // 发起创建文章请求
        let url = "/api/v1/docs/article/create";
        fetchApi.Post(url, {}, {
            data: {group: currentGroup.id}
        })
          .then(responseData => {
              if(responseData.id > 0){
                  message.success("添加文章成功");
                  // 刷新导航
                  setRefreshNavTimes(prevState => prevState + 1);
                  //  跳转创建的文章页
                  history.push(`/docs/article/${responseData.id}`);

              }else{
                  message.warn(JSON.stringify(responseData));
              }
          })
            .catch(err => {
                console.log(err);
                if(err.status === 403){
                    message.warn(`您无权限添加文章！`, 5);
                }
            })
        
    }, [currentGroup.id, history, setRefreshNavTimes])

    return (
        <Resizable className="box"  
          axis='x' height={0} 
          width={width} onResize={onResize}
        >
            <Layout.Sider style={{height: "100vh"}} width={width}>
                <div className="left-sider">
                    <div className="header">
                        <div className="logo">
                            <Link to="/">
                                <img alt="logo"
                                src="http://127.0.0.1:9000/static/image/logo-kanban.svg">
                                </img>
                            </Link>
                            
                            <div className="toogle" onClick={toogleLeftSider}>
                                <Icon type="angle-double-left" noMarginRight={true}></Icon>
                            </div>
                            <div className="clear"></div>
                        </div>
                            
                        {/* 分类 */}
                        <div className="clear"></div>
                        <div className="namespace">
                            <Dropdown overlay={categoriesElements} trigger={["click"]}>
                                <div>
                                    <span style={{color: "red"}}>
                                        <Icon type="flag"  />
                                    </span>
                                    <div className="current">
                                        {currentGroup.name}
                                    </div>
                                    <Icon type="arrows-v" />
                                </div>
                            </Dropdown>
                        </div>
                    </div> 

                    <div className="content">
                        {/* 文章导航 */}
                        {
                            showLeftSider && articlesNavElement
                        }
                        {/* 文章导航内容结束 */}
                    </div> 

                    {/* 底部区域 */}
                    <div className="footer" onClick={handlerAddNewArticle}>
                        <div className="add">
                            <Icon type="plus"/>新的文章
                        </div>
                    </div>   
                </div>
            </Layout.Sider>
        </Resizable>
    );
}
export default LeftSider;